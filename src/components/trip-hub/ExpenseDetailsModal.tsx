import { useState, useRef, useEffect } from "react";
import { Receipt, Users, User, Upload, CheckCircle, Download, Eye, ZoomIn, ZoomOut, Clock, ImageIcon, Bell, Camera, X, Check, Pencil } from "lucide-react";
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
  onSubmitPayment?: (expenseId: string, memberId: string, receiptUrl?: string, payerNote?: string) => void;
}

// Mock payment data for each member
interface MemberPayment {
  memberId: string;
  status: "pending" | "submitted" | "settled";
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
  onSubmitPayment,
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
  
  // State for edit mode in AWAITING_CONFIRMATION state
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editNote, setEditNote] = useState("");
  const [isEditingReceipt, setIsEditingReceipt] = useState(false);
  
  // Payment review modal state
  const [reviewingPayment, setReviewingPayment] = useState<{
    member: typeof mockMembers[0];
    payment: MemberPayment;
    amount: number;
  } | null>(null);

  // Receipts from others modal state
  const [showReceiptsModal, setShowReceiptsModal] = useState(false);

  // Refs for file inputs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Sync memberPayments with expense.payments when expense prop updates
  useEffect(() => {
    if (open && expense) {
      const splitMembers = expense.splitWith || mockMembers.map(m => m.id);
      const payerMember = mockMembers.find(m => m.name === expense.paidBy);
      
      if (expense.payments && expense.payments.length > 0) {
        setMemberPayments(expense.payments.map(p => ({
          memberId: p.memberId,
          status: p.status,
          receiptUrl: p.receiptUrl,
          uploadedAt: p.uploadedAt,
          payerNote: p.payerNote,
        })));
      } else {
        setMemberPayments(splitMembers.map(memberId => ({
          memberId,
          status: memberId === payerMember?.id ? "settled" : "pending",
        })));
      }
    }
  }, [expense?.id, expense?.payments, open]);

  // Reset UI state when modal opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && expense) {
      setActiveTab(initialTab);
      setUploadedFile(null);
      setUploadPreview(null);
      setUploadNote("");
      setZoom(1);
      setShowFullReceipt(false);
      setReviewingPayment(null);
      setIsEditingNote(false);
      setIsEditingReceipt(false);
    }
    onOpenChange(newOpen);
  };

  if (!expense) return null;

  const category = getCategoryById(expense.category || "Other");

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
    // Capture values before reset
    const savedPreview = uploadPreview;
    const savedNote = uploadNote;
    const submittedAt = new Date().toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit'
    });
    
    // Update local state for immediate UI feedback
    setMemberPayments(prev => 
      prev.map(p => p.memberId === currentUserId 
        ? { 
            ...p, 
            status: "submitted" as const,
            receiptUrl: savedPreview || undefined,
            payerNote: savedNote || undefined,
            uploadedAt: submittedAt
          } 
        : p
      )
    );
    
    // Call parent callback to persist the payment status
    onSubmitPayment?.(
      expense.id, 
      currentUserId || "", 
      savedPreview || undefined, 
      savedNote || undefined
    );
    
    onUploadProof?.(uploadedFile || undefined, uploadNote);
    
    toast({
      title: "Payment proof uploaded",
      description: `${expense.paidBy} will review and acknowledge your payment.`,
    });
    
    // Reset upload form state
    setUploadedFile(null);
    setUploadPreview(null);
    setUploadNote("");
  };


  // Handle marking a member's payment as settled
  const handleMarkMemberSettled = (memberId: string) => {
    setMemberPayments(prev => 
      prev.map(p => p.memberId === memberId ? { ...p, status: "settled" as const } : p)
    );
    
    const member = getMemberById(memberId);
    
    // Calculate new progress
    const settledCount = memberPayments.filter(p => p.status === "settled").length + 1;
    const newProgress = Math.round((settledCount / memberCount) * 100);
    
    // Call the new confirmation handler if provided
    if (onConfirmPaymentReceived && expense) {
      onConfirmPaymentReceived(expense.id, memberId);
    }
    
    onMarkAsReceived?.(memberId);
    onUpdateProgress?.(newProgress);
    
    toast({
      title: "Payment settled",
      description: `${member?.name}'s payment has been marked as settled.`,
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
    handleMarkMemberSettled(reviewingPayment.member.id);
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
                <span className="text-xl">{category.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold text-foreground truncate">{expense.title}</p>
                {/* Progress bar with amount - under title */}
                <div className="mt-1.5 space-y-1.5">
                  <span className={`text-sm font-medium ${expense.paymentProgress === 100 ? "text-stat-green" : expense.paymentProgress === 0 ? "text-destructive" : "text-yellow-600"}`}>
                    {expense.paymentProgress}% settled · RM {settledAmount.toFixed(0)}/{expense.amount}
                  </span>
                  <Progress value={expense.paymentProgress} className="h-2" animate />
                </div>
              </div>
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
            {/* Combined: Amount + Paid by in one card */}
            <Card className="p-4 border-border/50">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarImage src={payerMember?.imageUrl} alt={expense.paidBy} />
                  <AvatarFallback>{expense.paidBy.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Paid by</p>
                  <p className="font-medium text-foreground truncate">{expense.paidBy}</p>
                  <p className="text-xs text-muted-foreground">{expense.date}</p>
                </div>
                
                <div className="text-right shrink-0">
                  <p className="text-xl font-bold text-foreground">RM {expense.amount.toLocaleString()}</p>
                  <Badge 
                    variant={getStatusBadgeVariant()}
                    className={`text-[10px] ${expense.paymentProgress === 100 ? "bg-stat-green text-stat-green-foreground" : ""}`}
                  >
                    {getPaymentStatus()}
                  </Badge>
                </div>
              </div>
            </Card>

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
                            className="w-full h-64 object-contain"
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
                  const isPaid = isThisMemberPayer || memberPayment?.status === "settled";

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
                          className={`shrink-0 text-[10px] px-2 py-0.5 ${isPaid ? "bg-stat-green text-stat-green-foreground" : memberPayment?.status === "submitted" ? "bg-blue-500/10 text-blue-600 border-blue-500/30" : "text-yellow-600 border-yellow-500/30 bg-yellow-500/10"}`}
                        >
                          {isPaid ? "Settled" : memberPayment?.status === "submitted" ? "Submitted" : "Pending"}
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
              /* Fully Settled State - Show payment history with receipts */
              <div className="space-y-4">
                <Card className="p-4 text-center border-border/50 bg-stat-green/5">
                  <CheckCircle className="h-10 w-10 mx-auto text-stat-green mb-2" />
                  <p className="font-medium text-foreground">All payments settled</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Everyone has paid their share for this expense.
                  </p>
                </Card>

                {/* Payment History List */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Payment History</h3>
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

                      return (
                        <Card key={memberId} className="p-4 border-border/50">
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
                              <p className="text-base font-bold text-foreground">
                                RM {amount.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          
                          {/* Status + View Receipt Row */}
                          <div className="flex items-center justify-between mt-3 ml-13">
                            <Badge className="text-xs px-2 py-0.5 bg-stat-green/10 text-stat-green border-stat-green/30">
                              Settled
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setReviewingPayment({
                                  member,
                                  payment: memberPayment || { memberId, status: "settled" as const },
                                  amount
                                });
                              }}
                              className="h-7 text-xs"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              View Receipt
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                </div>
              </div>
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
                      const pendingCount = memberPayments.filter(p => p.status === "pending").length;
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
                      const isSettled = memberPayment?.status === "settled";
                      const isSubmitted = memberPayment?.status === "submitted";

                      // Get status badge with updated styling
                      const getStatusBadge = () => {
                        if (isSettled) {
                          return (
                            <Badge className="text-xs px-2 py-0.5 bg-stat-green/10 text-stat-green border-stat-green/30">
                              Settled
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
                            Pending
                          </Badge>
                        );
                      };

                      return (
                        <Card key={memberId} className="p-4 border-border/50">
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
                              <p className="text-base font-bold text-foreground">
                                RM {amount.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          
                          {/* Status + View Payment Row */}
                          <div className="flex items-center justify-between mt-3 ml-13">
                            {getStatusBadge()}
                            <Button
                              variant={isSettled ? "ghost" : "outline"}
                              size="sm"
                              onClick={() => setReviewingPayment({
                                member,
                                payment: memberPayment || { memberId, status: "pending" as const },
                                amount
                              })}
                              className="h-7 text-xs"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              {isSettled ? "View Receipt" : "View Payment"}
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                </div>
              </div>
            ) : (
              /* Case A: I owe others - Show my payment status based on state */
              <div className="space-y-4">
                {/* Amount Display - Clean centered design */}
                <div className="bg-muted/50 rounded-2xl p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Amount</p>
                  <p className="text-3xl font-bold text-foreground">RM {currentUserOwesAmount.toFixed(2)}</p>
                </div>

                {/* PENDING State - Show upload form (also handles undefined status for users who owe) */}
                {(!currentUserPayment || currentUserPayment.status === "pending") && !isPayer && (
                  <div className="space-y-4">
                    {/* Optional Note */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Add a note (optional)
                      </label>
                      <Textarea
                        value={uploadNote}
                        onChange={(e) => setUploadNote(e.target.value)}
                        placeholder="e.g., Paid via DuitNow"
                        className="resize-none h-20 rounded-xl text-sm"
                      />
                    </div>

                    {/* Receipt Upload */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Upload Payment Receipt
                      </label>

                      {uploadPreview ? (
                        <div className="relative">
                          <img
                            src={uploadPreview}
                            alt="Receipt preview"
                            className="w-full h-64 object-contain rounded-xl border border-border"
                          />
                          <button
                            onClick={handleRemoveFile}
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

                    {/* Confirm Payment Button */}
                    <Button 
                      className="w-full h-12 rounded-xl"
                      onClick={handleSubmitProof}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Confirm Payment
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      {expense.paidBy} will be notified to confirm your payment.
                    </p>
                  </div>
                )}

                {/* AWAITING_CONFIRMATION State - Show review mode with edit options */}
                {currentUserPayment?.status === "submitted" && (
                  <div className="space-y-4">
                    {/* Status Badge */}
                    <div className="flex justify-center">
                      <Badge className="px-4 py-2 text-sm bg-muted text-muted-foreground border-border">
                        <Clock className="h-4 w-4 mr-2" />
                        Awaiting Confirmation
                      </Badge>
                    </div>

                    {/* Payment Summary Card */}
                    <Card className="p-4 border-border/50 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Amount Paid</span>
                        <span className="text-lg font-bold text-foreground">RM {currentUserOwesAmount.toFixed(2)}</span>
                      </div>
                      
                      {/* Payment Note - Editable */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Payment Note</span>
                          {!isEditingNote && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 px-2 text-xs"
                              onClick={() => {
                                setEditNote(currentUserPayment.payerNote || "");
                                setIsEditingNote(true);
                              }}
                            >
                              <Pencil className="h-3 w-3 mr-1" /> Edit
                            </Button>
                          )}
                        </div>
                        {isEditingNote ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editNote}
                              onChange={(e) => setEditNote(e.target.value)}
                              placeholder="e.g., Paid via DuitNow"
                              className="resize-none h-16 rounded-xl text-sm"
                            />
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                className="flex-1"
                                onClick={() => {
                                  setMemberPayments(prev => 
                                    prev.map(p => p.memberId === currentUserId 
                                      ? { ...p, payerNote: editNote }
                                      : p
                                    )
                                  );
                                  setIsEditingNote(false);
                                  toast({ title: "Note updated" });
                                }}
                              >
                                Save
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => setIsEditingNote(false)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm font-medium text-foreground">
                            {currentUserPayment.payerNote || "No note added"}
                          </p>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Submitted on {currentUserPayment.uploadedAt || "just now"}
                      </div>
                    </Card>

                    {/* Receipt Preview - Editable */}
                    {currentUserPayment.receiptUrl && (
                      <Card className="p-4 border-border/50">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-muted-foreground">My Payment Receipt</h4>
                          {!isEditingReceipt && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 px-2 text-xs"
                              onClick={() => setIsEditingReceipt(true)}
                            >
                              <Pencil className="h-3 w-3 mr-1" /> Edit
                            </Button>
                          )}
                        </div>
                        
                        {isEditingReceipt ? (
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <input
                                ref={cameraInputRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      const newReceiptUrl = event.target?.result as string;
                                      setMemberPayments(prev => 
                                        prev.map(p => p.memberId === currentUserId 
                                          ? { ...p, receiptUrl: newReceiptUrl }
                                          : p
                                        )
                                      );
                                      setIsEditingReceipt(false);
                                      toast({ title: "Receipt updated" });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="hidden"
                              />
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      const newReceiptUrl = event.target?.result as string;
                                      setMemberPayments(prev => 
                                        prev.map(p => p.memberId === currentUserId 
                                          ? { ...p, receiptUrl: newReceiptUrl }
                                          : p
                                        )
                                      );
                                      setIsEditingReceipt(false);
                                      toast({ title: "Receipt updated" });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="hidden"
                              />
                              <Button
                                variant="outline"
                                className="flex-1 h-10 rounded-xl"
                                onClick={() => cameraInputRef.current?.click()}
                              >
                                <Camera className="h-4 w-4 mr-2" />
                                Camera
                              </Button>
                              <Button
                                variant="outline"
                                className="flex-1 h-10 rounded-xl"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Upload
                              </Button>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="w-full"
                              onClick={() => setIsEditingReceipt(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <img 
                            src={currentUserPayment.receiptUrl} 
                            alt="Payment receipt" 
                            className="w-full h-64 object-contain rounded-xl border border-border cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setShowFullReceipt(true)}
                          />
                        )}
                      </Card>
                    )}

                    <p className="text-xs text-muted-foreground text-center">
                      Your payment has been submitted and is awaiting confirmation by {expense.paidBy}.
                    </p>
                  </div>
                )}

                {/* SETTLED State - Final locked state */}
                {currentUserPayment?.status === "settled" && (
                  <div className="space-y-4">
                    {/* Status Badge */}
                    <div className="flex justify-center">
                      <Badge className="px-4 py-2 text-sm bg-stat-green/10 text-stat-green border-stat-green/30">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Settled
                      </Badge>
                    </div>

                    {/* Payment Summary Card - Read Only */}
                    <Card className="p-4 border-border/50 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Amount Paid</span>
                        <span className="text-lg font-bold text-foreground">RM {currentUserOwesAmount.toFixed(2)}</span>
                      </div>
                      
                      {currentUserPayment.payerNote && (
                        <div className="space-y-1">
                          <span className="text-sm text-muted-foreground">Payment Note</span>
                          <p className="text-sm font-medium text-foreground">{currentUserPayment.payerNote}</p>
                        </div>
                      )}

                      <div className="text-xs text-stat-green">
                        Confirmed by {expense.paidBy}
                      </div>
                    </Card>

                    {/* Receipt Preview - Locked */}
                    {currentUserPayment.receiptUrl && (
                      <Card className="p-4 border-border/50">
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">Payment Receipt</h4>
                        <img 
                          src={currentUserPayment.receiptUrl} 
                          alt="Payment receipt" 
                          className="w-full h-64 object-contain rounded-xl border border-border cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setShowFullReceipt(true)}
                        />
                      </Card>
                    )}

                    <p className="text-xs text-muted-foreground text-center">
                      Payment confirmed by {expense.paidBy}.
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
          onMarkAsReceived={handleMarkMemberSettled}
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
