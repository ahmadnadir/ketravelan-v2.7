import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  UserPlus, 
  Check, 
  X, 
  Clock, 
  MapPin,
  Calendar,
  Receipt,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  useApprovals, 
  ApprovalItem, 
  ApprovalStatus, 
  RequestType,
  JoinRequest,
  ExpenseApproval,
  ReceiptVerification 
} from "@/contexts/ApprovalsContext";

const segmentOptions = [
  { value: "pending", label: "Pending" },
  { value: "history", label: "History" },
];

export default function Approvals() {
  const navigate = useNavigate();
  const [activeSegment, setActiveSegment] = useState("pending");
  
  const { 
    approvals, 
    pendingCount,
    approveJoinRequest,
    rejectJoinRequest,
    acknowledgeExpense,
    disputeExpense,
    confirmReceipt,
    rejectReceipt,
  } = useApprovals();

  const filteredApprovals = useMemo(() => {
    if (activeSegment === "pending") {
      return approvals.filter((item) => item.status === "pending");
    }
    return approvals.filter((item) => item.status !== "pending");
  }, [approvals, activeSegment]);

  const handleApprove = (item: ApprovalItem) => {
    switch (item.type) {
      case "join_request":
        approveJoinRequest(item.id);
        break;
      case "expense_approval":
        acknowledgeExpense(item.expenseId, "1"); // "1" is current user ID
        break;
      case "receipt_verification":
        confirmReceipt(item.expenseId, item.submittedBy.id);
        break;
    }
  };

  const handleReject = (item: ApprovalItem) => {
    switch (item.type) {
      case "join_request":
        rejectJoinRequest(item.id);
        break;
      case "expense_approval":
        disputeExpense(item.expenseId, "1");
        break;
      case "receipt_verification":
        rejectReceipt(item.expenseId, item.submittedBy.id);
        break;
    }
  };

  const getTypeIcon = (type: RequestType) => {
    switch (type) {
      case "join_request":
        return <UserPlus className="h-4 w-4" />;
      case "expense_approval":
        return <Receipt className="h-4 w-4" />;
      case "receipt_verification":
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: RequestType) => {
    switch (type) {
      case "join_request":
        return "Join Request";
      case "expense_approval":
        return "Expense Added";
      case "receipt_verification":
        return "Receipt Submitted";
    }
  };

  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-stat-green/10 text-stat-green border-0 text-xs">
            <Check className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-destructive/10 text-destructive border-0 text-xs">
            <X className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const renderJoinRequest = (item: JoinRequest) => (
    <Card key={item.id} className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {getTypeIcon(item.type)}
          <span>{getTypeLabel(item.type)}</span>
          <span>•</span>
          <span>{item.requestedAt}</span>
        </div>
        {item.status !== "pending" && getStatusBadge(item.status)}
      </div>

      {/* Trip Info */}
      <div 
        className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
        onClick={() => navigate(`/trip/${item.tripId}`)}
      >
        <img 
          src={item.tripImage} 
          alt={item.tripTitle}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground truncate">{item.tripTitle}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{item.tripDate}</span>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Requester Info */}
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={item.requester.imageUrl} />
          <AvatarFallback>{item.requester.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm">{item.requester.name}</p>
            <Badge variant="secondary" className="text-xs">
              {item.requester.tripsCount} trips
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">{item.requester.bio}</p>
        </div>
      </div>

      {/* Message */}
      {item.message && (
        <div className="bg-secondary/50 rounded-lg p-3">
          <p className="text-sm text-foreground">{item.message}</p>
        </div>
      )}

      {/* Actions */}
      {item.status === "pending" && (
        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => handleReject(item)}
          >
            <X className="h-4 w-4 mr-1" />
            Decline
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => handleApprove(item)}
          >
            <Check className="h-4 w-4 mr-1" />
            Approve
          </Button>
        </div>
      )}
    </Card>
  );

  const renderExpenseApproval = (item: ExpenseApproval) => (
    <Card key={item.id} className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {getTypeIcon(item.type)}
          <span>{getTypeLabel(item.type)}</span>
          <span>•</span>
          <span>{item.requestedAt}</span>
        </div>
        {item.status !== "pending" && getStatusBadge(item.status)}
      </div>

      {/* Trip context */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3" />
        <span>{item.tripTitle}</span>
      </div>

      {/* Expense Info */}
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={item.expense.paidByImage} />
          <AvatarFallback>{item.expense.paidBy.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{item.expense.title}</p>
          <p className="text-xs text-muted-foreground">
            Paid by {item.expense.paidBy} • {item.expense.category}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-sm">RM {item.expense.amount}</p>
        </div>
      </div>

      {/* Actions */}
      {item.status === "pending" && (
        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => handleReject(item)}
          >
            <X className="h-4 w-4 mr-1" />
            Dispute
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => handleApprove(item)}
          >
            <Check className="h-4 w-4 mr-1" />
            Acknowledge
          </Button>
        </div>
      )}
    </Card>
  );

  const renderReceiptVerification = (item: ReceiptVerification) => (
    <Card key={item.id} className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {getTypeIcon(item.type)}
          <span>{getTypeLabel(item.type)}</span>
          <span>•</span>
          <span>{item.submittedAt}</span>
        </div>
        {item.status !== "pending" && getStatusBadge(item.status)}
      </div>

      {/* Trip context */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3" />
        <span>{item.tripTitle}</span>
      </div>

      {/* Expense & Submitter Info */}
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={item.submittedBy.imageUrl} />
          <AvatarFallback>{item.submittedBy.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{item.submittedBy.name}</p>
          <p className="text-xs text-muted-foreground">
            Paid RM {item.expense.yourShare} for "{item.expense.title}"
          </p>
        </div>
      </div>

      {/* Receipt Preview & Note */}
      <div className="flex gap-3">
        <img 
          src={item.receiptUrl} 
          alt="Receipt"
          className="w-16 h-20 rounded-lg object-cover border border-border"
        />
        {item.note && (
          <div className="flex-1 bg-secondary/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Note:</p>
            <p className="text-sm text-foreground">{item.note}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      {item.status === "pending" && (
        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => handleReject(item)}
          >
            <X className="h-4 w-4 mr-1" />
            Reject
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => handleApprove(item)}
          >
            <Check className="h-4 w-4 mr-1" />
            Confirm Payment
          </Button>
        </div>
      )}
    </Card>
  );

  const renderApprovalItem = (item: ApprovalItem) => {
    switch (item.type) {
      case "join_request":
        return renderJoinRequest(item);
      case "expense_approval":
        return renderExpenseApproval(item);
      case "receipt_verification":
        return renderReceiptVerification(item);
    }
  };

  return (
    <AppLayout>
      <div className="py-6 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Approvals & Requests</h1>
          <p className="text-sm text-muted-foreground">
            {pendingCount > 0 
              ? `You have ${pendingCount} pending item${pendingCount > 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>

        {/* Segment Control */}
        <SegmentedControl
          options={segmentOptions}
          value={activeSegment}
          onChange={setActiveSegment}
        />

        {/* Approval Items */}
        {filteredApprovals.length > 0 ? (
          <div className="space-y-4">
            {filteredApprovals.map(renderApprovalItem)}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              {activeSegment === "pending" ? (
                <Check className="h-8 w-8 text-stat-green" />
              ) : (
                <FileText className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {activeSegment === "pending" 
                ? "All caught up!" 
                : "No history yet"}
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              {activeSegment === "pending"
                ? "You have no pending approvals or requests to review."
                : "Your approved and rejected items will appear here."}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
