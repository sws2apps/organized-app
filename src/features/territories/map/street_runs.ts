// Vector tiles can put both endpoints outside a territory even when the road crosses it.
// Clip each segment before looking for a place for its name.
const EPSILON = 1e-12;
const cross = (ax: number, ay: number, bx: number, by: number) =>
  ax * by - ay * bx;

const contains = ([x, y]: number[], ring: number[][]) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [ax, ay] = ring[j];
    const [bx, by] = ring[i];
    if (
      Math.abs(cross(x - ax, y - ay, bx - ax, by - ay)) <= EPSILON &&
      x >= Math.min(ax, bx) &&
      x <= Math.max(ax, bx) &&
      y >= Math.min(ay, by) &&
      y <= Math.max(ay, by)
    )
      return true;
    if (ay > y !== by > y && x < ((bx - ax) * (y - ay)) / (by - ay) + ax)
      inside = !inside;
  }
  return inside;
};

const segmentCuts = (a: number[], b: number[], ring: number[][]) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const cuts = [0, 1];
  for (let j = 0; j < ring.length; j++) {
    const c = ring[j];
    const d = ring[(j + 1) % ring.length];
    const ex = d[0] - c[0];
    const ey = d[1] - c[1];
    const denominator = cross(dx, dy, ex, ey);
    if (Math.abs(denominator) <= EPSILON) continue;
    const t = cross(c[0] - a[0], c[1] - a[1], ex, ey) / denominator;
    const u = cross(c[0] - a[0], c[1] - a[1], dx, dy) / denominator;
    if (t > 0 && t < 1 && u >= 0 && u <= 1) cuts.push(t);
  }
  return [...new Set(cuts)].sort((a, b) => a - b);
};

export const streetRuns = (line: number[][], ring: number[][]) => {
  const runs: number[][][] = [];
  let run: number[][] = [];
  for (let i = 1; i < line.length; i++) {
    const a = line[i - 1];
    const b = line[i];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    if (!dx && !dy) continue;
    const sorted = segmentCuts(a, b, ring);
    const at = (t: number) => [a[0] + dx * t, a[1] + dy * t];
    for (let j = 1; j < sorted.length; j++) {
      const start = sorted[j - 1];
      const end = sorted[j];
      if (contains(at((start + end) / 2), ring)) {
        if (!run.length) run.push(at(start));
        run.push(at(end));
      } else if (run.length) {
        runs.push(run);
        run = [];
      }
    }
  }
  if (run.length) runs.push(run);
  return runs;
};

// Compare distance, not vertex count: a straight road can have only two vertices.
const distance = (a: number[], b: number[]) =>
  Math.hypot(
    (b[0] - a[0]) * Math.cos(((a[1] + b[1]) * Math.PI) / 360),
    b[1] - a[1]
  );
export const streetLength = (line: number[][]) =>
  line
    .slice(1)
    .reduce((sum, point, index) => sum + distance(line[index], point), 0);

export const streetMidpoint = (line: number[][]) => {
  let remaining = streetLength(line) / 2;
  for (let i = 1; i < line.length; i++) {
    const length = distance(line[i - 1], line[i]);
    if (length > 0 && remaining <= length) {
      const fraction = remaining / length;
      return line[i - 1].map(
        (coordinate, axis) =>
          coordinate + (line[i][axis] - coordinate) * fraction
      );
    }
    remaining -= length;
  }
  return line[0];
};
