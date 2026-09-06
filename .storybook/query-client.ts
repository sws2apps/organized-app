import { QueryClient } from '@tanstack/react-query';

/** Shared by every story; `preview.tsx` clears it before each story. */
export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});
