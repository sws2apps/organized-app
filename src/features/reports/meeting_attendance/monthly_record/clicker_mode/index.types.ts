/**
 * Which count a clicker session is editing.
 */
export type ClickerTab = 'present' | 'online';

/**
 * Values written back when a clicker session is saved. Only the counts the user
 * actually interacted with are present.
 */
export type ClickerSaveValues = {
  present?: number;
  online?: number;
};

/**
 * Props for the {@link ClickerMode} full-screen overlay.
 */
export type ClickerModeProps = {
  /**
   * Whether the overlay is open.
   */
  open: boolean;

  /**
   * Closes the overlay without saving (cancel / back).
   */
  onClose: () => void;

  /**
   * Header title, e.g. "May 16: Midweek meeting". The subtitle is filled in
   * automatically from the parent page's title.
   */
  title: string;

  /**
   * Tab selected when the overlay opens (mirrors the focused field).
   */
  initialTab: ClickerTab;

  /**
   * Whether online attendance is being recorded. When false, only the present
   * count is available and the switcher is hidden.
   */
  recordOnline: boolean;

  /**
   * Current present count in the field — the session starts from here.
   */
  presentValue: number;

  /**
   * Current online count in the field — the session starts from here.
   */
  onlineValue: number;

  /**
   * Called with the counted value(s) when the user saves.
   */
  onSave: (values: ClickerSaveValues) => void;
};
