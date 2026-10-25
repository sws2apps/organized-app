import {
  isDrawingGuide,
  pendingSplitLine,
} from '@features/territories/map/drawing_snapshot';
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
import {
  DEFAULT_BOUNDARY_STYLE,
  MAP_COLORS,
} from '@features/territories/map/constants';
import {
  lineColor,
  roundPosition,
  toBoundary,
} from '@features/territories/map/helpers';

export type MapTool =
  | 'border'
  | 'move'
  | 'points'
  | 'shape'
  | 'line'
  | 'pin'
  | 'text'
  | 'split'
  | 'merge';

export type MapItemKind = 'boundary' | 'shape' | 'line' | 'pin' | 'text';

export type EditScope = 'territory' | 'congregation';

// an area may also have a dashed outline; a border never does
export type ShapeStyle = MapStyle & { dashed?: boolean };

export type LineLook = { style: 'solid' | 'dashed'; color: MapColor };

const EMPTY_DRAFT: TerritoryMapDraft = {
  shapes: [],
  lines: [],
  markers: [],
};

const EXTRA_TOOLS = new Set<MapTool>([
  'text',
  'pin',
  'line',
  'shape',
  'split',
  'merge',
]);

const MODE_FOR: Record<MapTool, string> = {
  border: 'polygon',
  move: 'select',
  points: 'points',
  shape: 'polygon',
  line: 'linestring',
  pin: 'point',
  text: 'point',
  split: 'linestring',
  // picking territories to merge is the map's own click, not terra draw's
  merge: 'static',
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

const lookOf = (feature: GeoJSONStoreFeatures): LineLook => {
  const style = feature.properties?.lineStyle === 'dashed' ? 'dashed' : 'solid';
  const color = (feature.properties?.color as MapColor) || undefined;
  return { style, color: lineColor({ style, color }) };
};

const lineHex = (feature: GeoJSONStoreFeatures) =>
  MAP_COLORS[lookOf(feature).color] as HexColor;

// in line widths, as the saved drawings have them
const DASH: [number, number] = [2, 1.5];

// terra draw takes a line's dashes in pixels
const dashOf = (width: number): [number, number] => [
  DASH[0] * width,
  DASH[1] * width,
];

const selectStyles = {
  selectedPolygonColor: fillColor,
  selectedPolygonOutlineColor: outlineColor,
  selectedPolygonFillOpacity: (feature: GeoJSONStoreFeatures) =>
    fillOpacity(feature) === 0 ? 0 : 0.3,
  selectedPolygonOutlineWidth: 3.5,
  selectedLineStringColor: lineHex,
  selectedLineStringWidth: 5,
  selectedLineStringDash: (feature: GeoJSONStoreFeatures) =>
    lookOf(feature).style === 'dashed' ? dashOf(5) : undefined,
  // a picked pin or note stands out under its chip
  selectedPointColor: BLUE,
  selectedPointWidth: 9,
  selectedPointOutlineColor: '#ffffff' as HexColor,
  selectedPointOutlineWidth: 3,
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

// Esc belongs to the editor's own step back (leaveTool), so terra draw leaves it alone
const DRAW_KEYS = { cancel: null, finish: 'Enter' };

type Vertex = { id: string | number; index: number };

// corners closer than this on screen get small handles, so the border stays visible
const DENSE_SPACING = 16;

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
      dashed: properties.dashed === true || undefined,
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
    if (isDrawingGuide(feature)) continue;

    const id = String(feature.id);
    const geometry = feature.geometry;

    if (geometry.type === 'Polygon') {
      readPolygon(next, id, geometry.coordinates[0], properties);
    } else if (geometry.type === 'LineString') {
      next.lines.push({
        id,
        path: geometry.coordinates.map(position),
        style: properties.lineStyle === 'dashed' ? 'dashed' : 'solid',
        color: (properties.color as MapColor) || undefined,
      });
    } else if (geometry.type === 'Point') {
      next.markers.push(readMarker(id, geometry.coordinates, properties));
    }
  }

  return next;
};

