// Provider and data credits are part of a map export, not the interactive controls.
export const MAP_EXPORT_ATTRIBUTION =
  '© OpenMapTiles · © OpenStreetMap contributors · openstreetmap.org/copyright';

export const paintMapAttribution = (
  canvas: HTMLCanvasElement,
  printedLongSide: number
) => {
  const context = canvas.getContext('2d');
  if (!context) return;

  // Six PDF points on the intended sheet, independent of capture resolution.
  const fontSize = (6 * Math.max(canvas.width, canvas.height)) / printedLongSide;
  const inset = fontSize / 2;
  context.save();
  context.font = `${fontSize}px sans-serif`;
  context.textBaseline = 'top';
  const width = Math.min(
    context.measureText(MAP_EXPORT_ATTRIBUTION).width,
    canvas.width - inset * 4
  );
  const left = canvas.width - width - inset * 3;
  context.fillStyle = '#FFFFFF';
  context.fillRect(left, inset, width + inset * 2, fontSize + inset * 2);
  context.fillStyle = '#222222';
  context.fillText(MAP_EXPORT_ATTRIBUTION, left + inset, inset * 2, width);
  context.restore();
};
