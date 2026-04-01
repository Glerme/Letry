import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import type { PublicSign } from '@/lib/query/types';

const fetchSign = async (slug: string): Promise<PublicSign> => {
  const response = await fetch(`/api/signs/${slug}`);
  if (!response.ok) {
    throw new Error('Sign not found');
  }
  return response.json() as Promise<PublicSign>;
};

export const useSign = (slug: string) =>
  useQuery({
    queryKey: queryKeys.signs.detail(slug),
    queryFn: () => fetchSign(slug),
    enabled: slug.length > 0,
  });
