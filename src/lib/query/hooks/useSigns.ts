import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import type { OwnedSign } from '@/lib/query/types';

const fetchSigns = async (): Promise<OwnedSign[]> => {
  const response = await fetch('/api/signs');
  if (!response.ok) {
    throw new Error('Failed to fetch signs');
  }
  return response.json() as Promise<OwnedSign[]>;
};

export const useSigns = () =>
  useQuery({
    queryKey: queryKeys.signs.list(),
    queryFn: fetchSigns,
  });
