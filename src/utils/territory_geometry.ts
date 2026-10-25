import polygonClipping from 'polygon-clipping';
import type { Pair } from 'polygon-clipping';
import type { TerritoryBoundary } from '@definition/territory';

type GeometryError = 'invalid' | 'cross' | 'apart' | 'hole';
type GeometryResult<T> = T | { error: GeometryError };

const samePosition = (a: Pair, b: Pair) => a[0] === b[0] && a[1] === b[1];

const validPosition = (point: Pair) =>
  point.length === 2 &&
  point.every(Number.isFinite) &&
  Math.abs(point[0]) <= 180 &&
  Math.abs(point[1]) <= 90;

// Translate to the first vertex before summing to avoid cancellation at large
// longitude/latitude values. Only comparisons use this planar area.
export const territoryBoundaryArea = (ring: TerritoryBoundary) => {
  if (ring.length < 3) return 0;
  const [x, y] = ring[0];
  return Math.abs(
    ring.reduce((sum, point, index) => {
      const next = ring[(index + 1) % ring.length];
      return (
        sum + (point[0] - x) * (next[1] - y) - (next[0] - x) * (point[1] - y)
      );
    }, 0) / 2
  );
};

const normalizedBoundary = (boundary: TerritoryBoundary) => {
  if (boundary.length < 3 || !boundary.every(validPosition)) return;
  const longitudes = boundary.map(([lng]) => lng);
  if (Math.max(...longitudes) - Math.min(...longitudes) >= 180) return;

  const area = territoryBoundaryArea(boundary);
  if (!area) return;
  const polygons = polygonClipping.union([boundary]);
  if (polygons.length !== 1 || polygons[0].length !== 1) return;
  const ring = polygons[0][0];
  if (Math.abs(territoryBoundaryArea(ring) - area) > area * 1e-9) return;
  return ring;
};

// Close each side of the cut outside the territory. The two parts share the
// original line, so recombining them never leaves a strip of missing land.
export const splitTerritoryBoundary = (
  boundary: TerritoryBoundary,
  line: Pair[]
): GeometryResult<{ first: TerritoryBoundary; second: TerritoryBoundary }> => {
  try {
    const ring = normalizedBoundary(boundary);
    if (!ring || line.length < 2 || !line.every(validPosition))
      return { error: 'invalid' };
    if (
      line.some(
        (point, index) => index > 0 && samePosition(point, line[index - 1])
      )
    )
      return { error: 'cross' };

    // The visible cut must reach both edges; do not silently extend an unfinished cut inside the territory.
    const strictlyInside = ([x, y]: Pair) => {
      let inside = false;
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const [ax, ay] = ring[j];
        const [bx, by] = ring[i];
        const cross = (x - ax) * (by - ay) - (y - ay) * (bx - ax);
        if (
          Math.abs(cross) < 1e-14 &&
          x >= Math.min(ax, bx) &&
          x <= Math.max(ax, bx) &&
          y >= Math.min(ay, by) &&
          y <= Math.max(ay, by)
        )
          return false;
        if (ay > y !== by > y && x < ((bx - ax) * (y - ay)) / (by - ay) + ax)
          inside = !inside;
      }
      return inside;
    };
    if (strictlyInside(line[0]) || strictlyInside(line.at(-1)!))
      return { error: 'cross' };
    const points = [...ring, ...line];
    const xs = points.map(([x]) => x);
    const ys = points.map(([, y]) => y);
    const margin = Math.max(
      Math.max(...xs) - Math.min(...xs),
      Math.max(...ys) - Math.min(...ys)
    );
    const west = Math.min(...xs) - margin;
    const east = Math.max(...xs) + margin;
    const south = Math.min(...ys) - margin;
    const north = Math.max(...ys) + margin;
    const corners: Pair[] = [
      [west, south],
      [east, south],
      [east, north],
      [west, north],
    ];
    const extend = (from: Pair, previous: Pair) => {
      const dx = from[0] - previous[0];
      const dy = from[1] - previous[1];
      const horizontalEdge = dx > 0 ? east : west;
      const verticalEdge = dy > 0 ? north : south;
      const tx = dx === 0 ? Infinity : (horizontalEdge - from[0]) / dx;
      const ty = dy === 0 ? Infinity : (verticalEdge - from[1]) / dy;
      const t = Math.min(tx, ty);
      const point: Pair = [from[0] + dx * t, from[1] + dy * t];
      const horizontalIndex = dx > 0 ? 1 : 3;
      const verticalIndex = dy > 0 ? 2 : 0;
      const edge = tx < ty ? horizontalIndex : verticalIndex;
      return { point, edge };
    };
    const start = extend(line[0], line[1]);
    const end = extend(line.at(-1)!, line.at(-2)!);
    // Returning through the same outer edge cannot partition this envelope.
    if (start.edge === end.edge) return { error: 'cross' };
    const path = [start.point, ...line, end.point];
    const closeSide = (forward: boolean): Pair[] => {
      const outside: Pair[] = [];
      let edge = end.edge;
      while (edge !== start.edge) {
        outside.push(corners[(edge + (forward ? 1 : 0)) % 4]);
        edge = (edge + (forward ? 1 : 3)) % 4;
      }
      return [...path, ...outside, start.point];
    };
    const first = polygonClipping.intersection([ring], [closeSide(true)]);
    const second = polygonClipping.intersection([ring], [closeSide(false)]);
    if (
      first.length !== 1 ||
      second.length !== 1 ||
      first[0].length !== 1 ||
      second[0].length !== 1
    )
      return { error: 'cross' };
    const area = territoryBoundaryArea(ring);
    const firstArea = territoryBoundaryArea(first[0][0]);
    const secondArea = territoryBoundaryArea(second[0][0]);
    if (
      !firstArea ||
      !secondArea ||
      Math.abs(firstArea + secondArea - area) > area * 1e-9
    )
      return { error: 'cross' };
    return { first: first[0][0], second: second[0][0] };
  } catch {
    return { error: 'invalid' };
  }
};

export const combineTerritoryBoundaries = (
  boundaries: TerritoryBoundary[]
): GeometryResult<{ boundary: TerritoryBoundary }> => {
  try {
    if (boundaries.length < 2) return { error: 'invalid' };
    const rings = boundaries.map(normalizedBoundary);
    if (rings.some((ring) => !ring)) return { error: 'invalid' };
    const polygons = polygonClipping.union(
      [rings[0]!],
      ...rings.slice(1).map((ring) => [ring!])
    );
    if (polygons.length !== 1) return { error: 'apart' };
    if (polygons[0].length !== 1) return { error: 'hole' };
    return { boundary: polygons[0][0] };
  } catch {
    return { error: 'invalid' };
  }
};
