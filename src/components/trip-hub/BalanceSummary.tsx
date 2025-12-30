import { useMemo } from "react";
import { TrendingUp, TrendingDown, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { mockMembers } from "@/data/mockData";
import { ExpenseData, CustomSplitAmount } from "./AddExpenseModal";

interface BalanceSummaryProps {
  expenses: ExpenseData[];
  currentUser: string;
}

interface MemberBalance {
  memberId: string;
  name: string;
  imageUrl?: string;
  paid: number;
  owes: number;
  balance: number; // positive = owed money, negative = owes money
}

interface Settlement {
  from: string;
  fromName: string;
  fromImage?: string;
  to: string;
  toName: string;
  toImage?: string;
  amount: number;
}

export function BalanceSummary({ expenses, currentUser }: BalanceSummaryProps) {
  // Calculate balances for each member
  const memberBalances = useMemo(() => {
    const balances: Record<string, MemberBalance> = {};

    // Initialize balances for all members
    mockMembers.forEach((member) => {
      balances[member.name] = {
        memberId: member.id,
        name: member.name,
        imageUrl: member.imageUrl,
        paid: 0,
        owes: 0,
        balance: 0,
      };
    });

    // Process each expense
    expenses.forEach((expense) => {
      const payer = expense.paidBy;
      const amount = expense.amount;
      const splitWith = expense.splitWith || mockMembers.map((m) => m.id);

      // Add to payer's paid amount
      if (balances[payer]) {
        balances[payer].paid += amount;
      }

      // Calculate each person's share
      if (expense.splitType === "custom" && expense.customSplitAmounts) {
        // Custom split
        expense.customSplitAmounts.forEach((split: CustomSplitAmount) => {
          const member = mockMembers.find((m) => m.id === split.memberId);
          if (member && balances[member.name]) {
            balances[member.name].owes += split.amount;
          }
        });
      } else {
        // Equal split
        const perPerson = amount / splitWith.length;
        splitWith.forEach((memberId) => {
          const member = mockMembers.find((m) => m.id === memberId);
          if (member && balances[member.name]) {
            balances[member.name].owes += perPerson;
          }
        });
      }
    });

    // Calculate net balance (paid - owes)
    Object.values(balances).forEach((balance) => {
      balance.balance = balance.paid - balance.owes;
    });

    return Object.values(balances);
  }, [expenses]);

  // Calculate optimal settlements (who owes whom)
  const settlements = useMemo(() => {
    const result: Settlement[] = [];
    
    // Separate creditors and debtors
    const creditors = memberBalances
      .filter((m) => m.balance > 0.01)
      .map((m) => ({ ...m }))
      .sort((a, b) => b.balance - a.balance);
    
    const debtors = memberBalances
      .filter((m) => m.balance < -0.01)
      .map((m) => ({ ...m, balance: Math.abs(m.balance) }))
      .sort((a, b) => b.balance - a.balance);

    // Match debtors to creditors
    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(debtor.balance, creditor.balance);

      if (amount > 0.01) {
        result.push({
          from: debtor.memberId,
          fromName: debtor.name,
          fromImage: debtor.imageUrl,
          to: creditor.memberId,
          toName: creditor.name,
          toImage: creditor.imageUrl,
          amount: Math.round(amount * 100) / 100,
        });
      }

      debtor.balance -= amount;
      creditor.balance -= amount;

      if (debtor.balance < 0.01) i++;
      if (creditor.balance < 0.01) j++;
    }

    return result;
  }, [memberBalances]);

  // Find current user's summary
  const currentUserBalance = memberBalances.find((m) => m.name === currentUser);
  const userOwes = settlements.filter((s) => s.fromName === currentUser);
  const userIsOwed = settlements.filter((s) => s.toName === currentUser);

  return (
    <div className="space-y-4">
      {/* Your Balance Summary */}
      <Card className="p-4 border-border/50">
        <h3 className="font-semibold text-foreground mb-3 text-sm sm:text-base">Your Balance</h3>
        
        {currentUserBalance && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">You paid</span>
              <span className="font-medium text-foreground">
                RM {currentUserBalance.paid.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Your share</span>
              <span className="font-medium text-foreground">
                RM {currentUserBalance.owes.toFixed(2)}
              </span>
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">Net balance</span>
                <span
                  className={`font-semibold ${
                    currentUserBalance.balance > 0.01
                      ? "text-stat-green"
                      : currentUserBalance.balance < -0.01
                      ? "text-stat-red"
                      : "text-muted-foreground"
                  }`}
                >
                  {currentUserBalance.balance > 0.01
                    ? `+RM ${currentUserBalance.balance.toFixed(2)}`
                    : currentUserBalance.balance < -0.01
                    ? `-RM ${Math.abs(currentUserBalance.balance).toFixed(2)}`
                    : "Settled"}
                </span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Who Owes Whom */}
      <Card className="p-4 border-border/50">
        <h3 className="font-semibold text-foreground mb-3 text-sm sm:text-base">Who Owes Whom</h3>
        
        {settlements.length > 0 ? (
          <div className="space-y-3">
            {settlements.map((settlement, index) => {
              const isYouOwe = settlement.fromName === currentUser;
              const isOwedToYou = settlement.toName === currentUser;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    isYouOwe
                      ? "bg-stat-red/10"
                      : isOwedToYou
                      ? "bg-stat-green/10"
                      : "bg-secondary/50"
                  }`}
                >
                  {/* From User */}
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={settlement.fromImage} />
                      <AvatarFallback className="text-xs">
                        {settlement.fromName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground">
                      {isYouOwe ? "You" : settlement.fromName}
                    </span>
                  </div>

                  {/* Arrow & Amount */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      {isYouOwe ? (
                        <TrendingUp className="h-4 w-4 text-stat-red rotate-90" />
                      ) : isOwedToYou ? (
                        <TrendingDown className="h-4 w-4 text-stat-green rotate-90" />
                      ) : (
                        <span className="text-muted-foreground">→</span>
                      )}
                      <span
                        className={`text-sm font-semibold ${
                          isYouOwe
                            ? "text-stat-red"
                            : isOwedToYou
                            ? "text-stat-green"
                            : "text-foreground"
                        }`}
                      >
                        RM {settlement.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* To User */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {isOwedToYou ? "You" : settlement.toName}
                    </span>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={settlement.toImage} />
                      <AvatarFallback className="text-xs">
                        {settlement.toName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CheckCircle2 className="h-10 w-10 text-stat-green mb-2" />
            <p className="text-sm font-medium text-foreground">All settled up!</p>
            <p className="text-xs text-muted-foreground mt-1">
              No outstanding balances between group members
            </p>
          </div>
        )}
      </Card>

      {/* All Member Balances */}
      <Card className="p-4 border-border/50">
        <h3 className="font-semibold text-foreground mb-3 text-sm sm:text-base">All Balances</h3>
        <div className="space-y-2">
          {memberBalances.map((member) => (
            <div
              key={member.memberId}
              className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={member.imageUrl} />
                  <AvatarFallback className="text-xs">
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-foreground">
                  {member.name === currentUser ? "You" : member.name}
                </span>
              </div>
              <span
                className={`text-sm font-medium ${
                  member.balance > 0.01
                    ? "text-stat-green"
                    : member.balance < -0.01
                    ? "text-stat-red"
                    : "text-muted-foreground"
                }`}
              >
                {member.balance > 0.01
                  ? `+RM ${member.balance.toFixed(2)}`
                  : member.balance < -0.01
                  ? `-RM ${Math.abs(member.balance).toFixed(2)}`
                  : "Settled"}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
