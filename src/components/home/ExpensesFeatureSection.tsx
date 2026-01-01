import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, TrendingDown, Wallet, Users } from "lucide-react";

// Mock data for previews
const mockContributions = [
  { name: "Ahmad", initial: "A", amount: 1200, percentage: 47, color: "bg-primary" },
  { name: "Sarah", initial: "S", amount: 770, percentage: 30, color: "bg-emerald-500" },
  { name: "Lisa", initial: "L", amount: 380, percentage: 15, color: "bg-amber-500" },
  { name: "Marcus", initial: "M", amount: 180, percentage: 8, color: "bg-rose-500" },
];

// Mockup Card 1 - Trip Overview
const OverviewMockup = () => (
  <div className="space-y-2 p-3">
    {/* Total Trip Spend */}
    <div className="bg-primary/10 rounded-lg p-2.5 flex items-center gap-2">
      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
        <Wallet className="w-3.5 h-3.5 text-primary" />
      </div>
      <div>
        <p className="text-[10px] text-muted-foreground">Total Trip Spend</p>
        <p className="text-sm font-bold">RM 2,530</p>
      </div>
    </div>
    
    {/* Your Expenses */}
    <div className="bg-muted/50 rounded-lg p-2.5 flex items-center gap-2">
      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
        <Users className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-[10px] text-muted-foreground">Your Total Expenses</p>
        <p className="text-sm font-bold">RM 680</p>
      </div>
    </div>
    
    {/* Owed Stats */}
    <div className="grid grid-cols-2 gap-2">
      <div className="bg-emerald-500/10 rounded-lg p-2 text-center">
        <TrendingUp className="w-3.5 h-3.5 text-emerald-500 mx-auto mb-0.5" />
        <p className="text-[9px] text-muted-foreground">You're Owed</p>
        <p className="text-xs font-bold text-emerald-600">RM 186</p>
      </div>
      <div className="bg-rose-500/10 rounded-lg p-2 text-center">
        <TrendingDown className="w-3.5 h-3.5 text-rose-500 mx-auto mb-0.5" />
        <p className="text-[9px] text-muted-foreground">You Owe</p>
        <p className="text-xs font-bold text-rose-600">RM 42</p>
      </div>
    </div>
  </div>
);

// Mockup Card 2 - Upfront Contributions
const ContributionsMockup = () => (
  <div className="p-3 space-y-2">
    <p className="text-[10px] font-medium text-muted-foreground">Paid on Behalf of the Group</p>
    <div className="space-y-2">
      {mockContributions.map((member) => (
        <div key={member.name} className="flex items-center gap-2">
          <Avatar className="w-5 h-5">
            <AvatarFallback className="text-[8px] bg-muted">{member.initial}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[9px] font-medium truncate">{member.name}</span>
              <span className="text-[9px] text-muted-foreground">{member.percentage}%</span>
            </div>
            <Progress value={member.percentage} className="h-1.5" />
          </div>
          <span className="text-[9px] font-semibold w-12 text-right">RM {member.amount}</span>
        </div>
      ))}
    </div>
  </div>
);

// Mockup Card 3 - Settlement
const SettlementMockup = () => (
  <div className="p-3 space-y-3">
    <div className="bg-muted/30 rounded-lg p-2.5">
      <div className="flex items-center justify-between gap-2">
        {/* From User */}
        <div className="flex items-center gap-1.5">
          <Avatar className="w-7 h-7 border-2 border-rose-200">
            <AvatarFallback className="text-[10px] bg-rose-100 text-rose-600">S</AvatarFallback>
          </Avatar>
          <span className="text-[10px] font-medium">Sarah</span>
        </div>
        
        {/* Arrow */}
        <div className="flex flex-col items-center">
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-[9px] text-muted-foreground">owes</span>
        </div>
        
        {/* To User */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-medium">Ahmad</span>
          <Avatar className="w-7 h-7 border-2 border-emerald-200">
            <AvatarFallback className="text-[10px] bg-emerald-100 text-emerald-600">A</AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      {/* Amount */}
      <div className="text-center mt-2">
        <p className="text-lg font-bold">RM 186</p>
        <span className="text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full">Pending</span>
      </div>
    </div>
    
    {/* Action Button */}
    <Button size="sm" className="w-full h-7 text-[10px]">
      Mark as Paid
    </Button>
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
          {/* Status Bar */}
          <div className="h-4 bg-muted/50 flex items-center justify-between px-3 flex-shrink-0">
            <span className="text-[8px] text-muted-foreground">9:41</span>
            <div className="flex gap-1">
              <div className="w-2.5 h-1.5 bg-muted-foreground/50 rounded-sm" />
              <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full" />
            </div>
          </div>
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
