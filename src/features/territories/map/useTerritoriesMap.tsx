import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useAtom, useAtomValue } from 'jotai';
import * as maplibregl from 'maplibre-gl';
import {
  TerraDraw,
  TerraDrawLineStringMode,
  TerraDrawPointMode,
  TerraDrawPolygonMode,
  TerraDrawSelectMode,
} from 'terra-draw';
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';
import { IconCheckCircle } from '@icons/index';
import { displaySnackNotification } from '@services/states/app';
import { isDarkThemeState } from '@states/app';
import {
  congregationBoundaryState,
  territoriesState,
} from '@states/territories';
import {
  Territory,
  TerritoryBoundary,
  TerritoryMapDraft,
} from '@definition/territory';
import {
  MapProviderKey,
  MapView,
  styleUrl,
  CONGREGATION_FILL_LAYER,
  CONGREGATION_LINE_LAYER,
  CONGREGATION_SOURCE,
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  FILL_LAYER,
  LABEL_LAYER,
  LINES_SOURCE,
  LINE_DASHED_LAYER,
  LINE_LAYER,
  LINE_SOLID_LAYER,
  MARKERS_SOURCE,
  MARKER_PIN_LAYER,
  MARKER_TEXT_LAYER,
  SOURCE_ID,
} from './constants';
import {
  boundaryBounds,
  boundaryCollection,
  cssVar,
  lineCollection,
  markerCollection,
  toBoundary,
} from './helpers';

export type MapTool = 'move' | 'shape' | 'line' | 'pin' | 'text';

export type EditScope = 'territory' | 'congregation';

const EMPTY_DRAFT: TerritoryMapDraft = { lines: [], markers: [] };

const MODE_FOR: Record<MapTool, string> = {
  move: 'select',
  shape: 'polygon',
  line: 'linestring',
  pin: 'point',
  text: 'point',
};

