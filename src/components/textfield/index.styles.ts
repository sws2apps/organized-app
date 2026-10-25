export const centeredFieldLabel = (
  height: number,
  inset = 'var(--field-content-inset)'
) => ({
  // Keep MUI's fixed anchor and transform transition in both label states.
  top: 0,
  left: 0,
  transform: `translate(${inset}, calc(${height / 2}px - 50%)) scale(1)`,
  maxWidth: `calc(100% - 2 * ${inset})`,
  // The RTL plugin cannot flip translations containing CSS variables.
  '&:dir(rtl)': {
    transform: `translate(calc(-1 * ${inset}), calc(${height / 2}px - 50%)) scale(1)`,
  },
});
