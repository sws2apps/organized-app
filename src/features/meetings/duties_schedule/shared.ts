// Keep the assignment grid aligned with the Cleaning editor.
export const DUTY_NAME_WIDTH = 240;
export const DUTY_FIELD_MIN_WIDTH = 200;
export const DUTY_FIELD_GAP = 8;

export const dutyFieldColumns = (count: number) => {
  if (count === 1) return 12;
  if (count % 3 === 0) return 4;
  return count % 2 === 0 ? 6 : 4;
};

export const dutyFieldsLayout = (count: number) => ({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  gap: 'var(--dialog-gap-mobile) var(--dialog-header-gap)',
  [`@container (min-width: ${DUTY_FIELD_MIN_WIDTH * 2 + DUTY_FIELD_GAP}px)`]: {
    gridTemplateColumns: `repeat(${Math.min(2, count)}, minmax(0, 1fr))`,
  },
  [`@container (min-width: ${DUTY_FIELD_MIN_WIDTH * 3 + DUTY_FIELD_GAP * 2}px)`]:
    {
      gridTemplateColumns: `repeat(${12 / dutyFieldColumns(count)}, minmax(0, 1fr))`,
    },
});
