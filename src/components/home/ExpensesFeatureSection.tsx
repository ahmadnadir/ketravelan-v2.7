import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, TrendingDown, Wallet, FileText, CheckCircle2 } from "lucide-react";

// Mock data for previews - matching TripExpenses member contribution format
const mockContributions = [
  { name: "Ahmad Razak", initial: "AR", amount: 1200, percentage: 47 },
  { name: "Sarah Tan", initial: "ST", amount: 770, percentage: 30 },
  { name: "Lisa Wong", initial: "LW", amount: 380, percentage: 15 },
  { name: "Marcus Lee", initial: "ML", amount: 180, percentage: 8 },
];

// Mockup Card 1 - Trip Overview (Matches Hero Section layout)
const OverviewMockup = () => (
  <div className="p-2 space-y-1.5">
    {/* Your Total Expenses - Full width card */}
    <div className="border border-border/50 rounded-lg p-2">
      <div className="space-y-0.5">
        <div className="flex items-center gap-1">
          <Wallet className="h-3 w-3 text-stat-green shrink-0" />
          <p className="text-[9px] text-muted-foreground">Your Total Expenses</p>
        </div>
        <p className="text-sm font-bold text-foreground">RM 680</p>
        <p className="text-[8px] text-muted-foreground">Your share of all trip costs</p>
      </div>
    </div>
    
    {/* Two column layout for Owed cards */}
    <div className="grid grid-cols-2 gap-1.5">
      {/* You're Owed */}
      <div className="border border-border/50 rounded-lg p-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-stat-orange shrink-0" />
            <p className="text-[9px] text-muted-foreground">You're Owed</p>
          </div>
          <p className="text-sm font-bold text-foreground">RM 85</p>
          <p className="text-[8px] text-muted-foreground">Net from others</p>
        </div>
      </div>
      
      {/* You Owe */}
      <div className="border border-border/50 rounded-lg p-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1">
            <TrendingDown className="h-3 w-3 text-stat-red shrink-0" />
            <p className="text-[9px] text-muted-foreground">You Owe</p>
          </div>
          <p className="text-sm font-bold text-foreground">RM 120</p>
          <p className="text-[8px] text-muted-foreground">Net to others</p>
        </div>
      </div>
    </div>
  </div>
);

// Mockup Card 2 - Upfront Contributions (Matches "Paid on Behalf of the Group" card)
const ContributionsMockup = () => (
  <div className="p-2 space-y-1.5">
    {/* Card wrapper matching TripExpenses */}
    <div className="border border-border/50 rounded-lg p-2 space-y-1.5">
      <p className="text-[9px] font-semibold text-foreground">Paid on Behalf of the Group</p>
      
      {/* Summary stats row */}
      <div className="flex justify-between text-[8px] text-muted-foreground pb-1.5 border-b border-border/30">
        <span>Total: <span className="font-semibold text-foreground">RM 2,530</span></span>
        <span>Avg: <span className="font-semibold text-foreground">RM 633</span></span>
      </div>
      
      {/* Member contributions */}
      <div className="space-y-1.5">
        {mockContributions.map((member) => (
          <div key={member.name} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Avatar className="w-4 h-4">
                <AvatarFallback className="text-[6px] bg-muted">{member.initial}</AvatarFallback>
              </Avatar>
              <span className="text-[8px] font-medium truncate max-w-[60px]">{member.name}</span>
            </div>
            <span className="text-[8px] font-semibold">RM {member.amount.toLocaleString()} <span className="text-muted-foreground font-normal">({member.percentage}%)</span></span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Mockup Card 3 - Settlement (Matches SettlementCard component)
const SettlementMockup = () => (
  <div className="p-2">
    {/* Card wrapper matching SettlementCard */}
    <div className="border border-border/50 rounded-lg p-2.5 space-y-2">
      {/* From → To layout (horizontal row) */}
      <div className="flex items-center justify-between gap-1">
        {/* From User */}
        <div className="flex items-center gap-1">
          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
            <span className="text-[8px] font-medium text-muted-foreground">ST</span>
          </div>
          <span className="text-[9px] font-medium text-foreground">Sarah</span>
        </div>
        
        {/* Arrow */}
        <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
        
        {/* To User */}
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-medium text-foreground">Ahmad</span>
          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
            <span className="text-[8px] font-medium text-muted-foreground">AR</span>
          </div>
        </div>
      </div>
      
      {/* Amount - centered */}
      <div className="text-center py-1">
        <p className="text-base font-bold text-foreground">RM 186</p>
        <p className="text-[8px] text-muted-foreground">Net amount owed</p>
      </div>
      
      {/* Status Badge - matching StatusBadge component */}
      <div className="flex justify-center">
        <span className="text-[8px] px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full font-medium">
          Pending
        </span>
      </div>
      
      {/* Action buttons - matching SettlementCard */}
      <div className="flex flex-col gap-1 pt-1.5 border-t border-border/50">
        <Button variant="outline" size="sm" className="w-full h-6 text-[8px]">
          <FileText className="h-2.5 w-2.5 mr-1" />
          View Details
        </Button>
        <Button size="sm" className="w-full h-6 text-[8px] bg-foreground text-background hover:bg-foreground/90">
          <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
          Mark as Paid
        </Button>
      </div>
    </div>
  </div>
);

// Feature card wrapper
interface MockupCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const MockupCard = ({ title, description, children }: MockupCardProps) => (
  <div className="min-w-[85vw] max-w-[320px] sm:min-w-0 sm:max-w-none snap-start flex-shrink-0 h-full">
    <Card className="overflow-hidden border-border/50 h-full flex flex-col min-h-[340px] sm:min-h-0">
      {/* Phone Mockup Frame */}
      <div className="bg-muted/30 p-3 border-b border-border/30 h-[200px] sm:h-auto sm:flex-1 flex flex-col">
        <div className="bg-background rounded-xl border border-border/50 shadow-sm overflow-hidden flex-1 flex flex-col">
          {/* App Content */}
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </div>
      </div>
      
      {/* Card Footer */}
      <div className="p-4 space-y-1.5 mt-auto">
        <h3 className="font-semibold text-base leading-tight line-clamp-2 break-words">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 break-words">{description}</p>
      </div>
    </Card>
  </div>
);

const featureCards = [
  {
    id: "overview",
    title: "See the Full Picture",
    description: "Get a clear snapshot of total trip spending and everyone's share — updated in real time for the whole group.",
    mockup: <OverviewMockup />,
  },
  {
    id: "contributions",
    title: "Upfront Payments, Clearly Tracked",
    description: "Covered flights, stays, or tickets upfront? We automatically track who paid for what, so balance stays fair without reminders.",
    mockup: <ContributionsMockup />,
  },
  {
    id: "settlement",
    title: "Settle Once. Done.",
    description: "We calculate the net balance across all expenses. Settle everything in one step — no back-and-forth, no confusion.",
    mockup: <SettlementMockup />,
  },
];

export const ExpensesFeatureSection = () => {
  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          Expenses, Without the Awkwardness
        </h2>
        <p className="text-sm text-muted-foreground">
          Know where the money stands — without spreadsheets, reminders, or uncomfortable conversations.
        </p>
      </div>

      {/* Swipeable Cards */}
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible">
        {featureCards.map((card) => (
          <MockupCard key={card.id} title={card.title} description={card.description}>
            {card.mockup}
          </MockupCard>
        ))}
      </div>
    </section>
  );
};
