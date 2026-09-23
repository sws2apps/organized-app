import { KeyboardEvent } from 'react';

// rows sit on a white card, or on a tinted (--accent-150) info card; on the
// tinted one the lighter --accent-100 would read as a hole in light mode and
// darken in dark mode, so its states step darker in both themes instead
export type RowSurface = 'plain' | 'tinted';

const HOVER: Record<RowSurface, string> = {
  plain: 'var(--accent-100)',
  tinted: 'var(--accent-200)',
};

const ACTIVE: Record<RowSurface, string> = {
  plain: 'var(--accent-200)',
  tinted: 'var(--accent-300)',
};

// on a tinted card --accent-200 is almost invisible (1.15:1) and matches the
// hover colour, so its dividers use a see-through --accent-300 instead
export const ROW_DIVIDER: Record<RowSurface, string> = {
  plain: 'var(--accent-200)',
  tinted: 'rgba(var(--accent-300-base), 0.6)',
};

export const rowStates = (
  selected = false,
  clickable = true,
  surface: RowSurface = 'plain'
) => ({
  cursor: clickable ? 'pointer' : 'default',
  transition: 'background-color 0.15s ease',
  backgroundColor: selected ? 'var(--accent-150)' : 'transparent',
  '&:hover': {
    backgroundColor: selected ? 'var(--accent-200)' : HOVER[surface],
  },
  '&:active': {
    backgroundColor: selected ? 'var(--accent-300)' : ACTIVE[surface],
  },
  '&:focus-visible': {
    outline: '2px solid var(--accent-main)',
    outlineOffset: '-2px',
  },
});

export const clickableRow = (action: VoidFunction) => ({
  role: 'button',
  tabIndex: 0,
  onClick: action,
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
    // keys pressed on a checkbox or button inside the row stay theirs
    if (event.target !== event.currentTarget) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    action();
  },
});
