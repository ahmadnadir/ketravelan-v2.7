import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  MessageCircle,
  Pencil,
  Users,
  Settings,
  UserPlus,
  MoreVertical,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Member {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
}

interface Trip {
  id: string;
  title: string;
  imageUrl: string;
  destination: string;
}

interface GroupInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: Trip;
  members: Member[];
  currentUserId?: string;
  onTripUpdate?: (updates: Partial<Trip>) => void;
}

export function GroupInfoModal({
  open,
  onOpenChange,
  trip,
  members,
  currentUserId = "1",
}: GroupInfoModalProps) {
  const navigate = useNavigate();
  const membersRef = useRef<HTMLDivElement>(null);

  const currentMember = members.find((m) => m.id === currentUserId);
  const isOrganizer = currentMember?.role === "Organizer";

  const handleMemberClick = (memberId: string) => {
    onOpenChange(false);
    navigate(`/user/${memberId}`);
  };

  const handleMessageClick = (memberId: string) => {
    onOpenChange(false);
    navigate(`/chat/direct/${memberId}`);
  };

  const handleEditDetails = () => {
    onOpenChange(false);
    navigate(`/create-trip?edit=${trip.id}`);
  };

  const handleManageMembers = () => {
    membersRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTripSettings = () => {
    toast("Trip Settings", { description: "Settings panel coming soon." });
  };

  const handlePromote = (member: Member) => {
    toast("Member Promoted", {
      description: `${member.name} has been promoted to Organizer.`,
    });
  };

  const handleRemove = (member: Member) => {
    toast("Member Removed", {
      description: `${member.name} has been removed from the trip.`,
    });
  };

  const handleInvite = () => {
    toast("Invite Members", { description: "Invite link copied to clipboard." });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
        <SheetHeader className="sr-only">
          <SheetTitle>Group Info</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Trip Info Header */}
          <div className="flex flex-col items-center pt-4 pb-6 border-b border-border/50">
            <div className="relative mb-4">
              <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-background shadow-lg">
                <img
                  src={trip.imageUrl}
                  alt={trip.title}
                  className="h-full w-full object-cover"
                />
              </div>
              {isOrganizer && (
                <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full shadow-md hover:bg-primary/90 transition-colors">
                  <Camera className="h-4 w-4 text-primary-foreground" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-foreground">
                {trip.title}
              </h2>
              {isOrganizer && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleEditDetails}
                >
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              )}
            </div>

            <p className="text-sm text-muted-foreground mt-1">
              {trip.destination} • {members.length} members
            </p>
          </div>

          <ScrollArea className="flex-1">
            {/* Manage Trip Section — Organizer Only */}
            {isOrganizer && (
              <div className="px-4 py-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Manage Trip
                </h3>
                <div className="rounded-xl border border-border overflow-hidden">
                  <button
                    onClick={handleEditDetails}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors"
                  >
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 text-sm font-medium text-foreground">
                      Edit Details
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <div className="border-t border-border" />
                  <button
                    onClick={handleManageMembers}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors"
                  >
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 text-sm font-medium text-foreground">
                      Manage Members
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <div className="border-t border-border" />
                  <button
                    onClick={handleTripSettings}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors"
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 text-sm font-medium text-foreground">
                      Trip Settings
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            )}

            {/* Members List */}
            <div ref={membersRef} className="px-4">
              <h3 className="text-sm font-medium text-muted-foreground py-3">
                Members
              </h3>
              <div className="space-y-1">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition-colors"
                  >
                    <button
                      onClick={() => handleMemberClick(member.id)}
                      className="flex items-center gap-3 flex-1 min-w-0 text-left"
                    >
                      <div className="h-11 w-11 rounded-full bg-muted overflow-hidden shrink-0">
                        {member.imageUrl ? (
                          <img
                            src={member.imageUrl}
                            alt={member.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground font-semibold">
                            {member.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-foreground truncate">
                          {member.name}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {member.role}
                        </span>
                      </div>
                    </button>

                    {isOrganizer && member.id !== currentUserId ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleMessageClick(member.id)}>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePromote(member)}>
                            <Users className="h-4 w-4 mr-2" />
                            Promote to Organizer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleRemove(member)}
                            className="text-destructive focus:text-destructive"
                          >
                            Remove from Trip
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : member.id !== currentUserId ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMessageClick(member.id)}
                        className="shrink-0"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>

              {/* Invite Members CTA — Organizer Only */}
              {isOrganizer && (
                <Button
                  variant="ghost"
                  className="w-full mt-3 mb-4 text-muted-foreground"
                  onClick={handleInvite}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Members
                </Button>
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
