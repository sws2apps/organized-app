import { getCSSPropertyValue } from '@utils/common';

// Provider and data credits are part of a map export, not the interactive controls.
export const MAP_EXPORT_ATTRIBUTION =
  '© OpenFreeMap · © OpenMapTiles · © OpenStreetMap contributors · openstreetmap.org/copyright';

// small print in the bottom-left corner, without a box; `reserved` is the
// share of the height a label covers at the bottom. It wraps at the separators
// so it stays clear of the badges in the bottom-right corner
export const paintMapAttribution = (
  canvas: HTMLCanvasElement,
  printedLongSide: number,
  reserved = 0
) => {
  const context = canvas.getContext('2d');
  if (!context) return;

  // Six PDF points on the intended sheet, independent of capture resolution.
  const fontSize =
    (6 * Math.max(canvas.width, canvas.height)) / printedLongSide;
  const inset = fontSize / 2;
  const maxWidth = canvas.width * 0.55;
  context.save();
  context.font = `${fontSize}px sans-serif`;
  context.textBaseline = 'bottom';
  context.fillStyle = getCSSPropertyValue('--grey-350') || 'rgb(117, 117, 117)';

  const lines: string[] = [];
  for (const part of MAP_EXPORT_ATTRIBUTION.split(' · ')) {
    const joined = lines.length ? `${lines.at(-1)} · ${part}` : part;
    if (lines.length && context.measureText(joined).width <= maxWidth)
      lines[lines.length - 1] = joined;
    else lines.push(part);
  }

  const bottom = canvas.height * (1 - reserved) - inset;
  lines.forEach((line, index) =>
    context.fillText(
      line,
      inset,
      bottom - (lines.length - 1 - index) * fontSize * 1.2,
      maxWidth
    )
  );
  context.restore();
};
