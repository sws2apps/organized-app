import polygonClipping, { MultiPolygon, Polygon } from 'polygon-clipping';
import { Territory, TerritoryBoundary } from '@definition/territory';
import { closedRing } from '@features/territories/map/helpers';

// pieces smaller than this, or thin as a drawing seam, are hand-drawing
// noise along shared borders, not real gaps or overlaps
const MIN_AREA = 150;
const MIN_ROUNDNESS = 0.04;

type Box = [number, number, number, number];

const boxOf = (ring: TerritoryBoundary): Box => {
  const xs = ring.map(([x]) => x);
  const ys = ring.map(([, y]) => y);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
};

const touches = (a: Box, b: Box) =>
  a[0] <= b[2] && b[0] <= a[2] && a[1] <= b[3] && b[1] <= a[3];

// square metres and metres on a flat local projection, close enough here
const measure = (polygon: Polygon) => {
  const lat = polygon[0][0][1];
  const kx = 111320 * Math.cos((lat * Math.PI) / 180);
  const ky = 110540;
  let area = 0;
  let perimeter = 0;
  polygon.forEach((ring, index) => {
    let ringArea = 0;
    for (let i = 0; i < ring.length - 1; i++) {
      const [x1, y1] = ring[i];
      const [x2, y2] = ring[i + 1];
      ringArea += x1 * kx * (y2 * ky) - x2 * kx * (y1 * ky);
      perimeter += Math.hypot((x2 - x1) * kx, (y2 - y1) * ky);
    }
    area += (index === 0 ? 1 : -1) * Math.abs(ringArea / 2);
  });
  return { area, perimeter };
};

const meaningful = (polygon: Polygon) => {
  const { area, perimeter } = measure(polygon);
  return (
    area >= MIN_AREA && (4 * Math.PI * area) / perimeter ** 2 >= MIN_ROUNDNESS
  );
};

export type CoverageProblems = {
  gaps: Polygon[];
  overlaps: Polygon[];
};

// where the territories leave the congregation area uncovered, and where
// two of them claim the same ground
export const coverageProblems = (
  congregation: TerritoryBoundary | undefined,
  territories: Territory[]
): CoverageProblems => {
  const shapes = territories
    .filter((territory) => (territory.boundary?.length ?? 0) >= 3)
    .map((territory) => {
      const ring = closedRing(territory.boundary!);
      return { polygon: [ring] as Polygon, box: boxOf(ring) };
    });

  let gaps: MultiPolygon = [];
  if (congregation && congregation.length >= 3) {
    gaps = polygonClipping.difference(
      [closedRing(congregation)] as Polygon,
      ...shapes.map((shape) => shape.polygon)
    );
  }

  const overlaps: Polygon[] = [];
  for (let i = 0; i < shapes.length; i++) {
    for (let j = i + 1; j < shapes.length; j++) {
      if (!touches(shapes[i].box, shapes[j].box)) continue;
      overlaps.push(
        ...polygonClipping.intersection(shapes[i].polygon, shapes[j].polygon)
      );
    }
  }

  return {
    gaps: gaps.filter(meaningful),
    overlaps: overlaps.filter(meaningful),
  };
};

const WORLD: [number, number][] = [
  [-180, -85],
  [180, -85],
  [180, 85],
  [-180, 85],
  [-180, -85],
];

// the problems as map data: a veil over the world with each problem cut
// out, so only they stay clear, and the problems themselves to outline
export const coverageCollection = ({
  gaps,
  overlaps,
}: CoverageProblems): GeoJSON.FeatureCollection => ({
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { kind: 'veil' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          WORLD,
          ...[...gaps, ...overlaps].map((polygon) => [...polygon[0]].reverse()),
        ],
      },
    },
    ...gaps.map((polygon) => ({
      type: 'Feature' as const,
      properties: { kind: 'gap' },
      geometry: { type: 'Polygon' as const, coordinates: polygon },
    })),
    ...overlaps.map((polygon) => ({
      type: 'Feature' as const,
      properties: { kind: 'overlap' },
      geometry: { type: 'Polygon' as const, coordinates: polygon },
    })),
  ],
});
