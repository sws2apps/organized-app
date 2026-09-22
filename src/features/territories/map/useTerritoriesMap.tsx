import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
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
import { MapColor, TerritoryBoundary } from '@definition/territory';
import {
  MAP_PROVIDERS,
  CONGREGATION_FILL_LAYER,
  CONGREGATION_LINE_LAYER,
  CONGREGATION_SOURCE,
  DEFAULT_BOUNDARY_STYLE,
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  FILL_LAYER,
  LABEL_CAPTION_LAYER,
  LABEL_LAYER,
  LABELS_SOURCE,
  LINE_LAYER,
  MAP_COLORS,
  MapProviderKey,
  SOURCE_ID,
  styleUrl,
} from './constants';
import { ColorView, colorScheme, HEATMAP_YEARS } from './views';
import {
  addAttribution,
  addHouseIcon,
  addLabelBackground,
  LABEL_BACKGROUND,
  captionPlacement,
  captionText,
  LABEL_DETAIL_ZOOM,
  LABEL_TEXT_SIZE,
  numberText,
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

const FILL_OPACITY: maplibregl.ExpressionSpecification = [
  'case',
  ['get', 'filled'],
  ['case', ['get', 'selected'], 0.45, 0.18],
  0,
];

// a border has no transparent option, and an empty fill leaves the area unfilled
const drawnColor = (color: MapColor | 'transparent') =>
  color === 'transparent' ? '' : MAP_COLORS[color];

const useTerritoriesMap = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

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
    const hiddenId =
      editor.editing && editor.scope === 'territory' ? selectedId : undefined;

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
        colorOf: (territory) =>
          colorView === 'original'
            ? drawnColor(
                (territory.boundaryStyle ?? DEFAULT_BOUNDARY_STYLE).border
              ) || MAP_COLORS.blue
            : (colors.get(scheme.keyOf(territory)) ?? ''),
        fillOf:
          colorView === 'original'
            ? (territory) =>
                drawnColor(
                  (territory.boundaryStyle ?? DEFAULT_BOUNDARY_STYLE).fill
                )
            : undefined,
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
    colorView,
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
    addLabelBackground(
      instance,
      getCSSPropertyValue('--white'),
      getCSSPropertyValue('--accent-200')
    );

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
        'fill-color': ['get', 'fill'],
        'fill-opacity': FILL_OPACITY,
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

    const fonts = MAP_PROVIDERS[labelOptions.current.provider].fonts;
    const caption = captionPlacement(labelOptions.current.showNumbers);

    // the caption goes first, so the number badge draws on top of it
    instance.addLayer({
      id: LABEL_CAPTION_LAYER,
      type: 'symbol',
      source: LABELS_SOURCE,
      minzoom: LABEL_DETAIL_ZOOM,
      layout: {
        'text-field': captionText(labelOptions.current, fonts),
        'text-font': [...fonts.regular],
        'text-size': LABEL_TEXT_SIZE,
        'text-line-height': 1.2,
        'text-anchor': caption.anchor,
        'text-offset': caption.offset,
        'text-allow-overlap': false,
      },
      paint: {
        'text-color': getCSSPropertyValue('--black'),
        // a thin, softened halo keeps small text readable over any tile
        'text-halo-color': getCSSPropertyValue('--white'),
        'text-halo-width': 1.5,
        'text-halo-blur': 0.5,
      },
    });

    instance.addLayer({
      id: LABEL_LAYER,
      type: 'symbol',
      source: LABELS_SOURCE,
      layout: {
        visibility: labelOptions.current.showNumbers ? 'visible' : 'none',
        'text-field': numberText(fonts),
        'text-font': [...fonts.number],
        'text-size': LABEL_TEXT_SIZE,
        'text-line-height': 1.15,
        'text-allow-overlap': false,
        'icon-image': LABEL_BACKGROUND,
        'icon-text-fit': 'both',
        // the font keeps extra room above capitals and digits, so the box
        // gives less at the top and more at the bottom to look centred
        'icon-text-fit-padding': [-2, 4, 4, 4],
        'icon-allow-overlap': false,
        // numbers still avoid each other, but don't push away their own
        // caption underneath
        'text-ignore-placement': true,
        'icon-ignore-placement': true,
      },
      paint: {
        'text-color': getCSSPropertyValue('--black'),
        'icon-opacity': 0.92,
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

  // while one territory is edited the rest step back, so the drawing stands out
  useEffect(() => {
    const instance = map.current;
    if (!instance || !styleVersion) return;

    const fade = editor.editing ? 0.5 : 1;

    const set = (
      layer: string,
      property: Parameters<maplibregl.Map['setPaintProperty']>[1],
      value: Parameters<maplibregl.Map['setPaintProperty']>[2]
    ) => {
      if (instance.getLayer(layer)) {
        instance.setPaintProperty(layer, property, value);
      }
    };

    set(FILL_LAYER, 'fill-opacity', ['*', fade, FILL_OPACITY]);
    set(LINE_LAYER, 'line-opacity', fade);
    set(CONGREGATION_FILL_LAYER, 'fill-opacity', 0.06 * fade);
    set(CONGREGATION_LINE_LAYER, 'line-opacity', fade);
    set('drawing-shapes-fill', 'fill-opacity', 0.35 * fade);

    for (const layer of [
      'drawing-shapes-line',
      'drawing-lines-solid',
      'drawing-lines-dashed',
    ]) {
      set(layer, 'line-opacity', fade);
    }

    for (const layer of [LABEL_LAYER, LABEL_CAPTION_LAYER]) {
      set(layer, 'text-opacity', fade);
      set(layer, 'icon-opacity', fade);
    }
  }, [editor.editing, styleVersion]);

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

    const fonts = MAP_PROVIDERS[provider].fonts;
    const caption = captionPlacement(showNumbers);

    instance.setLayoutProperty(
      LABEL_LAYER,
      'visibility',
      showNumbers ? 'visible' : 'none'
    );
    instance.setLayoutProperty(LABEL_LAYER, 'text-field', numberText(fonts));
    instance.setLayoutProperty(LABEL_LAYER, 'text-font', [...fonts.number]);

    instance.setLayoutProperty(
      LABEL_CAPTION_LAYER,
      'text-field',
      captionText({ showHouseholds }, fonts)
    );
    instance.setLayoutProperty(LABEL_CAPTION_LAYER, 'text-font', [
      ...fonts.regular,
    ]);
    instance.setLayoutProperty(
      LABEL_CAPTION_LAYER,
      'text-anchor',
      caption.anchor
    );
    instance.setLayoutProperty(
      LABEL_CAPTION_LAYER,
      'text-offset',
      caption.offset
    );
  }, [showNumbers, showHouseholds, provider, styleVersion]);

  useEffect(() => {
    if (!ready || !selected?.boundary?.length) return;

    flyToBoundary(selected.boundary);
  }, [selectedId, ready, selected?.boundary, flyToBoundary]);

  // set when editing was opened from a territory's page, so saving goes back there
  const returnTo = useRef<string>(undefined);

  // a step that would throw away unsaved drawing waits here for a confirmation
  const [pendingLeave, setPendingLeave] = useState<VoidFunction>();

  const startEditing = useCallback(
    (scope: EditScope = 'territory') => {
      if (scope === 'territory' && !selected) return;

      editor.start(scope, selected, congregationBoundary);
    },
    [editor, selected, congregationBoundary]
  );

  const editRequested = searchParams.get('edit') === '1';

  useEffect(() => {
    if (!ready || !editRequested || !selected || editor.editing) return;

    returnTo.current = `/territories/${selected.id}`;

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

  const goBack = useCallback(() => {
    const target = returnTo.current;
    returnTo.current = undefined;

    if (target) navigate(target);

    return !!target;
  }, [navigate]);

  // leaves editing without saving, back to viewing the map
  const cancelEditing = useCallback(() => {
    editor.finish();
    goBack();
  }, [editor, goBack]);

  const requestLeave = useCallback(
    (action: VoidFunction) => {
      if (editor.dirty) setPendingLeave(() => action);
      else action();
    },
    [editor.dirty]
  );

  const confirmLeave = useCallback(() => {
    pendingLeave?.();
    setPendingLeave(undefined);
  }, [pendingLeave]);

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
                boundaryStyle: draft.boundaryStyle,
                mapShapes: draft.shapes,
                mapLines: draft.lines,
                mapMarkers: draft.markers,
              }
            : item
        )
      );

      displaySnackNotification({
        header: 'Map saved',
        message: `The map of territory ${selected.number} was saved.`,
        severity: 'success',
        icon: <IconCheckCircle color="var(--white)" />,
      });
    }

    editor.finish();

    // the saved territory stays picked, so the result is on screen
    goBack();
  }, [editor, selected, setTerritories, setCongregationBoundary, goBack]);

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
    cancelEditing,
    requestLeave,
    pendingLeave: !!pendingLeave,
    confirmLeave,
    keepEditing: () => setPendingLeave(undefined),
    save,
  };
};

export type TerritoriesMapState = ReturnType<typeof useTerritoriesMap>;

export default useTerritoriesMap;
