// PDF points, on ISO A4 in either orientation
export const A4 = { width: 595.28, height: 841.89 };
export const S12 = { width: 467, height: 301 };
// Two A5 halves on A4; keep content inside a printer-safe inset.
export const A5_HORIZONTAL = { width: A4.width, height: A4.height / 2 };
export const A5_VERTICAL = { width: A4.height / 2, height: A4.width };

// 8 mm in PDF points. Physical print geometry is independent of screen CSS.
export const PRINT_MARGIN = (8 * 72) / 25.4;
export const printableA5 = (size: { width: number; height: number }) => ({
  width: size.width - PRINT_MARGIN * 2,
  height: size.height - PRINT_MARGIN * 2,
});

// the white label floating over the bottom of an A5 map, with its margin
export const MAP_LABEL_SPACE = 58;

// Fixed PDF cells keep long telephone lists inside the front's map frame.
export const PHONE_GRID = { columns: 4, gap: 4, cellHeight: 25 };

export const phoneGridLayout = (
  height: number,
  total: number,
  width: number,
  minCellWidth: number
) => {
  const columns = Math.max(
    1,
    Math.min(
      PHONE_GRID.columns,
      Math.floor((width + PHONE_GRID.gap) / (minCellWidth + PHONE_GRID.gap))
    )
  );
  const rows = Math.max(
    0,
    Math.floor(
      (height + PHONE_GRID.gap) / (PHONE_GRID.cellHeight + PHONE_GRID.gap)
    )
  );
  const capacity = rows * columns;
  const shown = total > capacity ? Math.max(0, capacity - 1) : total;
  return { columns, shown, remaining: total - shown };
};
