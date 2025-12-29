import { Link } from "react-router-dom";
import { Shield, MessageCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PillChip } from "@/components/shared/PillChip";
import { mockMembers } from "@/data/mockData";

export function TripMembers() {
  return (
    <div className="px-3 sm:px-4 py-3 sm:py-4 pb-8 space-y-4 sm:space-y-6">
      {/* Safety Notice */}
      <Card className="p-3 sm:p-4 border-border/50 bg-accent/30">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-primary/10 shrink-0">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground text-sm sm:text-base">Safety & Security</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
              All members have verified their identity. Message the organizer if you have any concerns.
            </p>
          </div>
        </div>
      </Card>

      {/* Members List */}
      <div className="space-y-2 sm:space-y-3">
        {mockMembers.map((member) => (
          <Card key={member.id} className="p-3 sm:p-4 border-border/50">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Clickable Avatar + Name area */}
              <Link 
                to={`/user/${member.id}`}
                className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
              >
                <div className="h-11 w-11 sm:h-14 sm:w-14 rounded-full bg-muted overflow-hidden shrink-0">
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground font-semibold text-base sm:text-lg">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <h4 className="font-medium text-foreground text-sm sm:text-base">{member.name}</h4>
                    {member.role === "Organizer" && (
                      <PillChip label="Organizer" variant="primary" size="sm" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                    <span className="text-xs sm:text-sm text-muted-foreground">5 trips completed</span>
                  </div>
                </div>
              </Link>
              
              {/* Social links - separate action */}
              <div className="flex gap-1.5 sm:gap-2">
                <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-secondary flex items-center justify-center">
                  <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground" />
                </div>
              </div>
              
              {/* Message button - separate action */}
              <Button variant="outline" size="sm" className="shrink-0 text-xs sm:text-sm px-2 sm:px-3">
                <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" />
                <span className="hidden sm:inline">Message</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
