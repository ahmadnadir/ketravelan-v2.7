import { useState, useEffect } from "react";
import { X, Upload, Receipt, Users, UserCheck, Pencil, Info } from "lucide-react";
import { expenseCategories } from "@/lib/expenseCategories";
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
import { mockMembers, ExpensePayment, ExpenseData } from "@/data/mockData";
import { 
  CurrencyCode, 
  travelCurrencies, 
  convertToHomeCurrency, 
  formatCurrencySpaced,
  getCurrencySymbol
} from "@/lib/currencyUtils";
import { useAuth } from "@/contexts/AuthContext";

// Using expenseCategories from lib for consistency

export interface CustomSplitAmount {
  memberId: string;
  amount: number;
}

export interface NewExpense {
  title: string;
  amount: number;
  category: string;
  paidBy: string;
  splitType: "equal" | "custom";
  splitWith: string[];
  customSplitAmounts?: CustomSplitAmount[];
  notes?: string;
  receiptFile?: File;
  date: string;
  // Multi-currency fields
  originalCurrency: CurrencyCode;
  fxRateToHome?: number;
  convertedAmountHome?: number;
  homeCurrency?: CurrencyCode;
}

// ExpenseData is now imported from mockData.ts
export type { ExpenseData } from "@/data/mockData";

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddExpense: (expense: NewExpense) => void;
  onEditExpense?: (id: string, expense: NewExpense) => void;
  editingExpense?: ExpenseData | null;
  currentUser?: string;
  allowedCurrencies?: CurrencyCode[];
}

