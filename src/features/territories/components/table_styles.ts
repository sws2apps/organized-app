import { KeyboardEvent } from 'react';

export const rowStates = (selected = false, clickable = true) => ({
  cursor: clickable ? 'pointer' : 'default',
  transition: 'background-color 0.15s ease',
  backgroundColor: selected ? 'var(--accent-150)' : 'transparent',
  '&:hover': {
    backgroundColor: selected ? 'var(--accent-200)' : 'var(--accent-100)',
  },
  '&:active': {
    backgroundColor: selected ? 'var(--accent-300)' : 'var(--accent-200)',
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
