import { describe, it, expect } from 'vitest';
import { 
  calculateUserShare, 
  calculateNetSettlements, 
  getContributingExpenses,
  type Member,
  type Settlement
} from './settlementUtils';
import type { ExpenseData } from '@/data/mockData';

// Test fixtures
const mockMembers: Member[] = [
  { id: "1", name: "Ahmad Razak", imageUrl: "ahmad.jpg" },
  { id: "2", name: "Sarah Tan", imageUrl: "sarah.jpg" },
  { id: "3", name: "Lisa Wong", imageUrl: "lisa.jpg" },
];

const getCategoryFromTitle = (title: string) => {
  if (title.toLowerCase().includes("accommodation")) return "Accommodation";
  if (title.toLowerCase().includes("car") || title.toLowerCase().includes("rental")) return "Transport";
  if (title.toLowerCase().includes("ferry")) return "Transport";
  if (title.toLowerCase().includes("cable")) return "Activities";
  return "Other";
};

// Helper to create expense with required fields
const createExpense = (partial: Partial<ExpenseData> & Pick<ExpenseData, 'id' | 'title' | 'amount' | 'paidBy' | 'date' | 'splitWith' | 'splitType'>): ExpenseData => ({
  hasReceipt: false,
  paymentProgress: 0,
  category: "Other",
  ...partial,
});

describe('calculateUserShare', () => {
  it('should return 0 if user is not part of the split', () => {
    const expense = createExpense({
      id: "1",
      title: "Dinner",
      amount: 100,
      paidBy: "Ahmad Razak",
      date: "Jan 15",
      splitWith: ["1", "2"], // Only Ahmad and Sarah
      splitType: "equal",
    });
    
    // Lisa (id: 3) is not part of the split
    expect(calculateUserShare(expense, "3")).toBe(0);
  });

  it('should calculate equal split correctly', () => {
    const expense = createExpense({
      id: "1",
      title: "Dinner",
      amount: 300,
      paidBy: "Ahmad Razak",
      date: "Jan 15",
      splitWith: ["1", "2", "3"], // 3 people
      splitType: "equal",
    });
    
    // Each person's share should be 100
    expect(calculateUserShare(expense, "1")).toBe(100);
    expect(calculateUserShare(expense, "2")).toBe(100);
    expect(calculateUserShare(expense, "3")).toBe(100);
  });

  it('should handle custom split amounts', () => {
    const expense = createExpense({
      id: "1",
      title: "Hotel",
      amount: 600,
      paidBy: "Ahmad Razak",
      date: "Jan 15",
      splitWith: ["1", "2", "3"],
      splitType: "custom",
      customSplitAmounts: [
        { memberId: "1", amount: 200 },
        { memberId: "2", amount: 150 },
        { memberId: "3", amount: 250 },
      ],
    });
    
    expect(calculateUserShare(expense, "1")).toBe(200);
    expect(calculateUserShare(expense, "2")).toBe(150);
    expect(calculateUserShare(expense, "3")).toBe(250);
  });

  it('should return 0 for custom split if user has no amount defined', () => {
    const expense = createExpense({
      id: "1",
      title: "Hotel",
      amount: 400,
      paidBy: "Ahmad Razak",
      date: "Jan 15",
      splitWith: ["1", "2", "3"],
      splitType: "custom",
      customSplitAmounts: [
        { memberId: "1", amount: 200 },
        { memberId: "2", amount: 200 },
        // Lisa not defined
      ],
    });
    
    expect(calculateUserShare(expense, "3")).toBe(0);
  });
});

