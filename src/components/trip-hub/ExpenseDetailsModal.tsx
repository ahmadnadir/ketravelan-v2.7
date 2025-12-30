import { useState } from "react";
import { Receipt, Users, User, Upload, CheckCircle, Download, Eye, ZoomIn, ZoomOut, Clock, ImageIcon, Bell } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ExpenseData } from "@/components/trip-hub/AddExpenseModal";
import { getCategoryById } from "@/lib/expenseCategories";
import { mockMembers, ExpensePayment } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { PaymentReviewModal } from "./PaymentReviewModal";
import { ReceiptsFromOthersModal } from "./ReceiptsFromOthersModal";

type TabType = "overview" | "payments";

interface ExpenseDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: ExpenseData | null;
  currentUser?: string;
  initialTab?: TabType;
  onMarkAsReceived?: (memberId: string) => void;
  onUploadProof?: (file: File, note?: string) => void;
  onUpdateProgress?: (newProgress: number) => void;
  onConfirmPaymentReceived?: (expenseId: string, memberId: string) => void;
}

// Mock payment data for each member
interface MemberPayment {
  memberId: string;
  status: "awaiting" | "submitted" | "received";
  receiptUrl?: string;
  uploadedAt?: string;
  payerNote?: string;
}

export function ExpenseDetailsModal({
  open,
  onOpenChange,
  expense,
  currentUser = "Ahmad Razak",
  initialTab = "overview",
  onMarkAsReceived,
  onUploadProof,
  onUpdateProgress,
  onConfirmPaymentReceived,
}: ExpenseDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [zoom, setZoom] = useState(1);
  const [showFullReceipt, setShowFullReceipt] = useState(false);
  
  // Upload state for Payments tab
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadNote, setUploadNote] = useState("");
  
  // Mock member payment statuses
  const [memberPayments, setMemberPayments] = useState<MemberPayment[]>([]);
  
  // Payment review modal state
  const [reviewingPayment, setReviewingPayment] = useState<{
    member: typeof mockMembers[0];
    payment: MemberPayment;
    amount: number;
  } | null>(null);

  // Receipts from others modal state
  const [showReceiptsModal, setShowReceiptsModal] = useState(false);

  // Reset state when modal opens with new expense or initial tab
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && expense) {
      setActiveTab(initialTab);
      setUploadedFile(null);
      setUploadPreview(null);
      setUploadNote("");
      setZoom(1);
      setShowFullReceipt(false);
      setReviewingPayment(null);
      
      // Initialize member payments from expense data if available
      const splitMembers = expense.splitWith || mockMembers.map(m => m.id);
      const payerMember = mockMembers.find(m => m.name === expense.paidBy);
      
      if (expense.payments && expense.payments.length > 0) {
        // Use existing payment data from expense
        setMemberPayments(expense.payments.map(p => ({
          memberId: p.memberId,
          status: p.status,
          receiptUrl: p.receiptUrl,
          uploadedAt: p.uploadedAt,
          payerNote: p.payerNote,
        })));
      } else {
        // Create default payments
        setMemberPayments(splitMembers.map(memberId => ({
          memberId,
          status: memberId === payerMember?.id ? "received" : "awaiting",
        })));
      }
    }
    onOpenChange(newOpen);
  };

  if (!expense) return null;

  const category = getCategoryById(expense.category || "Other");
  const CategoryIcon = category.icon;

  // Calculate split amounts
  const splitMembers = expense.splitWith || mockMembers.map(m => m.id);
  const memberCount = splitMembers.length;
  const equalSplitAmount = expense.amount / memberCount;
  const settledAmount = (expense.paymentProgress / 100) * expense.amount;

  // Get member details
  const getMemberById = (id: string) => mockMembers.find(m => m.id === id);
  
  // Find current user's member ID
  const currentUserMember = mockMembers.find(m => m.name === currentUser);
  const currentUserId = currentUserMember?.id;
  
  // Determine user's role
  const payerMember = mockMembers.find(m => m.name === expense.paidBy);
  const isPayer = payerMember?.id === currentUserId;
  const isFullySettled = expense.paymentProgress === 100;

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

  // Payment status helpers
  const getPaymentStatus = () => {
    if (expense.paymentProgress === 100) return "Paid";
    if (expense.paymentProgress > 0) return "Partially Paid";
    return "Pending";
  };

  const getStatusBadgeVariant = () => {
    if (expense.paymentProgress === 100) return "default";
    if (expense.paymentProgress > 0) return "secondary";
    return "outline";
  };

  // Handle file upload for "I owe" case
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setUploadPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadPreview(null);
  };

  const handleSubmitProof = () => {
    if (!uploadedFile) return;
    
    onUploadProof?.(uploadedFile, uploadNote);
    
    toast({
      title: "Payment proof uploaded",
      description: `Your receipt has been sent to ${expense.paidBy} for confirmation.`,
    });
    
    // Reset upload state
    setUploadedFile(null);
    setUploadPreview(null);
    setUploadNote("");
  };

  // Handle marking a member's payment as received
  const handleMarkMemberReceived = (memberId: string) => {
    setMemberPayments(prev => 
      prev.map(p => p.memberId === memberId ? { ...p, status: "received" as const } : p)
    );
    
    const member = getMemberById(memberId);
    
    // Calculate new progress
    const receivedCount = memberPayments.filter(p => p.status === "received").length + 1;
    const newProgress = Math.round((receivedCount / memberCount) * 100);
    
    // Call the new confirmation handler if provided
    if (onConfirmPaymentReceived && expense) {
      onConfirmPaymentReceived(expense.id, memberId);
    }
    
    onMarkAsReceived?.(memberId);
    onUpdateProgress?.(newProgress);
    
    toast({
      title: "Payment received",
      description: `${member?.name}'s payment has been marked as received.`,
    });
  };

  // Handle viewing a payment for review
  const handleViewPayment = (member: typeof mockMembers[0], payment: MemberPayment, amount: number) => {
    // Add mock receipt data for submitted payments in demo
    const enhancedPayment = payment.status === "submitted" && !payment.receiptUrl
      ? {
          ...payment,
          receiptUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop",
          uploadedAt: "Jan 16, 2025",
          payerNote: "Paid via TNG on Jan 16"
        }
      : payment;
    setReviewingPayment({ member, payment: enhancedPayment, amount });
  };

  // Handle confirming payment from review modal
  const handleConfirmFromReview = () => {
    if (!reviewingPayment) return;
    handleMarkMemberReceived(reviewingPayment.member.id);
    setReviewingPayment(null);
  };

  // Get current user's payment status
  const currentUserPayment = memberPayments.find(p => p.memberId === currentUserId);
  const currentUserOwesAmount = (() => {
    if (isPayer) return 0;
    if (expense.splitType === "custom" && expense.customSplitAmounts) {
      const customAmount = expense.customSplitAmounts.find(c => c.memberId === currentUserId);
      return customAmount?.amount || 0;
    }
    return equalSplitAmount;
  })();

  // Mock uploaded receipts for Receipts tab
  const uploadedReceipts = expense.hasReceipt ? [
    {
      id: "1",
      url: receiptUrl!,
      uploadedBy: expense.paidBy,
      uploadedAt: expense.date,
    }
  ] : [];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md h-[90vh] sm:h-auto sm:max-h-[90vh] w-[calc(100%-2rem)] sm:w-full rounded-2xl p-0 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <div className="flex-none">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="sr-only">{expense.title} Details</DialogTitle>
            <div className="flex items-start gap-3">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${category.color.split(' ')[0]}`}>
                <CategoryIcon className={`h-6 w-6 ${category.color.split(' ')[1]}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold text-foreground truncate">{expense.title}</p>
              </div>
            </div>
            
            {/* Progress bar with amount */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {expense.paymentProgress}% · RM {settledAmount.toFixed(0)}/{expense.amount} settled
                </span>
              </div>
              <Progress value={expense.paymentProgress} className="h-2" />
            </div>
          </DialogHeader>

          {/* Fixed Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)} className="w-full">
            <TabsList className="w-full grid grid-cols-2 mx-4 mt-4" style={{ width: "calc(100% - 2rem)" }}>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Scrollable Content - ONLY this scrolls */}
        <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-hide">
          <Tabs value={activeTab} className="w-full">
            {/* Overview Tab */}
            <TabsContent value="overview" className="p-4 space-y-4 mt-0">
            {/* Total Amount with Status Badge */}
            <Card className="p-4 border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold text-foreground">RM {expense.amount.toLocaleString()}</p>
                </div>
                <Badge 
                  variant={getStatusBadgeVariant()}
                  className={expense.paymentProgress === 100 ? "bg-stat-green text-stat-green-foreground" : ""}
                >
                  {getPaymentStatus()}
                </Badge>
              </div>
            </Card>

            {/* Paid By Section */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <h3 className="text-xs font-medium text-muted-foreground">Paid by</h3>
              </div>
              <Card className="p-3 border-border/50">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={payerMember?.imageUrl} alt={expense.paidBy} />
                    <AvatarFallback>{expense.paidBy.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{expense.paidBy}</p>
                    <p className="text-xs text-muted-foreground">{expense.date}</p>
                  </div>
                  <p className="font-semibold text-foreground">RM {expense.amount.toLocaleString()}</p>
                </div>
              </Card>
            </div>

            {/* Receipts Section (elevated priority) */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Receipt className="h-3.5 w-3.5 text-muted-foreground" />
                <h3 className="text-xs font-medium text-muted-foreground">Receipts</h3>
              </div>

              {uploadedReceipts.length > 0 ? (
                <div className="space-y-3">
                  {uploadedReceipts.map((receipt) => (
                    <Card key={receipt.id} className="overflow-hidden border-border/50">
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
                          <div className="max-h-[280px] overflow-auto scrollbar-hide">
                            <div
                              className="flex items-center justify-center p-2"
                              style={{ transform: `scale(${zoom})`, transformOrigin: "center top" }}
                            >
                              <img
                                src={receipt.url}
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
                            src={receipt.url}
                            alt="Receipt thumbnail"
                            className="w-full h-40 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="text-[11px] text-foreground/80">{receipt.uploadedBy}</p>
                                <p className="text-[11px] text-muted-foreground">{receipt.uploadedAt}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setShowFullReceipt(true)}
                                className="h-7 text-xs gap-1.5 flex-1"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                View
                              </Button>
                              <Button
                                variant="secondary"
                                size="icon"
                                onClick={handleDownload}
                                className="h-7 w-7"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-4 text-center border-border/50">
                  <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No receipts uploaded yet</p>
                </Card>
              )}
            </div>

            {/* Split Breakdown */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <h3 className="text-xs font-medium text-muted-foreground">Split breakdown</h3>
                <Badge variant="secondary" className="text-[10px] px-1.5">
                  {expense.splitType === "equal" ? "Equal" : "Custom"}
                </Badge>
              </div>

              <div className="space-y-2">
                {splitMembers.map((memberId) => {
                  const member = getMemberById(memberId);
                  if (!member) return null;

                  let amount = equalSplitAmount;
                  if (expense.splitType === "custom" && expense.customSplitAmounts) {
                    const customAmount = expense.customSplitAmounts.find(c => c.memberId === memberId);
                    amount = customAmount?.amount || 0;
                  }

                  const isThisMemberPayer = member.name === expense.paidBy;
                  const memberPayment = memberPayments.find(p => p.memberId === memberId);
                  const isPaid = isThisMemberPayer || memberPayment?.status === "received";

                  return (
                    <Card key={memberId} className="p-3 border-border/50">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 shrink-0">
                          <AvatarImage src={member.imageUrl} alt={member.name} />
                          <AvatarFallback className="text-xs">
                            {member.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <p className="flex-1 min-w-0 text-sm font-medium text-foreground truncate">{member.name}</p>
                        <p className="text-sm font-semibold text-foreground whitespace-nowrap">
                          RM {amount.toFixed(2)}
                        </p>
                        <Badge 
                          variant={isPaid ? "default" : memberPayment?.status === "submitted" ? "secondary" : "outline"} 
                          className={`shrink-0 text-[10px] px-2 py-0.5 ${isPaid ? "bg-stat-green text-stat-green-foreground" : memberPayment?.status === "submitted" ? "bg-blue-500/10 text-blue-600 border-blue-500/30" : ""}`}
                        >
                          {isPaid ? "Received" : memberPayment?.status === "submitted" ? "Submitted" : "Awaiting"}
                        </Badge>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="p-4 space-y-4 mt-0">
            {isFullySettled ? (
              /* Fully Settled State */
              <Card className="p-6 text-center border-border/50">
                <CheckCircle className="h-12 w-12 mx-auto text-stat-green mb-3" />
                <p className="font-medium text-foreground">All payments have been settled</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Everyone has paid their share for this expense.
                </p>
              </Card>
            ) : isPayer ? (
              /* Case B: Others owe me - Show pending payments */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-foreground">Pending Payments from Others</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const pendingCount = memberPayments.filter(p => p.status === "awaiting").length;
                      toast({
                        title: "Reminders sent",
                        description: `${pendingCount} member(s) have been notified about their pending payment.`,
                      });
                    }}
                    className="h-7 text-xs text-muted-foreground"
                  >
                    Remind All
                  </Button>
                </div>

                <div className="space-y-2">
                  {splitMembers
                    .filter(memberId => {
                      const member = getMemberById(memberId);
                      return member && member.name !== expense.paidBy;
                    })
                    .map((memberId) => {
                      const member = getMemberById(memberId);
                      if (!member) return null;

                      let amount = equalSplitAmount;
                      if (expense.splitType === "custom" && expense.customSplitAmounts) {
                        const customAmount = expense.customSplitAmounts.find(c => c.memberId === memberId);
                        amount = customAmount?.amount || 0;
                      }

                      const memberPayment = memberPayments.find(p => p.memberId === memberId);
                      const isReceived = memberPayment?.status === "received";
                      const isSubmitted = memberPayment?.status === "submitted";

                      // Get status badge with updated styling
                      const getStatusBadge = () => {
                        if (isReceived) {
                          return (
                            <Badge className="text-xs px-2 py-0.5 bg-stat-green/10 text-stat-green border-stat-green/30">
                              Paid
                            </Badge>
                          );
                        }
                        if (isSubmitted) {
                          return (
                            <Badge className="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-600 border-amber-500/30">
                              Pending Verification
                            </Badge>
                          );
                        }
                        return (
                          <Badge variant="outline" className="text-xs px-2 py-0.5 text-yellow-600 border-yellow-500/30 bg-yellow-500/10">
                            Awaiting Payment
                          </Badge>
                        );
                      };

                      return (
                        <Card key={memberId} className="p-4 border-border/50">
                          {/* Vertical Layout */}
                          <div className="space-y-3">
                            {/* Top Row: Avatar + Name + Amount */}
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 shrink-0">
                                <AvatarImage src={member.imageUrl} alt={member.name} />
                                <AvatarFallback className="text-xs">
                                  {member.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground text-sm truncate">{member.name}</p>
                              </div>
                              <p className="text-base font-bold text-foreground whitespace-nowrap">
                                RM {amount.toFixed(2)}
                              </p>
                            </div>
                            
                            {/* Status Badge Row */}
                            <div className="ml-13">
                              {getStatusBadge()}
                            </div>

                            {/* Button Row - Full Width */}
                            {!isReceived && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => setShowReceiptsModal(true)}
                                className="w-full text-xs"
                              >
                                <Eye className="h-3.5 w-3.5 mr-1.5" />
                                View Payment Receipts
                              </Button>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                </div>
              </div>
            ) : (
              /* Case A: I owe others - Show my payment status and upload */
              <div className="space-y-4">
                {/* Your Payment Status */}
                <Card className="p-4 border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-foreground">Your Payment Status</h3>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Amount Owed</p>
                      <p className="text-xl font-bold text-foreground">RM {currentUserOwesAmount.toFixed(2)}</p>
                    </div>
                    <Badge 
                      variant={currentUserPayment?.status === "received" ? "default" : currentUserPayment?.status === "submitted" ? "secondary" : "outline"}
                      className={currentUserPayment?.status === "received" ? "bg-stat-green text-stat-green-foreground" : currentUserPayment?.status === "submitted" ? "bg-blue-500/10 text-blue-600" : ""}
                    >
                      {currentUserPayment?.status === "received" ? "Received" : 
                       currentUserPayment?.status === "submitted" ? "Pending Verification" : "Awaiting Payment"}
                    </Badge>
                  </div>
                </Card>

                {/* Upload Payment Proof Section */}
                {currentUserPayment?.status !== "received" && (
                  <div className="space-y-3">
                    <Separator />
                    
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-semibold text-foreground">Upload Payment Receipt</h3>
                    </div>

                    {!uploadedFile ? (
                      <label className="block">
                        <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Tap to upload receipt or screenshot
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            JPG, PNG up to 10MB
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    ) : (
                      <div className="space-y-3">
                        {/* Preview */}
                        <div className="relative rounded-xl overflow-hidden bg-secondary/30">
                          <img 
                            src={uploadPreview || ""} 
                            alt="Receipt preview" 
                            className="w-full h-40 object-cover"
                          />
                          <Button
                            variant="secondary"
                            size="sm"
                            className="absolute top-2 right-2 h-7 text-xs"
                            onClick={handleRemoveFile}
                          >
                            Remove
                          </Button>
                        </div>

                        {/* Optional Note */}
                        <div>
                          <p className="text-xs text-muted-foreground mb-1.5">Add a note (optional)</p>
                          <Textarea
                            placeholder="e.g., Paid via TNG on Jan 16"
                            value={uploadNote}
                            onChange={(e) => setUploadNote(e.target.value)}
                            className="min-h-[60px] text-sm resize-none"
                          />
                        </div>

                        {/* Submit Button */}
                        <Button 
                          className="w-full"
                          onClick={handleSubmitProof}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Submit Proof
                        </Button>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground text-center">
                      {expense.paidBy} will be notified to confirm your payment.
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

        {/* Payment Review Modal */}
        <PaymentReviewModal
          open={!!reviewingPayment}
          onOpenChange={(open) => !open && setReviewingPayment(null)}
          member={reviewingPayment?.member || null}
          amount={reviewingPayment?.amount || 0}
          payment={reviewingPayment?.payment || null}
          onConfirmReceived={handleConfirmFromReview}
        />

        {/* Receipts From Others Modal */}
        <ReceiptsFromOthersModal
          open={showReceiptsModal}
          onOpenChange={setShowReceiptsModal}
          pendingMembers={splitMembers
            .filter(memberId => {
              const member = getMemberById(memberId);
              return member && member.name !== expense.paidBy;
            })
            .map(memberId => {
              const member = getMemberById(memberId)!;
              let amount = equalSplitAmount;
              if (expense.splitType === "custom" && expense.customSplitAmounts) {
                const customAmount = expense.customSplitAmounts.find(c => c.memberId === memberId);
                amount = customAmount?.amount || 0;
              }
              const payment = memberPayments.find(p => p.memberId === memberId);
              return { member, amount, payment };
            })}
          onMarkAsReceived={handleMarkMemberReceived}
          onSendReminder={(memberId, memberName) => {
            toast({
              title: "Reminder sent",
              description: `${memberName} has been notified about their pending payment.`,
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
