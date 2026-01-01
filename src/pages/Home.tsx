import { AppLayout } from "@/components/layout/AppLayout";
import { InstallBanner } from "@/components/pwa/InstallBanner";
import { HeroSection } from "@/components/home/HeroSection";
import { UpcomingAdventuresSection } from "@/components/home/UpcomingAdventuresSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { GuidesSection } from "@/components/home/GuidesSection";
import { FAQSection } from "@/components/home/FAQSection";
import { BottomCTASection } from "@/components/home/BottomCTASection";

export default function Home() {
  return (
    <AppLayout>
      <InstallBanner />
      <div className="py-4 sm:py-6 space-y-10 sm:space-y-14">
        <HeroSection />
        <UpcomingAdventuresSection />
        <HowItWorksSection />
        <GuidesSection />
        <FAQSection />
        <BottomCTASection />
      </div>
    </AppLayout>
  );
}
