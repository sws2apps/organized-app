import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as maplibregl from 'maplibre-gl';
import {
  TerraDraw,
  TerraDrawLineStringMode,
  TerraDrawPointMode,
  TerraDrawPolygonMode,
  TerraDrawSelectMode,
} from 'terra-draw';
import type { GeoJSONStoreFeatures, HexColor } from 'terra-draw';
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';
import {
  MapColor,
  PinType,
  Territory,
  TerritoryBoundary,
  TerritoryMapDraft,
} from '@definition/territory';
import { MAP_COLORS } from './constants';
import { roundPosition, toBoundary } from './helpers';

export type MapTool = 'move' | 'points' | 'shape' | 'line' | 'pin' | 'text';

export type EditScope = 'territory' | 'congregation';

type ShapeStyle = {
  border: MapColor | 'transparent';
  fill: MapColor | 'transparent';
};

const EMPTY_DRAFT: TerritoryMapDraft = {
  shapes: [],
  lines: [],
  markers: [],
};

const MODE_FOR: Record<MapTool, string> = {
  move: 'select',
  points: 'points',
  shape: 'polygon',
  line: 'linestring',
  pin: 'point',
  text: 'point',
};

const hex = (color: MapColor | 'transparent', fallback: MapColor) =>
  MAP_COLORS[color === 'transparent' ? fallback : color] as HexColor;

const BLUE = MAP_COLORS.blue as HexColor;

const isShape = (feature: GeoJSONStoreFeatures) =>
  feature.properties?.role === 'shape';

const fillColor = (feature: GeoJSONStoreFeatures) =>
  isShape(feature) ? hex(feature.properties.fill as MapColor, 'red') : BLUE;

const outlineColor = (feature: GeoJSONStoreFeatures) =>
  isShape(feature) ? hex(feature.properties.border as MapColor, 'red') : BLUE;

const fillOpacity = (feature: GeoJSONStoreFeatures) =>
  isShape(feature) && feature.properties.fill === 'transparent' ? 0 : 0.2;

const selectStyles = {
  selectedPolygonColor: fillColor,
  selectedPolygonOutlineColor: outlineColor,
  selectedPolygonFillOpacity: (feature: GeoJSONStoreFeatures) =>
    fillOpacity(feature) === 0 ? 0 : 0.3,
  selectedPolygonOutlineWidth: 3.5,
  selectedLineStringColor: BLUE,
  selectedLineStringWidth: 4,
  selectionPointColor: '#ffffff' as HexColor,
  selectionPointOutlineColor: BLUE,
  selectionPointWidth: 5,
  selectionPointOutlineWidth: 2,
  midPointColor: BLUE,
  midPointOutlineColor: '#ffffff' as HexColor,
  midPointWidth: 3,
  midPointOutlineWidth: 1,
};

const MOVE_FLAGS = {
  polygon: { feature: { draggable: true } },
  linestring: { feature: { draggable: true } },
  point: { feature: { draggable: true } },
};

const POINT_FLAGS = {
  polygon: {
    feature: {
      coordinates: {
        midpoints: { draggable: true },
        draggable: true,
        deletable: true,
      },
    },
  },
  linestring: {
    feature: {
      coordinates: {
        midpoints: { draggable: true },
        draggable: true,
        deletable: true,
      },
    },
  },
  point: { feature: { draggable: true } },
};

type Vertex = { id: string | number; index: number };

const PICK_DISTANCE = 12;

type Properties = Record<string, unknown>;

const position = roundPosition;

const readSnapshot = (features: GeoJSONStoreFeatures[]) => {
  const next: TerritoryMapDraft = { shapes: [], lines: [], markers: [] };

  for (const feature of features) {
    const properties = (feature.properties ?? {}) as Properties;

    // terra draw renders its own handles as points; they are not data
    if (properties.selectionPoint || properties.midPoint) continue;

    const geometry = feature.geometry;

    if (geometry.type === 'Polygon') {
      const path = toBoundary(geometry.coordinates[0]);

      if (properties.role === 'shape') {
        next.shapes.push({
          id: String(feature.id),
          path,
          border: (properties.border as ShapeStyle['border']) ?? 'red',
          fill: (properties.fill as ShapeStyle['fill']) ?? 'transparent',
          label: (properties.label as string) || undefined,
        });
      } else if (properties.role === 'boundary' || !next.boundary) {
        next.boundary = path;
      }
    }

    if (geometry.type === 'LineString') {
      next.lines.push({
        id: String(feature.id),
        path: geometry.coordinates.map(position),
        style: properties.lineStyle === 'dashed' ? 'dashed' : 'solid',
      });
    }

    if (geometry.type === 'Point') {
      const kind = properties.kind === 'text' ? 'text' : 'pin';

      next.markers.push({
        id: String(feature.id),
        kind,
        position: position(geometry.coordinates),
        text: (properties.label as string) || undefined,
        pinType: kind === 'pin' ? (properties.pinType as PinType) : undefined,
        color: (properties.color as MapColor) || undefined,
      });
    }
  }

  return next;
};

