import { Receipt, Users, User, Calendar, Wallet, FileText, ZoomIn, ZoomOut, Download, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExpenseData } from "@/components/trip-hub/AddExpenseModal";
import { getCategoryById } from "@/lib/expenseCategories";
import { mockMembers } from "@/data/mockData";
import { useState } from "react";

interface ExpenseDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: ExpenseData | null;
}

export function ExpenseDetailsModal({
  open,
  onOpenChange,
  expense,
}: ExpenseDetailsModalProps) {
  const [zoom, setZoom] = useState(1);
  const [showFullReceipt, setShowFullReceipt] = useState(false);

  if (!expense) return null;

  const category = getCategoryById(expense.category || "Other");
  const CategoryIcon = category.icon;

  // Calculate split amounts
  const splitMembers = expense.splitWith || mockMembers.map(m => m.id);
  const memberCount = splitMembers.length;
  const equalSplitAmount = expense.amount / memberCount;

  // Get member details
  const getMemberById = (id: string) => mockMembers.find(m => m.id === id);

  // Demo receipt URL
  const receiptUrl = expense.hasReceipt 
    ? "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop" 
    : undefined;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));

  const handleDownload = () => {
    if (receiptUrl) {
      const link = document.createElement("a");
      link.href = receiptUrl;
      link.download = `receipt-${expense.title.replace(/\s+/g, "-").toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto scrollbar-hide w-[calc(100%-2rem)] sm:w-full rounded-2xl">
        <DialogHeader>
          {/* 1. Header: Category Icon, Title, Category Label, Amount */}
          <DialogTitle className="sr-only">{expense.title} Details</DialogTitle>
          <div className="flex items-start gap-3">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${category.color.split(' ')[0]}`}>
              <CategoryIcon className={`h-6 w-6 ${category.color.split(' ')[1]}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-semibold text-foreground truncate">{expense.title}</p>
              <p className="text-sm text-muted-foreground">{category.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                RM {expense.amount.toLocaleString()}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* 2. Meta Information: Paid by & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-secondary/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <User className="h-3.5 w-3.5" />
                <span className="text-xs">Paid by</span>
              </div>
              <p className="text-sm font-medium text-foreground">{expense.paidBy}</p>
            </div>
            <div className="p-3 rounded-xl bg-secondary/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-xs">Date</span>
              </div>
              <p className="text-sm font-medium text-foreground">{expense.date}</p>
            </div>
          </div>

          {/* 3. Receipt Section (if available) */}
          {expense.hasReceipt && receiptUrl && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground">Receipt</h3>
                </div>
                
                {/* Receipt Thumbnail */}
                <div className="rounded-xl bg-secondary/30 overflow-hidden">
                  {showFullReceipt ? (
                    <>
                      {/* Full Receipt View with Zoom */}
                      <div className="flex items-center justify-between px-3 py-2 border-b border-border/50">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleZoomOut}
                            className="h-7 w-7"
                            disabled={zoom <= 0.5}
                          >
                            <ZoomOut className="h-3.5 w-3.5" />
                          </Button>
                          <span className="text-xs text-muted-foreground w-10 text-center">
                            {Math.round(zoom * 100)}%
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleZoomIn}
                            className="h-7 w-7"
                            disabled={zoom >= 3}
                          >
                            <ZoomIn className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleDownload}
                            className="h-7 w-7"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowFullReceipt(false)}
                            className="h-7 text-xs"
                          >
                            Collapse
                          </Button>
                        </div>
                      </div>
                      <div className="max-h-[300px] overflow-auto scrollbar-hide">
                        <div
                          className="flex items-center justify-center p-2"
                          style={{ transform: `scale(${zoom})`, transformOrigin: "center top" }}
                        >
                          <img
                            src={receiptUrl}
                            alt="Receipt"
                            className="rounded-lg max-w-full"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Thumbnail View */
                    <div className="relative">
                      <img
                        src={receiptUrl}
                        alt="Receipt thumbnail"
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setShowFullReceipt(true)}
                          className="h-8 text-xs gap-1.5 flex-1"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => {
                            setShowFullReceipt(true);
                            handleZoomIn();
                          }}
                          className="h-8 w-8"
                        >
                          <ZoomIn className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={handleDownload}
                          className="h-8 w-8"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* 4. Split Breakdown */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Split breakdown</h3>
              <Badge variant="secondary" className="text-xs">
                {expense.splitType === "equal" ? "Equal split" : "Custom split"}
              </Badge>
            </div>

            <div className="space-y-2">
              {splitMembers.map((memberId) => {
                const member = getMemberById(memberId);
                if (!member) return null;

                // Get amount based on split type
                let amount = equalSplitAmount;
                if (expense.splitType === "custom" && expense.customSplitAmounts) {
                  const customAmount = expense.customSplitAmounts.find(c => c.memberId === memberId);
                  amount = customAmount?.amount || 0;
                }

                const isPayer = member.name === expense.paidBy;

                return (
                  <div
                    key={memberId}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/30"
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.imageUrl} alt={member.name} />
                        <AvatarFallback className="text-xs">
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium text-foreground">{member.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        RM {amount.toFixed(2)}
                      </p>
                      <Badge 
                        variant={isPayer ? "default" : "outline"} 
                        className={`text-[10px] px-1.5 py-0 ${isPayer ? "bg-stat-green text-stat-green-foreground" : ""}`}
                      >
                        {isPayer ? "Paid" : "Owes"}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Notes (Optional) */}
          {expense.notes && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground">Notes</h3>
                </div>
                <p className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded-xl">
                  {expense.notes}
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