describe('calculateNetSettlements', () => {
  it('should return empty array when no expenses', () => {
    const settlements = calculateNetSettlements([], mockMembers, "1");
    expect(settlements).toEqual([]);
  });

  it('should calculate simple one-way debt', () => {
    const expenses: ExpenseData[] = [
      createExpense({
        id: "1",
        title: "Dinner",
        amount: 200,
        paidBy: "Ahmad Razak", // Ahmad paid
        date: "Jan 15",
        splitWith: ["1", "2"], // Split with Sarah
        splitType: "equal",
      }),
    ];
    
    const settlements = calculateNetSettlements(expenses, mockMembers, "1");
    
    expect(settlements).toHaveLength(1);
    expect(settlements[0].fromUser.id).toBe("2"); // Sarah owes
    expect(settlements[0].toUser.id).toBe("1");   // Ahmad
    expect(settlements[0].amount).toBe(100);      // RM 100
  });

  it('should calculate net amount when both parties owe each other', () => {
    const extendedMembers = [
      ...mockMembers,
      { id: "4", name: "John Doe", imageUrl: "john.jpg" },
      { id: "5", name: "Jane Smith", imageUrl: "jane.jpg" },
    ];
    
    const expenses: ExpenseData[] = [
      createExpense({
        id: "1",
        title: "Accommodation",
        amount: 1200, // Ahmad paid
        paidBy: "Ahmad Razak",
        date: "Jan 15",
        splitWith: ["1", "2", "3", "4"], // 4-way split = 300 each
        splitType: "equal",
      }),
      createExpense({
        id: "2",
        title: "Rental car",
        amount: 600, // Ahmad paid
        paidBy: "Ahmad Razak",
        date: "Jan 16",
        splitWith: ["1", "2", "3", "4"],
        splitType: "custom",
        customSplitAmounts: [
          { memberId: "1", amount: 150 },
          { memberId: "2", amount: 150 }, // Sarah owes 150
          { memberId: "3", amount: 150 },
          { memberId: "4", amount: 150 },
        ],
      }),
      createExpense({
        id: "3",
        title: "Cable car",
        amount: 128, // Ahmad paid
        paidBy: "Ahmad Razak",
        date: "Jan 17",
        splitWith: ["1", "2"], // 2-way split = 64 each
        splitType: "equal",
      }),
      createExpense({
        id: "4",
        title: "Ferry tickets",
        amount: 320, // Sarah paid
        paidBy: "Sarah Tan",
        date: "Jan 18",
        splitWith: ["1", "2", "3", "4", "5"], // 5-way split = 64 each
        splitType: "equal",
      }),
    ];
    
    const settlements = calculateNetSettlements(expenses, extendedMembers, "1");
    
    // Find settlement between Sarah and Ahmad
    const sarahAhmadSettlement = settlements.find(
      s => (s.fromUser.id === "2" && s.toUser.id === "1") ||
           (s.fromUser.id === "1" && s.toUser.id === "2")
    );
    
    expect(sarahAhmadSettlement).toBeDefined();
    
    // Sarah owes Ahmad:
    // - Accommodation: 300
    // - Rental car: 150
    // - Cable car: 64
    // Total: 514
    
    // Ahmad owes Sarah:
    // - Ferry tickets: 64
    
    // Net: Sarah owes Ahmad 450
    expect(sarahAhmadSettlement!.fromUser.id).toBe("2"); // Sarah owes
    expect(sarahAhmadSettlement!.toUser.id).toBe("1");   // Ahmad
    expect(sarahAhmadSettlement!.amount).toBe(450);
  });

  it('should skip settled expenses', () => {
    const expenses: ExpenseData[] = [
      createExpense({
        id: "1",
        title: "Dinner",
        amount: 200,
        paidBy: "Ahmad Razak",
        date: "Jan 15",
        splitWith: ["1", "2"],
        splitType: "equal",
        payments: [
          { memberId: "2", status: "settled" }, // Sarah already paid
        ],
      }),
    ];
    
    const settlements = calculateNetSettlements(expenses, mockMembers, "1");
    
    // No settlement because Sarah already settled
    expect(settlements).toHaveLength(0);
  });

  it('should include pending expenses', () => {
    const expenses: ExpenseData[] = [
      createExpense({
        id: "1",
        title: "Dinner",
        amount: 200,
        paidBy: "Ahmad Razak",
        date: "Jan 15",
        splitWith: ["1", "2"],
        splitType: "equal",
        payments: [
          { memberId: "2", status: "pending" }, // Sarah hasn't paid
        ],
      }),
    ];
    
    const settlements = calculateNetSettlements(expenses, mockMembers, "1");
    
    expect(settlements).toHaveLength(1);
    expect(settlements[0].amount).toBe(100);
  });

  it('should ignore tiny amounts below threshold', () => {
    const expenses: ExpenseData[] = [
      createExpense({
        id: "1",
        title: "Snack",
        amount: 0.01, // Very small amount
        paidBy: "Ahmad Razak",
        date: "Jan 15",
        splitWith: ["1", "2"],
        splitType: "equal",
      }),
    ];
    
    const settlements = calculateNetSettlements(expenses, mockMembers, "1");
    
    // Amount per person is 0.005, which is below 0.01 threshold
    expect(settlements).toHaveLength(0);
  });
});

