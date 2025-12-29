import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield, BadgeCheck } from "lucide-react";

const members = [
  { name: "Ahmad", avatar: "A", trips: 12, isOrganizer: true },
  { name: "Sarah", avatar: "S", trips: 5, isOrganizer: false },
  { name: "Lisa", avatar: "L", trips: 8, isOrganizer: false },
];

export function MembersScreen() {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border/50 bg-card">
        <h3 className="text-xs font-semibold text-foreground">Members</h3>
      </div>

      <div className="flex-1 overflow-hidden px-3 py-3 space-y-2.5">
        {/* Safety Banner */}
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl p-2.5 flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
            <Shield className="h-3 w-3 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-green-800 dark:text-green-300">
              Safety & Security
            </p>
            <p className="text-[9px] text-green-600 dark:text-green-400">
              All members verified
            </p>
          </div>
        </div>

        {/* Member Cards */}
        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.name}
              className="bg-card border border-border/50 rounded-xl p-2.5 flex items-center gap-2.5"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {member.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-foreground">
                    {member.name}
                  </span>
                  {member.isOrganizer && (
                    <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                      Organizer
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <BadgeCheck className="h-2.5 w-2.5 text-primary" />
                  <span className="text-[9px] text-muted-foreground">
                    {member.trips} trips completed
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* More Members */}
        <div className="text-center">
          <span className="text-[10px] text-muted-foreground">
            +5 more members
          </span>
        </div>
      </div>
    </div>
  );
}
