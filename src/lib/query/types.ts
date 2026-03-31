// Temporary Sign type — replace with import from @/lib/validations/sign once Task 3 is complete
// TODO: replace with: import type { Sign } from '@/lib/validations/sign';
export type Sign = {
  id: string;
  slug: string;
  text: string;
  animation: string;
  led_color: string;
  bg_color: string;
  speed: string;
  user_id: string | null;
  created_at: string;
};