describe('getContributingExpenses', () => {
  it('should return expenses where fromUser owes toUser', () => {
    const expenses: ExpenseData[] = [
      createExpense({
        id: "1",
        title: "Accommodation",
        amount: 400,
        paidBy: "Ahmad Razak", // toUser paid
        date: "Jan 15",
        splitWith: ["1", "2"], // fromUser (Sarah) is in split
        splitType: "equal",
      }),
    ];
    
    const settlement: Settlement = {
      id: "s1",
      fromUser: { id: "2", name: "Sarah Tan" },
      toUser: { id: "1", name: "Ahmad Razak" },
      amount: 200,
      status: "pending",
    };
    
    const result = getContributingExpenses(settlement, expenses, mockMembers, getCategoryFromTitle);
    
    expect(result.owedToReceiver).toHaveLength(1);
    expect(result.owedToReceiver[0].title).toBe("Accommodation");
    expect(result.owedToReceiver[0].shareAmount).toBe(200);
    expect(result.grossOwed).toBe(200);
    expect(result.grossOffset).toBe(0);
  });

  it('should calculate offset when toUser also owes fromUser', () => {
    const expenses: ExpenseData[] = [
      createExpense({
        id: "1",
        title: "Accommodation",
        amount: 400,
        paidBy: "Ahmad Razak", // Ahmad paid, Sarah owes
        date: "Jan 15",
        splitWith: ["1", "2"],
        splitType: "equal",
      }),
      createExpense({
        id: "2",
        title: "Ferry tickets",
        amount: 200,
        paidBy: "Sarah Tan", // Sarah paid, Ahmad owes
        date: "Jan 16",
        splitWith: ["1", "2"],
        splitType: "equal",
      }),
    ];
    
    const settlement: Settlement = {
      id: "s1",
      fromUser: { id: "2", name: "Sarah Tan" },
      toUser: { id: "1", name: "Ahmad Razak" },
      amount: 100, // Net: 200 - 100 = 100
      status: "pending",
    };
    
    const result = getContributingExpenses(settlement, expenses, mockMembers, getCategoryFromTitle);
    
    expect(result.owedToReceiver).toHaveLength(1);
    expect(result.owedToReceiver[0].shareAmount).toBe(200);
    
    expect(result.owedToDebtor).toHaveLength(1);
    expect(result.owedToDebtor[0].shareAmount).toBe(100);
    
    expect(result.grossOwed).toBe(200);
    expect(result.grossOffset).toBe(100);
    
    // Net should be 200 - 100 = 100
    expect(result.grossOwed - result.grossOffset).toBe(100);
  });

  it('should only include settled expenses for settled settlements', () => {
    const expenses: ExpenseData[] = [
      createExpense({
        id: "1",
        title: "Accommodation",
        amount: 400,
        paidBy: "Ahmad Razak",
        date: "Jan 15",
        splitWith: ["1", "2"],
        splitType: "equal",
        payments: [
          { memberId: "2", status: "settled" },
        ],
      }),
      createExpense({
        id: "2",
        title: "Dinner",
        amount: 200,
        paidBy: "Ahmad Razak",
        date: "Jan 16",
        splitWith: ["1", "2"],
        splitType: "equal",
        payments: [
          { memberId: "2", status: "pending" },
        ],
      }),
    ];
    
    const settlement: Settlement = {
      id: "s1",
      fromUser: { id: "2", name: "Sarah Tan" },
      toUser: { id: "1", name: "Ahmad Razak" },
      amount: 200,
      status: "settled", // Viewing a settled settlement
    };
    
    const result = getContributingExpenses(settlement, expenses, mockMembers, getCategoryFromTitle);
    
    // Only the settled expense should be included
    expect(result.owedToReceiver).toHaveLength(1);
    expect(result.owedToReceiver[0].title).toBe("Accommodation");
    expect(result.grossOwed).toBe(200);
  });

  it('should only include pending expenses for pending settlements', () => {
    const expenses: ExpenseData[] = [
      createExpense({
        id: "1",
        title: "Accommodation",
        amount: 400,
        paidBy: "Ahmad Razak",
        date: "Jan 15",
        splitWith: ["1", "2"],
        splitType: "equal",
        payments: [
          { memberId: "2", status: "settled" },
        ],
      }),
      createExpense({
        id: "2",
        title: "Dinner",
        amount: 200,
        paidBy: "Ahmad Razak",
        date: "Jan 16",
        splitWith: ["1", "2"],
        splitType: "equal",
        payments: [
          { memberId: "2", status: "pending" },
        ],
      }),
    ];
    
    const settlement: Settlement = {
      id: "s1",
      fromUser: { id: "2", name: "Sarah Tan" },
      toUser: { id: "1", name: "Ahmad Razak" },
      amount: 100,
      status: "pending", // Viewing a pending settlement
    };
    
    const result = getContributingExpenses(settlement, expenses, mockMembers, getCategoryFromTitle);
    
    // Only the pending expense should be included
    expect(result.owedToReceiver).toHaveLength(1);
    expect(result.owedToReceiver[0].title).toBe("Dinner");
    expect(result.grossOwed).toBe(100);
  });
});

