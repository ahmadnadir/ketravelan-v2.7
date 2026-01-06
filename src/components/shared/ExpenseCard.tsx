import { MoreVertical, Upload, FileText, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatDisplayDate } from "@/lib/dateUtils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CurrencyLensToggle } from "@/components/shared/CurrencyLensToggle";
import { CurrencyCode, formatCurrencySpaced } from "@/lib/currencyUtils";
import { CurrencyViewMode } from "@/hooks/useCurrencyViewPreference";

// User role types for expense actions
type ExpenseRole = "payer" | "owes" | "settled";
type PaymentStatus = "pending" | "settled";

interface Payment {
  memberId: string;
  status: PaymentStatus;
}

interface ExpenseCardProps {
  id: string;
  title: string;
  amount: number;
  currency?: string;
  paidBy: string;
  date: string;
  category?: string;
  paymentProgress?: number;
  currentUser?: string;
  currentUserId?: string;
  splitWith?: string[];
  splitType?: "equal" | "custom";
  customSplitAmounts?: { memberId: string; amount: number }[];
  payments?: Payment[];
  // Interaction callbacks
  onCardClick: () => void;
  onPrimaryAction: () => void;
  // Management callbacks
  onEdit?: () => void;
  onDelete?: () => void;
  // Visual feedback for bulk settlement
  isHighlighted?: boolean;
  // Staggered animation delay for progress bar (in ms)
  animationDelay?: number;
  // Multi-currency props
  originalCurrency?: CurrencyCode;
  homeCurrency?: CurrencyCode;
  convertedAmountHome?: number;
  conversionAvailable?: boolean;
  viewMode?: CurrencyViewMode;
  onToggleViewMode?: () => void;
}

