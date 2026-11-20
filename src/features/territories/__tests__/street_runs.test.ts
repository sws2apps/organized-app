import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  streetRuns,
  streetLength,
  streetMidpoint,
} from '@features/territories/map/street_runs';

const boundary = [
  [0, 0],
  [4, 0],
  [4, 4],
  [0, 4],
  [0, 0],
];

test('a crossing road gets a label run even when both tile vertices are outside', () => {
  assert.deepEqual(
    streetRuns(
      [
        [-2, 2],
        [6, 2],
      ],
      boundary
    ),
    [
      [
        [0, 2],
        [4, 2],
      ],
    ]
  );
});

test('connected inside segments stay connected and boundary roads remain eligible', () => {
  assert.deepEqual(
    streetRuns(
      [
        [-2, 2],
        [2, 2],
        [6, 2],
      ],
      boundary
    ),
    [
      [
        [0, 2],
        [2, 2],
        [4, 2],
      ],
    ]
  );
  assert.deepEqual(
    streetRuns(
      [
        [-2, 0],
        [6, 0],
      ],
      boundary
    ),
    [
      [
        [0, 0],
        [4, 0],
      ],
    ]
  );
});

test('concave boundaries do not place a label across the outside gap', () => {
  const ring = [
    [0, 0],
    [4, 0],
    [4, 4],
    [3, 4],
    [3, 1],
    [1, 1],
    [1, 4],
    [0, 4],
  ];
  assert.deepEqual(
    streetRuns(
      [
        [-2, 2],
        [6, 2],
      ],
      ring
    ),
    [
      [
        [0, 2],
        [1, 2],
      ],
      [
        [3, 2],
        [4, 2],
      ],
    ]
  );
});

test('outside, tangent and zero-length streets create no label geometry', () => {
  assert.deepEqual(
    streetRuns(
      [
        [-2, 5],
        [6, 5],
      ],
      boundary
    ),
    []
  );
  assert.deepEqual(
    streetRuns(
      [
        [-1, 1],
        [1, -1],
      ],
      boundary
    ),
    []
  );
  assert.deepEqual(
    streetRuns(
      [
        [2, 2],
        [2, 2],
      ],
      boundary
    ),
    []
  );
});

test('longest run and midpoint depend on distance rather than tile vertex density', () => {
  const straight = [
    [0, 0],
    [4, 0],
  ];
  const dense = [
    [0, 0],
    [0.1, 0],
    [0.2, 0],
    [0.3, 0],
  ];
  assert.ok(streetLength(straight) > streetLength(dense));
  assert.deepEqual(
    streetMidpoint([
      [0, 0],
      [0.1, 0],
      [4, 0],
    ]),
    [2, 0]
  );
  assert.equal(streetLength([]), 0);
});

test('clipping works at real geographic coordinates without changing the map bounds', () => {
  const ring = [
    [6.48, 51.63],
    [6.49, 51.63],
    [6.49, 51.64],
    [6.48, 51.64],
  ];
  const original = structuredClone(ring);
  const result = streetRuns(
    [
      [6.47, 51.635],
      [6.5, 51.635],
    ],
    ring
  );
  assert.equal(result.length, 1);
  assert.ok(Math.abs(result[0][0][0] - 6.48) < 1e-10);
  assert.ok(Math.abs(result[0][1][0] - 6.49) < 1e-10);
  assert.deepEqual(ring, original);
});
