import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import * as maplibregl from 'maplibre-gl';
import { IconCheckCircle } from '@icons/index';
import { displaySnackNotification } from '@services/states/app';
import { getCSSPropertyValue } from '@utils/common';
import { isDarkThemeState } from '@states/app';
import {
  congregationBoundaryState,
  territoriesState,
  territoriesWithStatusState,
} from '@states/territories';
import { TerritoryBoundary } from '@definition/territory';
import {
  MAP_PROVIDERS,
  CONGREGATION_FILL_LAYER,
  CONGREGATION_LINE_LAYER,
  CONGREGATION_SOURCE,
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  FILL_LAYER,
  LABEL_LAYER,
  LABELS_SOURCE,
  LINE_LAYER,
  MapProviderKey,
  SOURCE_ID,
  styleUrl,
} from './constants';
import { ColorView, colorScheme, HEATMAP_YEARS } from './views';
import {
  addAttribution,
  addHouseIcon,
  labelText,
  resolveColor,
  allMarkers,
  boundaryBounds,
  boundaryCollection,
  labelCollection,
} from './helpers';
import { addDrawingLayers, setDrawingData } from './layers';
import { MarkerRegistry, syncMarkers } from './markers';
import useFullscreen from './useFullscreen';
import useMapEditor, { EditScope } from './useMapEditor';

const ZOOM_STEP = 0.5;

