import {
  FAQSection,
  FeaturesSection,
  FinalCTASection,
  HeroSection,
  PreviewSection,
  PricingSection,
} from '@/components/marketing';

export default function LandingPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 py-14 sm:py-20">
      <HeroSection />
      <PreviewSection />
      <FeaturesSection />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
    </div>
  );
}