describe('Real scenario: Sarah owes Ahmad RM 450', () => {
  it('should correctly calculate the net settlement amount', () => {
    // This test reproduces the exact scenario from the bug report
    const extendedMembers: Member[] = [
      { id: "1", name: "Ahmad Razak" },
      { id: "2", name: "Sarah Tan" },
      { id: "3", name: "Lisa Wong" },
      { id: "4", name: "John Doe" },
      { id: "5", name: "Jane Smith" },
    ];
    
    const expenses: ExpenseData[] = [
      createExpense({
        id: "exp-1",
        title: "Accommodation",
        amount: 1200,
        paidBy: "Ahmad Razak",
        date: "Jan 15",
        splitWith: ["1", "2", "3", "4"], // 4-way = 300 each
        splitType: "equal",
      }),
      createExpense({
        id: "exp-2",
        title: "Rental car",
        amount: 600,
        paidBy: "Ahmad Razak",
        date: "Jan 16",
        splitWith: ["1", "2", "3", "4"],
        splitType: "custom",
        customSplitAmounts: [
          { memberId: "1", amount: 150 },
          { memberId: "2", amount: 150 },
          { memberId: "3", amount: 150 },
          { memberId: "4", amount: 150 },
        ],
      }),
      createExpense({
        id: "exp-3",
        title: "Cable car tickets",
        amount: 128,
        paidBy: "Ahmad Razak",
        date: "Jan 17",
        splitWith: ["1", "2"], // 2-way = 64 each
        splitType: "equal",
      }),
      createExpense({
        id: "exp-4",
        title: "Ferry tickets",
        amount: 320,
        paidBy: "Sarah Tan",
        date: "Jan 18",
        splitWith: ["1", "2", "3", "4", "5"], // 5-way = 64 each
        splitType: "equal",
      }),
    ];
    
    const settlements = calculateNetSettlements(expenses, extendedMembers, "1");
    
    // Find the Sarah -> Ahmad settlement
    const sarahAhmadSettlement = settlements.find(
      s => s.fromUser.id === "2" && s.toUser.id === "1"
    );
    
    expect(sarahAhmadSettlement).toBeDefined();
    
    // Verify the calculation:
    // Sarah owes Ahmad:
    //   - Accommodation share: RM 300
    //   - Rental car share: RM 150
    //   - Cable car share: RM 64
    //   - Subtotal: RM 514
    //
    // Ahmad owes Sarah:
    //   - Ferry tickets share: RM 64
    //   - Subtotal: RM 64
    //
    // Net: RM 514 - RM 64 = RM 450
    
    expect(sarahAhmadSettlement!.amount).toBe(450);
  });
});
