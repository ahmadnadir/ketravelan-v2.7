import { AppLayout } from "@/components/layout/AppLayout";
import { InstallBanner } from "@/components/pwa/InstallBanner";
import { HeroSection } from "@/components/home/HeroSection";
import { UpcomingAdventuresSection } from "@/components/home/UpcomingAdventuresSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { GuidesSection } from "@/components/home/GuidesSection";
import { ExpensesFeatureSection } from "@/components/home/ExpensesFeatureSection";
import { FAQSection } from "@/components/home/FAQSection";
import { BottomCTASection } from "@/components/home/BottomCTASection";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { SEOHead } from "@/components/seo/SEOHead";

export default function Home() {
  return (
    <>
      <SEOHead
        title="Ketravelan - Find Travel Buddies & Group Trips"
        description="Join group trips, find travel buddies, and explore the world together. Plan trips with friends, not spreadsheets. Coordinate destinations, budgets, and itineraries effortlessly."
        canonicalUrl="https://ketravelan.com/"
        keywords={['travel buddies', 'group trips', 'travel group', 'budget travel', 'backpacking', 'travel planning']}
      />
      <AppLayout>
      <InstallBanner />
      <div className="py-4 sm:py-6 space-y-10 sm:space-y-14">
        <AnimatedSection>
          <HeroSection />
        </AnimatedSection>
        <AnimatedSection delay={50}>
          <UpcomingAdventuresSection />
        </AnimatedSection>
        <AnimatedSection delay={50}>
          <GuidesSection />
        </AnimatedSection>
        <AnimatedSection delay={50}>
          <ExpensesFeatureSection />
        </AnimatedSection>
        <AnimatedSection delay={50}>
          <HowItWorksSection />
        </AnimatedSection>
        <AnimatedSection delay={50}>
          <FAQSection />
        </AnimatedSection>
        <AnimatedSection delay={50}>
          <BottomCTASection />
        </AnimatedSection>
      </div>
      </AppLayout>
    </>
  );
}
