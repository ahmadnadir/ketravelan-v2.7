import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
// Member color palette matching TripExpenses
const MEMBER_COLORS = [
  { bg: "bg-member-coral", shadow: "shadow-member-coral/30" },
  { bg: "bg-member-teal", shadow: "shadow-member-teal/30" },
  { bg: "bg-member-violet", shadow: "shadow-member-violet/30" },
  { bg: "bg-member-sky", shadow: "shadow-member-sky/30" },
];

// Mock data for previews - matching TripExpenses member contribution format
const mockContributions = [
  { name: "Ahmad Razak", initial: "AR", amount: 1200, percentage: 47, colorIndex: 0 },
  { name: "Sarah Tan", initial: "ST", amount: 770, percentage: 30, colorIndex: 1 },
  { name: "Lisa Wong", initial: "LW", amount: 380, percentage: 15, colorIndex: 2 },
  { name: "Marcus Lee", initial: "ML", amount: 180, percentage: 8, colorIndex: 3 },
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
        {mockContributions.map((member) => {
          const color = MEMBER_COLORS[member.colorIndex];
          return (
            <div key={member.name} className="space-y-0.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Avatar className="w-4 h-4">
                    <AvatarFallback className="text-[6px] bg-muted">{member.initial}</AvatarFallback>
                  </Avatar>
                  <span className="text-[8px] font-medium truncate max-w-[60px]">{member.name}</span>
                </div>
                <span className="text-[8px] font-semibold">RM {member.amount.toLocaleString()} <span className="text-muted-foreground font-normal">({member.percentage}%)</span></span>
              </div>
              {/* Progress bar with member color and glow effect */}
              <div className="relative">
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${color.bg} transition-all`}
                    style={{ width: `${member.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

// Mockup Card 3 - Settlement (Static image placeholder)
// TODO: Replace with actual settlement mockup image when provided
const SettlementMockup = () => (
  <div className="w-full h-full flex items-center justify-center bg-muted/20">
    <p className="text-[10px] text-muted-foreground text-center px-4">
      Settlement mockup image placeholder
    </p>
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
    <Card className="overflow-hidden border-border/50 flex flex-col h-full">
      {/* Phone Mockup Frame - Standardized height */}
      <div className="bg-muted/30 p-3 border-b border-border/30 flex flex-col">
        <div className="bg-background rounded-xl border border-border/50 shadow-sm overflow-hidden h-[240px] sm:h-[280px] flex flex-col">
          {/* Status Bar */}
          <div className="h-4 bg-muted/50 flex items-center justify-between px-3 flex-shrink-0">
            <span className="text-[8px] text-muted-foreground">9:41</span>
            <div className="flex gap-1">
              <div className="w-2.5 h-1.5 bg-muted-foreground/50 rounded-sm" />
              <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full" />
            </div>
          </div>
          {/* App Content - Clipped */}
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
