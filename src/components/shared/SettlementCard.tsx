import { Link } from "react-router-dom";
import { ArrowRight, QrCode, FileText, Upload, CheckCircle2, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CurrencyLensToggle } from "@/components/shared/CurrencyLensToggle";
import { CurrencyCode, formatCurrencySpaced } from "@/lib/currencyUtils";
import { CurrencyViewMode } from "@/hooks/useCurrencyViewPreference";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SettlementCardProps {
  fromUser: { id: string; name: string; imageUrl?: string };
  toUser: { id: string; name: string; imageUrl?: string };
  amount: number;
  currency?: string;
  status: "pending" | "settled";
  currentUserId?: string;
  showReminder?: boolean;
  onCardClick?: () => void;
  onViewPayment?: () => void;
  onViewDetails?: () => void;
  onSendReminder?: () => void;
  onMarkPaid?: () => void;
  // Multi-currency props
  originalCurrency?: CurrencyCode;
  homeCurrency?: CurrencyCode;
  convertedAmountHome?: number;
  conversionAvailable?: boolean;
  viewMode?: CurrencyViewMode;
  onToggleViewMode?: () => void;
}

export function SettlementCard({
  fromUser,
  toUser,
  amount,
  currency = "RM",
  status,
  currentUserId,
  showReminder,
  onCardClick,
  onViewPayment,
  onViewDetails,
  onSendReminder,
  onMarkPaid,
  // Multi-currency props
  originalCurrency,
  homeCurrency = "MYR",
  convertedAmountHome,
  conversionAvailable = true,
  viewMode = "travel",
  onToggleViewMode,
}: SettlementCardProps) {
  // Determine user's role in this settlement
  const isUserPayer = currentUserId === fromUser.id;  // I owe someone
  const isUserReceiver = currentUserId === toUser.id; // Someone owes me
  
  // Determine if dual currency display is needed
  const needsDualDisplay = originalCurrency && originalCurrency !== homeCurrency;
  const showToggle = needsDualDisplay && conversionAvailable && !!onToggleViewMode;

  // Calculate amounts based on view mode
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

  return (
    <Card 
      className="p-4 border-border/50 cursor-pointer hover:border-primary/50 hover:shadow-md active:scale-[0.98] transition-all"
      onClick={onCardClick}
    >
      {/* Top Section: From → To (Compact Context) */}
      <div className="flex items-center justify-between gap-2 mb-3">
        {/* From User */}
        <Link 
          to={`/user/${fromUser.id}`}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity min-w-0"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
            {fromUser.imageUrl ? (
              <img src={fromUser.imageUrl} alt={fromUser.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-[14px] sm:text-xs font-medium text-muted-foreground">
                {fromUser.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <span className="text-[14px] sm:text-xs font-medium text-foreground line-clamp-2 max-w-[90px] leading-tight">
            {fromUser.name}
          </span>
        </Link>

        {/* Arrow */}
        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />

        {/* To User */}
        <Link 
          to={`/user/${toUser.id}`}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity min-w-0"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-[14px] sm:text-xs font-medium text-foreground line-clamp-2 max-w-[90px] leading-tight text-right">
            {toUser.name}
          </span>
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
            {toUser.imageUrl ? (
              <img src={toUser.imageUrl} alt={toUser.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-[14px] sm:text-xs font-medium text-muted-foreground">
                {toUser.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* Middle Section: Net Amount (Primary Focus) */}
      <div className="text-center py-2">
        {/* Currency Toggle - only if different currencies and conversion available */}
        {showToggle && originalCurrency && (
          <div className="flex justify-center mb-2">
            <CurrencyLensToggle
              travelCurrency={originalCurrency}
              homeCurrency={homeCurrency}
              viewMode={viewMode}
              onToggle={onToggleViewMode!}
            />
          </div>
        )}
        
        {/* Conversion unavailable indicator */}
        {needsDualDisplay && !conversionAvailable && (
          <div className="flex justify-center mb-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Info className="h-3 w-3" />
                    Rate unavailable
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Currency conversion unavailable</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* Primary Amount - single dominant currency */}
        <p className="text-2xl font-bold text-foreground transition-opacity duration-150">
          {formatCurrencySpaced(primaryAmount, primaryCurrency)}
        </p>
        
        {/* Secondary reference */}
        {needsDualDisplay && conversionAvailable && secondaryAmount !== undefined && (
          <p className="text-xs text-muted-foreground mt-0.5">
            ≈ {formatCurrencySpaced(secondaryAmount, secondaryCurrency)} (est.)
          </p>
        )}
        
        <p className="text-[14px] sm:text-xs text-muted-foreground mt-1">Net amount owed</p>
      </div>

      {/* Status Badge - Centered */}
      <div className="flex justify-center mb-3">
        <StatusBadge status={status} size="md" className="text-[13px] sm:text-xs px-3.5 sm:px-3 py-1.5 sm:py-1" />
      </div>

      {/* Actions - Role-based at bottom */}
      <div className="flex flex-col gap-2 pt-3 border-t border-border/50">
        {/* If I OWE someone and PENDING: Show View QR and Upload Receipt */}
        {isUserPayer && status === "pending" && (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full h-10 text-sm"
              onClick={(e) => { e.stopPropagation(); onViewPayment?.(); }}
            >
              <QrCode className="h-4 w-4 mr-2" />
              View QR
            </Button>
            <Button 
              size="sm" 
              className="w-full h-10 text-sm bg-foreground text-background hover:bg-foreground/90"
              onClick={(e) => { e.stopPropagation(); onCardClick?.(); }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Receipt
            </Button>
          </>
        )}
        
        {/* If I OWE someone and SETTLED: Show View Details */}
        {isUserPayer && status === "settled" && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full h-10 text-sm"
            onClick={(e) => { e.stopPropagation(); onViewDetails?.(); }}
          >
            <FileText className="h-4 w-4 mr-2" />
            View Details
          </Button>
        )}
        
        {/* If someone owes ME: Show View Details */}
        {isUserReceiver && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full h-10 text-sm"
            onClick={(e) => { e.stopPropagation(); onViewDetails?.(); }}
          >
            <FileText className="h-4 w-4 mr-2" />
            View Details
          </Button>
        )}
        
        
        {/* Mark as Paid - Only when someone owes ME and pending */}
        {status === "pending" && isUserReceiver && (
          <Button 
            size="sm" 
            className="w-full h-10 text-sm bg-foreground text-background hover:bg-foreground/90"
            onClick={(e) => { e.stopPropagation(); onMarkPaid?.(); }}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark as Paid
          </Button>
        )}
      </div>
    </Card>
  );
}