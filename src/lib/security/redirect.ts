export const sanitizeRedirectPath = (
  rawPath: string | null,
  fallbackPath: string
) => {
  const path = rawPath ?? fallbackPath;
  return path.startsWith('/') && !path.startsWith('//') ? path : fallbackPath;
};