const useTerritoriesMap = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setTerritories = useSetAtom(territoriesState);
  const withStatus = useAtomValue(territoriesWithStatusState);

  const territories = useMemo(
    () => withStatus.filter((territory) => territory.type !== 'phone'),
    [withStatus]
  );
  const [congregationBoundary, setCongregationBoundary] = useAtom(
    congregationBoundaryState
  );
  const isDark = useAtomValue(isDarkThemeState);

  const wrapper = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map>(null);
  const markers = useRef<MarkerRegistry>(new Map());
  const style = useRef('');

  const [ready, setReady] = useState(false);
  const [styleVersion, setStyleVersion] = useState(0);
  const [search, setSearch] = useState('');
  const [colorView, setColorView] = useState<ColorView>('status');

  const [heatmapYear, setHeatmapYear] = useState(HEATMAP_YEARS()[0]);

  const scheme = useMemo(
    () => colorScheme(colorView, heatmapYear),
    [colorView, heatmapYear]
  );
  const [provider, setProvider] = useState<MapProviderKey>('carto');
  const [showNumbers, setShowNumbers] = useState(true);
  const [showHouseholds, setShowHouseholds] = useState(false);

  const { fullscreen, toggleFullscreen } = useFullscreen(wrapper, map);

  const selectedId = searchParams.get('territory') ?? undefined;
  const selected = territories.find((item) => item.id === selectedId);

  const mapped = territories.filter((item) => item.boundary?.length).length;

  const flyToBoundary = useCallback((boundary: TerritoryBoundary) => {
    const [west, south, east, north] = boundaryBounds(boundary);

    map.current?.fitBounds([west, south, east, north], {
      padding: 80,
      maxZoom: 16,
    });
  }, []);

  const handleEditStart = useCallback(
    (boundary?: TerritoryBoundary) => {
      if (boundary?.length) flyToBoundary(boundary);
    },
    [flyToBoundary]
  );

  const editor = useMapEditor({ map, onStart: handleEditStart });

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
    const hiddenId = editor.editing ? selectedId : undefined;

    const colors = new Map(
      scheme.buckets.map((entry) => [entry.key, resolveColor(entry.color)])
    );
    const rest = territories.filter((item) => item.id !== hiddenId);

    const border: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features:
        congregationBoundary?.length &&
        !(editor.editing && editor.scope === 'congregation')
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
        colorOf: (territory) => colors.get(scheme.keyOf(territory)) ?? '',
        detailOf: scheme.detailOf,
        selectedId,
        hiddenId,
      }),
      rest,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    territories,
    congregationBoundary,
    editor.editing,
    editor.scope,
    selectedId,
    scheme,
    isDark,
  ]);

  const labelOptions = useRef({ showNumbers, showHouseholds, provider });
  labelOptions.current = { showNumbers, showHouseholds, provider };

  const dataRef = useRef(data);
  dataRef.current = data;

  const setSelectedId = useCallback(
    (id?: string) => {
      setSearchParams(id ? { territory: id } : {}, { replace: true });
    },
    [setSearchParams]
  );

  // layers live on the style, so they are re-applied whenever the style is swapped
  const applyLayers = useCallback(() => {
    const instance = map.current;
    if (!instance || instance.getSource(SOURCE_ID)) return;

    const current = dataRef.current;

    addHouseIcon(instance, getCSSPropertyValue('--black')).catch(console.error);

    instance.addSource(CONGREGATION_SOURCE, {
      type: 'geojson',
      data: current.border,
    });
    instance.addSource(SOURCE_ID, { type: 'geojson', data: current.areas });
    instance.addSource(LABELS_SOURCE, {
      type: 'geojson',
      data: labelCollection(current.areas),
    });

    instance.addLayer({
      id: CONGREGATION_FILL_LAYER,
      type: 'fill',
      source: CONGREGATION_SOURCE,
      paint: {
        'fill-color': getCSSPropertyValue('--accent-main'),
        'fill-opacity': 0.06,
      },
    });

    instance.addLayer({
      id: CONGREGATION_LINE_LAYER,
      type: 'line',
      source: CONGREGATION_SOURCE,
      paint: {
        'line-color': getCSSPropertyValue('--accent-dark'),
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

    addDrawingLayers(instance, current.rest);

    instance.addLayer({
      id: LABEL_LAYER,
      type: 'symbol',
      source: LABELS_SOURCE,
      layout: {
        'text-field': labelText(
          labelOptions.current,
          MAP_PROVIDERS[labelOptions.current.provider].fonts
        ),
        'text-font': [
          ...MAP_PROVIDERS[labelOptions.current.provider].fonts.regular,
        ],
        'text-size': 12,
        'text-line-height': 1.3,
        'text-allow-overlap': false,
      },
      paint: {
        'text-color': getCSSPropertyValue('--black'),
        'text-halo-color': getCSSPropertyValue('--white'),
        'text-halo-width': 2,
      },
    });
  }, []);

  useEffect(() => {
    if (!container.current || map.current) return;

    style.current = styleUrl(provider, isDark);

    const instance = new maplibregl.Map({
      container: container.current,
      style: style.current,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
    });

    addAttribution(instance);

    instance.scrollZoom.setWheelZoomRate(1 / 900);
    instance.scrollZoom.setZoomRate(1 / 200);

    map.current = instance;

    // 'style.load' is the first point a custom layer is accepted, and it fires
    // again after the theme swaps the basemap
    instance.on('style.load', () => {
      applyLayers();
      setReady(true);
      setStyleVersion((version) => version + 1);
    });

    instance.on('click', FILL_LAYER, (event: maplibregl.MapLayerMouseEvent) => {
      if (editor.active.current) return;

      const id = event.features?.[0]?.properties?.id;
      if (typeof id === 'string') setSelectedId(id);
    });

    instance.on('mouseenter', FILL_LAYER, () => {
      instance.getCanvas().style.cursor = 'pointer';
    });

    instance.on('mouseleave', FILL_LAYER, () => {
      instance.getCanvas().style.cursor = '';
    });

    const registry = markers.current;

    return () => {
      syncMarkers(instance, [], registry);
      instance.remove();
      map.current = null;
      setReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // swapping the style drops every other layer, terra draw's too, so only on a real basemap change
  useEffect(() => {
    const next = styleUrl(provider, isDark);

    if (!map.current || !ready || next === style.current) return;

    style.current = next;
    map.current.setStyle(next);
  }, [isDark, provider, ready]);

  useEffect(() => {
    const instance = map.current;
    if (!instance || !ready) return;

    const source = (id: string) =>
      instance.getSource(id) as maplibregl.GeoJSONSource | undefined;

    source(CONGREGATION_SOURCE)?.setData(data.border);
    source(SOURCE_ID)?.setData(data.areas);
    source(LABELS_SOURCE)?.setData(labelCollection(data.areas));
    setDrawingData(instance, data.rest);
    syncMarkers(instance, allMarkers(data.rest), markers.current);

    // without this the first frame can stay empty until something else moves
    instance.triggerRepaint();
  }, [data, ready]);

  useEffect(() => {
    const instance = map.current;
    if (!instance || !styleVersion) return;

    for (const layer of instance.getStyle()?.layers ?? []) {
      if (!/^poi/i.test(layer.id)) continue;

      instance.setLayoutProperty(layer.id, 'visibility', 'none');
    }
  }, [styleVersion]);

  useEffect(() => {
    const instance = map.current;
    if (!instance || !styleVersion || !instance.getLayer(LABEL_LAYER)) return;

    instance.setLayoutProperty(
      LABEL_LAYER,
      'text-field',
      labelText({ showNumbers, showHouseholds }, MAP_PROVIDERS[provider].fonts)
    );
    instance.setLayoutProperty(LABEL_LAYER, 'text-font', [
      ...MAP_PROVIDERS[provider].fonts.regular,
    ]);
  }, [showNumbers, showHouseholds, provider, styleVersion]);

  useEffect(() => {
    if (!ready || !selected?.boundary?.length) return;

    flyToBoundary(selected.boundary);
  }, [selectedId, ready, selected?.boundary, flyToBoundary]);

  const [editMode, setEditMode] = useState(false);
  const editingId = useRef<string>(undefined);

  const startEditing = useCallback(
    (scope: EditScope = 'territory') => {
      if (scope === 'territory' && !selected) return;

      editingId.current = scope === 'territory' ? selected?.id : undefined;
      setEditMode(true);
      editor.start(scope, selected, congregationBoundary);
    },
    [editor, selected, congregationBoundary]
  );

  const editRequested = searchParams.get('edit') === '1';

  useEffect(() => {
    if (!ready || !editRequested || !selected || editor.editing) return;

    setSearchParams({ territory: selected.id }, { replace: true });
    startEditing('territory');
  }, [
    ready,
    editRequested,
    selected,
    editor.editing,
    setSearchParams,
    startEditing,
  ]);

  const save = useCallback(() => {
    const { draft, scope } = editor;

    if (!draft.boundary?.length) return;

    if (scope === 'congregation') {
      setCongregationBoundary(draft.boundary);

      displaySnackNotification({
        header: 'Congregation border saved',
        message: 'The outer border of the congregation was updated.',
        severity: 'success',
        icon: <IconCheckCircle color="var(--white)" />,
      });
    } else if (selected) {
      setTerritories((prev) =>
        prev.map((item) =>
          item.id === selected.id
            ? {
                ...item,
                boundary: draft.boundary,
                mapShapes: draft.shapes,
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
    }

    editor.finish();
  }, [editor, selected, setTerritories, setCongregationBoundary]);

  const leaveEditing = useCallback(() => {
    if (!editor.editing) return;

    if (editor.draft.boundary?.length) save();
    else editor.finish();

    editingId.current = undefined;
  }, [editor, save]);

  const setMode = useCallback(
    (next: 'view' | 'edit') => {
      if (next === 'view') {
        leaveEditing();
        setEditMode(false);
        return;
      }

      setEditMode(true);
      if (selected) startEditing('territory');
    },
    [leaveEditing, selected, startEditing]
  );

  useEffect(() => {
    if (!editMode || !selected || editor.scope === 'congregation') return;
    if (editor.editing && editingId.current === selected.id) return;

    leaveEditing();
    startEditing('territory');
    // only a new selection should move the drawing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, selected?.id]);

  const switchScope = useCallback(
    (scope: EditScope) => {
      if (editor.editing && scope === editor.scope) return;

      leaveEditing();

      if (scope === 'territory' && !selected) return;
      startEditing(scope);
    },
    [editor.editing, editor.scope, leaveEditing, selected, startEditing]
  );

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

    if (all.length > 0) flyToBoundary(all);
  }, [territories, congregationBoundary, flyToBoundary]);

  return {
    wrapper,
    container,
    territories: visible,
    mapped,
    selected,
    selectedId,
    setSelectedId,
    search,
    setSearch,
    colorView,
    setColorView,
    heatmapYear,
    setHeatmapYear,
    provider,
    setProvider,
    showNumbers,
    setShowNumbers,
    showHouseholds,
    setShowHouseholds,
    fullscreen,
    toggleFullscreen,
    zoomIn: () => map.current?.zoomTo(map.current.getZoom() + ZOOM_STEP),
    zoomOut: () => map.current?.zoomTo(map.current.getZoom() - ZOOM_STEP),
    locate,
    fitAll,
    editor,
    startEditing,
    switchScope,
    editMode,
    setMode,
    cancelEditing: () => {
      editor.finish();
      editingId.current = undefined;
      setEditMode(false);
    },
    save,
  };
};

export type TerritoriesMapState = ReturnType<typeof useTerritoriesMap>;

export default useTerritoriesMap;
