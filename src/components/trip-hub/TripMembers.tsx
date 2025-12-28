import { Shield, MessageCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PillChip } from "@/components/shared/PillChip";
import { mockMembers } from "@/data/mockData";

export function TripMembers() {
  return (
    <div className="px-4 py-4 pb-8 space-y-6">
      {/* Safety Notice */}
      <Card className="p-4 border-border/50 bg-accent/30">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Safety & Security</h3>
            <p className="text-sm text-muted-foreground mt-1">
              All members have verified their identity. Message the organizer if you have any concerns.
            </p>
          </div>
        </div>
      </Card>

      {/* Members List */}
      <div className="space-y-3">
        {mockMembers.map((member) => (
          <Card key={member.id} className="p-4 border-border/50">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-muted overflow-hidden shrink-0">
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground font-semibold text-lg">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-foreground">{member.name}</h4>
                  {member.role === "Organizer" && (
                    <PillChip label="Organizer" variant="primary" size="sm" />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">5 trips completed</span>
                </div>
                {/* Social links placeholder */}
                <div className="flex gap-2 mt-2">
                  <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="shrink-0">
                <MessageCircle className="h-4 w-4 mr-1" />
                Message
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}