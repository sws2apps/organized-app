export const MAX_MAP_TILES = 12000;
export type Bounds = [number, number, number, number];
const tileX = (longitude: number, zoom: number) =>
  Math.floor(((longitude + 180) / 360) * 2 ** zoom);
const tileY = (latitude: number, zoom: number) => {
  const radians =
    (Math.max(-85.0511, Math.min(85.0511, latitude)) * Math.PI) / 180;
  return Math.floor(
    ((1 - Math.asinh(Math.tan(radians)) / Math.PI) / 2) * 2 ** zoom
  );
};
export const tileUrls = (
  template: string,
  bounds: Bounds,
  minZoom = 0,
  maxZoom = 14,
  scheme = 'xyz'
) => {
  const [west, south, east, north] = bounds;
  if (
    !bounds.every(Number.isFinite) ||
    west > east ||
    south > north ||
    west < -180 ||
    east > 180
  )
    throw new Error('Invalid map area.');
  const result: string[] = [];
  // Native vector detail is normally z14. It can be overzoomed offline.
  for (let z = Math.max(0, minZoom); z <= Math.min(14, maxZoom); z++) {
    const max = 2 ** z - 1;
    const clamp = (value: number) => Math.max(0, Math.min(max, value));
    const x0 = clamp(tileX(west, z) - 1),
      x1 = clamp(tileX(east, z) + 1);
    const y0 = clamp(tileY(north, z) - 1),
      y1 = clamp(tileY(south, z) + 1);
    if (result.length + (x1 - x0 + 1) * (y1 - y0 + 1) > MAX_MAP_TILES)
      throw new Error(
        'This area is too large. Use a smaller congregation boundary.'
      );
    for (let x = x0; x <= x1; x++)
      for (let y = y0; y <= y1; y++)
        result.push(
          template
            .replaceAll('%7B', '{')
            .replaceAll('%7D', '}')
            .replace('{z}', String(z))
            .replace('{x}', String(x))
            .replace('{y}', String(scheme === 'tms' ? max - y : y))
        );
  }
  return result;
};