export function AddExpenseModal({
  open,
  onOpenChange,
  onAddExpense,
  onEditExpense,
  editingExpense,
  currentUser = "Ahmad Razak",
  allowedCurrencies,
}: AddExpenseModalProps) {
  const { user } = useAuth();
  const homeCurrency: CurrencyCode = user?.homeCurrency || "MYR";
  
  // Build available currencies: home currency + allowed travel currencies
  const homeCurrencyInfo = { code: homeCurrency, symbol: homeCurrency === "MYR" ? "RM" : homeCurrency, name: "Home Currency" };
  const filteredTravelCurrencies = allowedCurrencies?.length 
    ? travelCurrencies.filter(c => allowedCurrencies.includes(c.code))
    : travelCurrencies;
  const availableCurrencies = [homeCurrencyInfo, ...filteredTravelCurrencies.filter(c => c.code !== homeCurrency)];
  
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>(homeCurrency);
  const [category, setCategory] = useState("");
  const [paidBy, setPaidBy] = useState(currentUser);
  const [splitType, setSplitType] = useState<"equal" | "custom">("equal");
  const [splitWith, setSplitWith] = useState<string[]>(
    mockMembers.map((m) => m.id)
  );
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const isEditMode = !!editingExpense;
  
  // Compute conversion
  const numericAmount = parseFloat(amount) || 0;
  const conversion = convertToHomeCurrency(numericAmount, currency, homeCurrency);
  const showConversion = currency !== homeCurrency && numericAmount > 0;

  // Load editing expense data
  useEffect(() => {
    if (editingExpense && open) {
      setTitle(editingExpense.title);
      setAmount(editingExpense.amount.toString());
      setCurrency(editingExpense.originalCurrency || "USD");
      setCategory(editingExpense.category || "other");
      setPaidBy(editingExpense.paidBy);
      setSplitType(editingExpense.splitType || "equal");
      setSplitWith(editingExpense.splitWith || mockMembers.map((m) => m.id));
      setNotes(editingExpense.notes || "");
      
      // Load custom amounts if available
      if (editingExpense.customSplitAmounts) {
        const amounts: Record<string, string> = {};
        editingExpense.customSplitAmounts.forEach((item) => {
          amounts[item.memberId] = item.amount.toString();
        });
        setCustomAmounts(amounts);
      }
    } else if (!open) {
      resetForm();
    }
  }, [editingExpense, open]);

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
    setSplitWith((prev) => {
      const newSplitWith = prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId];
      
      // Clear custom amount when member is deselected
      if (!newSplitWith.includes(memberId)) {
        setCustomAmounts((prev) => {
          const updated = { ...prev };
          delete updated[memberId];
          return updated;
        });
      }
      
      return newSplitWith;
    });
  };

  const handleSelectAll = () => {
    setSplitWith(mockMembers.map((m) => m.id));
  };

  const handleDeselectAll = () => {
    setSplitWith([]);
    setCustomAmounts({});
  };

  const handleCustomAmountChange = (memberId: string, value: string) => {
    setCustomAmounts((prev) => ({
      ...prev,
      [memberId]: value,
    }));
  };

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setCurrency(homeCurrency);
    setCategory("");
    setPaidBy(currentUser);
    setSplitType("equal");
    setSplitWith(mockMembers.map((m) => m.id));
    setCustomAmounts({});
    setNotes("");
    setReceiptFile(null);
    setReceiptPreview(null);
  };

  const handleSubmit = () => {
    if (!title.trim() || !amount || !category) return;

    const customSplitAmounts: CustomSplitAmount[] = splitType === "custom" 
      ? splitWith.map((memberId) => ({
          memberId,
          amount: parseFloat(customAmounts[memberId] || "0"),
        }))
      : [];

    const expense: NewExpense = {
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      paidBy,
      splitType,
      splitWith,
      customSplitAmounts: splitType === "custom" ? customSplitAmounts : undefined,
      notes: notes.trim() || undefined,
      receiptFile: receiptFile || undefined,
      date: editingExpense?.date || new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      // Multi-currency fields
      originalCurrency: currency,
      fxRateToHome: conversion.available ? conversion.rate : undefined,
      convertedAmountHome: conversion.available ? conversion.amount : undefined,
      homeCurrency: homeCurrency,
    };

    if (isEditMode && onEditExpense && editingExpense) {
      onEditExpense(editingExpense.id, expense);
    } else {
      onAddExpense(expense);
    }
    
    resetForm();
    onOpenChange(false);
  };

  // Calculate totals for validation
  const totalCustomAmount = splitWith.reduce((sum, memberId) => {
    return sum + (parseFloat(customAmounts[memberId] || "0") || 0);
  }, 0);
  
  const totalAmount = parseFloat(amount) || 0;
  const customAmountDifference = totalAmount - totalCustomAmount;

  const isValid = 
    title.trim() && 
    parseFloat(amount) > 0 && 
    category && 
    splitWith.length > 0 &&
    (splitType === "equal" || Math.abs(customAmountDifference) < 0.01);

  const perPersonAmount =
    splitWith.length > 0 && parseFloat(amount) > 0 && splitType === "equal"
      ? (parseFloat(amount) / splitWith.length).toFixed(2)
      : "0.00";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md h-[90vh] sm:h-auto sm:max-h-[90vh] w-[calc(100%-2rem)] sm:w-full rounded-2xl p-0 flex flex-col overflow-hidden [&>button]:hidden">
        {/* Fixed Header */}
        <DialogHeader className="flex-none p-4 pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              {isEditMode ? (
                <>
                  <Pencil className="h-5 w-5 text-primary" />
                  Edit Expense
                </>
              ) : (
                <>
                  <Receipt className="h-5 w-5 text-primary" />
                  Add Shared Expense
                </>
              )}
            </DialogTitle>
            <button 
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-hide p-4 space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Expense Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Group dinner, Ferry tickets"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="h-12 rounded-xl"
            />
          </div>

          {/* Amount with Currency */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <div className="flex gap-2">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
                className="h-12 rounded-xl flex-1"
              />
              <Select value={currency} onValueChange={(val) => setCurrency(val as CurrencyCode)}>
                <SelectTrigger className="w-auto min-w-[120px] h-12 rounded-xl">
                  <span className="flex items-center gap-1.5">
                    <span>{getCurrencySymbol(currency)}</span>
                    <span>{currency}</span>
                    {currency === homeCurrency && (
                      <span className="px-1.5 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded-full">
                        Home
                      </span>
                    )}
                  </span>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {availableCurrencies.map((c) => (
                    <SelectItem key={c.code} value={c.code} className="rounded-lg">
                      <span className="flex items-center gap-1.5">
                        <span>{c.symbol}</span>
                        <span>{c.code}</span>
                        {c.code === homeCurrency && (
                          <span className="px-1.5 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded-full">
                            Home
                          </span>
                        )}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Conversion preview */}
            {showConversion && conversion.available && (
              <p className="text-xs text-muted-foreground">
                ≈ {formatCurrencySpaced(conversion.amount, homeCurrency)}
              </p>
            )}
            {showConversion && !conversion.available && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Info className="h-3 w-3" />
                Conversion unavailable
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {expenseCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id} className="rounded-lg">
                    <span className="flex items-center gap-2">
                      <span className="text-base">{cat.emoji}</span>
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
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {mockMembers.map((member) => (
                  <SelectItem key={member.id} value={member.name} className="rounded-lg">
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
                onClick={() => setSplitType("equal")}
                className="flex-1 h-11 rounded-xl"
              >
                <Users className="h-4 w-4 mr-1.5" />
                Split Equally
              </Button>
              <Button
                type="button"
                variant={splitType === "custom" ? "default" : "outline"}
                onClick={() => setSplitType("custom")}
                className="flex-1 h-11 rounded-xl"
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
                  className="h-7 text-xs rounded-lg"
                >
                  All
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleDeselectAll}
                  className="h-7 text-xs rounded-lg"
                >
                  None
                </Button>
              </div>
            </div>
            <div className="border border-border rounded-xl p-2 space-y-1 max-h-48 overflow-y-auto scrollbar-hide bg-secondary/30">
              {mockMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/50"
                >
                  <div 
                    className="flex items-center gap-2 cursor-pointer flex-1"
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
                  </div>
                  
                  {splitWith.includes(member.id) && (
                    splitType === "custom" ? (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">{getCurrencySymbol(currency)}</span>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={customAmounts[member.id] || ""}
                          onChange={(e) => handleCustomAmountChange(member.id, e.target.value)}
                          className="w-20 h-8 text-xs rounded-lg"
                          min="0"
                          step="0.01"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    ) : (
                      parseFloat(amount) > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {getCurrencySymbol(currency)} {perPersonAmount}
                        </span>
                      )
                    )
                  )}
                </div>
              ))}
            </div>
            
            {/* Summary */}
            {splitWith.length > 0 && parseFloat(amount) > 0 && (
              <div className="space-y-1">
                {splitType === "equal" ? (
                  <p className="text-xs text-muted-foreground">
                    Each person pays: <span className="font-medium text-foreground">{getCurrencySymbol(currency)} {perPersonAmount}</span>
                  </p>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Total assigned: <span className="font-medium text-foreground">{getCurrencySymbol(currency)} {totalCustomAmount.toFixed(2)}</span>
                      {" / "}
                      <span className="font-medium">{getCurrencySymbol(currency)} {totalAmount.toFixed(2)}</span>
                    </p>
                    {Math.abs(customAmountDifference) >= 0.01 && (
                      <p className={`text-xs ${customAmountDifference > 0 ? "text-destructive" : "text-amber-500"}`}>
                        {customAmountDifference > 0 
                          ? `${getCurrencySymbol(currency)} ${customAmountDifference.toFixed(2)} remaining to assign` 
                          : `${getCurrencySymbol(currency)} ${Math.abs(customAmountDifference).toFixed(2)} over-assigned`}
                      </p>
                    )}
                  </div>
                )}
              </div>
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
              className="rounded-xl min-h-[80px]"
            />
          </div>

          {/* Receipt Upload */}
          <div className="space-y-2">
            <Label>Receipt (Optional)</Label>
            {receiptPreview ? (
              <div className="relative border border-border rounded-xl p-2 bg-secondary/30">
                <img
                  src={receiptPreview}
                  alt="Receipt preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-3 right-3 h-7 w-7 rounded-lg"
                  onClick={handleRemoveReceipt}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-4 cursor-pointer hover:border-primary/50 transition-colors bg-secondary/30">
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

          {/* Actions - Fixed Footer */}
        </div>
        
        <div className="flex-none p-4 pt-3 border-t border-border/50">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 rounded-xl"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1 h-12 rounded-xl"
              onClick={handleSubmit}
              disabled={!isValid}
            >
              {isEditMode ? "Save Changes" : "Add Expense"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
