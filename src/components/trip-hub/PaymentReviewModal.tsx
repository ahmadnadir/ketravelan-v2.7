import { useState } from "react";
import { Download, ZoomIn, ZoomOut, ImageIcon, CheckCircle, Bell } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExpensePayment } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

interface Member {
  id: string;
  name: string;
  imageUrl?: string;
}

interface PaymentReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
  amount: number;
  payment: ExpensePayment | null;
  onConfirmReceived: () => void;
}

export function PaymentReviewModal({
  open,
  onOpenChange,
  member,
  amount,
  payment,
  onConfirmReceived,
}: PaymentReviewModalProps) {
  const [zoom, setZoom] = useState(1);

  if (!member || !payment) return null;

  const isReceived = payment.status === "received";
  const hasReceipt = !!payment.receiptUrl;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));

  const handleDownload = () => {
    if (payment.receiptUrl) {
      const link = document.createElement("a");
      link.href = payment.receiptUrl;
      link.download = `payment-receipt-${member.name.replace(/\s+/g, "-").toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getStatusBadge = () => {
    switch (payment.status) {
      case "received":
        return (
          <Badge className="bg-stat-green text-stat-green-foreground">
            Received
          </Badge>
        );
      case "submitted":
        return (
          <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500/30">
            Payment Submitted
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-500/30">
            Awaiting Payment
          </Badge>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto scrollbar-hide w-[calc(100%-2rem)] sm:w-full rounded-2xl p-0">
        {/* Header */}
        <DialogHeader className="p-4 pb-3 border-b border-border/50">
          <DialogTitle className="sr-only">Payment Review for {member.name}</DialogTitle>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.imageUrl} alt={member.name} />
                <AvatarFallback>{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{member.name}</p>
                <p className="text-lg font-bold text-foreground">RM {amount.toFixed(2)}</p>
              </div>
            </div>
            {getStatusBadge()}
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Received Banner */}
          {isReceived && (
            <Card className="p-4 bg-stat-green/10 border-stat-green/30">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-stat-green" />
                <div>
                  <p className="font-medium text-foreground">Payment Received</p>
                  <p className="text-sm text-muted-foreground">This payment has been confirmed.</p>
                </div>
              </div>
            </Card>
          )}

          {/* Proof of Payment Section */}
          <div>
            <h3 className="text-xs font-medium text-muted-foreground mb-2">Proof of Payment</h3>
            
            {hasReceipt ? (
              <Card className="overflow-hidden border-border/50">
                {/* Zoom Controls */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 bg-secondary/30">
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownload}
                    className="h-7 text-xs gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </Button>
                </div>

                {/* Receipt Image */}
                <div className="max-h-[280px] overflow-auto scrollbar-hide">
                  <div
                    className="flex items-center justify-center p-2"
                    style={{ transform: `scale(${zoom})`, transformOrigin: "center top" }}
                  >
                    <img
                      src={payment.receiptUrl}
                      alt="Payment receipt"
                      className="rounded-lg max-w-full"
                    />
                  </div>
                </div>

                {/* Upload Timestamp */}
                {payment.uploadedAt && (
                  <div className="px-3 py-2 border-t border-border/50 bg-secondary/20">
                    <p className="text-[11px] text-muted-foreground">
                      Uploaded {payment.uploadedAt}
                    </p>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="p-6 text-center border-border/50">
                <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No receipt uploaded yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {member.name} hasn't submitted proof of payment.
                </p>
              </Card>
            )}
          </div>

          {/* Send Reminder Button - Only show if awaiting payment */}
          {!isReceived && !hasReceipt && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                toast({
                  title: "Reminder sent",
                  description: `${member.name} has been notified about their pending payment.`,
                });
              }}
            >
              <Bell className="h-4 w-4 mr-2" />
              Send Reminder to {member.name}
            </Button>
          )}

          {/* Payer Note */}
          {payment.payerNote && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-2">Payer's Note</h3>
              <Card className="p-3 border-border/50 bg-secondary/20">
                <p className="text-sm text-foreground italic">"{payment.payerNote}"</p>
              </Card>
            </div>
          )}

          {/* Action Button - Only show if not received and has receipt */}
          {!isReceived && hasReceipt && (
            <Button
              className="w-full"
              onClick={onConfirmReceived}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm & Mark as Received
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