const useTerritoriesMap = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [territories, setTerritories] = useAtom(territoriesState);
  const [congregationBoundary, setCongregationBoundary] = useAtom(
    congregationBoundaryState
  );
  const isDark = useAtomValue(isDarkThemeState);

  const wrapper = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map>(null);
  const draw = useRef<TerraDraw>(null);
  const tool = useRef<MapTool>('move');
  const lineStyle = useRef<'solid' | 'dashed'>('solid');

  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState('');
  const [heatmap, setHeatmap] = useState(false);
  const [provider, setProvider] = useState<MapProviderKey>('carto');
  const [view, setView] = useState<MapView>('map');
  const [showNumbers, setShowNumbers] = useState(true);
  const [showHouseholds, setShowHouseholds] = useState(false);
  const [hidePoi, setHidePoi] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [scope, setScope] = useState<EditScope>('territory');
  const [activeTool, setActiveTool] = useState<MapTool>('move');
  const [activeLineStyle, setActiveLineStyle] = useState<'solid' | 'dashed'>(
    'solid'
  );
  const [draft, setDraft] = useState<TerritoryMapDraft>(EMPTY_DRAFT);
  const [labelling, setLabelling] = useState<string | number | undefined>();

  const selectedId = searchParams.get('territory') ?? undefined;

  const selected = territories.find((item) => item.id === selectedId);

  const mapped = territories.filter((item) => item.boundary?.length).length;

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return territories;

    return territories.filter(
      (item) =>
        item.number.toLowerCase().includes(term) ||
        item.name.toLowerCase().includes(term) ||
        item.city.toLowerCase().includes(term)
    );
  }, [territories, search]);

  const data = useMemo(() => {
    const hiddenId = editing ? selectedId : undefined;
    const rest = territories.filter((item) => item.id !== hiddenId);

    const border: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features:
        congregationBoundary?.length && !(editing && scope === 'congregation')
          ? [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Polygon',
                  coordinates: [congregationBoundary],
                },
              },
            ]
          : [],
    };

    return {
      border,
      areas: boundaryCollection(territories, {
        heatmap,
        selectedId,
        hiddenId,
        showNumbers,
        showHouseholds,
      }),
      lines: lineCollection(rest),
      markers: markerCollection(rest),
    };
  }, [
    territories,
    congregationBoundary,
    editing,
    scope,
    selectedId,
    heatmap,
    showNumbers,
    showHouseholds,
  ]);

  const dataRef = useRef(data);
  dataRef.current = data;

  const setSelectedId = useCallback(
    (id?: string) => {
      setSearchParams(id ? { territory: id } : {}, { replace: true });
    },
    [setSearchParams]
  );

  const applyLayers = useCallback(() => {
    const instance = map.current;
    if (!instance || instance.getSource(SOURCE_ID)) return;

    const current = dataRef.current;

    instance.addSource(CONGREGATION_SOURCE, {
      type: 'geojson',
      data: current.border,
    });
    instance.addSource(SOURCE_ID, { type: 'geojson', data: current.areas });
    instance.addSource(LINES_SOURCE, { type: 'geojson', data: current.lines });
    instance.addSource(MARKERS_SOURCE, {
      type: 'geojson',
      data: current.markers,
    });

    instance.addLayer({
      id: CONGREGATION_FILL_LAYER,
      type: 'fill',
      source: CONGREGATION_SOURCE,
      paint: { 'fill-color': cssVar('--accent-main'), 'fill-opacity': 0.06 },
    });

    instance.addLayer({
      id: CONGREGATION_LINE_LAYER,
      type: 'line',
      source: CONGREGATION_SOURCE,
      paint: {
        'line-color': cssVar('--accent-dark'),
        'line-width': 2,
        'line-dasharray': [4, 3],
      },
    });

    instance.addLayer({
      id: FILL_LAYER,
      type: 'fill',
      source: SOURCE_ID,
      paint: {
        'fill-color': ['get', 'color'],
        'fill-opacity': ['case', ['get', 'selected'], 0.45, 0.18],
      },
    });

    instance.addLayer({
      id: LINE_LAYER,
      type: 'line',
      source: SOURCE_ID,
      paint: {
        'line-color': ['get', 'color'],
        'line-width': ['case', ['get', 'selected'], 3, 1.5],
      },
    });

    instance.addLayer({
      id: LINE_SOLID_LAYER,
      type: 'line',
      source: LINES_SOURCE,
      filter: ['==', ['get', 'style'], 'solid'],
      paint: { 'line-color': cssVar('--accent-dark'), 'line-width': 3 },
    });

    instance.addLayer({
      id: LINE_DASHED_LAYER,
      type: 'line',
      source: LINES_SOURCE,
      filter: ['==', ['get', 'style'], 'dashed'],
      paint: {
        'line-color': cssVar('--accent-dark'),
        'line-width': 3,
        'line-dasharray': [2, 2],
      },
    });

    instance.addLayer({
      id: MARKER_PIN_LAYER,
      type: 'circle',
      source: MARKERS_SOURCE,
      filter: ['==', ['get', 'kind'], 'pin'],
      paint: {
        'circle-radius': 6,
        'circle-color': cssVar('--red-main'),
        'circle-stroke-width': 2,
        'circle-stroke-color': cssVar('--white'),
      },
    });

    instance.addLayer({
      id: MARKER_TEXT_LAYER,
      type: 'symbol',
      source: MARKERS_SOURCE,
      filter: ['==', ['get', 'kind'], 'text'],
      layout: {
        'text-field': ['get', 'text'],
        'text-size': 13,
        'text-allow-overlap': true,
      },
      paint: {
        'text-color': cssVar('--black'),
        'text-halo-color': cssVar('--white'),
        'text-halo-width': 1.5,
      },
    });

    instance.addLayer({
      id: LABEL_LAYER,
      type: 'symbol',
      source: SOURCE_ID,
      layout: {
        'text-field': ['get', 'label'],
        'text-size': 12,
        'text-allow-overlap': false,
      },
      paint: {
        'text-color': cssVar('--black'),
        'text-halo-color': cssVar('--white'),
        'text-halo-width': 1.5,
      },
    });
  }, []);

  useEffect(() => {
    if (!container.current || map.current) return;

    const instance = new maplibregl.Map({
      container: container.current,
      style: styleUrl(provider, isDark, view),
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: { compact: true },
    });

    map.current = instance;

    // 'style.load' is the first point a custom layer is accepted, and it fires
    // again after the theme swaps the basemap
    instance.on('style.load', () => {
      applyLayers();
      setReady(true);
    });

    instance.on('click', FILL_LAYER, (event: maplibregl.MapLayerMouseEvent) => {
      if (draw.current) return;

      const id = event.features?.[0]?.properties?.id;
      if (typeof id === 'string') setSelectedId(id);
    });

    instance.on('mouseenter', FILL_LAYER, () => {
      instance.getCanvas().style.cursor = 'pointer';
    });

    instance.on('mouseleave', FILL_LAYER, () => {
      instance.getCanvas().style.cursor = '';
    });

    return () => {
      instance.remove();
      map.current = null;
      setReady(false);
    };
    // the map is created once; the theme effect keeps its style in sync
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!map.current || !ready) return;

    map.current.setStyle(styleUrl(provider, isDark, view));
  }, [isDark, provider, view, ready]);

  useEffect(() => {
    const instance = map.current;
    if (!instance || !ready) return;

    const source = (id: string) =>
      instance.getSource(id) as maplibregl.GeoJSONSource | undefined;

    source(CONGREGATION_SOURCE)?.setData(data.border);
    source(SOURCE_ID)?.setData(data.areas);
    source(LINES_SOURCE)?.setData(data.lines);
    source(MARKERS_SOURCE)?.setData(data.markers);

    instance.triggerRepaint();
  }, [data, ready, isDark, provider, view]);

  useEffect(() => {
    const instance = map.current;
    if (!instance || !ready) return;

    for (const layer of instance.getStyle().layers ?? []) {
      if (!/poi|place_label|shop|restaurant/i.test(layer.id)) continue;

      instance.setLayoutProperty(
        layer.id,
        'visibility',
        hidePoi ? 'none' : 'visible'
      );
    }
  }, [hidePoi, ready, isDark, provider, view]);

  const flyToBoundary = useCallback((boundary: TerritoryBoundary) => {
    const [west, south, east, north] = boundaryBounds(boundary);

    map.current?.fitBounds([west, south, east, north], {
      padding: 80,
      maxZoom: 16,
    });
  }, []);

  useEffect(() => {
    if (!ready || !selected?.boundary?.length) return;

    flyToBoundary(selected.boundary);
  }, [selectedId, ready, selected?.boundary, flyToBoundary]);

  const stopDrawing = useCallback(() => {
    draw.current?.stop();
    draw.current = null;
  }, []);

  const readDraft = useCallback(() => {
    const terra = draw.current;
    if (!terra) return;

    const next: TerritoryMapDraft = { lines: [], markers: [] };

    for (const feature of terra.getSnapshot()) {
      const properties = (feature.properties ?? {}) as Record<string, unknown>;

      // terra draw renders its own handles as points; they are not data
      if (properties.selectionPoint || properties.midPoint) continue;

      if (feature.geometry.type === 'Polygon') {
        next.boundary = toBoundary(feature.geometry.coordinates[0]);
      }

      if (feature.geometry.type === 'LineString') {
        next.lines.push({
          id: String(feature.id),
          path: feature.geometry.coordinates.map(
            ([lng, lat]) => [lng, lat] as [number, number]
          ),
          style: properties.lineStyle === 'dashed' ? 'dashed' : 'solid',
        });
      }

      if (feature.geometry.type === 'Point') {
        const [lng, lat] = feature.geometry.coordinates;

        next.markers.push({
          id: String(feature.id),
          kind: properties.kind === 'text' ? 'text' : 'pin',
          position: [lng, lat],
          text: typeof properties.label === 'string' ? properties.label : '',
        });
      }
    }

    setDraft(next);
  }, []);

  const startEditing = useCallback(
    (nextScope: EditScope = 'territory') => {
      const instance = map.current;
      if (!instance) return;

      const congregation = nextScope === 'congregation';
      const target = congregation ? undefined : selected;

      if (!congregation && !target) return;

      const existing = congregation ? congregationBoundary : target?.boundary;

      stopDrawing();

      const accent = cssVar('--accent-main') as `#${string}`;
      const accentDark = cssVar('--accent-dark') as `#${string}`;
      const red = cssVar('--red-main') as `#${string}`;

      const terra = new TerraDraw({
        adapter: new TerraDrawMapLibreGLAdapter({ map: instance }),
        modes: [
          new TerraDrawPolygonMode({
            styles: {
              fillColor: accent,
              outlineColor: accentDark,
              fillOpacity: 0.3,
              outlineWidth: 2,
            },
          }),
          new TerraDrawLineStringMode({
            styles: { lineStringColor: accentDark, lineStringWidth: 3 },
          }),
          new TerraDrawPointMode({
            styles: { pointColor: red, pointWidth: 6, pointOutlineWidth: 2 },
          }),
          new TerraDrawSelectMode({
            flags: {
              polygon: {
                feature: {
                  draggable: true,
                  coordinates: {
                    midpoints: true,
                    draggable: true,
                    deletable: true,
                  },
                },
              },
              linestring: {
                feature: {
                  draggable: true,
                  coordinates: {
                    midpoints: true,
                    draggable: true,
                    deletable: true,
                  },
                },
              },
              point: { feature: { draggable: true } },
            },
          }),
        ],
      });

      terra.start();

      terra.on('change', readDraft);

      terra.on('finish', (id) => {
        const current = tool.current;

        if (current === 'line') {
          terra.updateFeatureProperties(id, { lineStyle: lineStyle.current });
        }

        if (current === 'pin') {
          terra.updateFeatureProperties(id, { kind: 'pin' });
        }

        if (current === 'text') {
          terra.updateFeatureProperties(id, { kind: 'text', label: '' });
          setLabelling(id);
        }

        readDraft();
      });

      const loaded: Parameters<typeof terra.addFeatures>[0] = [];

      if (existing?.length) {
        loaded.push({
          type: 'Feature',
          id: terra.getFeatureId(),
          properties: { mode: 'polygon' },
          geometry: { type: 'Polygon', coordinates: [existing] },
        });
      }

      if (!congregation && target) {
        for (const line of target.mapLines ?? []) {
          loaded.push({
            type: 'Feature',
            id: terra.getFeatureId(),
            properties: { mode: 'linestring', lineStyle: line.style },
            geometry: { type: 'LineString', coordinates: line.path },
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
            },
            geometry: { type: 'Point', coordinates: marker.position },
          });
        }
      }

      const startTool: MapTool = existing?.length ? 'move' : 'shape';

      tool.current = startTool;
      setActiveTool(startTool);

      // a mode has to be running before the store accepts features: a freshly
      // started instance is static and rejects everything
      terra.setMode(MODE_FOR[startTool]);

      if (loaded.length > 0) terra.addFeatures(loaded);

      draw.current = terra;

      setDraft({
        boundary: existing,
        lines: congregation ? [] : (target?.mapLines ?? []),
        markers: congregation ? [] : (target?.mapMarkers ?? []),
      });
      setScope(nextScope);
      setEditing(true);

      if (existing?.length) flyToBoundary(existing);
    },
    [selected, congregationBoundary, stopDrawing, readDraft, flyToBoundary]
  );

  const pickTool = useCallback((next: MapTool) => {
    tool.current = next;
    setActiveTool(next);
    draw.current?.setMode(MODE_FOR[next]);
  }, []);

  const pickLineStyle = useCallback((next: 'solid' | 'dashed') => {
    lineStyle.current = next;
    setActiveLineStyle(next);
  }, []);

  const saveLabel = useCallback(
    (text: string) => {
      if (labelling === undefined) return;

      if (text.trim().length === 0) {
        draw.current?.removeFeatures([labelling]);
      } else {
        draw.current?.updateFeatureProperties(labelling, {
          kind: 'text',
          label: text.trim(),
        });
      }

      setLabelling(undefined);
      readDraft();
    },
    [labelling, readDraft]
  );

  const cancelEditing = useCallback(() => {
    stopDrawing();
    setDraft(EMPTY_DRAFT);
    setEditing(false);
    setScope('territory');
    setLabelling(undefined);
    tool.current = 'move';
    setActiveTool('move');
  }, [stopDrawing]);

  const saveBoundary = useCallback(() => {
    if (!draft.boundary?.length) return;

    if (scope === 'congregation') {
      setCongregationBoundary(draft.boundary);

      displaySnackNotification({
        header: 'Congregation border saved',
        message: 'The outer border of the congregation was updated.',
        severity: 'success',
        icon: <IconCheckCircle color="var(--white)" />,
      });

      cancelEditing();
      return;
    }

    if (!selected) return;

    setTerritories((prev) =>
      prev.map((item) =>
        item.id === selected.id
          ? {
              ...item,
              boundary: draft.boundary,
              mapLines: draft.lines,
              mapMarkers: draft.markers,
            }
          : item
      )
    );

    displaySnackNotification({
      header: 'Map saved',
      message: `Territory ${selected.number} now has an area on the map.`,
      severity: 'success',
      icon: <IconCheckCircle color="var(--white)" />,
    });

    cancelEditing();
  }, [
    scope,
    selected,
    draft,
    setTerritories,
    setCongregationBoundary,
    cancelEditing,
  ]);

  const clearDrawing = useCallback(() => {
    draw.current?.clear();
    setDraft(EMPTY_DRAFT);
    pickTool('shape');
  }, [pickTool]);

  const undo = useCallback(() => {
    draw.current?.undo();
    readDraft();
  }, [readDraft]);

  const redo = useCallback(() => {
    draw.current?.redo();
    readDraft();
  }, [readDraft]);

  const locate = useCallback(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        map.current?.flyTo({
          center: [position.coords.longitude, position.coords.latitude],
          zoom: 15,
        });
      },
      () =>
        displaySnackNotification({
          header: 'Location unavailable',
          message: 'The device did not share its position.',
          severity: 'error',
        })
    );
  }, []);

  const fitAll = useCallback(() => {
    const drawn = territories
      .filter((item) => item.boundary?.length)
      .flatMap((item) => item.boundary as TerritoryBoundary);

    const all = [...drawn, ...(congregationBoundary ?? [])];

    if (all.length === 0) return;

    flyToBoundary(all);
  }, [territories, congregationBoundary, flyToBoundary]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined);
      setFullscreen(false);
      return;
    }

    if (fullscreen) {
      setFullscreen(false);
      return;
    }

    // an embedded web view can refuse the API by throwing or by rejecting; the
    // overlay below covers both
    try {
      wrapper.current?.requestFullscreen().catch(() => undefined);
    } catch {
      setFullscreen(true);
    }

    setFullscreen(true);
  }, [fullscreen]);

  useEffect(() => {
    const handle = () => {
      setFullscreen(document.fullscreenElement === wrapper.current);
      window.setTimeout(() => map.current?.resize(), 150);
    };

    document.addEventListener('fullscreenchange', handle);

    return () => document.removeEventListener('fullscreenchange', handle);
  }, []);

  // a transformed ancestor becomes the containing block for anything fixed,
  // which would trap the full screen map inside the page. The transform is
  // switched off for as long as the map covers the screen
  useEffect(() => {
    if (!fullscreen) return;

    const patched: { element: HTMLElement; transform: string }[] = [];

    let node = wrapper.current?.parentElement;

    while (node && node !== document.body) {
      const { transform, filter, perspective } = getComputedStyle(node);

      // the page enter animation fills forever, and an element with a filling
      // transform animation keeps being a containing block even once its value
      // is none, so the finished animation is dropped as well
      for (const animation of node.getAnimations()) {
        if (animation.playState === 'finished') animation.cancel();
      }

      if (transform !== 'none' || filter !== 'none' || perspective !== 'none') {
        patched.push({ element: node, transform: node.style.transform });

        // the page transition animates the transform, and an animation beats a
        // plain inline style, so the override has to be important
        node.style.setProperty('transform', 'none', 'important');
        node.style.setProperty('filter', 'none', 'important');
        node.style.setProperty('perspective', 'none', 'important');
      }

      node = node.parentElement;
    }

    return () => {
      for (const { element, transform } of patched) {
        element.style.removeProperty('transform');
        element.style.removeProperty('filter');
        element.style.removeProperty('perspective');

        if (transform) element.style.transform = transform;
      }
    };
  }, [fullscreen]);

  useEffect(() => {
    const element = wrapper.current;
    if (!element) return;

    const observer = new ResizeObserver(() => map.current?.resize());

    observer.observe(element);

    return () => observer.disconnect();
  }, [fullscreen]);

  useEffect(() => stopDrawing, [stopDrawing]);

  return {
    wrapper,
    container,
    ready,
    territories: visible as Territory[],
    mapped,
    selected,
    selectedId,
    setSelectedId,
    search,
    setSearch,
    heatmap,
    setHeatmap,
    provider,
    setProvider,
    view,
    setView,
    showNumbers,
    setShowNumbers,
    showHouseholds,
    setShowHouseholds,
    hidePoi,
    setHidePoi,
    zoomIn: () => map.current?.zoomIn(),
    zoomOut: () => map.current?.zoomOut(),
    fullscreen,
    toggleFullscreen,
    editing,
    scope,
    congregationBoundary,
    startEditing,
    cancelEditing,
    saveBoundary,
    clearDrawing,
    draft,
    activeTool,
    pickTool,
    activeLineStyle,
    pickLineStyle,
    labelling,
    saveLabel,
    undo,
    redo,
    locate,
    fitAll,
  };
};

export default useTerritoriesMap;
