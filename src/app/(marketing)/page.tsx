import { createClient } from '@/lib/supabase/server';
import {
  FAQSection,
  FeaturesSection,
  FinalCTASection,
  HeroSection,
  PreviewSection,
  PricingSection,
} from '@/components/marketing';

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 py-14 sm:py-20">
      <HeroSection isAuthenticated={Boolean(user)} />
      <PreviewSection />
      <FeaturesSection />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
    </div>
  );
}
