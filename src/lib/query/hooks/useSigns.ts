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

const fetchSigns = async (): Promise<Sign[]> => {
  const response = await fetch('/api/signs');
  if (!response.ok) {
    throw new Error('Failed to fetch signs');
  }
  return response.json() as Promise<Sign[]>;
};

export const useSigns = () =>
  useQuery({
    queryKey: queryKeys.signs.list(),
    queryFn: fetchSigns,
  });
