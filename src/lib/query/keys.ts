export const queryKeys = {
  signs: {
    all: ['signs'] as const,
    lists: () => [...queryKeys.signs.all, 'list'] as const,
    list: () => [...queryKeys.signs.lists()] as const,
    detail: (slug: string) => [...queryKeys.signs.all, 'detail', slug] as const,
  },
} as const;
