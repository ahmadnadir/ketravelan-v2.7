import { X, Download, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ReceiptViewerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expenseTitle: string;
  receiptUrl?: string;
}

export function ReceiptViewerModal({
  open,
  onOpenChange,
  expenseTitle,
  receiptUrl,
}: ReceiptViewerModalProps) {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleDownload = () => {
    if (receiptUrl) {
      const link = document.createElement("a");
      link.href = receiptUrl;
      link.download = `receipt-${expenseTitle.replace(/\s+/g, "-").toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between pr-6">
            <span className="truncate">Receipt: {expenseTitle}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden relative">
          {receiptUrl ? (
            <div className="h-full overflow-auto">
              <div 
                className="flex items-center justify-center min-h-[300px] p-4"
                style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
              >
                <img
                  src={receiptUrl}
                  alt={`Receipt for ${expenseTitle}`}
                  className="max-w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-muted-foreground">
              <p className="text-sm">No receipt image available</p>
              <p className="text-xs mt-1">The receipt may have been uploaded as a file reference only</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[4rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {receiptUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
