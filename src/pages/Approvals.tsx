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
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Types for approvals
type ApprovalStatus = "pending" | "approved" | "rejected";
type RequestType = "join_request" | "expense_approval" | "receipt_verification";

interface JoinRequest {
  id: string;
  type: "join_request";
  tripId: string;
  tripTitle: string;
  tripImage: string;
  tripDate: string;
  requester: {
    id: string;
    name: string;
    imageUrl?: string;
    bio?: string;
    tripsCount: number;
  };
  message?: string;
  requestedAt: string;
  status: ApprovalStatus;
}

interface ExpenseApproval {
  id: string;
  type: "expense_approval";
  tripId: string;
  tripTitle: string;
  expense: {
    title: string;
    amount: number;
    category: string;
    paidBy: string;
    paidByImage?: string;
  };
  requestedAt: string;
  status: ApprovalStatus;
}

interface ReceiptVerification {
  id: string;
  type: "receipt_verification";
  tripId: string;
  tripTitle: string;
  expense: {
    title: string;
    amount: number;
    yourShare: number;
  };
  submittedBy: {
    id: string;
    name: string;
    imageUrl?: string;
  };
  receiptUrl: string;
  note?: string;
  submittedAt: string;
  status: ApprovalStatus;
}

type ApprovalItem = JoinRequest | ExpenseApproval | ReceiptVerification;

// Mock data for approvals
const mockApprovals: ApprovalItem[] = [
  // Join Requests (as organizer, you need to approve these)
  {
    id: "jr-1",
    type: "join_request",
    tripId: "1",
    tripTitle: "Langkawi Island Adventure",
    tripImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    tripDate: "Jan 15-18, 2025",
    requester: {
      id: "new-1",
      name: "Marcus Chen",
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
      bio: "Adventure seeker from KL, love water sports and hiking",
      tripsCount: 3,
    },
    message: "Hi! I've been wanting to visit Langkawi for ages. I'm comfortable with swimming and have my own snorkeling gear. Would love to join!",
    requestedAt: "2 hours ago",
    status: "pending",
  },
  {
    id: "jr-2",
    type: "join_request",
    tripId: "1",
    tripTitle: "Langkawi Island Adventure",
    tripImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    tripDate: "Jan 15-18, 2025",
    requester: {
      id: "new-2",
      name: "Mei Ling",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
      bio: "Solo traveler, photographer, beach lover",
      tripsCount: 7,
    },
    message: "Experienced DIY traveler here! I can help with photography and I know some great hidden spots in Langkawi.",
    requestedAt: "5 hours ago",
    status: "pending",
  },
  // Expense Approvals (as member, you need to approve expenses added)
  {
    id: "ea-1",
    type: "expense_approval",
    tripId: "1",
    tripTitle: "Langkawi Island Adventure",
    expense: {
      title: "Jet Ski Rental",
      amount: 400,
      category: "Activities",
      paidBy: "Sarah Tan",
      paidByImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    },
    requestedAt: "1 hour ago",
    status: "pending",
  },
  {
    id: "ea-2",
    type: "expense_approval",
    tripId: "1",
    tripTitle: "Langkawi Island Adventure",
    expense: {
      title: "Snorkeling Equipment",
      amount: 150,
      category: "Activities",
      paidBy: "John Lee",
      paidByImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    },
    requestedAt: "3 hours ago",
    status: "pending",
  },
  // Receipt Verifications (as payer, you need to verify receipts submitted)
  {
    id: "rv-1",
    type: "receipt_verification",
    tripId: "1",
    tripTitle: "Langkawi Island Adventure",
    expense: {
      title: "Accommodation - 3 nights",
      amount: 1200,
      yourShare: 300,
    },
    submittedBy: {
      id: "4",
      name: "John Lee",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    },
    receiptUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
    note: "Paid via bank transfer on Jan 16",
    submittedAt: "30 mins ago",
    status: "pending",
  },
  // Some historical items
  {
    id: "jr-3",
    type: "join_request",
    tripId: "2",
    tripTitle: "Cameron Highlands Retreat",
    tripImage: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400",
    tripDate: "Feb 5-7, 2025",
    requester: {
      id: "new-3",
      name: "Raj Patel",
      imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200",
      bio: "Nature photographer, tea enthusiast",
      tripsCount: 5,
    },
    requestedAt: "2 days ago",
    status: "approved",
  },
  {
    id: "ea-3",
    type: "expense_approval",
    tripId: "1",
    tripTitle: "Langkawi Island Adventure",
    expense: {
      title: "Group Lunch",
      amount: 180,
      category: "Food & Drinks",
      paidBy: "Lisa Wong",
      paidByImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    },
    requestedAt: "1 day ago",
    status: "approved",
  },
];

const segmentOptions = [
  { value: "pending", label: "Pending" },
  { value: "history", label: "History" },
];

export default function Approvals() {
  const navigate = useNavigate();
  const [activeSegment, setActiveSegment] = useState("pending");
  const [approvals, setApprovals] = useState<ApprovalItem[]>(mockApprovals);

  const filteredApprovals = useMemo(() => {
    if (activeSegment === "pending") {
      return approvals.filter((item) => item.status === "pending");
    }
    return approvals.filter((item) => item.status !== "pending");
  }, [approvals, activeSegment]);

  const pendingCount = useMemo(() => {
    return approvals.filter((item) => item.status === "pending").length;
  }, [approvals]);

  const handleApprove = (id: string) => {
    setApprovals((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "approved" as ApprovalStatus } : item
      )
    );
  };

  const handleReject = (id: string) => {
    setApprovals((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "rejected" as ApprovalStatus } : item
      )
    );
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
            onClick={() => handleReject(item.id)}
          >
            <X className="h-4 w-4 mr-1" />
            Decline
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => handleApprove(item.id)}
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
            onClick={() => handleReject(item.id)}
          >
            <X className="h-4 w-4 mr-1" />
            Dispute
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => handleApprove(item.id)}
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
            onClick={() => handleReject(item.id)}
          >
            <X className="h-4 w-4 mr-1" />
            Reject
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => handleApprove(item.id)}
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
