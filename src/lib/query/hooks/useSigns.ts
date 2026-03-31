import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import type { Sign } from '@/lib/query/types';

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
