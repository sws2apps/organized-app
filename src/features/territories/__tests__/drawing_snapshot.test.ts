import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { GeoJSONStoreFeatures } from 'terra-draw';
import {
  isDrawingGuide,
  pendingSplitLine,
} from '@features/territories/map/drawing_snapshot';

const line = (
  coordinates: number[][],
  currentlyDrawing = true
): GeoJSONStoreFeatures => ({
  id: 'cut',
  type: 'Feature',
  properties: { mode: 'linestring', currentlyDrawing },
  geometry: { type: 'LineString', coordinates },
});

test('drawing handles never become territory markers; real pins remain', () => {
  const point: GeoJSONStoreFeatures = {
    id: 'point',
    type: 'Feature',
    properties: { mode: 'point', kind: 'pin' },
    geometry: { type: 'Point', coordinates: [1, 2] },
  };
  assert.equal(isDrawingGuide(point), false);
  for (const key of [
    'selectionPoint',
    'midPoint',
    'closingPoint',
    'snappingPoint',
    'coordinatePoint',
  ]) {
    assert.equal(
      isDrawingGuide({ ...point, properties: { [key]: true } }),
      true,
      key
    );
  }
});

test('Split requires two distinct placed points and excludes the cursor preview', () => {
  assert.deepEqual(pendingSplitLine([]), []);
  assert.deepEqual(
    pendingSplitLine([
      line([
        [0, 0],
        [10, 10],
      ]),
    ]),
    []
  );
  assert.deepEqual(
    pendingSplitLine([
      line([
        [0, 0],
        [0, 0],
        [10, 10],
      ]),
    ]),
    []
  );
  assert.deepEqual(
    pendingSplitLine([
      line([
        [0, 0],
        [2, 2],
        [10, 10],
      ]),
    ]),
    [
      [0, 0],
      [2, 2],
    ]
  );
  assert.deepEqual(
    pendingSplitLine([
      line(
        [
          [0, 0],
          [2, 2],
        ],
        false
      ),
    ]),
    []
  );
});
