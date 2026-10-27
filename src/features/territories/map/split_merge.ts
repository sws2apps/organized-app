import type { TerritoryBoundary } from '@definition/territory';
import {
  combineTerritoryBoundaries,
  splitTerritoryBoundary,
  territoryBoundaryArea,
} from '@utils/territory_geometry';
export { suggestSplitTerritoryNumber as nextNumber } from '@utils/territory';

export type SplitResult =
  | { larger: TerritoryBoundary; smaller: TerritoryBoundary }
  | { error: 'cross' };

export const splitBoundary = (
  boundary: TerritoryBoundary,
  line: [number, number][]
): SplitResult => {
  const result = splitTerritoryBoundary(boundary, line);
  if ('error' in result) return { error: 'cross' };
  const [larger, smaller] = [result.first, result.second].sort(
    (a, b) => territoryBoundaryArea(b) - territoryBoundaryArea(a)
  );
  return { larger, smaller };
};

export type MergeResult =
  | { boundary: TerritoryBoundary }
  | { error: 'apart' | 'hole' };
export const mergeBoundaries = (
  boundary: TerritoryBoundary,
  others: TerritoryBoundary[]
): MergeResult => {
  const result = combineTerritoryBoundaries([boundary, ...others]);
  if ('error' in result)
    return { error: result.error === 'hole' ? 'hole' : 'apart' };
  return result;
};