const useMapEditor = ({
  map,
  onStart,
}: {
  map: RefObject<maplibregl.Map | null>;
  onStart: (boundary?: TerritoryBoundary) => void;
}) => {
  const draw = useRef<TerraDraw>(null);

  // terra draw calls back outside React, so the current choices live in refs
  const options = useRef({
    tool: 'move' as MapTool,
    shape: { border: 'red', fill: 'transparent' } as ShapeStyle,
    lineStyle: 'solid' as 'solid' | 'dashed',
    pinType: 'normal' as PinType,
  });

  const [editing, setEditing] = useState(false);
  const [scope, setScope] = useState<EditScope>('territory');
  const [tool, setTool] = useState<MapTool>('move');
  const [shape, setShape] = useState<ShapeStyle>(options.current.shape);
  const [lineStyle, setLineStyle] = useState<'solid' | 'dashed'>('solid');
  const [pinType, setPinType] = useState<PinType>('normal');
  const [draft, setDraft] = useState<TerritoryMapDraft>(EMPTY_DRAFT);
  const [labelling, setLabelling] = useState<string | number>();
  const [selected, setSelected] = useState<string | number>();
  const [selectedStyle, setSelectedStyle] = useState<ShapeStyle>();

  const vertex = useRef<Vertex>(undefined);
  const vertexMarker = useRef<maplibregl.Marker>(null);

  const readDraft = useCallback(() => {
    if (draw.current) setDraft(readSnapshot(draw.current.getSnapshot()));
  }, []);

  const clearVertex = useCallback(() => {
    vertex.current = undefined;
    vertexMarker.current?.remove();
    vertexMarker.current = null;
  }, []);

  const stop = useCallback(() => {
    draw.current?.stop();
    draw.current = null;
  }, []);

  const start = useCallback(
    (nextScope: EditScope, target?: Territory, border?: TerritoryBoundary) => {
      const instance = map.current;
      if (!instance) return;

      const congregation = nextScope === 'congregation';
      const existing = congregation ? border : target?.boundary;

      stop();

      const terra = new TerraDraw({
        adapter: new TerraDrawMapLibreGLAdapter({ map: instance }),
        modes: [
          new TerraDrawPolygonMode({
            styles: {
              fillColor,
              outlineColor,
              fillOpacity,
              outlineWidth: 2.5,
            },
          }),
          new TerraDrawLineStringMode({
            styles: {
              lineStringColor: BLUE,
              lineStringWidth: 3,
            },
          }),
          new TerraDrawPointMode({
            styles: {
              pointColor: BLUE,
              pointWidth: 6,
              pointOutlineWidth: 2,
            },
          }),
          new TerraDrawSelectMode({
            flags: MOVE_FLAGS,
            styles: selectStyles,
          }),
          new TerraDrawSelectMode({
            modeName: 'points',
            flags: POINT_FLAGS,
            styles: selectStyles,
            keyEvents: {
              deselect: 'Escape',
              delete: null,
              rotate: null,
              scale: null,
            },
          }),
        ],
      });

      terra.start();

      terra.on('change', readDraft);

      terra.on('select', (id) => {
        const feature = terra.getSnapshotFeature(id);

        if (vertex.current && vertex.current.id !== id) clearVertex();

        setSelected(id);
        setSelectedStyle(
          feature && isShape(feature)
            ? {
                border: feature.properties.border as ShapeStyle['border'],
                fill: feature.properties.fill as ShapeStyle['fill'],
              }
            : undefined
        );
      });

      // clicking a point deselects and reselects the same drawing, so keep the picked point
      terra.on('deselect', () => {
        setSelected(undefined);
        setSelectedStyle(undefined);
      });

      terra.on('finish', (id) => {
        const { tool: current, shape: style, pinType: type } = options.current;

        if (current === 'shape') {
          const isBoundary = !terra
            .getSnapshot()
            .some(
              (feature) =>
                feature.id !== id &&
                feature.geometry.type === 'Polygon' &&
                feature.properties?.role === 'boundary'
            );

          if (congregation && !isBoundary) {
            terra.removeFeatures([id]);
            readDraft();
            return;
          }

          terra.updateFeatureProperties(
            id,
            isBoundary
              ? { role: 'boundary' }
              : { role: 'shape', border: style.border, fill: style.fill }
          );
        }

        if (current === 'shape' || current === 'line') {
          options.current.tool = 'points';
          setTool('points');

          setTimeout(() => {
            terra.setMode(MODE_FOR.points);
            if (terra.hasFeature(id)) terra.selectFeature(id, 'points');
          });
        }

        if (current === 'line') {
          terra.updateFeatureProperties(id, {
            lineStyle: options.current.lineStyle,
          });
        }

        if (current === 'pin') {
          terra.updateFeatureProperties(id, { kind: 'pin', pinType: type });
        }

        if (current === 'text') {
          terra.updateFeatureProperties(id, { kind: 'text', label: '' });
          setLabelling(id);
        }

        readDraft();
      });

      const loaded: GeoJSONStoreFeatures[] = [];

      if (existing?.length) {
        loaded.push({
          type: 'Feature',
          id: terra.getFeatureId(),
          properties: { mode: 'polygon', role: 'boundary' },
          geometry: {
            type: 'Polygon',
            coordinates: [existing.map(roundPosition)],
          },
        });
      }

      if (!congregation && target) {
        for (const item of target.mapShapes ?? []) {
          loaded.push({
            type: 'Feature',
            id: terra.getFeatureId(),
            properties: {
              mode: 'polygon',
              role: 'shape',
              border: item.border,
              fill: item.fill,
              label: item.label ?? '',
            },
            geometry: {
              type: 'Polygon',
              coordinates: [item.path.map(roundPosition)],
            },
          });
        }

        for (const line of target.mapLines ?? []) {
          loaded.push({
            type: 'Feature',
            id: terra.getFeatureId(),
            properties: { mode: 'linestring', lineStyle: line.style },
            geometry: {
              type: 'LineString',
              coordinates: line.path.map(roundPosition),
            },
          });
        }

        for (const marker of target.mapMarkers ?? []) {
          loaded.push({
            type: 'Feature',
            id: terra.getFeatureId(),
            properties: {
              mode: 'point',
              kind: marker.kind,
              label: marker.text ?? '',
              pinType: marker.pinType ?? 'normal',
              color: marker.color ?? '',
            },
            geometry: {
              type: 'Point',
              coordinates: roundPosition(marker.position),
            },
          });
        }
      }

      const startTool: MapTool = existing?.length ? 'points' : 'shape';

      options.current.tool = startTool;
      setTool(startTool);

      // a freshly started terra draw is static and rejects features until a mode runs
      terra.setMode(MODE_FOR[startTool]);

      if (loaded.length > 0) terra.addFeatures(loaded);

      if (existing?.length) terra.selectFeature(loaded[0].id!, 'points');

      draw.current = terra;

      setDraft({
        boundary: existing,
        shapes: congregation ? [] : (target?.mapShapes ?? []),
        lines: congregation ? [] : (target?.mapLines ?? []),
        markers: congregation ? [] : (target?.mapMarkers ?? []),
      });
      setScope(nextScope);
      setEditing(true);

      onStart(existing);
    },
    [map, stop, readDraft, onStart, clearVertex]
  );

  const pickTool = useCallback(
    (next: MapTool) => {
      options.current.tool = next;
      setTool(next);
      setSelected(undefined);
      setSelectedStyle(undefined);
      clearVertex();
      draw.current?.setMode(MODE_FOR[next]);
    },
    [clearVertex]
  );

  const pickShape = useCallback(
    (next: Partial<ShapeStyle>) => {
      if (selected !== undefined && selectedStyle && draw.current) {
        const restyled = { ...selectedStyle, ...next };

        draw.current.updateFeatureProperties(selected, restyled);
        setSelectedStyle(restyled);
        readDraft();
        return;
      }

      const style = { ...options.current.shape, ...next };

      options.current.shape = style;
      setShape(style);
      pickTool('shape');
    },
    [pickTool, selected, selectedStyle, readDraft]
  );

  const pickLineStyle = useCallback(
    (next: 'solid' | 'dashed') => {
      options.current.lineStyle = next;
      setLineStyle(next);
      pickTool('line');
    },
    [pickTool]
  );

  const pickPinType = useCallback(
    (next: PinType) => {
      options.current.pinType = next;
      setPinType(next);
      pickTool('pin');
    },
    [pickTool]
  );

  const saveLabel = useCallback(
    (text: string) => {
      if (labelling === undefined) return;

      if (text.trim().length === 0) {
        draw.current?.removeFeatures([labelling]);
      } else {
        draw.current?.updateFeatureProperties(labelling, {
          kind: 'text',
          label: text.trim(),
          color: 'red',
        });
      }

      setLabelling(undefined);
      readDraft();
    },
    [labelling, readDraft]
  );

  const finish = useCallback(() => {
    stop();
    clearVertex();
    setSelected(undefined);
    setSelectedStyle(undefined);
    setDraft(EMPTY_DRAFT);
    setEditing(false);
    setScope('territory');
    setLabelling(undefined);
    options.current.tool = 'move';
    setTool('move');
  }, [stop, clearVertex]);

  const undo = useCallback(() => {
    draw.current?.undo();
    readDraft();
  }, [readDraft]);

  const redo = useCallback(() => {
    draw.current?.redo();
    readDraft();
  }, [readDraft]);

  const ringOf = (feature?: GeoJSONStoreFeatures) => {
    if (feature?.geometry.type === 'Polygon') {
      return (feature.geometry.coordinates[0] as number[][]).slice(0, -1);
    }

    if (feature?.geometry.type === 'LineString') {
      return feature.geometry.coordinates as number[][];
    }

    return [];
  };

  const deleteVertex = useCallback(() => {
    const terra = draw.current;
    const picked = vertex.current;
    if (!terra || !picked) return;

    const feature = terra.getSnapshotFeature(picked.id);
    const points = ringOf(feature);
    const isPolygon = feature?.geometry.type === 'Polygon';

    if (points.length <= (isPolygon ? 3 : 2)) return;

    const kept = points.filter((_, index) => index !== picked.index);

    terra.deselectFeature(picked.id);
    terra.updateFeatureGeometry(
      picked.id,
      isPolygon
        ? { type: 'Polygon', coordinates: [[...kept, kept[0]]] }
        : { type: 'LineString', coordinates: kept }
    );
    terra.selectFeature(picked.id, 'points');

    clearVertex();
    readDraft();
  }, [clearVertex, readDraft]);

  useEffect(() => {
    const instance = map.current;
    if (!editing || tool !== 'points' || !instance) return;

    const pick = (event: maplibregl.MapMouseEvent) => {
      const terra = draw.current;
      if (!terra) return;

      if (selected === undefined) {
        clearVertex();
        return;
      }

      const points = ringOf(terra.getSnapshotFeature(selected));

      let best: { index: number; distance: number } | undefined;

      points.forEach((point, index) => {
        const pixel = instance.project(point as [number, number]);
        const distance = Math.hypot(
          pixel.x - event.point.x,
          pixel.y - event.point.y
        );

        if (distance <= PICK_DISTANCE && (!best || distance < best.distance)) {
          best = { index, distance };
        }
      });

      if (!best) {
        clearVertex();
        return;
      }

      vertex.current = { id: selected, index: best.index };

      if (!vertexMarker.current) {
        const element = document.createElement('div');
        element.style.cssText =
          'width:14px;height:14px;border-radius:50%;border:2px solid var(--accent-main);box-shadow:0 0 0 3px rgba(94,106,210,0.3);pointer-events:none';

        vertexMarker.current = new maplibregl.Marker({ element });
        vertexMarker.current.setLngLat(points[best.index] as [number, number]);
        vertexMarker.current.addTo(instance);
      }
    };

    const follow = () => {
      const picked = vertex.current;
      if (!picked || !draw.current) return;

      const point = ringOf(draw.current.getSnapshotFeature(picked.id))[
        picked.index
      ];
      if (point) vertexMarker.current?.setLngLat(point as [number, number]);
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Delete' && event.key !== 'Backspace') return;

      const target = event.target as HTMLElement;
      if (target.closest('input, textarea, [contenteditable="true"]')) return;

      event.preventDefault();
      deleteVertex();
    };

    instance.on('mousedown', pick);
    instance.on('mouseup', follow);
    window.addEventListener('keydown', onKey);

    return () => {
      instance.off('mousedown', pick);
      instance.off('mouseup', follow);
      window.removeEventListener('keydown', onKey);
    };
  }, [map, editing, tool, selected, clearVertex, deleteVertex]);

  useEffect(() => stop, [stop]);

  return useMemo(
    () => ({
      active: draw,
      editing,
      scope,
      tool,
      shape,
      lineStyle,
      pinType,
      draft,
      labelling,
      selectedStyle,
      start,
      finish,
      pickTool,
      pickShape,
      pickLineStyle,
      pickPinType,
      saveLabel,
      undo,
      redo,
    }),
    [
      editing,
      scope,
      tool,
      shape,
      lineStyle,
      pinType,
      draft,
      labelling,
      selectedStyle,
      start,
      finish,
      pickTool,
      pickShape,
      pickLineStyle,
      pickPinType,
      saveLabel,
      undo,
      redo,
    ]
  );
};

export default useMapEditor;
