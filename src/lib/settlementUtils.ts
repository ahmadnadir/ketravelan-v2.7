import type { ExpenseData } from "@/data/mockData";

export interface SettlementUser {
  id: string;
  name: string;
  imageUrl?: string;
  qrCodeUrl?: string;
}

export interface Settlement {
  id: string;
  fromUser: SettlementUser;
  toUser: SettlementUser;
  amount: number;
  status: "pending" | "settled";
  receiptUrl?: string;
}

export interface Member {
  id: string;
  name: string;
  imageUrl?: string;
  qrCodeUrl?: string;
}

export interface SettlementExpense {
  expenseId: string;
  title: string;
  date: string;
  shareAmount: number;
  status: "pending" | "settled";
  category: string;
  paidBy: string;
}

/**
 * Calculate a user's share for a single expense
 */
export const calculateUserShare = (expense: ExpenseData, userId: string): number => {
  // Check if user is part of this expense's split
  if (!expense.splitWith.includes(userId)) {
    return 0;
  }
  
  // Custom split: look up the user's specific amount
  if (expense.splitType === "custom" && expense.customSplitAmounts) {
    const customAmount = expense.customSplitAmounts.find(c => c.memberId === userId);
    return customAmount?.amount || 0;
  }
  
  // Equal split: divide total by number of people
  return expense.amount / expense.splitWith.length;
};

/**
 * Calculate net settlements between all members based on expense data
 * Returns an array of settlements showing who owes whom and how much
 */
export const calculateNetSettlements = (
  expenses: ExpenseData[], 
  members: Member[],
  currentUserId: string
): Settlement[] => {
  // Track debts: debtMatrix[fromId][toId] = amount owed
  const debtMatrix: Record<string, Record<string, number>> = {};
  
  expenses.forEach(expense => {
    // Find payer's member ID
    const payer = members.find(m => m.name === expense.paidBy);
    if (!payer) return;
    
    // For each person who split this expense (except the payer)
    expense.splitWith.forEach(memberId => {
      if (memberId === payer.id) return; // Payer doesn't owe themselves
      
      const memberPayment = expense.payments?.find(p => p.memberId === memberId);
      // Only count unsettled amounts (pending or submitted, not settled)
      if (!memberPayment || memberPayment.status !== "settled") {
        const shareAmount = calculateUserShare(expense, memberId);
        
        // Initialize if needed
        if (!debtMatrix[memberId]) debtMatrix[memberId] = {};
        if (!debtMatrix[memberId][payer.id]) debtMatrix[memberId][payer.id] = 0;
        
        debtMatrix[memberId][payer.id] += shareAmount;
      }
    });
  });
  
  // Convert to net settlements (simplify mutual debts)
  const settlements: Settlement[] = [];
  const processedPairs = new Set<string>();
  
  Object.keys(debtMatrix).forEach(fromId => {
    Object.keys(debtMatrix[fromId]).forEach(toId => {
      const pairKey = [fromId, toId].sort().join("-");
      if (processedPairs.has(pairKey)) return;
      processedPairs.add(pairKey);
      
      const aOwesB = debtMatrix[fromId]?.[toId] || 0;
      const bOwesA = debtMatrix[toId]?.[fromId] || 0;
      const netAmount = aOwesB - bOwesA;
      
      if (Math.abs(netAmount) > 0.01) {
        const netFromId = netAmount > 0 ? fromId : toId;
        const netToId = netAmount > 0 ? toId : fromId;
        const fromMember = members.find(m => m.id === netFromId);
        const toMember = members.find(m => m.id === netToId);
        
        if (fromMember && toMember) {
          settlements.push({
            id: `settlement-${fromMember.id}-${toMember.id}`,
            fromUser: { id: fromMember.id, name: fromMember.name, imageUrl: fromMember.imageUrl },
            toUser: { id: toMember.id, name: toMember.name, imageUrl: toMember.imageUrl },
            amount: Math.abs(netAmount),
            status: "pending"
          });
        }
      }
    });
  });
  
  return settlements;
};

/**
 * Get contributing expenses for a settlement breakdown
 * Returns expenses where fromUser owes toUser (owedToReceiver)
 * and expenses where toUser owes fromUser (owedToDebtor/offset)
 */
export const getContributingExpenses = (
  settlement: Settlement,
  expenses: ExpenseData[],
  members: Member[],
  getCategoryFromTitle: (title: string) => string
): {
  owedToReceiver: SettlementExpense[];
  owedToDebtor: SettlementExpense[];
  grossOwed: number;
  grossOffset: number;
} => {
  const owedToReceiver: SettlementExpense[] = []; // fromUser owes toUser
  const owedToDebtor: SettlementExpense[] = [];   // toUser owes fromUser (reverse/offset)
  
  expenses.forEach(expense => {
    const payer = members.find(m => m.name === expense.paidBy);
    if (!payer) return;
    
    // Direction 1: toUser paid, fromUser owes
    if (payer.id === settlement.toUser.id && expense.splitWith?.includes(settlement.fromUser.id)) {
      const shareAmount = calculateUserShare(expense, settlement.fromUser.id);
      const memberPayment = expense.payments?.find(p => p.memberId === settlement.fromUser.id);
      const status: SettlementExpense["status"] = memberPayment?.status === "settled" 
        ? "settled" 
        : "pending";
      
      // Include settled expenses when viewing a settled settlement
      const shouldInclude = settlement.status === "settled" 
        ? status === "settled" 
        : status !== "settled";
      
      if (shouldInclude) {
        owedToReceiver.push({
          expenseId: expense.id,
          title: expense.title,
          date: expense.date,
          shareAmount,
          status,
          category: getCategoryFromTitle(expense.title),
          paidBy: expense.paidBy,
        });
      }
    }
    
    // Direction 2: fromUser paid, toUser owes (reverse - this gets subtracted)
    if (payer.id === settlement.fromUser.id && expense.splitWith?.includes(settlement.toUser.id)) {
      const shareAmount = calculateUserShare(expense, settlement.toUser.id);
      const memberPayment = expense.payments?.find(p => p.memberId === settlement.toUser.id);
      const status: SettlementExpense["status"] = memberPayment?.status === "settled" 
        ? "settled" 
        : "pending";
      
      // Include settled expenses when viewing a settled settlement
      const shouldInclude = settlement.status === "settled" 
        ? status === "settled" 
        : status !== "settled";
      
      if (shouldInclude) {
        owedToDebtor.push({
          expenseId: expense.id,
          title: expense.title,
          date: expense.date,
          shareAmount,
          status,
          category: getCategoryFromTitle(expense.title),
          paidBy: expense.paidBy,
        });
      }
    }
  });
  
  const grossOwed = owedToReceiver.reduce((sum, e) => sum + e.shareAmount, 0);
  const grossOffset = owedToDebtor.reduce((sum, e) => sum + e.shareAmount, 0);
  
  return { owedToReceiver, owedToDebtor, grossOwed, grossOffset };
};
