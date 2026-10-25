import type { GeoJSONStoreFeatures } from 'terra-draw';

export const isDrawingGuide = ({ properties }: GeoJSONStoreFeatures) =>
  !!(
    properties.selectionPoint ||
    properties.midPoint ||
    properties.closingPoint ||
    properties.snappingPoint ||
    properties.coordinatePoint
  );

export const pendingSplitLine = (
  features: GeoJSONStoreFeatures[]
): [number, number][] => {
  const line = features.find(
    (feature) =>
      feature.geometry.type === 'LineString' &&
      feature.properties.currentlyDrawing
  );
  if (line?.geometry.type !== 'LineString') return [];
  // Terra Draw keeps a final cursor-following coordinate until the line finishes.
  const placed = line.geometry.coordinates
    .slice(0, -1)
    .map(([lng, lat]): [number, number] => [lng, lat]);
  return placed.length >= 2 &&
    placed.some(([lng, lat]) => lng !== placed[0][0] || lat !== placed[0][1])
    ? placed
    : [];
};
