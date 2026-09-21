import { Territory, TerritoryBoundary } from '@definition/territory';

export const cssVar = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const heatColor = (days: number) => {
  if (days <= 120) return cssVar('--green-main');
  if (days <= 240) return cssVar('--orange-main');
  if (days <= 365) return cssVar('--orange-dark');
  return cssVar('--red-main');
};

export const statusColor = (territory: Territory) => {
  if (territory.status === 'overdue') return cssVar('--red-main');
  if (territory.status === 'in_work') return cssVar('--orange-main');

  return cssVar('--accent-main');
};

export type BoundaryFeature = GeoJSON.Feature<GeoJSON.Polygon>;

const boundaryFeature = (
  territory: Territory,
  options: {
    heatmap: boolean;
    selected: boolean;
    showNumbers?: boolean;
    showHouseholds?: boolean;
  }
): BoundaryFeature => ({
  type: 'Feature',
  id: territory.id,
  properties: {
    id: territory.id,
    number: territory.number,
    label: [
      options.showNumbers === false ? '' : territory.number,
      options.showHouseholds ? `${territory.households}` : '',
    ]
      .filter(Boolean)
      .join('\n'),
    selected: options.selected,
    color: options.heatmap
      ? heatColor(territory.daysSinceCovered)
      : statusColor(territory),
  },
  geometry: { type: 'Polygon', coordinates: [territory.boundary ?? []] },
});

export const boundaryCollection = (
  territories: Territory[],
  options: {
    heatmap: boolean;
    selectedId?: string;
    hiddenId?: string;
    showNumbers?: boolean;
    showHouseholds?: boolean;
  }
): GeoJSON.FeatureCollection<GeoJSON.Polygon> => ({
  type: 'FeatureCollection',
  features: territories
    .filter(
      (territory) =>
        territory.boundary?.length && territory.id !== options.hiddenId
    )
    .map((territory) =>
      boundaryFeature(territory, {
        heatmap: options.heatmap,
        selected: territory.id === options.selectedId,
        showNumbers: options.showNumbers,
        showHouseholds: options.showHouseholds,
      })
    ),
});

export const boundaryBounds = (boundary: TerritoryBoundary) =>
  boundary.reduce(
    (bounds, [lng, lat]) => [
      Math.min(bounds[0], lng),
      Math.min(bounds[1], lat),
      Math.max(bounds[2], lng),
      Math.max(bounds[3], lat),
    ],
    [Infinity, Infinity, -Infinity, -Infinity]
  ) as [number, number, number, number];

// terra draw hands back a polygon ring; the store keeps it closed
export const toBoundary = (
  coordinates: GeoJSON.Position[]
): TerritoryBoundary => {
  const ring = coordinates.map(([lng, lat]) => [lng, lat] as [number, number]);

  const [first] = ring;
  const last = ring[ring.length - 1];

  if (first && last && (first[0] !== last[0] || first[1] !== last[1])) {
    ring.push(first);
  }

  return ring;
};

export const lineCollection = (
  territories: Territory[]
): GeoJSON.FeatureCollection<GeoJSON.LineString> => ({
  type: 'FeatureCollection',
  features: territories.flatMap((territory) =>
    (territory.mapLines ?? []).map((line) => ({
      type: 'Feature' as const,
      id: line.id,
      properties: { style: line.style, territory: territory.id },
      geometry: { type: 'LineString' as const, coordinates: line.path },
    }))
  ),
});

export const markerCollection = (
  territories: Territory[]
): GeoJSON.FeatureCollection<GeoJSON.Point> => ({
  type: 'FeatureCollection',
  features: territories.flatMap((territory) =>
    (territory.mapMarkers ?? []).map((marker) => ({
      type: 'Feature' as const,
      id: marker.id,
      properties: {
        kind: marker.kind,
        text: marker.text ?? '',
        territory: territory.id,
      },
      geometry: { type: 'Point' as const, coordinates: marker.position },
    }))
  ),
});
