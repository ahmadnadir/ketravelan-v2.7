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

        {/* Notion-style Hiking Illustration */}
        <div className="py-8">
          <svg
            viewBox="0 0 320 180"
            className="w-full max-w-[280px] sm:max-w-xs mx-auto"
            aria-label="Three people hiking together on a mountain trail"
            role="img"
          >
            {/* Soft sun */}
            <circle cx="260" cy="35" r="20" fill="#F5EFE0" />
            
            {/* Back mountain - soft grey */}
            <path
              d="M0 180 L0 110 Q40 85 80 100 Q120 75 160 90 Q200 70 240 85 Q280 95 320 80 L320 180 Z"
              fill="#E8E6E3"
            />
            
            {/* Front mountain - muted sage */}
            <path
              d="M0 180 L0 130 Q50 115 100 125 Q150 110 200 120 Q250 130 320 115 L320 180 Z"
              fill="#D4DDD4"
            />
            
            {/* Subtle path */}
            <path
              d="M30 165 Q100 155 160 158 Q220 161 290 150"
              stroke="#D9D3C9"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            
            {/* Person 1 - Leading (soft coral) */}
            <g transform="translate(230, 128)">
              {/* Backpack */}
              <rect x="-5" y="8" width="10" height="12" rx="2" fill="#D4B8A8" />
              {/* Body */}
              <rect x="-8" y="4" width="16" height="24" rx="8" fill="#E8C4B8" />
              {/* Head */}
              <circle cx="0" cy="-6" r="10" fill="#E8C4B8" />
            </g>
            
            {/* Person 2 - Middle (muted teal) */}
            <g transform="translate(170, 136)">
              {/* Backpack */}
              <rect x="-4" y="6" width="8" height="10" rx="2" fill="#A0C4C4" />
              {/* Body */}
              <rect x="-7" y="2" width="14" height="20" rx="7" fill="#B8D4D4" />
              {/* Head */}
              <circle cx="0" cy="-6" r="8" fill="#B8D4D4" />
            </g>
            
            {/* Person 3 - Back (warm sand) */}
            <g transform="translate(115, 142)">
              {/* Backpack */}
              <rect x="-3" y="5" width="6" height="8" rx="1.5" fill="#C8C0B0" />
              {/* Body */}
              <rect x="-5" y="1" width="10" height="16" rx="5" fill="#DDD5C8" />
              {/* Head */}
              <circle cx="0" cy="-4" r="6" fill="#DDD5C8" />
            </g>
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
