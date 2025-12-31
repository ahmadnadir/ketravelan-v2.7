import { useState, useRef } from "react";
import { Camera, Upload, X, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MarkAsPaidModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientName: string;
  amount: number;
  currency?: string;
  /** If true, this is confirming payment FROM someone (receiver view) */
  isReceiver?: boolean;
  /** The receipt URL uploaded by the payer (shown in receiver view) */
  payerReceiptUrl?: string;
  onConfirm: (note?: string, receiptFile?: File) => void;
}

export function MarkAsPaidModal({
  open,
  onOpenChange,
  recipientName,
  amount,
  currency = "RM",
  isReceiver = false,
  payerReceiptUrl,
  onConfirm,
}: MarkAsPaidModalProps) {
  const [note, setNote] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveReceipt = () => {
    setReceiptFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleConfirm = () => {
    onConfirm(note || undefined, receiptFile || undefined);
    // Reset state
    setNote("");
    handleRemoveReceipt();
    onOpenChange(false);
  };

  const handleClose = () => {
    setNote("");
    handleRemoveReceipt();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] sm:w-full rounded-2xl p-0 flex flex-col overflow-hidden max-h-[85vh]">
        {/* Fixed Header */}
        <DialogHeader className="flex-none p-4 pb-3 border-b border-border/50">
          <DialogTitle className="text-lg">
            {isReceiver 
              ? `Confirm Payment from ${recipientName}` 
              : `Confirm Payment to ${recipientName}`}
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-hide p-4 space-y-4">
          {/* Amount */}
          <div className="text-center py-3 bg-secondary/50 rounded-xl">
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="text-2xl font-bold text-foreground">
              {currency} {amount.toLocaleString()}
            </p>
          </div>

          {/* PAYER VIEW - Note & Upload */}
          {!isReceiver && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Add a note (optional)
                </label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g., Paid via DuitNow"
                  className="resize-none h-20 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Upload Payment Receipt
                </label>

                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Receipt preview"
                      className="w-full h-40 object-cover rounded-xl border border-border"
                    />
                    <button
                      onClick={handleRemoveReceipt}
                      className="absolute top-2 right-2 p-1.5 bg-background/90 rounded-full hover:bg-background transition-colors"
                    >
                      <X className="h-4 w-4 text-foreground" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      className="flex-1 h-12 rounded-xl"
                      onClick={() => cameraInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Camera
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 h-12 rounded-xl"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* RECEIVER VIEW - View payer's receipt */}
          {isReceiver && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block text-center">
                Payment Receipt from {recipientName}
              </label>
              {payerReceiptUrl ? (
                <img
                  src={payerReceiptUrl}
                  alt="Payment receipt"
                  className="w-full h-auto max-h-60 object-contain rounded-xl border border-border"
                />
              ) : (
                <div className="py-8 text-center bg-secondary/30 rounded-xl">
                  <p className="text-sm text-muted-foreground">
                    No receipt uploaded yet
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Fixed Footer */}
        <div className="flex-none p-4 pt-3 border-t border-border/50">
          <Button
            onClick={handleConfirm}
            className="w-full h-12 rounded-xl"
          >
            <Check className="h-4 w-4 mr-2" />
            {isReceiver ? "Confirm & Settle" : "Confirm Payment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
