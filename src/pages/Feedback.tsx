import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function Feedback() {
  const googleFormUrl = "https://forms.google.com/your-form-id"; // Replace with actual Google Form URL

  return (
    <AppLayout>
      <div className="py-8 px-4 space-y-8 text-center min-h-[calc(100vh-200px)] flex flex-col justify-center">
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Help Us Build a Better Ketravelan
          </h1>
          <div className="text-base text-muted-foreground max-w-md mx-auto space-y-2">
            <p>
              Your feedback helps us improve the experience for everyone — from planning trips to splitting expenses smoothly.
            </p>
            <p>
              Every suggestion matters, and we truly read them all.
            </p>
          </div>
        </div>

        {/* Hiking Illustration - 3 people hiking together */}
        <div className="py-6">
          <svg
            viewBox="0 0 400 200"
            className="w-full max-w-xs sm:max-w-sm mx-auto"
            aria-label="Three people hiking together on a mountain trail"
          >
            {/* Sky gradient background */}
            <defs>
              <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary) / 0.15)" />
                <stop offset="100%" stopColor="hsl(var(--primary) / 0.05)" />
              </linearGradient>
              <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary) / 0.3)" />
                <stop offset="100%" stopColor="hsl(var(--primary) / 0.5)" />
              </linearGradient>
            </defs>
            
            {/* Background */}
            <rect width="400" height="200" fill="url(#skyGradient)" rx="16" />
            
            {/* Sun */}
            <circle cx="320" cy="45" r="25" fill="hsl(var(--primary) / 0.25)" />
            
            {/* Mountains - back */}
            <path
              d="M0 200 L80 100 L160 150 L240 80 L320 130 L400 90 L400 200 Z"
              fill="hsl(var(--primary) / 0.2)"
            />
            
            {/* Mountains - front */}
            <path
              d="M0 200 L60 140 L120 170 L200 120 L280 160 L340 130 L400 160 L400 200 Z"
              fill="url(#mountainGradient)"
            />
            
            {/* Trail path */}
            <path
              d="M50 195 Q150 175 200 180 Q250 185 350 170"
              stroke="hsl(var(--muted-foreground) / 0.3)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="8 6"
            />
            
            {/* Person 1 - Left (leading) */}
            <g transform="translate(280, 145)">
              {/* Backpack */}
              <ellipse cx="0" cy="8" rx="8" ry="10" fill="hsl(var(--primary) / 0.7)" />
              {/* Body */}
              <ellipse cx="0" cy="5" rx="6" ry="8" fill="hsl(var(--primary))" />
              {/* Head */}
              <circle cx="0" cy="-8" r="7" fill="hsl(var(--primary) / 0.9)" />
              {/* Hiking pole */}
              <line x1="8" y1="-2" x2="15" y2="20" stroke="hsl(var(--muted-foreground))" strokeWidth="2" strokeLinecap="round" />
              {/* Legs */}
              <line x1="-3" y1="12" x2="-5" y2="25" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
              <line x1="3" y1="12" x2="6" y2="24" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
            </g>
            
            {/* Person 2 - Middle */}
            <g transform="translate(220, 155)">
              {/* Backpack */}
              <ellipse cx="0" cy="8" rx="7" ry="9" fill="hsl(var(--accent) / 0.7)" />
              {/* Body */}
              <ellipse cx="0" cy="5" rx="5" ry="7" fill="hsl(var(--accent-foreground) / 0.6)" />
              {/* Head */}
              <circle cx="0" cy="-6" r="6" fill="hsl(var(--accent-foreground) / 0.5)" />
              {/* Arm waving */}
              <line x1="5" y1="0" x2="12" y2="-8" stroke="hsl(var(--accent-foreground) / 0.5)" strokeWidth="2" strokeLinecap="round" />
              {/* Legs */}
              <line x1="-2" y1="11" x2="-4" y2="22" stroke="hsl(var(--accent-foreground) / 0.6)" strokeWidth="3" strokeLinecap="round" />
              <line x1="2" y1="11" x2="5" y2="21" stroke="hsl(var(--accent-foreground) / 0.6)" strokeWidth="3" strokeLinecap="round" />
            </g>
            
            {/* Person 3 - Right (back) */}
            <g transform="translate(160, 165)">
              {/* Backpack */}
              <ellipse cx="0" cy="7" rx="6" ry="8" fill="hsl(var(--secondary))" />
              {/* Body */}
              <ellipse cx="0" cy="4" rx="5" ry="6" fill="hsl(var(--secondary-foreground) / 0.5)" />
              {/* Head */}
              <circle cx="0" cy="-5" r="5" fill="hsl(var(--secondary-foreground) / 0.4)" />
              {/* Hiking pole */}
              <line x1="-6" y1="0" x2="-10" y2="15" stroke="hsl(var(--muted-foreground))" strokeWidth="2" strokeLinecap="round" />
              {/* Legs */}
              <line x1="-2" y1="9" x2="-3" y2="18" stroke="hsl(var(--secondary-foreground) / 0.5)" strokeWidth="2" strokeLinecap="round" />
              <line x1="2" y1="9" x2="4" y2="17" stroke="hsl(var(--secondary-foreground) / 0.5)" strokeWidth="2" strokeLinecap="round" />
            </g>
            
            {/* Small trees/bushes for depth */}
            <ellipse cx="100" cy="185" rx="15" ry="10" fill="hsl(var(--primary) / 0.4)" />
            <ellipse cx="320" cy="180" rx="12" ry="8" fill="hsl(var(--primary) / 0.35)" />
          </svg>
        </div>

        {/* CTA Section */}
        <div className="pt-2">
          <a
            href={googleFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button 
              className="w-full rounded-full py-6 text-base font-medium gap-2"
              size="lg"
            >
              Share Your Feedback
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </AppLayout>
  );
}
