export const FEATURE_FLAGS: Record<string, boolean> = {
  upcoming_events: JSON.parse(
    import.meta.env.VITE_FLAGS_UPCOMING_EVENTS || 'false'
  ),
};
