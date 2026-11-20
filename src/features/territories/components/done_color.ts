// "done" is green, except in the green schemes, where green is the accent:
// there it takes the blue scheme's accent instead
export const DONE_COLOR = {
  '--done': 'var(--green-main)',
  '[data-theme="green-light"] &': { '--done': 'rgb(59, 76, 163)' },
  '[data-theme="green-dark"] &': { '--done': 'rgb(139, 158, 254)' },
};
