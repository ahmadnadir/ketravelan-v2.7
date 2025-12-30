import { useState } from "react";
import { X, Upload, Receipt, Users, UserCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockMembers } from "@/data/mockData";

const expenseCategories = [
  { id: "transport", label: "Transport", icon: "🚗" },
  { id: "accommodation", label: "Accommodation", icon: "🏨" },
  { id: "food", label: "Food & Drinks", icon: "🍽️" },
  { id: "activities", label: "Activities", icon: "🎫" },
  { id: "shopping", label: "Shopping", icon: "🛍️" },
  { id: "other", label: "Other", icon: "📦" },
];

export interface NewExpense {
  title: string;
  amount: number;
  category: string;
  paidBy: string;
  splitType: "equal" | "custom";
  splitWith: string[];
  notes?: string;
  receiptFile?: File;
  date: string;
}

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddExpense: (expense: NewExpense) => void;
  currentUser?: string;
}

export function AddExpenseModal({
  open,
  onOpenChange,
  onAddExpense,
  currentUser = "Ahmad Razak",
}: AddExpenseModalProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [paidBy, setPaidBy] = useState(currentUser);
  const [splitType, setSplitType] = useState<"equal" | "custom">("equal");
  const [splitWith, setSplitWith] = useState<string[]>(
    mockMembers.map((m) => m.id)
  );
  const [notes, setNotes] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
  };

  const toggleMemberSplit = (memberId: string) => {
    setSplitWith((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    setSplitWith(mockMembers.map((m) => m.id));
  };

  const handleDeselectAll = () => {
    setSplitWith([]);
  };

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setCategory("");
    setPaidBy(currentUser);
    setSplitType("equal");
    setSplitWith(mockMembers.map((m) => m.id));
    setNotes("");
    setReceiptFile(null);
    setReceiptPreview(null);
  };

  const handleSubmit = () => {
    if (!title.trim() || !amount || !category) return;

    const expense: NewExpense = {
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      paidBy,
      splitType,
      splitWith,
      notes: notes.trim() || undefined,
      receiptFile: receiptFile || undefined,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    onAddExpense(expense);
    resetForm();
    onOpenChange(false);
  };

  const isValid = title.trim() && parseFloat(amount) > 0 && category && splitWith.length > 0;

  const perPersonAmount =
    splitWith.length > 0 && parseFloat(amount) > 0
      ? (parseFloat(amount) / splitWith.length).toFixed(2)
      : "0.00";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Add Shared Expense
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Expense Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Group dinner, Ferry tickets"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (RM) *</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Paid By */}
          <div className="space-y-2">
            <Label>Paid By</Label>
            <Select value={paidBy} onValueChange={setPaidBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockMembers.map((member) => (
                  <SelectItem key={member.id} value={member.name}>
                    <span className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={member.imageUrl} />
                        <AvatarFallback className="text-[10px]">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{member.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Split Type */}
          <div className="space-y-2">
            <Label>Split Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={splitType === "equal" ? "default" : "outline"}
                size="sm"
                onClick={() => setSplitType("equal")}
                className="flex-1"
              >
                <Users className="h-4 w-4 mr-1.5" />
                Split Equally
              </Button>
              <Button
                type="button"
                variant={splitType === "custom" ? "default" : "outline"}
                size="sm"
                onClick={() => setSplitType("custom")}
                className="flex-1"
                disabled
              >
                <UserCheck className="h-4 w-4 mr-1.5" />
                Custom Split
              </Button>
            </div>
          </div>

          {/* Split With Members */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Split With ({splitWith.length} selected)</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  className="h-7 text-xs"
                >
                  All
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleDeselectAll}
                  className="h-7 text-xs"
                >
                  None
                </Button>
              </div>
            </div>
            <div className="border border-border rounded-lg p-2 space-y-1 max-h-40 overflow-y-auto">
              {mockMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary/50 cursor-pointer"
                  onClick={() => toggleMemberSplit(member.id)}
                >
                  <Checkbox
                    checked={splitWith.includes(member.id)}
                    onCheckedChange={() => toggleMemberSplit(member.id)}
                  />
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={member.imageUrl} />
                    <AvatarFallback className="text-[10px]">
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm flex-1">{member.name}</span>
                  {splitWith.includes(member.id) && parseFloat(amount) > 0 && (
                    <span className="text-xs text-muted-foreground">
                      RM {perPersonAmount}
                    </span>
                  )}
                </div>
              ))}
            </div>
            {splitWith.length > 0 && parseFloat(amount) > 0 && (
              <p className="text-xs text-muted-foreground">
                Each person pays: <span className="font-medium text-foreground">RM {perPersonAmount}</span>
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              maxLength={500}
            />
          </div>

          {/* Receipt Upload */}
          <div className="space-y-2">
            <Label>Receipt (Optional)</Label>
            {receiptPreview ? (
              <div className="relative border border-border rounded-lg p-2">
                <img
                  src={receiptPreview}
                  alt="Receipt preview"
                  className="w-full h-32 object-cover rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-3 right-3 h-7 w-7"
                  onClick={handleRemoveReceipt}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors">
                <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  Tap to upload receipt
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleReceiptUpload}
                />
              </label>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1"
              onClick={handleSubmit}
              disabled={!isValid}
            >
              Add Expense
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
