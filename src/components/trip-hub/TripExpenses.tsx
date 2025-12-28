import { useState } from "react";
import { Plus, MessageCircle, DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { StatCard } from "@/components/shared/StatCard";
import { ExpenseCard } from "@/components/shared/ExpenseCard";
import { SettlementCard } from "@/components/shared/SettlementCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockExpenses, mockMembers } from "@/data/mockData";

const categoryBreakdown = [
  { category: "Transport", amount: 770, percentage: 30, color: "bg-stat-blue" },
  { category: "Food & Drinks", amount: 560, percentage: 22, color: "bg-stat-orange" },
  { category: "Accommodation", amount: 1200, percentage: 47, color: "bg-purple-500" },
  { category: "Activities", amount: 180, percentage: 7, color: "bg-stat-green" },
];

export function TripExpenses() {
  const [subTab, setSubTab] = useState("breakdown");

  const totalCost = mockExpenses.reduce((sum, e) => sum + e.amount, 0);
  const yourExpenses = 680;
  const youOwe = 120;
  const owedToYou = 85;

  return (
    <div className="px-4 py-4 pb-8 space-y-6">
      {/* Actions */}
      <div className="flex gap-3">
        <Button className="flex-1 rounded-xl">
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
        <Button variant="outline" className="rounded-xl">
          <MessageCircle className="h-4 w-4 mr-2" />
          Chat
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          title="Total Trip Cost"
          value={`RM ${totalCost.toLocaleString()}`}
          icon={DollarSign}
          color="blue"
        />
        <StatCard
          title="Your Expenses"
          value={`RM ${yourExpenses.toLocaleString()}`}
          icon={Wallet}
          color="green"
        />
        <StatCard
          title="Who Owes You"
          value={`RM ${owedToYou.toLocaleString()}`}
          icon={TrendingUp}
          color="orange"
        />
        <StatCard
          title="You Owe"
          value={`RM ${youOwe.toLocaleString()}`}
          icon={TrendingDown}
          color="red"
        />
      </div>

      {/* Sub Tabs */}
      <SegmentedControl
        options={[
          { label: "Breakdown", value: "breakdown" },
          { label: "Expenses", value: "expenses" },
          { label: "Settlement", value: "settlement" },
        ]}
        value={subTab}
        onChange={setSubTab}
      />

      {/* Breakdown Tab */}
      {subTab === "breakdown" && (
        <div className="space-y-4">
          {/* Per Person */}
          <Card className="p-4 border-border/50">
            <h3 className="font-semibold text-foreground mb-4">Upfront Payment per Person</h3>
            <p className="text-2xl font-bold text-primary mb-4">
              RM {Math.round(totalCost / mockMembers.length).toLocaleString()}
            </p>
            <div className="space-y-3">
              {mockMembers.slice(0, 4).map((member, index) => {
                const contribution = [850, 680, 450, 730][index] || 500;
                const percentage = Math.round((contribution / totalCost) * 100);
                return (
                  <div key={member.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{member.name}</span>
                      <span className="text-muted-foreground">
                        RM {contribution} ({percentage}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </Card>

          {/* By Category */}
          <Card className="p-4 border-border/50">
            <h3 className="font-semibold text-foreground mb-4">Spending by Category</h3>
            <div className="space-y-3">
              {categoryBreakdown.map((item) => (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{item.category}</span>
                    <span className="text-muted-foreground">
                      RM {item.amount} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
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
      )}

      {/* Expenses Tab */}
      {subTab === "expenses" && (
        <div className="space-y-3">
          {mockExpenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              {...expense}
              onEdit={() => console.log("Edit", expense.id)}
              onDelete={() => console.log("Delete", expense.id)}
              onViewReceipt={() => console.log("View receipt", expense.id)}
            />
          ))}
        </div>
      )}

      {/* Settlement Tab */}
      {subTab === "settlement" && (
        <div className="space-y-3">
          <SettlementCard
            fromUser={{ name: "Sarah", imageUrl: mockMembers[1].imageUrl }}
            toUser={{ name: "Ahmad", imageUrl: mockMembers[0].imageUrl }}
            amount={120}
            status="pending"
            onViewPayment={() => console.log("View payment")}
            onMarkPaid={() => console.log("Mark paid")}
          />
          <SettlementCard
            fromUser={{ name: "Lisa", imageUrl: mockMembers[2].imageUrl }}
            toUser={{ name: "Ahmad", imageUrl: mockMembers[0].imageUrl }}
            amount={85}
            status="paid"
            onViewPayment={() => console.log("View payment")}
          />
          <SettlementCard
            fromUser={{ name: "John", imageUrl: mockMembers[3].imageUrl }}
            toUser={{ name: "Sarah", imageUrl: mockMembers[1].imageUrl }}
            amount={45}
            status="pending"
            onViewPayment={() => console.log("View payment")}
            onMarkPaid={() => console.log("Mark paid")}
          />
        </div>
      )}
    </div>
  );
}