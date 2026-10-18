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
  TerraDrawModeUndoRedo,
  TerraDrawSelectMode,
  TerraDrawSessionUndoRedo,
} from 'terra-draw';
import type { GeoJSONStoreFeatures, HexColor } from 'terra-draw';
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';
import {
  MapColor,
  MapStyle,
  PinType,
  Territory,
  TerritoryBoundary,
  TerritoryMapDraft,
  TerritoryMapMarker,
} from '@definition/territory';
import { DEFAULT_BOUNDARY_STYLE, MAP_COLORS } from './constants';
import { roundPosition, toBoundary } from './helpers';

export type MapTool =
  | 'border'
  | 'move'
  | 'points'
  | 'shape'
  | 'line'
  | 'pin'
  | 'text';

export type MapItemKind = 'boundary' | 'shape' | 'line' | 'pin' | 'text';

export type EditScope = 'territory' | 'congregation';

const EMPTY_DRAFT: TerritoryMapDraft = {
  shapes: [],
  lines: [],
  markers: [],
};

const EXTRA_TOOLS = new Set<MapTool>(['text', 'pin', 'line', 'shape']);

const MODE_FOR: Record<MapTool, string> = {
  border: 'polygon',
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

// a border keeps the colors it was drawn with; one saved before colors existed is blue
const styleOf = (feature: GeoJSONStoreFeatures): MapStyle => ({
  border:
    (feature.properties?.border as MapStyle['border']) ??
    DEFAULT_BOUNDARY_STYLE.border,
  fill:
    (feature.properties?.fill as MapStyle['fill']) ??
    DEFAULT_BOUNDARY_STYLE.fill,
});

const fallback = (feature: GeoJSONStoreFeatures): MapColor =>
  isShape(feature) ? 'red' : 'blue';

const fillColor = (feature: GeoJSONStoreFeatures) =>
  hex(styleOf(feature).fill, fallback(feature));

const outlineColor = (feature: GeoJSONStoreFeatures) =>
  hex(styleOf(feature).border, fallback(feature));

const fillOpacity = (feature: GeoJSONStoreFeatures) =>
  styleOf(feature).fill === 'transparent' ? 0 : 0.2;

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

const styleFrom = (properties: Properties, fallback: MapStyle): MapStyle => ({
  border: (properties.border as MapStyle['border']) ?? fallback.border,
  fill: (properties.fill as MapStyle['fill']) ?? fallback.fill,
});

const readPolygon = (
  next: TerritoryMapDraft,
  id: string,
  ring: number[][],
  properties: Properties
) => {
  const path = toBoundary(ring);

  if (properties.role === 'shape') {
    next.shapes.push({
      id,
      path,
      ...styleFrom(properties, { border: 'red', fill: 'transparent' }),
      label: (properties.label as string) || undefined,
    });
  } else if (properties.role === 'boundary') {
    next.boundary = path;
    next.boundaryStyle = styleFrom(properties, DEFAULT_BOUNDARY_STYLE);
  }
};

const readMarker = (
  id: string,
  point: number[],
  properties: Properties
): TerritoryMapMarker => {
  const kind = properties.kind === 'text' ? 'text' : 'pin';

  return {
    id,
    kind,
    position: position(point),
    text: (properties.label as string) || undefined,
    pinType: kind === 'pin' ? (properties.pinType as PinType) : undefined,
    color: (properties.color as MapColor) || undefined,
  };
};

const readSnapshot = (features: GeoJSONStoreFeatures[]) => {
  const next: TerritoryMapDraft = { shapes: [], lines: [], markers: [] };

  for (const feature of features) {
    const properties = (feature.properties ?? {}) as Properties;

    // terra draw renders its own handles as points; they are not data
    if (properties.selectionPoint || properties.midPoint) continue;

    const id = String(feature.id);
    const geometry = feature.geometry;

    if (geometry.type === 'Polygon') {
      readPolygon(next, id, geometry.coordinates[0], properties);
    } else if (geometry.type === 'LineString') {
      next.lines.push({
        id,
        path: geometry.coordinates.map(position),
        style: properties.lineStyle === 'dashed' ? 'dashed' : 'solid',
      });
    } else if (geometry.type === 'Point') {
      next.markers.push(readMarker(id, geometry.coordinates, properties));
    }
  }

  return next;
};

const kindOf = (feature?: GeoJSONStoreFeatures): MapItemKind | undefined => {
  if (!feature) return undefined;

  const properties = (feature.properties ?? {}) as Properties;

  if (feature.geometry.type === 'Polygon') {
    return properties.role === 'shape' ? 'shape' : 'boundary';
  }

  if (feature.geometry.type === 'LineString') return 'line';

  return properties.kind === 'text' ? 'text' : 'pin';
};

const useMapEditor = ({
  map,
  onStart,
}: {
  map: RefObject<maplibregl.Map | null>;
  onStart: (boundary?: TerritoryBoundary) => void;
}) => {
  const draw = useRef<TerraDraw>(null);

  const history = useRef<TerraDrawSessionUndoRedo>(null);

  // history sizes whose top step we made ourselves right after the user's
  // (styling a finished drawing, naming a note), so undo takes them together
  const autoSteps = useRef(new Set<number>());

  const historySize = useCallback(() => history.current?.undoSize() ?? 0, []);

  const markAuto = useCallback(
    (before: number) => {
      for (let size = before + 1; size <= historySize(); size++) {
        autoSteps.current.add(size);
      }
    },
    [historySize]
  );

  // terra draw calls back outside React, so the current choices live in refs
  const options = useRef({
    tool: 'move' as MapTool,
    shape: { border: 'red', fill: 'transparent' } as MapStyle,
    boundary: DEFAULT_BOUNDARY_STYLE,
    lineStyle: 'solid' as 'solid' | 'dashed',
    pinType: 'normal' as PinType,
  });

  const [editing, setEditing] = useState(false);
  const [scope, setScope] = useState<EditScope>('territory');
  const [tool, setTool] = useState<MapTool>('move');
  const [shape, setShape] = useState<MapStyle>(options.current.shape);
  const [boundaryStyle, setBoundaryStyle] = useState<MapStyle>(
    DEFAULT_BOUNDARY_STYLE
  );
  const [lineStyle, setLineStyle] = useState<'solid' | 'dashed'>('solid');
  const [pinType, setPinType] = useState<PinType>('normal');
  const [draft, setDraft] = useState<TerritoryMapDraft>(EMPTY_DRAFT);
  const [labelling, setLabelling] = useState<string | number>();
  const [selected, setSelected] = useState<string | number>();
  const [selectedStyle, setSelectedStyle] = useState<MapStyle>();
  const [selectedKind, setSelectedKind] = useState<MapItemKind>();

  // what the drawing looked like when editing started, to tell if anything changed
  const [baseline, setBaseline] = useState('');

  const vertex = useRef<Vertex>(undefined);
  const vertexMarker = useRef<maplibregl.Marker>(null);

  const readDraft = useCallback(() => {
    if (draw.current) setDraft(readSnapshot(draw.current.getSnapshot()));
  }, []);

  // mirrors the picked corner for the panel, which can't read the ref
  const [cornerPicked, setCornerPicked] = useState(false);

  const clearVertex = useCallback(() => {
    vertex.current = undefined;
    vertexMarker.current?.remove();
    vertexMarker.current = null;
    setCornerPicked(false);
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
      const style =
        (!congregation && target?.boundaryStyle) || DEFAULT_BOUNDARY_STYLE;

      options.current.boundary = style;
      setBoundaryStyle(style);

      stop();

      history.current = new TerraDrawSessionUndoRedo();
      autoSteps.current.clear();

      const terra = new TerraDraw({
        adapter: new TerraDrawMapLibreGLAdapter({ map: instance }),
        // without these, undo and redo have no history to step through
        undoRedo: {
          modeLevel: new TerraDrawModeUndoRedo(),
          sessionLevel: history.current,
        },
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
        setSelectedKind(kindOf(feature));
        setSelectedStyle(
          feature && isShape(feature)
            ? {
                border: feature.properties.border as MapStyle['border'],
                fill: feature.properties.fill as MapStyle['fill'],
              }
            : undefined
        );
      });

      // clicking a point deselects and reselects the same drawing, so keep the picked point
      terra.on('deselect', () => {
        setSelected(undefined);
        setSelectedKind(undefined);
        setSelectedStyle(undefined);
      });

      terra.on('finish', (id) => {
        const { tool: current, shape: style, pinType: type } = options.current;

        const before = historySize();

        if (current === 'border') {
          // a territory has one border, so a new one replaces the old
          const previous = terra
            .getSnapshot()
            .filter(
              (feature) =>
                feature.id !== id && feature.properties?.role === 'boundary'
            )
            .map((feature) => feature.id!);

          if (previous.length > 0) terra.removeFeatures(previous);

          terra.updateFeatureProperties(id, {
            role: 'boundary',
            ...options.current.boundary,
          });
        }

        if (current === 'shape') {
          terra.updateFeatureProperties(id, {
            role: 'shape',
            border: style.border,
            fill: style.fill,
          });
        }

        if (current === 'border' || current === 'shape' || current === 'line') {
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

        markAuto(before);
        readDraft();
      });

      const loaded: GeoJSONStoreFeatures[] = [];

      if (existing?.length) {
        loaded.push({
          type: 'Feature',
          id: terra.getFeatureId(),
          properties: { mode: 'polygon', role: 'boundary', ...style },
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

      const startTool: MapTool = existing?.length ? 'points' : 'border';

      options.current.tool = startTool;
      setTool(startTool);

      // a freshly started terra draw is static and rejects features until a mode runs
      terra.setMode(MODE_FOR[startTool]);

      if (loaded.length > 0) terra.addFeatures(loaded);

      // what was already saved is the starting point, not a step to undo
      terra.clearUndoRedoHistory();
      autoSteps.current.clear();

      if (existing?.length) terra.selectFeature(loaded[0].id!, 'points');

      draw.current = terra;

      const initial = readSnapshot(terra.getSnapshot());

      setDraft(initial);
      setBaseline(JSON.stringify(initial));
      setScope(nextScope);
      setEditing(true);

      onStart(existing);
    },
    [map, stop, readDraft, onStart, clearVertex, historySize, markAuto]
  );

  const pickTool = useCallback(
    (next: MapTool) => {
      options.current.tool = next;
      setTool(next);
      setSelected(undefined);
      setSelectedKind(undefined);
      setSelectedStyle(undefined);
      clearVertex();
      draw.current?.setMode(MODE_FOR[next]);
    },
    [clearVertex]
  );

  const pickShape = useCallback(
    (next: Partial<MapStyle>) => {
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

  const pickBoundary = useCallback(
    (next: Partial<MapStyle>) => {
      const style = { ...options.current.boundary, ...next };

      options.current.boundary = style;
      setBoundaryStyle(style);

      const terra = draw.current;
      const drawn = terra
        ?.getSnapshot()
        .find((feature) => feature.properties?.role === 'boundary');

      if (terra && drawn?.id !== undefined) {
        terra.updateFeatureProperties(drawn.id, style);
        readDraft();
      }
    },
    [readDraft]
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

      const before = historySize();

      if (text.trim().length === 0) {
        draw.current?.removeFeatures([labelling]);
      } else {
        draw.current?.updateFeatureProperties(labelling, {
          kind: 'text',
          label: text.trim(),
          color: 'red',
        });
      }

      markAuto(before);
      setLabelling(undefined);
      readDraft();
    },
    [labelling, readDraft, historySize, markAuto]
  );

  const deleteSelected = useCallback(() => {
    const terra = draw.current;
    if (!terra || selected === undefined) return;

    const removedBorder = selectedKind === 'boundary';

    clearVertex();
    terra.deselectFeature(selected);
    terra.removeFeatures([selected]);
    readDraft();

    pickTool(removedBorder ? 'border' : options.current.tool);
  }, [selected, selectedKind, clearVertex, readDraft, pickTool]);

  // steps out of the current action only; leaving the editor is the back arrow
  const cancelAction = useCallback(() => {
    const terra = draw.current;
    if (!terra) return;

    if (EXTRA_TOOLS.has(tool)) {
      pickTool('points');
      return;
    }

    if (tool === 'border') {
      // switching modes drops the unfinished outline
      terra.setMode(MODE_FOR.move);
      pickTool('border');
      return;
    }

    if (selected !== undefined) {
      clearVertex();
      terra.deselectFeature(selected);
    }
  }, [tool, selected, pickTool, clearVertex]);

  const canCancel =
    EXTRA_TOOLS.has(tool) || tool === 'border' || selected !== undefined;

  const redrawBorder = useCallback(() => {
    const terra = draw.current;
    if (!terra) return;

    const borders = terra
      .getSnapshot()
      .filter((feature) => feature.properties?.role === 'boundary')
      .map((feature) => feature.id!);

    clearVertex();
    for (const id of borders) {
      if (terra.getSnapshotFeature(id)?.properties?.selected) {
        terra.deselectFeature(id);
      }
    }
    if (borders.length > 0) terra.removeFeatures(borders);

    readDraft();
    pickTool('border');
  }, [clearVertex, readDraft, pickTool]);

  const adjustBorder = useCallback(() => {
    const terra = draw.current;
    if (!terra) return;

    pickTool('points');

    const border = terra
      .getSnapshot()
      .find((feature) => feature.properties?.role === 'boundary');

    if (border) {
      setTimeout(() => terra.selectFeature(border.id!, 'points'));
    }
  }, [pickTool]);

  const finish = useCallback(() => {
    stop();
    clearVertex();
    setSelected(undefined);
    setSelectedKind(undefined);
    setSelectedStyle(undefined);
    setBaseline('');
    setDraft(EMPTY_DRAFT);
    setEditing(false);
    setScope('territory');
    setLabelling(undefined);
    options.current.tool = 'move';
    setTool('move');
  }, [stop, clearVertex]);

  const undo = useCallback(() => {
    const terra = draw.current;
    if (!terra) return;

    let size = historySize();
    terra.undo();

    // keep going while the step just taken back was one we added ourselves
    while (autoSteps.current.has(size) && historySize() < size) {
      size = historySize();
      terra.undo();
    }

    readDraft();
  }, [readDraft, historySize]);

  const redo = useCallback(() => {
    const terra = draw.current;
    if (!terra) return;

    terra.redo();

    while (autoSteps.current.has(historySize() + 1) && terra.canRedo()) {
      terra.redo();
    }

    readDraft();
  }, [readDraft, historySize]);

  useEffect(() => {
    if (!editing) return;

    const onKey = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey)) return;

      const target = event.target as HTMLElement;
      if (target.closest('input, textarea, [contenteditable="true"]')) return;

      const key = event.key.toLowerCase();

      if (key === 'z' && !event.shiftKey) {
        event.preventDefault();
        undo();
      } else if (key === 'y' || (key === 'z' && event.shiftKey)) {
        event.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [editing, undo, redo]);

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

    const pick = (
      event: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent
    ) => {
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
      setCornerPicked(true);

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
    instance.on('touchstart', pick);
    instance.on('touchend', follow);
    window.addEventListener('keydown', onKey);

    return () => {
      instance.off('mousedown', pick);
      instance.off('mouseup', follow);
      instance.off('touchstart', pick);
      instance.off('touchend', follow);
      window.removeEventListener('keydown', onKey);
    };
  }, [map, editing, tool, selected, clearVertex, deleteVertex]);

  // with Move items the whole picked drawing goes, as the corner does in points mode
  useEffect(() => {
    if (!editing || tool !== 'move' || selected === undefined) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Delete' && event.key !== 'Backspace') return;

      const target = event.target as HTMLElement;
      if (target.closest('input, textarea, [contenteditable="true"]')) return;

      event.preventDefault();
      deleteSelected();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [editing, tool, selected, deleteSelected]);

  useEffect(() => stop, [stop]);

  const dirty = editing && JSON.stringify(draft) !== baseline;

  return useMemo(
    () => ({
      active: draw,
      editing,
      dirty,
      selected,
      selectedKind,
      deleteSelected,
      cancelAction,
      canCancel,
      cornerPicked,
      deleteVertex,
      redrawBorder,
      adjustBorder,
      scope,
      tool,
      shape,
      boundaryStyle,
      lineStyle,
      pinType,
      draft,
      labelling,
      selectedStyle,
      start,
      finish,
      pickTool,
      pickShape,
      pickBoundary,
      pickLineStyle,
      pickPinType,
      saveLabel,
      undo,
      redo,
    }),
    [
      editing,
      dirty,
      selected,
      selectedKind,
      deleteSelected,
      cancelAction,
      canCancel,
      cornerPicked,
      deleteVertex,
      redrawBorder,
      adjustBorder,
      scope,
      tool,
      shape,
      boundaryStyle,
      lineStyle,
      pinType,
      draft,
      labelling,
      selectedStyle,
      start,
      finish,
      pickTool,
      pickShape,
      pickBoundary,
      pickLineStyle,
      pickPinType,
      saveLabel,
      undo,
      redo,
    ]
  );
};

export default useMapEditor;