const inside = (point: number[], ring: number[][]) => {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (
      yi > point[1] !== yj > point[1] &&
      point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi
    ) {
      hit = !hit;
    }
  }
  return hit;
};

const ringArea = (ring: number[][]) =>
  Math.abs(
    ring.reduce((sum, [x, y], i) => {
      const [nx, ny] = ring[(i + 1) % ring.length];
      return sum + x * ny - nx * y;
    }, 0)
  );

// the smallest area drawn on the territory under the point, if any
const areaAt = (features: GeoJSONStoreFeatures[], point: number[]) =>
  features
    .filter(
      (feature) =>
        isShape(feature) &&
        feature.geometry.type === 'Polygon' &&
        inside(point, feature.geometry.coordinates[0] as number[][])
    )
    .sort(
      (a, b) =>
        ringArea((a.geometry.coordinates as number[][][])[0]) -
        ringArea((b.geometry.coordinates as number[][][])[0])
    )[0]?.id;

const ringOf = (feature?: GeoJSONStoreFeatures) => {
  if (feature?.geometry.type === 'Polygon') {
    return (feature.geometry.coordinates[0] as number[][]).slice(0, -1);
  }

  if (feature?.geometry.type === 'LineString') {
    return feature.geometry.coordinates as number[][];
  }

  return [];
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
  onSplitLine,
}: {
  map: RefObject<maplibregl.Map | null>;
  onStart: (boundary?: TerritoryBoundary) => void;
  onSplitLine: (line: [number, number][]) => void;
}) => {
  const draw = useRef<TerraDraw>(null);

  const splitLine = useRef(onSplitLine);
  splitLine.current = onSplitLine;

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
    shape: { border: 'red', fill: 'transparent', dashed: false } as ShapeStyle,
    boundary: DEFAULT_BOUNDARY_STYLE,
    line: { style: 'solid', color: 'blue' } as LineLook,
    pinType: 'normal' as PinType,
  });

  const [editing, setEditing] = useState(false);
  const [scope, setScope] = useState<EditScope>('territory');
  const [tool, setTool] = useState<MapTool>('move');
  const [shape, setShape] = useState<ShapeStyle>(options.current.shape);
  const [boundaryStyle, setBoundaryStyle] = useState<ShapeStyle>(
    DEFAULT_BOUNDARY_STYLE
  );
  const [line, setLine] = useState<LineLook>(options.current.line);
  const [pinType, setPinType] = useState<PinType>('normal');
  const [draft, setDraft] = useState<TerritoryMapDraft>(EMPTY_DRAFT);
  const [labelling, setLabelling] = useState<string | number>();
  // what the label dialog starts with: empty for a new note, the text for a picked one
  const [labelStart, setLabelStart] = useState('');
  const [selected, setSelected] = useState<string | number>();
  const [selectedStyle, setSelectedStyle] = useState<ShapeStyle>();
  const [selectedLine, setSelectedLine] = useState<LineLook>();
  const [selectedKind, setSelectedKind] = useState<MapItemKind>();

  // what the drawing looked like when editing started, to tell if anything changed
  const [baseline, setBaseline] = useState('');

  const thinHandles = useRef(false);

  // read on every render of the drawing, so a zoom can thin them without restarting
  const handleStyles = useRef({
    ...selectStyles,
    selectionPointWidth: () => (thinHandles.current ? 3 : 5),
    selectionPointOutlineWidth: () => (thinHandles.current ? 1 : 2),
    midPointWidth: () => (thinHandles.current ? 1.5 : 3),
    midPointOutlineWidth: () => (thinHandles.current ? 0 : 1),
  });

  const vertex = useRef<Vertex>(undefined);
  const vertexMarker = useRef<maplibregl.Marker>(null);

  const [canSplit, setCanSplit] = useState(false);

  const readDraft = useCallback(() => {
    if (!draw.current) return;
    const snapshot = draw.current.getSnapshot();
    setDraft(readSnapshot(snapshot));
    setCanSplit(pendingSplitLine(snapshot).length >= 2);
  }, []);

  const completeSplit = useCallback(() => {
    const terra = draw.current;
    if (!terra || options.current.tool !== 'split') return;
    const line = pendingSplitLine(terra.getSnapshot());
    if (line.length < 2) return;
    // Reset the temporary drawing through the public API before opening the preview.
    terra.setMode('static');
    terra.setMode(MODE_FOR.split);
    readDraft();
    splitLine.current(line.map(roundPosition));
  }, [readDraft]);

  // mirrors the picked corner for the panel, which can't read the ref
  const [cornerPicked, setCornerPicked] = useState(false);

  const clearVertex = useCallback(() => {
    vertex.current = undefined;
    vertexMarker.current?.remove();
    vertexMarker.current = null;
    setCornerPicked(false);
  }, []);

  const pendingActions = useRef(new Set<ReturnType<typeof setTimeout>>());
  const defer = useCallback((terra: TerraDraw, action: VoidFunction) => {
    const timer = setTimeout(() => {
      pendingActions.current.delete(timer);
      if (draw.current === terra) action();
    });
    pendingActions.current.add(timer);
  }, []);

  const stop = useCallback(() => {
    pendingActions.current.forEach(clearTimeout);
    pendingActions.current.clear();
    draw.current?.stop();
    draw.current = null;
  }, []);

  const start = useCallback(
    (
      nextScope: EditScope,
      target?: Territory,
      border?: TerritoryBoundary,
      borderColor: MapColor = 'red',
      borderDashed = false
    ) => {
      const instance = map.current;
      if (!instance) return;

      const congregation = nextScope === 'congregation';
      const existing = congregation ? border : target?.boundary;
      // the congregation's outline has a colour of its own and no fill
      const style: ShapeStyle = congregation
        ? { border: borderColor, fill: 'transparent', dashed: borderDashed }
        : target?.boundaryStyle || DEFAULT_BOUNDARY_STYLE;

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
            keyEvents: DRAW_KEYS,
          }),
          new TerraDrawLineStringMode({
            styles: {
              lineStringColor: lineHex,
              lineStringWidth: 3,
              // a line still being drawn has no style of its own yet
              lineStringDash: (feature) =>
                (feature.properties?.lineStyle ??
                  options.current.line.style) === 'dashed'
                  ? dashOf(3)
                  : undefined,
            },
            keyEvents: DRAW_KEYS,
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
            styles: handleStyles.current,
            keyEvents: {
              deselect: null,
              delete: 'Delete',
              rotate: ['Control', 'r'],
              scale: ['Control', 's'],
            },
          }),
          new TerraDrawSelectMode({
            modeName: 'points',
            flags: POINT_FLAGS,
            styles: handleStyles.current,
            keyEvents: {
              deselect: null,
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
                dashed: feature.properties.dashed === true,
              }
            : undefined
        );
        setSelectedLine(
          feature?.geometry.type === 'LineString' ? lookOf(feature) : undefined
        );
      });

      // clicking a point deselects and reselects the same drawing, so keep the picked point
      terra.on('deselect', () => {
        setSelected(undefined);
        setSelectedKind(undefined);
        setSelectedStyle(undefined);
        setSelectedLine(undefined);
      });

      terra.on('finish', (id) => {
        const { tool: current, shape: style, pinType: type } = options.current;

        // a point can only come from the pin or text tool; one finished while
        // another tool is picked (a mode switch still under way) is dropped,
        // so it never turns into a stray pin
        if (
          current !== 'pin' &&
          current !== 'text' &&
          terra.getSnapshotFeature(id)?.geometry.type === 'Point'
        ) {
          terra.removeFeatures([id]);
          terra.setMode(MODE_FOR[current]);
          return;
        }

        const before = historySize();

        // the cut is no drawing of its own; undo takes it back with its line
        if (current === 'split') {
          const feature = terra.getSnapshotFeature(id);
          // once terra draw is done finishing it
          defer(terra, () => {
            if (!terra.hasFeature(id)) return;
            terra.removeFeatures([id]);
            markAuto(before);
          });
          if (feature?.geometry.type === 'LineString') {
            splitLine.current(
              (feature.geometry.coordinates as number[][]).map(roundPosition)
            );
          }
          return;
        }

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
            dashed: !!style.dashed,
          });
        }

        if (current === 'border' || current === 'shape' || current === 'line') {
          options.current.tool = 'points';
          setTool('points');

          defer(terra, () => {
            terra.setMode(MODE_FOR.points);
            if (terra.hasFeature(id)) terra.selectFeature(id, 'points');
          });
        }

        if (current === 'line') {
          terra.updateFeatureProperties(id, {
            lineStyle: options.current.line.style,
            color: options.current.line.color,
          });
        }

        if (current === 'pin') {
          terra.updateFeatureProperties(id, { kind: 'pin', pinType: type });
        }

        if (current === 'text') {
          terra.updateFeatureProperties(id, { kind: 'text', label: '' });
          setLabelStart('');
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
              dashed: !!item.dashed,
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
            properties: {
              mode: 'linestring',
              lineStyle: line.style,
              color: lineColor(line),
            },
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
      setCanSplit(false);
      setBaseline(JSON.stringify(initial));
      setScope(nextScope);
      setEditing(true);

      onStart(existing);
    },
    [map, stop, readDraft, onStart, clearVertex, historySize, markAuto, defer]
  );

  const pickTool = useCallback(
    (next: MapTool) => {
      options.current.tool = next;
      setTool(next);
      setSelected(undefined);
      setSelectedKind(undefined);
      setSelectedStyle(undefined);
      setSelectedLine(undefined);
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

  const pickBoundary = useCallback(
    (next: Partial<ShapeStyle>) => {
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

  // a picked line changes in place; otherwise the look is for the next line drawn
  const pickLine = useCallback(
    (next: Partial<LineLook>) => {
      const current = selectedLine ?? options.current.line;
      // solid or dashed keeps the colour the line has
      const look = { ...current, ...next };

      if (selected !== undefined && selectedLine && draw.current) {
        draw.current.updateFeatureProperties(selected, {
          lineStyle: look.style,
          color: look.color,
        });
        setSelectedLine(look);
        readDraft();
        return;
      }

      options.current.line = look;
      setLine(look);
      pickTool('line');
    },
    [pickTool, selected, selectedLine, readDraft]
  );

  // a picked pin changes its type in place; otherwise it is for the next pin
  const pickPinType = useCallback(
    (next: PinType) => {
      if (selected !== undefined && selectedKind === 'pin' && draw.current) {
        draw.current.updateFeatureProperties(selected, { pinType: next });
        readDraft();
        return;
      }

      options.current.pinType = next;
      setPinType(next);
      pickTool('pin');
    },
    [pickTool, selected, selectedKind, readDraft]
  );

  // the picked note, or the one the context menu was opened on
  const editLabel = useCallback(
    (id: string | number | undefined = selected) => {
      const terra = draw.current;
      if (!terra || id === undefined) return;
      const feature = terra.getSnapshotFeature(id);
      if (feature?.properties?.kind !== 'text') return;
      setLabelStart(String(feature.properties.label ?? ''));
      setLabelling(id);
    },
    [selected]
  );

  const deleteItem = useCallback(
    (id: string | number) => {
      const terra = draw.current;
      if (!terra?.hasFeature(id)) return;
      const border = kindOf(terra.getSnapshotFeature(id)) === 'boundary';
      if (terra.getSnapshotFeature(id)?.properties?.selected) {
        clearVertex();
        terra.deselectFeature(id);
      }
      terra.removeFeatures([id]);
      readDraft();
      if (border) pickTool('border');
    },
    [clearVertex, readDraft, pickTool]
  );

  // the context menu places a pin or a note straight where it was opened
  const addMarkerAt = useCallback(
    (kind: 'pin' | 'text', at: [number, number]) => {
      const terra = draw.current;
      if (!terra) return;

      pickTool('move');
      const id = terra.getFeatureId();
      terra.addFeatures([
        {
          type: 'Feature',
          id,
          properties: {
            mode: 'point',
            kind,
            label: '',
            pinType: kind === 'pin' ? options.current.pinType : 'normal',
            color: '',
          },
          geometry: { type: 'Point', coordinates: roundPosition(at) },
        },
      ]);

      if (kind === 'text') {
        setLabelStart('');
        setLabelling(id);
      } else {
        defer(terra, () => terra.selectFeature(id, MODE_FOR.move));
      }
      readDraft();
    },
    [pickTool, readDraft, defer]
  );

  // what lies under a point on screen, nearest kind first: pins and notes,
  // lines, the smallest area, then the border
  const itemAt = useCallback(
    (pixel: { x: number; y: number }, at: [number, number]) => {
      const terra = draw.current;
      const instance = map.current;
      if (!terra || !instance) return undefined;

      const features = terra
        .getSnapshot()
        .filter(
          (f) => !f.properties?.selectionPoint && !f.properties?.midPoint
        );
      const near = (point: number[]) => {
        const p = instance.project(point as [number, number]);
        return Math.hypot(p.x - pixel.x, p.y - pixel.y);
      };

      const marker = features.find(
        (f) =>
          f.geometry.type === 'Point' &&
          near(f.geometry.coordinates as number[]) < 16
      );
      if (marker) return { id: marker.id!, kind: kindOf(marker)! };

      const line = features.find((f) => {
        if (f.geometry.type !== 'LineString') return false;
        const pts = (f.geometry.coordinates as number[][]).map((c) =>
          instance.project(c as [number, number])
        );
        return pts.slice(1).some((b, i) => {
          const a = pts[i];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const t = Math.max(
            0,
            Math.min(
              1,
              ((pixel.x - a.x) * dx + (pixel.y - a.y) * dy) /
                (dx * dx + dy * dy || 1)
            )
          );
          return (
            Math.hypot(a.x + t * dx - pixel.x, a.y + t * dy - pixel.y) < 10
          );
        });
      });
      if (line) return { id: line.id!, kind: 'line' as const };

      const area = areaAt(features, at);
      if (area !== undefined) return { id: area, kind: 'shape' as const };

      const border = features.find(
        (f) =>
          f.properties?.role === 'boundary' &&
          f.geometry.type === 'Polygon' &&
          inside(at, (f.geometry.coordinates as number[][][])[0])
      );
      if (border) return { id: border.id!, kind: 'boundary' as const };

      return undefined;
    },
    [map]
  );

  // the corner of the picked drawing under a point on screen, if any
  const cornerAt = useCallback(
    (pixel: { x: number; y: number }) => {
      const terra = draw.current;
      const instance = map.current;
      if (!terra || !instance || selected === undefined) return undefined;

      const points = ringOf(terra.getSnapshotFeature(selected));
      let best: { index: number; distance: number } | undefined;
      points.forEach((point, index) => {
        const p = instance.project(point as [number, number]);
        const distance = Math.hypot(p.x - pixel.x, p.y - pixel.y);
        if (distance <= PICK_DISTANCE && (!best || distance < best.distance)) {
          best = { index, distance };
        }
      });
      return best?.index;
    },
    [map, selected]
  );

  const selectItem = useCallback(
    (id: string | number, corners = false) => {
      const terra = draw.current;
      if (!terra) return;
      const next: MapTool = corners || tool === 'points' ? 'points' : 'move';
      if (next !== tool) pickTool(next);
      defer(terra, () => {
        const picked = terra.getSnapshot().find((f) => f.properties?.selected);
        if (picked?.id !== undefined && picked.id !== id)
          terra.deselectFeature(picked.id);
        terra.selectFeature(id, MODE_FOR[next]);
      });
    },
    [tool, pickTool, defer]
  );

  const saveLabel = useCallback(
    (text: string) => {
      if (labelling === undefined) return;

      const before = historySize();

      if (text.trim().length === 0) {
        // Cancel on a note that already had text keeps it
        if (!labelStart) draw.current?.removeFeatures([labelling]);
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
    [labelling, labelStart, readDraft, historySize, markAuto]
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

  // Done on the style bar: the picked drawing lets go, the tool stays
  const deselect = useCallback(() => {
    const terra = draw.current;
    clearVertex();
    if (terra && selected !== undefined && terra.hasFeature(selected)) {
      terra.deselectFeature(selected);
    }
    setSelected(undefined);
    setSelectedKind(undefined);
    setSelectedStyle(undefined);
    setSelectedLine(undefined);
  }, [selected, clearVertex]);

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
      defer(terra, () => terra.selectFeature(border.id!, 'points'));
    }
  }, [pickTool, defer]);

  // a split or merge also changes territories outside the drawing, which
  // undo can't reach, so the history starts again from here
  const replaceBoundary = useCallback(
    (ring: TerritoryBoundary) => {
      const terra = draw.current;
      const border = terra
        ?.getSnapshot()
        .find((feature) => feature.properties?.role === 'boundary');
      if (!terra || border?.id === undefined) return;

      clearVertex();
      if (border.properties.selected) terra.deselectFeature(border.id);
      terra.updateFeatureGeometry(border.id, {
        type: 'Polygon',
        coordinates: [ring.map(roundPosition)],
      });
      terra.clearUndoRedoHistory();
      autoSteps.current.clear();
      readDraft();
      adjustBorder();
    },
    [clearVertex, readDraft, adjustBorder]
  );

  // Abbrechen and Esc go back one level and drop only what that level added:
  //   placing (a note tool, or a border half drawn) → the territory, as it opened
  //   the territory → edit mode with nothing picked, asking first if changes would be lost
  //   edit mode → view mode
  // Picking a drawing or a corner is no level of its own; a click beside it lets go.
  // Speichern keeps the drawing and leaves the territory in one step.
  // This takes the first step and says false when there is no tool to leave.
  const leaveTool = useCallback(() => {
    const terra = draw.current;
    if (!terra) return false;

    if (EXTRA_TOOLS.has(tool)) {
      adjustBorder();
      return true;
    }

    if (tool === 'border' && terra.getModeState() === 'drawing') {
      // switching modes drops the unfinished outline
      terra.setMode(MODE_FOR.move);
      pickTool('border');
      return true;
    }

    return false;
  }, [tool, pickTool, adjustBorder]);

  const finish = useCallback(() => {
    stop();
    clearVertex();
    setSelected(undefined);
    setSelectedKind(undefined);
    setSelectedStyle(undefined);
    setSelectedLine(undefined);
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
          'width:16px;height:16px;border-radius:50%;background:var(--accent-main);border:3px solid #fff;box-shadow:0 0 0 3px var(--accent-main),0 0 0 9px rgba(94,106,210,0.28),0 2px 6px rgba(0,0,0,0.35);pointer-events:none';

        vertexMarker.current = new maplibregl.Marker({ element });
        vertexMarker.current.addTo(instance);
      }
      // a newly picked point moves the ring there, not only the first one
      vertexMarker.current.setLngLat(points[best.index] as [number, number]);
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
    // the ring goes along while the point is dragged
    instance.on('mousemove', follow);
    instance.on('touchmove', follow);
    window.addEventListener('keydown', onKey);

    return () => {
      instance.off('mousedown', pick);
      instance.off('mousemove', follow);
      instance.off('touchmove', follow);
      instance.off('mouseup', follow);
      instance.off('touchstart', pick);
      instance.off('touchend', follow);
      window.removeEventListener('keydown', onKey);
    };
  }, [map, editing, tool, selected, clearVertex, deleteVertex]);

  useEffect(() => {
    const instance = map.current;
    const terra = draw.current;
    if (!editing || !instance || !terra || selected === undefined) return;

    const update = () => {
      const pixels = ringOf(terra.getSnapshotFeature(selected)).map((point) =>
        instance.project(point as [number, number])
      );

      const gaps = pixels
        .slice(1)
        .map((pixel, index) =>
          Math.hypot(pixel.x - pixels[index].x, pixel.y - pixels[index].y)
        )
        .sort((a, b) => a - b);

      const thin =
        gaps.length > 0 && gaps[Math.floor(gaps.length / 2)] < DENSE_SPACING;
      if (thin === thinHandles.current) return;

      thinHandles.current = thin;
      // setting the styles again redraws the handles with the new widths
      terra.updateModeOptions(terra.getMode(), {
        styles: handleStyles.current,
      });
    };

    update();
    instance.on('zoomend', update);

    return () => {
      instance.off('zoomend', update);
    };
  }, [map, editing, selected]);

  // terra draw can't dash an area's outline, so its layer gets the dashes here;
  // an area still being drawn has no role yet and takes the tool's style
  useEffect(() => {
    const instance = map.current;
    if (!editing || !instance?.getLayer('td-polygon-outline')) return;

    const drawing =
      (tool === 'shape' && !!shape.dashed) ||
      (tool === 'border' && !!boundaryStyle.dashed);

    instance.setPaintProperty('td-polygon-outline', 'line-dasharray', [
      'case',
      ['has', 'role'],
      [
        'case',
        ['boolean', ['get', 'dashed'], false],
        ['literal', DASH],
        ['literal', [1, 0]],
      ],
      ['literal', drawing ? DASH : [1, 0]],
    ]);
  }, [map, editing, tool, shape.dashed, boundaryStyle.dashed]);

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

  // terra draw decides between overlapping areas by its own order, often the
  // border; a click inside an area drawn on the territory takes the area
  useEffect(() => {
    const instance = map.current;
    if (!editing || !instance || (tool !== 'move' && tool !== 'points')) return;

    const onClick = (event: maplibregl.MapMouseEvent) => {
      const point = [event.lngLat.lng, event.lngLat.lat];
      // after terra draw has handled the same click
      const terra = draw.current;
      if (!terra) return;
      defer(terra, () => {
        const features = terra.getSnapshot();
        const picked = features.find((feature) => feature.properties?.selected);
        if (picked && kindOf(picked) !== 'boundary') return;
        const area = areaAt(features, point);
        if (area === undefined || area === picked?.id) return;
        if (picked?.id !== undefined) terra.deselectFeature(picked.id);
        terra.selectFeature(area, MODE_FOR[tool]);
      });
    };

    instance.on('click', onClick);
    return () => {
      instance.off('click', onClick);
    };
  }, [map, editing, tool, defer]);

  useEffect(() => stop, [stop]);

  const dirty = editing && JSON.stringify(draft) !== baseline;

  return useMemo(
    () => ({
      active: draw,
      canSplit: tool === 'split' && canSplit,
      completeSplit,
      editing,
      dirty,
      selected,
      selectedKind,
      deleteSelected,
      deselect,
      leaveTool,
      labelStart,
      editLabel,
      addMarkerAt,
      itemAt,
      cornerAt,
      selectItem,
      deleteItem,
      cornerPicked,
      deleteVertex,
      redrawBorder,
      adjustBorder,
      replaceBoundary,
      scope,
      tool,
      shape,
      boundaryStyle,
      line,
      pinType,
      draft,
      labelling,
      selectedStyle,
      selectedLine,
      start,
      finish,
      pickTool,
      pickShape,
      pickBoundary,
      pickLine,
      pickPinType,
      saveLabel,
      undo,
      redo,
    }),
    [
      canSplit,
      completeSplit,
      editing,
      dirty,
      selected,
      selectedKind,
      deleteSelected,
      deselect,
      leaveTool,
      labelStart,
      editLabel,
      addMarkerAt,
      itemAt,
      cornerAt,
      selectItem,
      deleteItem,
      cornerPicked,
      deleteVertex,
      redrawBorder,
      adjustBorder,
      replaceBoundary,
      scope,
      tool,
      shape,
      boundaryStyle,
      line,
      pinType,
      draft,
      labelling,
      selectedStyle,
      selectedLine,
      start,
      finish,
      pickTool,
      pickShape,
      pickBoundary,
      pickLine,
      pickPinType,
      saveLabel,
      undo,
      redo,
    ]
  );
};

export default useMapEditor;
