import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';

// Temporary until src/lib/validations/sign.ts is created (Task 3)
type Sign = {
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

const fetchSign = async (slug: string): Promise<Sign> => {
  const response = await fetch(`/api/signs/${slug}`);
  if (!response.ok) {
    throw new Error('Sign not found');
  }
  return response.json() as Promise<Sign>;
};

export const useSign = (slug: string) =>
  useQuery({
    queryKey: queryKeys.signs.detail(slug),
    queryFn: () => fetchSign(slug),
    enabled: Boolean(slug),
  });
