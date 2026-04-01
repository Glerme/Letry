export const queryKeys = {
  signs: {
    all: ['signs'] as const,
    list: () => [...queryKeys.signs.all, 'list'] as const,
    detail: (slug: string) => [...queryKeys.signs.all, 'detail', slug] as const,
  },
} as const;
