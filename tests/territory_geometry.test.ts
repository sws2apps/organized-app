import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { TerritoryBoundary } from '../src/definition/territory';
import {
  combineTerritoryBoundaries,
  splitTerritoryBoundary,
  territoryBoundaryArea,
} from '../src/utils/territory_geometry';

const rectangle = (
  west: number,
  south: number,
  east: number,
  north: number
): TerritoryBoundary => [
  [west, south],
  [east, south],
  [east, north],
  [west, north],
  [west, south],
];
const boundary = rectangle(6, 51, 6.01, 51.01);

test('splitting and combining preserves the original area without a gap', () => {
  for (const line of [
    [
      [6.005, 50.99],
      [6.005, 51.02],
    ],
    [
      [5.99, 51.005],
      [6.02, 51.005],
    ],
    [
      [6, 51],
      [6.01, 51.01],
    ],
    [
      [6.002, 51],
      [6.008, 51.01],
    ],
  ] as [[number, number], [number, number]][]) {
    const split = splitTerritoryBoundary(boundary, line);
    assert.ok(!('error' in split), JSON.stringify(split));
    const joined = combineTerritoryBoundaries([split.first, split.second]);
    assert.ok(!('error' in joined), JSON.stringify(joined));
    assert.ok(
      Math.abs(
        territoryBoundaryArea(joined.boundary) - territoryBoundaryArea(boundary)
      ) < 1e-12
    );
    assert.ok(
      Math.abs(
        territoryBoundaryArea(split.first) +
          territoryBoundaryArea(split.second) -
          territoryBoundaryArea(boundary)
      ) < 1e-12
    );
  }
});

test('outside, tangent, and zero-length cuts are rejected', () => {
  for (const line of [
    [
      [6.02, 51],
      [6.02, 51.01],
    ],
    [
      [6, 51],
      [6.01, 51],
    ],
    [
      [6.005, 51.005],
      [6.005, 51.005],
    ],
  ] as [[number, number], [number, number]][]) {
    assert.deepEqual(splitTerritoryBoundary(boundary, line), {
      error: 'cross',
    });
  }
});

test('invalid, empty, self-crossing, and nonfinite borders fail without throwing', () => {
  for (const ring of [
    [],
    [[6, 51]],
    [
      [6, 51],
      [6, 51],
      [6, 51],
    ],
    [
      [6, 51],
      [NaN, 51],
      [6, 52],
    ],
    [
      [6, 51],
      [181, 51],
      [6, 52],
    ],
    [
      [6, 51],
      [7, 52],
      [6, 52],
      [7, 51],
      [6, 51],
    ],
  ] as TerritoryBoundary[]) {
    assert.deepEqual(
      splitTerritoryBoundary(ring, [
        [6, 51],
        [7, 52],
      ]),
      { error: 'invalid' }
    );
    assert.deepEqual(combineTerritoryBoundaries([boundary, ring]), {
      error: 'invalid',
    });
  }
  assert.deepEqual(combineTerritoryBoundaries([boundary]), {
    error: 'invalid',
  });
});

test('combining refuses separated or corner-touching territories', () => {
  assert.deepEqual(
    combineTerritoryBoundaries([boundary, rectangle(6.02, 51, 6.03, 51.01)]),
    { error: 'apart' }
  );
  assert.deepEqual(
    combineTerritoryBoundaries([boundary, rectangle(6.01, 51.01, 6.02, 51.02)]),
    { error: 'apart' }
  );
});

test('combining preserves holes by refusing a border format that cannot represent them', () => {
  const frame = [
    rectangle(6, 51, 6.03, 51.01),
    rectangle(6, 51.02, 6.03, 51.03),
    rectangle(6, 51, 6.01, 51.03),
    rectangle(6.02, 51, 6.03, 51.03),
  ];
  assert.deepEqual(combineTerritoryBoundaries(frame), { error: 'hole' });
});

test('a concave cut that creates more than two pieces requires a different cut', () => {
  const u: TerritoryBoundary = [
    [6, 51],
    [6.03, 51],
    [6.03, 51.03],
    [6.02, 51.03],
    [6.02, 51.01],
    [6.01, 51.01],
    [6.01, 51.03],
    [6, 51.03],
    [6, 51],
  ];
  assert.deepEqual(
    splitTerritoryBoundary(u, [
      [6, 51.02],
      [6.03, 51.02],
    ]),
    { error: 'cross' }
  );
});

test('border orientation and open rings do not change the result', () => {
  const split = splitTerritoryBoundary(boundary.slice(0, -1).reverse(), [
    [6.005, 51],
    [6.005, 51.01],
  ]);
  assert.ok(!('error' in split));
  assert.ok(
    !('error' in combineTerritoryBoundaries([split.second, split.first]))
  );
});

test('a bent cut preserves all land and recombines without a seam', () => {
  const split = splitTerritoryBoundary(boundary, [
    [5.99, 51.002],
    [6.005, 51.008],
    [6.02, 51.002],
  ]);
  assert.ok(!('error' in split));
  const combined = combineTerritoryBoundaries([split.first, split.second]);
  assert.ok(!('error' in combined));
  assert.ok(
    Math.abs(
      territoryBoundaryArea(combined.boundary) - territoryBoundaryArea(boundary)
    ) < 1e-12
  );
});

test('an unfinished cut inside the territory must reach the other edge', () => {
  assert.deepEqual(
    splitTerritoryBoundary(boundary, [
      [5.99, 51.005],
      [6.005, 51.005],
    ]),
    { error: 'cross' }
  );
});
