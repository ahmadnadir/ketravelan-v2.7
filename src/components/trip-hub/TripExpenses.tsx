import { useState, useMemo, useRef } from "react";
import { Plus, DollarSign, TrendingUp, TrendingDown, Wallet, ArrowUpDown, User } from "lucide-react";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { StatCard } from "@/components/shared/StatCard";
import { ExpenseCard } from "@/components/shared/ExpenseCard";
import { SettlementCard } from "@/components/shared/SettlementCard";
import { ViewQRModal } from "@/components/trip-hub/ViewQRModal";
import { MarkAsPaidModal } from "@/components/trip-hub/MarkAsPaidModal";
import { YourQRSection } from "@/components/trip-hub/YourQRSection";
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
import { mockExpenses, mockMembers } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

const categoryBreakdown = [
  { category: "Transport", amount: 770, percentage: 30, color: "bg-stat-blue" },
  { category: "Food & Drinks", amount: 560, percentage: 22, color: "bg-stat-orange" },
  { category: "Accommodation", amount: 1200, percentage: 47, color: "bg-purple-500" },
  { category: "Activities", amount: 180, percentage: 7, color: "bg-stat-green" },
];

interface Settlement {
  id: string;
  fromUser: { name: string; imageUrl?: string };
  toUser: { name: string; imageUrl?: string; qrCodeUrl?: string };
  amount: number;
  status: "pending" | "paid";
}

const mockSettlements: Settlement[] = [
  {
    id: "s1",
    fromUser: { name: "Sarah", imageUrl: mockMembers[1]?.imageUrl },
    toUser: { name: "Ahmad", imageUrl: mockMembers[0]?.imageUrl },
    amount: 120,
    status: "pending",
  },
  {
    id: "s2",
    fromUser: { name: "Lisa", imageUrl: mockMembers[2]?.imageUrl },
    toUser: { name: "Ahmad", imageUrl: mockMembers[0]?.imageUrl },
    amount: 85,
    status: "paid",
  },
  {
    id: "s3",
    fromUser: { name: "John", imageUrl: mockMembers[3]?.imageUrl },
    toUser: { name: "Sarah", imageUrl: mockMembers[1]?.imageUrl },
    amount: 45,
    status: "pending",
  },
];

