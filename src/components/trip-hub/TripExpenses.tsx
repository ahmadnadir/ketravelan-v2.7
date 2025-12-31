import { useState, useMemo, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Plus, DollarSign, TrendingUp, TrendingDown, Wallet, QrCode, SlidersHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { StatCard } from "@/components/shared/StatCard";
import { ExpenseCard } from "@/components/shared/ExpenseCard";
import { SettlementCard } from "@/components/shared/SettlementCard";
import { ViewQRModal } from "@/components/trip-hub/ViewQRModal";
import { MarkAsPaidModal } from "@/components/trip-hub/MarkAsPaidModal";
import { SendReminderModal } from "@/components/trip-hub/SendReminderModal";
import { YourQRSection } from "@/components/trip-hub/YourQRSection";
import { AddExpenseModal, NewExpense, ExpenseData } from "@/components/trip-hub/AddExpenseModal";
import { DeleteExpenseDialog } from "@/components/trip-hub/DeleteExpenseDialog";
import { ReceiptViewerModal } from "@/components/trip-hub/ReceiptViewerModal";
import { ExpenseDetailsModal } from "@/components/trip-hub/ExpenseDetailsModal";
import { SettlementBreakdownModal, SettlementExpense } from "@/components/trip-hub/SettlementBreakdownModal";
import { SettlementConfirmDialog } from "@/components/trip-hub/SettlementConfirmDialog";
import { SettlementReceiptsModal } from "@/components/trip-hub/SettlementReceiptsModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { mockExpenses as initialMockExpenses, mockMembers } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { getCategoryFromTitle } from "@/lib/expenseCategories";

const categoryBreakdown = [
  { category: "Transport", amount: 770, percentage: 30, color: "bg-stat-blue", emoji: "🚗" },
  { category: "Food & Drinks", amount: 560, percentage: 22, color: "bg-stat-orange", emoji: "🍴" },
  { category: "Accommodation", amount: 1200, percentage: 47, color: "bg-purple-500", emoji: "🏨" },
  { category: "Activities", amount: 180, percentage: 7, color: "bg-stat-green", emoji: "🎫" },
];

// Helper function for consistent currency formatting
const formatCurrency = (amount: number): string => {
  return `RM${amount.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};


interface Settlement {
  id: string;
  fromUser: { id: string; name: string; imageUrl?: string };
  toUser: { id: string; name: string; imageUrl?: string; qrCodeUrl?: string };
  amount: number;
  status: "pending" | "settled";
  receiptUrl?: string;
}

// Calculate net settlements between all members based on expense data
const calculateNetSettlements = (
  expenses: ExpenseData[], 
  members: typeof mockMembers,
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

// Current user is Ahmad Razak
const CURRENT_USER = "Ahmad Razak";
const CURRENT_USER_ID = "1";

// Calculate a user's share for a single expense
const calculateUserShare = (expense: ExpenseData, userId: string): number => {
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

export function TripExpenses() {
  const isMobile = useIsMobile();
  const [subTab, setSubTab] = useState("breakdown");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [filterPayer, setFilterPayer] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "awaiting" | "settled" | "pending">("all");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  
  // Settlement filters
  const [directionFilter, setDirectionFilter] = useState<"all" | "owesMe" | "iOwe">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "settled">("all");
  
  // QR Codes sub-view toggle
  const [qrSubView, setQrSubView] = useState<"myqr" | "others">("myqr");
  
  // Selected member for QR viewing
  const [selectedMemberForQR, setSelectedMemberForQR] = useState<typeof mockMembers[0] | null>(null);

  // Ref for scrolling to category breakdown
  const categoryBreakdownRef = useRef<HTMLDivElement>(null);

  // Modal states
  const [viewQROpen, setViewQROpen] = useState(false);
  const [markPaidOpen, setMarkPaidOpen] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [deleteExpenseOpen, setDeleteExpenseOpen] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);
  const [editingExpense, setEditingExpense] = useState<ExpenseData | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<ExpenseData | null>(null);
  const [receiptViewerOpen, setReceiptViewerOpen] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState<{ title: string; url?: string } | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [viewingExpenseDetails, setViewingExpenseDetails] = useState<ExpenseData | null>(null);
  const [initialModalTab, setInitialModalTab] = useState<"overview" | "payments">("overview");
  
  // Settlement breakdown modal state
  const [breakdownModalOpen, setBreakdownModalOpen] = useState(false);
  const [selectedSettlementForBreakdown, setSelectedSettlementForBreakdown] = useState<Settlement | null>(null);
  
  // Settlement confirmation dialog state
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingSettlement, setPendingSettlement] = useState<Settlement | null>(null);
  
  // Settlement receipts modal state
  const [receiptsModalOpen, setReceiptsModalOpen] = useState(false);

  // Track recently settled expense IDs for visual feedback
  const [recentlySettledIds, setRecentlySettledIds] = useState<string[]>([]);

  // User's own QR
  const [userQRUrl, setUserQRUrl] = useState<string | null>(null);

  // Expenses data with local state (must be declared before settlements calculation)
  const [expenses, setExpenses] = useState<ExpenseData[]>(initialMockExpenses);

  // Track settlement status overrides (when user marks as paid)
  const [settlementStatuses, setSettlementStatuses] = useState<Record<string, "pending" | "settled">>({});

  // Generate settlements dynamically from expense data
  const calculatedSettlements = useMemo(() => {
    return calculateNetSettlements(expenses, mockMembers, CURRENT_USER_ID);
  }, [expenses]);

  // Merge calculated settlements with local status overrides
  const settlements = useMemo(() => {
    return calculatedSettlements.map(s => ({
      ...s,
      status: settlementStatuses[s.id] || s.status
    }));
  }, [calculatedSettlements, settlementStatuses]);

  const totalCost = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Calculate current user's total share across all expenses
  const yourTotalExpenses = useMemo(() => {
    return expenses.reduce((sum, expense) => {
      return sum + calculateUserShare(expense, CURRENT_USER_ID);
    }, 0);
  }, [expenses]);

  // Calculate NET amount current user owes others (from settlements)
  const youOwe = useMemo(() => {
    return settlements
      .filter(s => s.fromUser.id === CURRENT_USER_ID)
      .reduce((sum, s) => sum + s.amount, 0);
  }, [settlements]);

  // Calculate NET amount others owe current user (from settlements)
  const owedToYou = useMemo(() => {
    return settlements
      .filter(s => s.toUser.id === CURRENT_USER_ID)
      .reduce((sum, s) => sum + s.amount, 0);
  }, [settlements]);

  // Get unique payers from expenses
  const uniquePayers = useMemo(() => {
    const payers = [...new Set(expenses.map(e => e.paidBy))];
    return payers;
  }, [expenses]);

  // Filter and sort expenses
  // Helper to determine user's payment status for an expense
  const getUserPaymentStatus = (expense: ExpenseData): "settled" | "pending" | "payer" => {
    const isPayer = expense.paidBy.toLowerCase().includes(CURRENT_USER.toLowerCase());
    if (isPayer) return "payer";
    
    const userPayment = expense.payments?.find(p => p.memberId === CURRENT_USER_ID);
    if (userPayment?.status === "settled") return "settled";
    return "pending";
  };

  const filteredExpenses = useMemo(() => {
    let result = [...expenses];
    
    // Filter by payer
    if (filterPayer !== "all") {
      result = result.filter(e => e.paidBy === filterPayer);
    }
    
    // Filter by category
    if (filterCategory !== "all") {
      result = result.filter(e => getCategoryFromTitle(e.title) === filterCategory);
    }
    
    // Filter by status
    if (filterStatus !== "all") {
      result = result.filter(e => {
        const status = getUserPaymentStatus(e);
        if (filterStatus === "settled") return status === "settled" || e.paymentProgress === 100;
        if (filterStatus === "pending") return status === "pending";
        return true;
      });
    }
    
    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });
    
    return result;
  }, [expenses, sortOrder, filterPayer, filterCategory, filterStatus]);

  // Active filter count for badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (sortOrder !== "latest") count++;
    if (filterPayer !== "all") count++;
    if (filterCategory !== "all") count++;
    if (filterStatus !== "all") count++;
    return count;
  }, [sortOrder, filterPayer, filterCategory, filterStatus]);

  // Clear all filters handler
  const handleClearAllFilters = () => {
    setSortOrder("latest");
    setFilterPayer("all");
    setFilterCategory("all");
    setFilterStatus("all");
  };

  // Filter settlements based on direction and status filters - only show settlements involving current user
  const filteredSettlements = useMemo(() => {
    return settlements.filter(s => {
      // Always filter to only show settlements involving the current user
      const involvesCurrentUser = 
        s.fromUser.id === CURRENT_USER_ID || s.toUser.id === CURRENT_USER_ID;
      
      if (!involvesCurrentUser) return false;
      
      // Direction filter (within settlements that involve me)
      if (directionFilter === "owesMe" && s.toUser.id !== CURRENT_USER_ID) return false;
      if (directionFilter === "iOwe" && s.fromUser.id !== CURRENT_USER_ID) return false;
      
      // Status filter
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      
      return true;
    });
  }, [settlements, directionFilter, statusFilter]);

  // Compute contributing expenses for each settlement (both directions for net calculation)
  const getContributingExpenses = (settlement: Settlement): {
    owedToReceiver: SettlementExpense[];
    owedToDebtor: SettlementExpense[];
    grossOwed: number;
    grossOffset: number;
  } => {
    const owedToReceiver: SettlementExpense[] = []; // fromUser owes toUser
    const owedToDebtor: SettlementExpense[] = [];   // toUser owes fromUser (reverse/offset)
    
    expenses.forEach(expense => {
      const payer = mockMembers.find(m => m.name === expense.paidBy);
      if (!payer) return;
      
      // Direction 1: toUser paid, fromUser owes
      if (payer.id === settlement.toUser.id && expense.splitWith?.includes(settlement.fromUser.id)) {
        const shareAmount = calculateUserShare(expense, settlement.fromUser.id);
        const memberPayment = expense.payments?.find(p => p.memberId === settlement.fromUser.id);
        const status: SettlementExpense["status"] = memberPayment?.status === "settled" 
          ? "settled" 
          : "pending";
        
        if (status !== "settled") {
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
        
        if (status !== "settled") {
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

  // Handler for settlement card click
  const handleSettlementCardClick = (settlement: Settlement) => {
    setSelectedSettlementForBreakdown(settlement);
    setBreakdownModalOpen(true);
  };
  // Helper: Get all expense payments contributing to a settlement
  const getExpensePaymentsForSettlement = (settlement: Settlement): { expenseId: string; memberId: string }[] => {
    const result: { expenseId: string; memberId: string }[] = [];
    
    expenses.forEach(expense => {
      const payer = mockMembers.find(m => m.name === expense.paidBy);
      if (!payer) return;
      
      // Case 1: toUser paid, fromUser owes (fromUser is the debtor)
      if (payer.id === settlement.toUser.id && expense.splitWith?.includes(settlement.fromUser.id)) {
        const memberPayment = expense.payments?.find(p => p.memberId === settlement.fromUser.id);
        if (!memberPayment || memberPayment.status !== "settled") {
          result.push({ expenseId: expense.id, memberId: settlement.fromUser.id });
        }
      }
      
      // Case 2: fromUser paid, toUser owes (reverse direction for net calculation)
      if (payer.id === settlement.fromUser.id && expense.splitWith?.includes(settlement.toUser.id)) {
        const memberPayment = expense.payments?.find(p => p.memberId === settlement.toUser.id);
        if (!memberPayment || memberPayment.status !== "settled") {
          result.push({ expenseId: expense.id, memberId: settlement.toUser.id });
        }
      }
    });
    
    return result;
  };

  // Helper: Cascade settlement to update all related expense payments
  const cascadeSettlementToExpenses = (settlement: Settlement) => {
    const expenseUpdates = getExpensePaymentsForSettlement(settlement);
    
    setExpenses(prev => prev.map(expense => {
      const updatesForThisExpense = expenseUpdates.filter(u => u.expenseId === expense.id);
      
      if (updatesForThisExpense.length > 0) {
        // Create or update payments array
        const existingPayments = expense.payments || [];
        const updatedPayments = expense.splitWith.map(memberId => {
          const existing = existingPayments.find(p => p.memberId === memberId);
          const shouldSettle = updatesForThisExpense.some(u => u.memberId === memberId);
          
          if (shouldSettle) {
            return { 
              memberId, 
              status: "settled" as const,
              receiptUrl: existing?.receiptUrl,
              uploadedAt: existing?.uploadedAt,
              payerNote: existing?.payerNote
            };
          }
          return existing || { memberId, status: "pending" as const };
        });
        
        // Recalculate payment progress based on amounts
        const settledAmount = updatedPayments
          .filter(p => p.status === "settled")
          .reduce((sum, p) => {
            if (expense.splitType === "custom" && expense.customSplitAmounts) {
              const customAmount = expense.customSplitAmounts.find(c => c.memberId === p.memberId);
              return sum + (customAmount?.amount || 0);
            }
            return sum + (expense.amount / updatedPayments.length);
          }, 0);
        const newProgress = Math.round((settledAmount / expense.amount) * 100);
        
        return { ...expense, payments: updatedPayments, paymentProgress: newProgress };
      }
      return expense;
    }));
  };

  // Get affected expenses for confirmation dialog display
  const getAffectedExpensesForDisplay = (settlement: Settlement) => {
    const expenseUpdates = getExpensePaymentsForSettlement(settlement);
    const uniqueExpenseIds = [...new Set(expenseUpdates.map(u => u.expenseId))];
    
    return uniqueExpenseIds.map(expenseId => {
      const expense = expenses.find(e => e.id === expenseId);
      const update = expenseUpdates.find(u => u.expenseId === expenseId);
      if (!expense || !update) return null;
      
      return {
        id: expense.id,
        title: expense.title,
        shareAmount: calculateUserShare(expense, update.memberId),
      };
    }).filter(Boolean) as { id: string; title: string; shareAmount: number }[];
  };

  // Handler for initiating settlement confirmation (shows dialog)
  const handleInitiateSettlement = (settlement: Settlement) => {
    setPendingSettlement(settlement);
    setConfirmDialogOpen(true);
  };

  // Handler for confirming settlement from dialog
  const handleConfirmSettlement = () => {
    if (pendingSettlement) {
      // Get affected expense IDs before cascade
      const expenseUpdates = getExpensePaymentsForSettlement(pendingSettlement);
      const uniqueIds = [...new Set(expenseUpdates.map(u => u.expenseId))];
      
      cascadeSettlementToExpenses(pendingSettlement);
      
      // Set recently settled for visual feedback
      setRecentlySettledIds(uniqueIds);
      
      // Auto-switch to expenses tab to show the changes
      setSubTab("breakdown");
      
      // Clear highlight after 3 seconds
      setTimeout(() => setRecentlySettledIds([]), 3000);
      
      toast({
        title: "Settlement completed",
        description: `${uniqueIds.length} expense(s) with ${pendingSettlement.toUser.name} marked as settled`,
      });
      
      setPendingSettlement(null);
    }
  };

  // Handler for marking all as paid from breakdown modal
  const handleMarkAllPaidFromBreakdown = () => {
    if (selectedSettlementForBreakdown) {
      setPendingSettlement(selectedSettlementForBreakdown);
      setBreakdownModalOpen(false);
      setConfirmDialogOpen(true);
    }
  };

  // Handler for viewing settlement receipts
  const handleViewSettlementReceipts = () => {
    if (selectedSettlementForBreakdown) {
      setBreakdownModalOpen(false);
      setReceiptsModalOpen(true);
    }
  };

  // Get receipts for a settlement
  const getReceiptsForSettlement = (settlement: Settlement) => {
    const { owedToReceiver } = getContributingExpenses(settlement);
    
    return owedToReceiver
      .filter(e => e.status === "pending")
      .map(e => {
        const expense = expenses.find(exp => exp.id === e.expenseId);
        const payment = expense?.payments?.find(p => p.memberId === settlement.fromUser.id);
        
        return {
          expenseId: e.expenseId,
          expenseTitle: e.title,
          amount: e.shareAmount,
          date: e.date,
          receiptUrl: payment?.receiptUrl || "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop",
          payerNote: payment?.payerNote,
          uploadedAt: payment?.uploadedAt,
          category: e.category,
        };
      });
  };

  // Card tap handlers
  const handleTotalSpendTap = () => {
    setSubTab("breakdown");
    setTimeout(() => {
      categoryBreakdownRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleYouPaidTap = () => {
    setSubTab("expenses");
  };

  const handleOwedToYouTap = () => {
    setDirectionFilter("owesMe");
    setStatusFilter("all");
    setSubTab("settle");
  };

  const handleYouOweTap = () => {
    setDirectionFilter("iOwe");
    setStatusFilter("all");
    setSubTab("settle");
  };

  const handleViewQR = (settlement: Settlement) => {
    setSelectedSettlement(settlement);
    setViewQROpen(true);
  };

  const handleMarkPaid = (settlement: Settlement) => {
    setSelectedSettlement(settlement);
    setMarkPaidOpen(true);
  };

  const handleSendReminder = (settlement: Settlement) => {
    setSelectedSettlement(settlement);
    setReminderOpen(true);
  };

  const handleConfirmPayment = (note?: string, receiptFile?: File) => {
    if (selectedSettlement) {
      // Show confirmation dialog before settling
      setPendingSettlement(selectedSettlement);
      setMarkPaidOpen(false);
      setConfirmDialogOpen(true);
    }
  };

  const handleReminderSend = (message: string) => {
    console.log("Reminder sent:", message);
    // Would send notification/chat message here
  };

  const handleUploadUserQR = (file: File) => {
    const url = URL.createObjectURL(file);
    setUserQRUrl(url);
    toast({
      title: "QR uploaded",
      description: "Your payment QR has been saved",
    });
  };

  const handleRemoveUserQR = () => {
    if (userQRUrl) {
      URL.revokeObjectURL(userQRUrl);
      setUserQRUrl(null);
    }
    toast({
      title: "QR removed",
      description: "Your payment QR has been removed",
    });
  };

  const handleAddExpense = (newExpense: NewExpense) => {
    const expense: ExpenseData = {
      id: `exp-${Date.now()}`,
      title: newExpense.title,
      amount: newExpense.amount,
      paidBy: newExpense.paidBy,
      date: newExpense.date,
      hasReceipt: !!newExpense.receiptFile,
      paymentProgress: 0,
      category: newExpense.category,
      splitType: newExpense.splitType,
      splitWith: newExpense.splitWith,
      customSplitAmounts: newExpense.customSplitAmounts,
      notes: newExpense.notes,
    };
    
    setExpenses(prev => [expense, ...prev]);
    
    toast({
      title: "Expense added",
      description: `${newExpense.title} - RM ${newExpense.amount.toFixed(2)} added successfully`,
    });
    
    // Switch to expenses tab to show the new expense
    setSubTab("expenses");
  };

  const handleEditExpense = (id: string, updatedExpense: NewExpense) => {
    setExpenses(prev => prev.map(expense => {
      if (expense.id === id) {
        return {
          ...expense,
          title: updatedExpense.title,
          amount: updatedExpense.amount,
          paidBy: updatedExpense.paidBy,
          date: updatedExpense.date,
          hasReceipt: expense.hasReceipt || !!updatedExpense.receiptFile,
          category: updatedExpense.category,
          splitType: updatedExpense.splitType,
          splitWith: updatedExpense.splitWith,
          customSplitAmounts: updatedExpense.customSplitAmounts,
          notes: updatedExpense.notes,
        };
      }
      return expense;
    }));
    
    setEditingExpense(null);
    
    toast({
      title: "Expense updated",
      description: `${updatedExpense.title} has been updated`,
    });
  };

  const handleDeleteExpense = () => {
    if (!deletingExpense) return;
    
    setExpenses(prev => prev.filter(e => e.id !== deletingExpense.id));
    
    toast({
      title: "Expense deleted",
      description: `${deletingExpense.title} has been removed`,
    });
    
    setDeletingExpense(null);
    setDeleteExpenseOpen(false);
  };

  const openEditExpense = (expense: ExpenseData) => {
    setEditingExpense(expense);
    setAddExpenseOpen(true);
  };

  const openDeleteExpense = (expense: ExpenseData) => {
    setDeletingExpense(expense);
    setDeleteExpenseOpen(true);
  };

  const openReceiptViewer = (expense: ExpenseData) => {
    // For demo purposes, use a placeholder receipt image
    setViewingReceipt({
      title: expense.title,
      url: expense.hasReceipt ? "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop" : undefined,
    });
    setReceiptViewerOpen(true);
  };

  // Card click → opens Overview tab
  const handleCardClick = (expense: ExpenseData) => {
    setViewingExpenseDetails(expense);
    setInitialModalTab("overview");
    setDetailsModalOpen(true);
  };

  // Primary action button click → opens Payments tab
  const handlePrimaryAction = (expense: ExpenseData) => {
    setViewingExpenseDetails(expense);
    setInitialModalTab("payments");
    setDetailsModalOpen(true);
  };

  // Handle marking member payment as received from modal
  const handleMarkAsReceived = (memberId: string) => {
    // This will be called from the modal
    console.log("Mark as received for member:", memberId);
  };

  // Handle uploading proof from modal
  const handleUploadProof = (file: File, note?: string) => {
    console.log("Proof uploaded:", file, note);
  };

  // Handle submitting payment proof from modal (user marks themselves as paid)
  const handleSubmitPayment = (
    expenseId: string, 
    memberId: string, 
    receiptUrl?: string, 
    payerNote?: string
  ) => {
    const uploadedAt = new Date().toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit'
    });
    
    setExpenses(prev => prev.map(expense => {
      if (expense.id === expenseId) {
        // Ensure payments array exists
        const existingPayments = expense.payments || expense.splitWith.map(id => ({
          memberId: id,
          status: "pending" as const
        }));
        
        // Update the specific member's payment to "settled" (awaiting payer confirmation)
        const updatedPayments = existingPayments.map(p => 
          p.memberId === memberId 
            ? { 
                ...p, 
                status: "settled" as const,
                receiptUrl,
                payerNote,
                uploadedAt,
                confirmedByPayer: false
              } 
            : p
        );
        
        return { ...expense, payments: updatedPayments };
      }
      return expense;
    }));
    
    // Also update the viewing expense details for immediate modal feedback
    if (viewingExpenseDetails?.id === expenseId) {
      setViewingExpenseDetails(prev => prev ? {
        ...prev,
        payments: (prev.payments || prev.splitWith.map(id => ({ memberId: id, status: "pending" as const }))).map(p => 
          p.memberId === memberId 
            ? { ...p, status: "settled" as const, receiptUrl, payerNote, uploadedAt, confirmedByPayer: false } 
            : p
        )
      } : null);
    }
  };

  // Handle progress update from modal
  const handleUpdateProgress = (expenseId: string, newProgress: number) => {
    setExpenses(prev => prev.map(e => {
      if (e.id === expenseId) {
        return { ...e, paymentProgress: newProgress };
      }
      return e;
    }));
  };

  // Handle confirming payment settled (with verification)
  const handleConfirmPaymentSettled = (expenseId: string, memberId: string) => {
    setExpenses(prev => prev.map(expense => {
    if (expense.id === expenseId && expense.payments) {
        const updatedPayments = expense.payments.map(p => 
          p.memberId === memberId ? { ...p, status: "settled" as const, confirmedByPayer: true } : p
        );
        // Calculate progress based on amounts
        const settledAmount = updatedPayments
          .filter(p => p.status === "settled")
          .reduce((sum, p) => {
            if (expense.splitType === "custom" && expense.customSplitAmounts) {
              const customAmount = expense.customSplitAmounts.find(c => c.memberId === p.memberId);
              return sum + (customAmount?.amount || 0);
            }
            return sum + (expense.amount / updatedPayments.length);
          }, 0);
        const newProgress = Math.round((settledAmount / expense.amount) * 100);
        
        return { 
          ...expense, 
          payments: updatedPayments,
          paymentProgress: newProgress 
        };
      }
      return expense;
    }));
    
    toast({
      title: "Payment confirmed",
      description: "The payment has been verified and marked as settled.",
    });
  };

  // Check if a settlement can show reminder (pending + others owe current user)
  const canShowReminder = (settlement: Settlement) => {
    return settlement.status === "pending" && settlement.toUser.name === CURRENT_USER;
  };

  // Get members who have uploaded QR codes (excluding current user)
  const membersWithQR = useMemo(() => {
    return mockMembers.filter(m => m.qrCodeUrl && m.name !== CURRENT_USER);
  }, []);

  // Handler for viewing a member's QR code
  const handleViewMemberQR = (member: typeof mockMembers[0]) => {
    setSelectedMemberForQR(member);
    setViewQROpen(true);
  };

  return (
    <div className="relative">
      {/* Always Visible: Header + Stat Cards */}
      <div className="px-3 sm:px-4 pt-3 sm:pt-4 space-y-4">
        {/* Header */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">Trip Expenses Overview</h2>
          <p className="text-sm text-muted-foreground">See where the money went and who's settled.</p>
        </div>

        {/* Interactive Stat Cards - 2x2 Grid - Always Visible */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <StatCard
            title="Total Trip Spend"
            value={`RM ${totalCost.toLocaleString()}`}
            icon={DollarSign}
            color="blue"
            description="All group expenses"
            onClick={handleTotalSpendTap}
          />
          <StatCard
            title="Your Total Expenses"
            value={`RM ${yourTotalExpenses.toLocaleString()}`}
            icon={Wallet}
            color="green"
            subtitle="Your share of all trip costs"
            tooltip="Includes expenses paid by others that were split with you"
            onClick={handleYouPaidTap}
          />
          <StatCard
            title="You're Owed"
            value={`RM ${owedToYou.toLocaleString()}`}
            icon={TrendingUp}
            color="orange"
            description="Net from others"
            tooltip="Net amount after offsetting what you owe them"
            onClick={handleOwedToYouTap}
          />
          <StatCard
            title="You Owe"
            value={`RM ${youOwe.toLocaleString()}`}
            icon={TrendingDown}
            color="red"
            description="Net to others"
            tooltip="Net amount after offsetting what they owe you"
            onClick={handleYouOweTap}
          />
        </div>

        {/* Sub Tabs - Below Stat Cards */}
        <SegmentedControl
          options={[
            { label: "Summary", value: "breakdown" },
            { label: "All Expenses", value: "expenses" },
            { label: "Settlement", value: "settle" },
            { label: "QR Codes", value: "qrcodes" },
          ]}
          value={subTab}
          onChange={(value) => {
            setSubTab(value);
            // Reset filters when switching tabs
            if (value === "settle") {
              setDirectionFilter("all");
              setStatusFilter("all");
            }
            if (value === "expenses") {
              setFilterPayer("all");
              setFilterCategory("all");
            }
            if (value === "qrcodes") {
              setQrSubView("myqr");
            }
          }}
        />
      </div>

      {/* Tab Content - Extra padding for sticky CTA */}
      <div className={subTab === "breakdown" || subTab === "expenses" ? "pb-24" : "pb-8"}>
        {/* Breakdown Tab */}
        {subTab === "breakdown" && (
          <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-4 sm:space-y-6">
            {/* Category Breakdown - Sorted by amount (highest first) */}
            <div ref={categoryBreakdownRef}>
              <Card className="p-3 sm:p-4 border-border/50">
                <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Spending by Category</h3>
                <div className="space-y-2 sm:space-y-3">
                  {[...categoryBreakdown].sort((a, b) => b.amount - a.amount).map((item) => (
                    <div key={item.category} className="space-y-1 sm:space-y-1.5">
                      <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                        <span className="text-foreground truncate flex items-center gap-1.5">
                          <span>{item.emoji}</span>
                          {item.category}
                        </span>
                        <span className="text-foreground shrink-0">
                          {formatCurrency(item.amount)} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="h-1.5 sm:h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Paid on Behalf of the Group */}
            <Card className="p-3 sm:p-4 border-border/50">
              <h3 className="font-semibold text-foreground text-sm sm:text-base">
                Paid on Behalf of the Group
              </h3>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Shows how much each member has paid upfront for shared expenses. Others can help balance upcoming costs.
              </p>
              
              {/* Total Group Expense */}
              <div className="flex items-center justify-between py-1.5">
                <span className="text-xs text-muted-foreground">Total group expense</span>
                <span className="text-sm text-foreground font-medium">
                  {formatCurrency(totalCost)}
                </span>
              </div>
              
              {/* Average per person */}
              <div className="flex items-center justify-between py-1.5 border-b border-border/30 mb-3">
                <span className="text-xs text-muted-foreground">Average per person</span>
                <span className="text-sm text-foreground font-medium">
                  {formatCurrency(totalCost / mockMembers.length)}
                </span>
              </div>
              
              {/* Member contributions - horizontal layout */}
              <div className="space-y-2">
                {(() => {
                  // Calculate actual contributions from expenses
                  const contributions: Record<string, { amount: number; imageUrl?: string }> = {};
                  mockMembers.forEach(member => {
                    contributions[member.name] = { amount: 0, imageUrl: member.imageUrl };
                  });
                  expenses.forEach(expense => {
                    if (contributions[expense.paidBy] !== undefined) {
                      contributions[expense.paidBy].amount += expense.amount;
                    }
                  });
                  
                  // Sort by contribution amount (highest first) - intentional ordering
                  const sortedContributions = Object.entries(contributions)
                    .sort(([, a], [, b]) => b.amount - a.amount);
                  
                  return sortedContributions.map(([name, { amount: contribution, imageUrl }]) => {
                    const percentage = totalCost > 0 ? Math.round((contribution / totalCost) * 100) : 0;
                    return (
                      <div key={name} className="space-y-1 sm:space-y-1.5">
                        {/* Top row: Avatar + Name on left, Amount + % on right */}
                        <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                          <span className="text-foreground truncate flex items-center gap-1.5 sm:gap-2">
                            <Avatar className="h-5 w-5 sm:h-6 sm:w-6 shrink-0">
                              <AvatarImage src={imageUrl} alt={name} />
                              <AvatarFallback className="text-[10px] sm:text-xs bg-secondary text-muted-foreground">
                                {name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            {name}
                          </span>
                          <span className="text-foreground shrink-0">
                            {formatCurrency(contribution)} <span className="text-muted-foreground">({percentage}%)</span>
                          </span>
                        </div>
                        
                        {/* Full-width progress bar below */}
                        <div className="h-1.5 sm:h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-foreground/70 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </Card>
          </div>
        )}

        {/* Expenses Tab */}
        {subTab === "expenses" && (
          <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4">
            {/* Mobile: Filter Trigger Button */}
            {isMobile && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="h-9 px-3 text-xs rounded-lg bg-secondary border-0"
                  onClick={() => setFilterDrawerOpen(true)}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
                  Filter & Sort
                  {activeFilterCount > 0 && (
                    <Badge className="ml-2 h-5 min-w-5 px-1.5 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
                
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 text-xs text-muted-foreground"
                    onClick={handleClearAllFilters}
                  >
                    Clear
                  </Button>
                )}
              </div>
            )}

            {/* Tablet/Desktop: Inline Dropdown Filters */}
            {!isMobile && (
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-4 gap-2">
                  <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as "latest" | "oldest")}>
                    <SelectTrigger className="w-full h-9 text-sm rounded-lg bg-secondary border-0">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">Latest first</SelectItem>
                      <SelectItem value="oldest">Oldest first</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterPayer} onValueChange={setFilterPayer}>
                    <SelectTrigger className="w-full h-9 text-sm rounded-lg bg-secondary border-0">
                      <SelectValue placeholder="Paid by">{filterPayer === "all" ? "Paid by" : filterPayer}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Paid by</SelectItem>
                      {uniquePayers.map((payer) => (
                        <SelectItem key={payer} value={payer}>{payer}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full h-9 text-sm rounded-lg bg-secondary border-0">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Transport">Transport</SelectItem>
                      <SelectItem value="Food & Drinks">Food & Drinks</SelectItem>
                      <SelectItem value="Accommodation">Accommodation</SelectItem>
                      <SelectItem value="Activities">Activities</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as "all" | "awaiting" | "settled" | "pending")}>
                    <SelectTrigger className="w-full h-9 text-sm rounded-lg bg-secondary border-0">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="awaiting">Awaiting Confirmation</SelectItem>
                      <SelectItem value="pending">Pending Payment</SelectItem>
                      <SelectItem value="settled">Settled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {activeFilterCount > 0 && (
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-sm text-muted-foreground"
                      onClick={handleClearAllFilters}
                    >
                      Clear ({activeFilterCount})
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Expense Cards */}
            <div className="space-y-2 sm:space-y-3">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <ExpenseCard
                    key={expense.id}
                    id={expense.id}
                    title={expense.title}
                    amount={expense.amount}
                    paidBy={expense.paidBy}
                    date={expense.date}
                    category={expense.category}
                    paymentProgress={expense.paymentProgress}
                    currentUser={CURRENT_USER}
                    currentUserId="1"
                    splitWith={expense.splitWith}
                    splitType={expense.splitType}
                    customSplitAmounts={expense.customSplitAmounts}
                    payments={expense.payments}
                    onCardClick={() => handleCardClick(expense)}
                    onPrimaryAction={() => handlePrimaryAction(expense)}
                    onEdit={() => openEditExpense(expense)}
                    onDelete={() => openDeleteExpense(expense)}
                    isHighlighted={recentlySettledIds.includes(expense.id)}
                  />
                ))
              ) : (
                <Card className="p-6 text-center border-border/50">
                  <p className="text-sm text-muted-foreground">No expenses found</p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Settle Tab */}
        {subTab === "settle" && (
          <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-4">
            {/* Header */}
            <div className="mb-2">
              <h2 className="text-lg font-semibold text-foreground">Settlement Summary</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Net balances between group members for this trip
              </p>
            </div>

            {/* Filter Controls - Full-Width 2-Column Grid */}
            <div className="grid grid-cols-2 gap-2">
              {/* Direction Filter Dropdown */}
              <Select 
                value={directionFilter} 
                onValueChange={(value: "all" | "owesMe" | "iOwe") => setDirectionFilter(value)}
              >
                <SelectTrigger className="w-full h-9 text-xs rounded-full bg-secondary border-0 px-4">
                  <SelectValue placeholder="Direction" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="owesMe">Owes Me</SelectItem>
                  <SelectItem value="iOwe">I Owe</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter Dropdown */}
              <Select 
                value={statusFilter} 
                onValueChange={(value: "all" | "pending" | "settled") => setStatusFilter(value)}
              >
                <SelectTrigger className="w-full h-9 text-xs rounded-full bg-secondary border-0 px-4">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="settled">Settled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Settlements */}
            <div className="space-y-2 sm:space-y-3">
                {filteredSettlements.length > 0 ? (
                filteredSettlements.map((settlement) => (
                  <SettlementCard
                    key={settlement.id}
                    fromUser={settlement.fromUser}
                    toUser={settlement.toUser}
                    amount={settlement.amount}
                    status={settlement.status}
                    currentUserId={CURRENT_USER_ID}
                    showReminder={canShowReminder(settlement)}
                    onCardClick={() => handleSettlementCardClick(settlement)}
                    onViewPayment={() => handleViewQR(settlement)}
                    onViewDetails={() => handleSettlementCardClick(settlement)}
                    onSendReminder={() => handleSendReminder(settlement)}
                    onMarkPaid={() => handleMarkPaid(settlement)}
                  />
                ))
              ) : (
                <Card className="p-6 text-center border-border/50">
                  <p className="text-sm text-muted-foreground">No settlements found</p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* QR Codes Tab */}
        {subTab === "qrcodes" && (
          <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-4">
            {/* Sub-toggle: My QR / Others */}
            <SegmentedControl
              options={[
                { label: "My QR", value: "myqr" },
                { label: "Others", value: "others" },
              ]}
              value={qrSubView}
              onChange={(value) => setQrSubView(value as "myqr" | "others")}
              className="max-w-xs mx-auto"
            />
            
            {/* My QR View */}
            {qrSubView === "myqr" && (
              <YourQRSection
                qrCodeUrl={userQRUrl}
                onUpload={handleUploadUserQR}
                onRemove={handleRemoveUserQR}
              />
            )}
            
            {/* Others View */}
            {qrSubView === "others" && (
              <div className="space-y-3">
                {/* Description */}
                <p className="text-sm text-muted-foreground text-center">
                  View group members' QR codes to make payments
                </p>
                
                {/* Member Cards - Only show members with QR */}
                {membersWithQR.length > 0 ? (
                  membersWithQR.map((member) => (
                    <Card key={member.id} className="p-3 border-border/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.imageUrl} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground text-sm">{member.name}</p>
                            <p className="text-xs text-muted-foreground">QR available</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs rounded-lg"
                          onClick={() => handleViewMemberQR(member)}
                        >
                          <QrCode className="h-3.5 w-3.5 mr-1.5" />
                          View QR
                        </Button>
                      </div>
                    </Card>
                  ))
                ) : (
                  // Empty state
                  <Card className="p-6 text-center border-border/50">
                    <QrCode className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No QR codes available yet.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ask your group to upload theirs for faster settlement.
                    </p>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fixed Bottom Action Container - Only on Breakdown and Expenses tabs */}
      {(subTab === "breakdown" || subTab === "expenses") && (
        <div className="fixed bottom-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border/50">
          <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-4 py-3">
            <Button 
              className="w-full h-12 rounded-xl text-sm font-medium shadow-lg"
              onClick={() => setAddExpenseOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Shared Expense
            </Button>
          </div>
        </div>
      )}

      {/* Add/Edit Expense Modal */}
      <AddExpenseModal
        open={addExpenseOpen}
        onOpenChange={(open) => {
          setAddExpenseOpen(open);
          if (!open) setEditingExpense(null);
        }}
        onAddExpense={handleAddExpense}
        onEditExpense={handleEditExpense}
        editingExpense={editingExpense}
        currentUser="Ahmad Razak"
      />

      {/* Delete Expense Dialog */}
      <DeleteExpenseDialog
        open={deleteExpenseOpen}
        onOpenChange={setDeleteExpenseOpen}
        expenseTitle={deletingExpense?.title || ""}
        expenseAmount={deletingExpense?.amount || 0}
        onConfirm={handleDeleteExpense}
      />

      {/* View QR Modal */}
      <ViewQRModal
        open={viewQROpen}
        onOpenChange={(open) => {
          setViewQROpen(open);
          if (!open) {
            setSelectedMemberForQR(null);
            setSelectedSettlement(null);
          }
        }}
        recipientName={selectedMemberForQR?.name || selectedSettlement?.toUser.name || ""}
        amount={selectedSettlement?.amount}
        qrCodeUrl={selectedMemberForQR?.qrCodeUrl || selectedSettlement?.toUser.qrCodeUrl || userQRUrl || undefined}
      />

      {/* Mark as Paid Modal */}
      <MarkAsPaidModal
        open={markPaidOpen}
        onOpenChange={setMarkPaidOpen}
        recipientName={selectedSettlement?.toUser.id === CURRENT_USER_ID 
          ? selectedSettlement?.fromUser.name || "" 
          : selectedSettlement?.toUser.name || ""}
        amount={selectedSettlement?.amount || 0}
        isReceiver={selectedSettlement?.toUser.id === CURRENT_USER_ID}
        payerReceiptUrl={selectedSettlement?.toUser.id === CURRENT_USER_ID 
          ? selectedSettlement?.receiptUrl 
          : undefined}
        onConfirm={handleConfirmPayment}
      />

      {/* Send Reminder Modal */}
      <SendReminderModal
        open={reminderOpen}
        onOpenChange={setReminderOpen}
        recipientName={selectedSettlement?.fromUser.name || ""}
        amount={selectedSettlement?.amount || 0}
        tripName="Cameron Highlands"
        onSend={handleReminderSend}
      />

      {/* Receipt Viewer Modal */}
      <ReceiptViewerModal
        open={receiptViewerOpen}
        onOpenChange={(open) => {
          setReceiptViewerOpen(open);
          if (!open) setViewingReceipt(null);
        }}
        expenseTitle={viewingReceipt?.title || ""}
        receiptUrl={viewingReceipt?.url}
      />

      {/* Expense Details Modal */}
      <ExpenseDetailsModal
        open={detailsModalOpen}
        onOpenChange={(open) => {
          setDetailsModalOpen(open);
          if (!open) setViewingExpenseDetails(null);
        }}
        expense={viewingExpenseDetails}
        currentUser="Ahmad Razak"
        initialTab={initialModalTab}
        onMarkAsReceived={handleMarkAsReceived}
        onUploadProof={handleUploadProof}
        onUpdateProgress={(newProgress) => {
          if (viewingExpenseDetails) {
            handleUpdateProgress(viewingExpenseDetails.id, newProgress);
          }
        }}
        onConfirmPaymentReceived={handleConfirmPaymentSettled}
        onSubmitPayment={handleSubmitPayment}
      />

      {/* Settlement Breakdown Modal */}
      {selectedSettlementForBreakdown && (() => {
        const breakdown = getContributingExpenses(selectedSettlementForBreakdown);
        return (
          <SettlementBreakdownModal
            open={breakdownModalOpen}
            onOpenChange={(open) => {
              setBreakdownModalOpen(open);
              if (!open) setSelectedSettlementForBreakdown(null);
            }}
            fromUser={selectedSettlementForBreakdown.fromUser}
            toUser={selectedSettlementForBreakdown.toUser}
            totalAmount={selectedSettlementForBreakdown.amount}
            status={selectedSettlementForBreakdown.status}
            contributingExpenses={breakdown.owedToReceiver}
            reverseExpenses={breakdown.owedToDebtor}
            grossOwed={breakdown.grossOwed}
            grossOffset={breakdown.grossOffset}
            currentUserId={mockMembers.find(m => m.name === CURRENT_USER)?.id || "1"}
            onUploadProof={() => {
              handleMarkPaid(selectedSettlementForBreakdown);
              setBreakdownModalOpen(false);
            }}
            onMarkAllPaid={handleMarkAllPaidFromBreakdown}
            onSendReminder={() => {
              handleSendReminder(selectedSettlementForBreakdown);
              setBreakdownModalOpen(false);
            }}
            onViewQR={() => {
              handleViewQR(selectedSettlementForBreakdown);
              setBreakdownModalOpen(false);
            }}
            onViewReceipts={handleViewSettlementReceipts}
          />
        );
      })()}

      {/* Settlement Receipts Modal */}
      {selectedSettlementForBreakdown && (
        <SettlementReceiptsModal
          open={receiptsModalOpen}
          onOpenChange={(open) => {
            setReceiptsModalOpen(open);
            if (!open) setSelectedSettlementForBreakdown(null);
          }}
          fromUser={selectedSettlementForBreakdown.fromUser}
          toUser={selectedSettlementForBreakdown.toUser}
          totalAmount={selectedSettlementForBreakdown.amount}
          receipts={getReceiptsForSettlement(selectedSettlementForBreakdown)}
          onMarkAllPaid={() => {
            setPendingSettlement(selectedSettlementForBreakdown);
            setReceiptsModalOpen(false);
            setConfirmDialogOpen(true);
          }}
        />
      )}

      {/* Settlement Confirmation Dialog */}
      {pendingSettlement && (
        <SettlementConfirmDialog
          open={confirmDialogOpen}
          onOpenChange={(open) => {
            setConfirmDialogOpen(open);
            if (!open) setPendingSettlement(null);
          }}
          recipientName={pendingSettlement.toUser.name}
          totalAmount={pendingSettlement.amount}
          affectedExpenses={getAffectedExpensesForDisplay(pendingSettlement)}
          onConfirm={handleConfirmSettlement}
        />
      )}

      {/* Filter & Sort Drawer - Mobile Only */}
      {isMobile && (
        <Drawer open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
          <DrawerContent className="h-[85vh] max-h-[85vh] flex flex-col">
            <DrawerHeader className="text-left shrink-0">
              <DrawerTitle>Filter & Sort Expenses</DrawerTitle>
              <DrawerDescription>
                {activeFilterCount > 0 
                  ? `${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active` 
                  : 'Customize your expense view'}
              </DrawerDescription>
            </DrawerHeader>
            
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4">
              <div className="space-y-6 pb-6">
                {/* Sort Section */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground">Sort Order</h4>
                  <RadioGroup value={sortOrder} onValueChange={(v) => setSortOrder(v as "latest" | "oldest")}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="latest" id="latest" />
                      <Label htmlFor="latest">Latest first</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="oldest" id="oldest" />
                      <Label htmlFor="oldest">Oldest first</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator />
                
                {/* Member Filter Section */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground">Paid By</h4>
                  <RadioGroup value={filterPayer} onValueChange={setFilterPayer}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all-members" />
                      <Label htmlFor="all-members">All members</Label>
                    </div>
                    {uniquePayers.map((payer) => (
                      <div key={payer} className="flex items-center space-x-2">
                        <RadioGroupItem value={payer} id={`payer-${payer}`} />
                        <Label htmlFor={`payer-${payer}`}>{payer}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <Separator />
                
                {/* Category Filter Section */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground">Category</h4>
                  <RadioGroup value={filterCategory} onValueChange={setFilterCategory}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all-categories" />
                      <Label htmlFor="all-categories">All Categories</Label>
                    </div>
                    {["Transport", "Food & Drinks", "Accommodation", "Activities"].map((cat) => (
                      <div key={cat} className="flex items-center space-x-2">
                        <RadioGroupItem value={cat} id={`cat-${cat}`} />
                        <Label htmlFor={`cat-${cat}`}>{cat}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <Separator />
                
                {/* Status Filter Section */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground">Status</h4>
                  <RadioGroup value={filterStatus} onValueChange={(v) => setFilterStatus(v as "all" | "awaiting" | "settled" | "pending")}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all-status" />
                      <Label htmlFor="all-status">All Status</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="awaiting" id="awaiting" />
                      <Label htmlFor="awaiting">Awaiting Confirmation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pending" id="pending" />
                      <Label htmlFor="pending">Pending Payment</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="settled" id="settled" />
                      <Label htmlFor="settled">Settled</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
            
            <DrawerFooter className="border-t shrink-0">
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleClearAllFilters}
                >
                  Clear All
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => setFilterDrawerOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
