import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Users, Bell, Shield, Trash2, LogOut } from "lucide-react";
import { FocusedFlowLayout } from "@/components/layout/FocusedFlowLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { mockTrips, mockMembers } from "@/data/mockData";
import { toast } from "sonner";

const CURRENT_USER_ID = "1";

export default function TripSettings() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const trip = mockTrips.find((t) => t.id === id);
  const isOrganizer = mockMembers.find(
    (m) => m.id === CURRENT_USER_ID
  )?.role === "Organizer";

  useEffect(() => {
    if (!isOrganizer) navigate(`/trip/${id}/hub`, { replace: true });
  }, [isOrganizer, id, navigate]);

  // Settings state
  const [isPublic, setIsPublic] = useState(true);
  const [editPermission, setEditPermission] = useState("organizer");
  const [expensePermission, setExpensePermission] = useState("everyone");
  const [notifyNewMembers, setNotifyNewMembers] = useState(true);
  const [notifyExpenses, setNotifyExpenses] = useState(true);
  const [notifyChat, setNotifyChat] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleManageMembers = () => {
    navigate(`/trip/${id}/hub`);
  };

  const handleLeaveTrip = () => {
    toast.error("Transfer ownership first", {
      description: "As the organizer, you must transfer ownership before leaving.",
    });
  };

  const handleDeleteTrip = () => {
    setDeleteOpen(false);
    toast.success("Trip deleted", { description: "The trip has been permanently deleted." });
    navigate("/my-trips", { replace: true });
  };

  if (!trip || !isOrganizer) return null;

  return (
    <FocusedFlowLayout
      headerContent={
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Trip Settings</h1>
        </div>
      }
    >
      <div className="pb-8 space-y-6 px-4 pt-4">
        {/* Privacy & Visibility */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4" />
            <h2 className="text-sm font-medium">Privacy & Visibility</h2>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                {isPublic ? "Public" : "Private"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isPublic
                  ? "Public trips can be discovered by anyone."
                  : "Private trips are invite-only."}
              </p>
            </div>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>
        </section>

        {/* Permissions */}
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">Permissions</h2>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="p-4 space-y-1.5">
              <label className="text-sm font-medium text-foreground block">
                Who can edit trip details
              </label>
              <Select value={editPermission} onValueChange={setEditPermission}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="organizer">Only Organizer</SelectItem>
                  <SelectItem value="everyone">Everyone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="border-t border-border" />
            <div className="p-4 space-y-1.5">
              <label className="text-sm font-medium text-foreground block">
                Who can add expenses
              </label>
              <Select value={expensePermission} onValueChange={setExpensePermission}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="everyone">Everyone</SelectItem>
                  <SelectItem value="organizer">Organizer Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Members Shortcut */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <h2 className="text-sm font-medium">Members</h2>
          </div>
          <button
            onClick={handleManageMembers}
            className="flex items-center justify-between w-full rounded-xl border border-border p-4 hover:bg-accent/50 transition-colors"
          >
            <span className="text-sm font-medium text-foreground">
              Manage Members
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </section>

        {/* Notifications */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Bell className="h-4 w-4" />
            <h2 className="text-sm font-medium">Notifications</h2>
          </div>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <span className="text-sm text-foreground">New members join</span>
              <Switch checked={notifyNewMembers} onCheckedChange={setNotifyNewMembers} />
            </div>
            <div className="border-t border-border" />
            <div className="flex items-center justify-between p-4">
              <span className="text-sm text-foreground">Expense updates</span>
              <Switch checked={notifyExpenses} onCheckedChange={setNotifyExpenses} />
            </div>
            <div className="border-t border-border" />
            <div className="flex items-center justify-between p-4">
              <span className="text-sm text-foreground">Chat activity</span>
              <Switch checked={notifyChat} onCheckedChange={setNotifyChat} />
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-destructive">Danger Zone</h2>
          <div className="rounded-xl border border-destructive/30 overflow-hidden">
            <div className="p-4 space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={handleLeaveTrip}
              >
                <LogOut className="h-4 w-4" />
                Leave Trip
              </Button>
              <Button
                variant="destructive"
                className="w-full justify-start gap-2"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete Trip
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this trip?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All trip data, expenses, and chat history will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTrip}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </FocusedFlowLayout>
  );
}
