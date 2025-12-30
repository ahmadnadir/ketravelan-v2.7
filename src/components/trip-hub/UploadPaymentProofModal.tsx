import { useState } from "react";
import { Upload, X, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface UploadPaymentProofModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expenseTitle: string;
  amount: number;
  payerName: string;
  onUpload: (file: File, note?: string) => void;
}

export function UploadPaymentProofModal({
  open,
  onOpenChange,
  expenseTitle,
  amount,
  payerName,
  onUpload,
}: UploadPaymentProofModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = () => {
    if (!file) return;
    
    onUpload(file, note.trim() || undefined);
    
    toast({
      title: "Payment proof uploaded",
      description: `Your payment proof for ${expenseTitle} has been submitted to ${payerName}`,
    });
    
    // Reset and close
    setFile(null);
    setPreview(null);
    setNote("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setNote("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md w-[calc(100%-2rem)] sm:w-full rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Upload className="h-5 w-5 text-primary" />
            Upload Payment Proof
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Context Info */}
          <div className="p-4 bg-secondary/50 rounded-xl">
            <p className="text-sm text-muted-foreground">
              Uploading payment proof for{" "}
              <span className="font-medium text-foreground">{expenseTitle}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Amount: <span className="font-medium text-foreground">RM {amount.toFixed(2)}</span>
              {" · "}Paid to: <span className="font-medium text-foreground">{payerName}</span>
            </p>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Receipt / Screenshot</Label>
            {preview ? (
              <div className="relative border border-border rounded-xl p-2 bg-secondary/30">
                <img
                  src={preview}
                  alt="Payment proof preview"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-3 right-3 h-7 w-7 rounded-lg"
                  onClick={handleRemoveFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-primary/50 transition-colors bg-secondary/30">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm font-medium text-foreground">
                  Upload payment proof
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  Screenshot or receipt image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>

          {/* Optional Note */}
          <div className="space-y-2">
            <Label htmlFor="proof-note">Note (Optional)</Label>
            <Textarea
              id="proof-note"
              placeholder="Add any additional details..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              maxLength={200}
              className="rounded-xl min-h-[60px]"
            />
          </div>

          {/* Info */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/50">
            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
            <p className="text-xs text-muted-foreground">
              {payerName} will be notified when you upload your payment proof.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 h-12 rounded-xl"
              onClick={handleSubmit}
              disabled={!file}
            >
              <Upload className="h-4 w-4 mr-2" />
              Submit Proof
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