export function ExpenseCard({
  title,
  amount,
  currency = "RM",
  paidBy,
  date,
  paymentProgress = 0,
  currentUser = "Ahmad",
  currentUserId = "1",
  splitWith,
  splitType = "equal",
  customSplitAmounts,
  payments,
  onCardClick,
  onPrimaryAction,
  onEdit,
  onDelete,
  isHighlighted = false,
  // Multi-currency props
  originalCurrency,
  homeCurrency = "MYR",
  convertedAmountHome,
  conversionAvailable = true,
  viewMode = "travel",
  onToggleViewMode,
}: ExpenseCardProps) {
  // Determine if dual currency display is needed
  const needsDualDisplay = originalCurrency && originalCurrency !== homeCurrency;
  const showToggle = needsDualDisplay && conversionAvailable && !!onToggleViewMode;

  // Determine user's role for this expense
  const isFullySettled = paymentProgress === 100;
  const isPayer = paidBy.toLowerCase().includes(currentUser.toLowerCase());

  // Calculate primary and secondary amounts based on view mode
  const primaryAmount = viewMode === "home" && convertedAmountHome !== undefined
    ? convertedAmountHome
    : amount;
  const primaryCurrency: CurrencyCode = viewMode === "home" 
    ? homeCurrency 
    : (originalCurrency || "MYR");

  const secondaryAmount = viewMode === "home" 
    ? amount 
    : convertedAmountHome;
  const secondaryCurrency: CurrencyCode = viewMode === "home" 
    ? (originalCurrency || "MYR") 
    : homeCurrency;

  // Calculate user's personal share
  const calculatePersonalShare = (): { amount: number; status: "pending" | "settled" } => {
    const memberCount = splitWith?.length || 1;
    
    // Calculate amount
    let shareAmount: number;
    if (splitType === "custom" && customSplitAmounts) {
      const customAmount = customSplitAmounts.find(c => c.memberId === currentUserId);
      shareAmount = customAmount?.amount || (amount / memberCount);
    } else {
      shareAmount = amount / memberCount;
    }
    
    // If user is the payer, their share is automatically settled
    if (isPayer) {
      return { amount: shareAmount, status: "settled" };
    }
    
    // Determine status from payments array
    const userPayment = payments?.find(p => p.memberId === currentUserId);
    const status: "pending" | "settled" = userPayment?.status === "settled" ? "settled" : "pending";
    
    return { amount: shareAmount, status };
  };

  const personalShare = calculatePersonalShare();

  // Calculate personal share in primary currency
  const personalSharePrimary = viewMode === "home" && convertedAmountHome !== undefined
    ? (personalShare.amount / amount) * convertedAmountHome
    : personalShare.amount;

  // Calculate personal share in secondary currency (for reference)
  const personalShareSecondary = viewMode === "home"
    ? personalShare.amount
    : convertedAmountHome !== undefined
      ? (personalShare.amount / amount) * convertedAmountHome
      : undefined;

  // CTA label and icon based on personal share status only (binary)
  const getButtonConfig = (): { label: string; icon: React.ReactNode } => {
    if (personalShare.status === "pending") {
      return { 
        label: "View & Settle", 
        icon: <Upload className="h-4 w-4 mr-2" /> 
      };
    }
    return { 
      label: "View Details", 
      icon: <FileText className="h-4 w-4 mr-2" /> 
    };
  };

  const buttonConfig = getButtonConfig();

  // Handle card click (not on button or dropdown)
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Don't trigger card click if clicking on buttons or dropdown
    if (target.closest('button') || target.closest('[role="menu"]')) {
      return;
    }
    onCardClick();
  };

  return (
    <Card 
      className={cn(
        "group p-3 sm:p-4 border-border/50 cursor-pointer hover:border-primary/50 hover:shadow-md active:scale-[0.98] transition-all",
        isHighlighted && "ring-2 ring-stat-green/50 animate-settle-pulse"
      )}
      onClick={handleCardClick}
    >
      <div className="space-y-3">
        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 1: Expense Context
            - Title + Currency Toggle
            - Primary Amount (large, single currency)
            - Payer + Date
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="space-y-1">
          {/* Header row: Title + Toggle + Menu */}
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-sm text-foreground truncate flex-1">
              {title}
            </h4>
            <div className="flex items-center gap-1 shrink-0">
              {/* Currency toggle - only if different currencies and conversion available */}
              {showToggle && originalCurrency && (
                <CurrencyLensToggle
                  travelCurrency={originalCurrency}
                  homeCurrency={homeCurrency}
                  viewMode={viewMode}
                  onToggle={onToggleViewMode!}
                />
              )}
              
              {/* Conversion unavailable indicator */}
              {needsDualDisplay && !conversionAvailable && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="p-1">
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Conversion unavailable</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {/* 3-dot menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(); }}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => { e.stopPropagation(); onDelete?.(); }} 
                    className="text-destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Primary Amount - largest text, single currency dominant */}
          <p className="text-2xl font-bold text-foreground transition-opacity duration-150">
            {formatCurrencySpaced(primaryAmount, primaryCurrency)}
          </p>

          {/* Subtext: Payer + Date */}
          <p className="text-xs text-muted-foreground">
            Paid by {paidBy} · {formatDisplayDate(date)}
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 2: Personal Impact
            - "Your share" label
            - Amount + Status badge
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-between py-1">
          <span className="text-sm font-medium text-foreground">Your share</span>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-foreground transition-opacity duration-150">
              {formatCurrencySpaced(personalSharePrimary, primaryCurrency)}
            </span>
            <StatusBadge status={personalShare.status} size="sm" />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 3: Settlement Meta + CTA
            - Divider
            - Secondary currency reference + Group settlement %
            - Primary CTA button
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="pt-2 border-t border-border/50 space-y-2">
          {/* Meta row: Secondary reference + Settlement info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {/* Secondary currency reference (only if dual display needed) */}
            {needsDualDisplay && conversionAvailable && personalShareSecondary !== undefined ? (
              <span>
                ≈ {formatCurrencySpaced(personalShareSecondary, secondaryCurrency)} (est.)
              </span>
            ) : needsDualDisplay && !conversionAvailable ? (
              <span className="flex items-center gap-1">
                <Info className="h-3 w-3" />
                Rate unavailable
              </span>
            ) : (
              <span></span>
            )}
            
            {/* Group settlement percentage */}
            <span className={cn(
              isFullySettled && "text-stat-green font-medium"
            )}>
              Group: {paymentProgress}% settled
            </span>
          </div>

          {/* Primary CTA */}
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onPrimaryAction();
            }}
            className={cn(
              "w-full h-9 text-sm font-medium transition-all duration-150",
              personalShare.status === "pending" 
                ? "bg-foreground text-background hover:bg-foreground/90"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {buttonConfig.icon}
            {buttonConfig.label}
          </Button>
        </div>
      </div>
    </Card>
  );
}