export function TripExpenses() {
  const [subTab, setSubTab] = useState("overview");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [filterPayer, setFilterPayer] = useState<string>("all");
  const [settlementFilter, setSettlementFilter] = useState<"all" | "owedToYou" | "youOwe">("all");

  // Ref for scrolling to category breakdown
  const categoryBreakdownRef = useRef<HTMLDivElement>(null);

  // Modal states
  const [viewQROpen, setViewQROpen] = useState(false);
  const [markPaidOpen, setMarkPaidOpen] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);

  // User's own QR
  const [userQRUrl, setUserQRUrl] = useState<string | null>(null);

  // Settlement data with local state for status updates
  const [settlements, setSettlements] = useState<Settlement[]>(mockSettlements);

  const totalCost = mockExpenses.reduce((sum, e) => sum + e.amount, 0);
  const yourExpenses = 680;
  const youOwe = 120;
  const owedToYou = 85;

  // Get unique payers from expenses
  const uniquePayers = useMemo(() => {
    const payers = [...new Set(mockExpenses.map(e => e.paidBy))];
    return payers;
  }, []);

  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    let result = [...mockExpenses];
    
    // Filter by payer
    if (filterPayer !== "all") {
      result = result.filter(e => e.paidBy === filterPayer);
    }
    
    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });
    
    return result;
  }, [sortOrder, filterPayer]);

  // Filter settlements based on filter
  const filteredSettlements = useMemo(() => {
    if (settlementFilter === "all") return settlements;
    if (settlementFilter === "owedToYou") {
      // Settlements where current user is the recipient (toUser)
      return settlements.filter(s => s.toUser.name === "Ahmad");
    }
    if (settlementFilter === "youOwe") {
      // Settlements where current user is the payer (fromUser)
      return settlements.filter(s => s.fromUser.name === "Ahmad");
    }
    return settlements;
  }, [settlements, settlementFilter]);

  // Card tap handlers
  const handleTotalSpendTap = () => {
    setSubTab("overview");
    setTimeout(() => {
      categoryBreakdownRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleYouPaidTap = () => {
    setFilterPayer("Ahmad"); // Current user
    setSubTab("expenses");
  };

  const handleOwedToYouTap = () => {
    setSettlementFilter("owedToYou");
    setSubTab("whopayswho");
  };

  const handleYouOweTap = () => {
    setSettlementFilter("youOwe");
    setSubTab("whopayswho");
  };

  const handleViewQR = (settlement: Settlement) => {
    setSelectedSettlement(settlement);
    setViewQROpen(true);
  };

  const handleMarkPaid = (settlement: Settlement) => {
    setSelectedSettlement(settlement);
    setMarkPaidOpen(true);
  };

  const handleConfirmPayment = (note?: string, receiptFile?: File) => {
    if (selectedSettlement) {
      setSettlements((prev) =>
        prev.map((s) =>
          s.id === selectedSettlement.id ? { ...s, status: "paid" as const } : s
        )
      );
      toast({
        title: "Payment confirmed",
        description: `Payment to ${selectedSettlement.toUser.name} marked as paid${note ? `: ${note}` : ""}`,
      });
    }
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

  const handleAddExpense = () => {
    toast({
      title: "Add Expense",
      description: "Add expense form coming soon",
    });
  };

  return (
    <div className="relative">
      {/* Sub Tabs */}
      <div className="px-3 sm:px-4 pt-3 sm:pt-4">
        <SegmentedControl
          options={[
            { label: "Overview", value: "overview" },
            { label: "Expenses", value: "expenses" },
            { label: "Who Pays Who", value: "whopayswho" },
            { label: "My QR", value: "myqr" },
          ]}
          value={subTab}
          onChange={(value) => {
            setSubTab(value);
            // Reset filters when switching tabs
            if (value === "whopayswho") {
              setSettlementFilter("all");
            }
            if (value === "expenses") {
              setFilterPayer("all");
            }
          }}
        />
      </div>

      {/* Tab Content - Extra padding for sticky CTA */}
      <div className={subTab === "overview" || subTab === "expenses" ? "pb-24" : "pb-8"}>
        {/* Overview Tab */}
        {subTab === "overview" && (
          <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">Trip Expenses Overview</h2>
              <p className="text-sm text-muted-foreground">See where the money went and who's settled.</p>
            </div>

            {/* Interactive Stat Cards - 2x2 Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <StatCard
                title="Total Trip Spend"
                value={`RM ${totalCost.toLocaleString()}`}
                icon={DollarSign}
                color="blue"
                description="All group expenses combined"
                onClick={handleTotalSpendTap}
              />
              <StatCard
                title="You Paid"
                value={`RM ${yourExpenses.toLocaleString()}`}
                icon={Wallet}
                color="green"
                description="Total amount paid by you"
                onClick={handleYouPaidTap}
              />
              <StatCard
                title="You're Owed"
                value={`RM ${owedToYou.toLocaleString()}`}
                icon={TrendingUp}
                color="orange"
                description="Money others need to pay you"
                onClick={handleOwedToYouTap}
              />
              <StatCard
                title="You Owe"
                value={`RM ${youOwe.toLocaleString()}`}
                icon={TrendingDown}
                color="red"
                description="Amount you still need to settle"
                onClick={handleYouOweTap}
              />
            </div>

            {/* Category Breakdown */}
            <div ref={categoryBreakdownRef}>
              <Card className="p-3 sm:p-4 border-border/50">
                <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Spending by Category</h3>
                <div className="space-y-2 sm:space-y-3">
                  {categoryBreakdown.map((item) => (
                    <div key={item.category} className="space-y-1 sm:space-y-1.5">
                      <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                        <span className="text-foreground truncate">{item.category}</span>
                        <span className="text-muted-foreground shrink-0">
                          RM {item.amount} ({item.percentage}%)
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

            {/* Per Person Contribution */}
            <Card className="p-3 sm:p-4 border-border/50">
              <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Upfront Payment per Person</h3>
              <p className="text-xl sm:text-2xl font-bold text-primary mb-3 sm:mb-4">
                RM {Math.round(totalCost / mockMembers.length).toLocaleString()}
              </p>
              <div className="space-y-2 sm:space-y-3">
                {mockMembers.slice(0, 4).map((member, index) => {
                  const contribution = [850, 680, 450, 730][index] || 500;
                  const percentage = Math.round((contribution / totalCost) * 100);
                  return (
                    <div key={member.id} className="space-y-1 sm:space-y-1.5">
                      <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                        <span className="text-foreground truncate">{member.name}</span>
                        <span className="text-muted-foreground shrink-0">
                          RM {contribution} ({percentage}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-1.5 sm:h-2" />
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* Expenses Tab */}
        {subTab === "expenses" && (
          <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4">
            {/* Filter Row */}
            <div className="flex gap-2 sm:gap-3">
              <Select value={sortOrder} onValueChange={(value: "latest" | "oldest") => setSortOrder(value)}>
                <SelectTrigger className="flex-1 h-9 text-xs sm:text-sm rounded-lg bg-secondary border-0">
                  <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <SelectValue placeholder="Sort by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterPayer} onValueChange={setFilterPayer}>
                <SelectTrigger className="flex-1 h-9 text-xs sm:text-sm rounded-lg bg-secondary border-0">
                  <User className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <SelectValue placeholder="Paid by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All members</SelectItem>
                  {uniquePayers.map((payer) => (
                    <SelectItem key={payer} value={payer}>{payer}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Expense Cards */}
            <div className="space-y-2 sm:space-y-3">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <ExpenseCard
                    key={expense.id}
                    {...expense}
                    onEdit={() => console.log("Edit", expense.id)}
                    onDelete={() => console.log("Delete", expense.id)}
                    onViewReceipt={() => console.log("View receipt", expense.id)}
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

        {/* Who Pays Who Tab */}
        {subTab === "whopayswho" && (
          <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-4">
            {/* Header */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">Who Pays Who</h2>
              <p className="text-sm text-muted-foreground">Track payment statuses and settle up.</p>
            </div>

            {/* Filter Pills */}
            {settlementFilter !== "all" && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Filtered:</span>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-7 text-xs rounded-full"
                  onClick={() => setSettlementFilter("all")}
                >
                  {settlementFilter === "owedToYou" ? "Owed to you" : "You owe"} ✕
                </Button>
              </div>
            )}

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
                    onViewPayment={() => handleViewQR(settlement)}
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

        {/* My QR Tab */}
        {subTab === "myqr" && (
          <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-4">
            {/* Header */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">My Payment QR</h2>
              <p className="text-sm text-muted-foreground">Others can scan this to pay you.</p>
            </div>

            {/* QR Management */}
            <YourQRSection
              qrCodeUrl={userQRUrl}
              onUpload={handleUploadUserQR}
              onRemove={handleRemoveUserQR}
            />
          </div>
        )}
      </div>

      {/* Sticky CTA - Only on Overview and Expenses tabs */}
      {(subTab === "overview" || subTab === "expenses") && (
        <div className="fixed bottom-20 left-0 right-0 z-40 px-4 pb-2 pointer-events-none">
          <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto pointer-events-auto">
            <Button 
              className="w-full h-12 rounded-xl text-sm font-medium shadow-lg"
              onClick={handleAddExpense}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Shared Expense
            </Button>
          </div>
        </div>
      )}

      {/* View QR Modal */}
      <ViewQRModal
        open={viewQROpen}
        onOpenChange={setViewQROpen}
        recipientName={selectedSettlement?.toUser.name || ""}
        amount={selectedSettlement?.amount || 0}
        qrCodeUrl={selectedSettlement?.toUser.qrCodeUrl || userQRUrl || undefined}
      />

      {/* Mark as Paid Modal */}
      <MarkAsPaidModal
        open={markPaidOpen}
        onOpenChange={setMarkPaidOpen}
        recipientName={selectedSettlement?.toUser.name || ""}
        amount={selectedSettlement?.amount || 0}
        onConfirm={handleConfirmPayment}
      />
    </div>
  );
}