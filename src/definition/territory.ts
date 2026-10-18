import { BadgeColor } from '@definition/app';

export type TerritoryStatus = 'available' | 'in_work' | 'overdue';

export type TerritoryType = 'door_to_door' | 'business' | 'phone';

// a fixed set: the blue is the midweek meeting blue, not the theme accent,
// so a category keeps its colour whatever colour scheme the app uses
export type CategoryColor = 'blue' | 'green' | 'orange' | 'red' | 'grey';

export type TerritoryCategoryOption = {
  id: string;
  name: string;
  color: CategoryColor;
};

export type DoNotCall = {
  id: string;
  address: string;
  name?: string;
  date: string;
  addedBy: string;
};

// a closed ring of [longitude, latitude] pairs, in GeoJSON order
export type TerritoryBoundary = [number, number][];

export type MapColor = 'red' | 'blue' | 'green' | 'orange' | 'purple' | 'black';

export type PinType =
  | 'normal'
  | 'parking'
  | 'restaurant'
  | 'transport'
  | 'shop'
  | 'nature'
  | 'gas'
  | 'sight'
  | 'building'
  | 'school'
  | 'cart';

export type TerritoryMapMarker = {
  id: string;
  kind: 'pin' | 'text';
  position: [number, number];
  text?: string;
  pinType?: PinType;
  color?: MapColor;
};

export type MapStyle = {
  border: MapColor | 'transparent';
  fill: MapColor | 'transparent';
};

export type TerritoryMapShape = MapStyle & {
  id: string;
  path: TerritoryBoundary;
  label?: string;
};

export type TerritoryMapLine = {
  id: string;
  path: [number, number][];
  style: 'solid' | 'dashed';
};

export type TerritoryMapDraft = {
  boundary?: TerritoryBoundary;
  boundaryStyle?: MapStyle;
  shapes: TerritoryMapShape[];
  lines: TerritoryMapLine[];
  markers: TerritoryMapMarker[];
};

export type TerritoryAssignment = {
  id: string;
  publisher: string;
  assignedOn: string;
  returnedOn?: string;
  // the service year the work was returned in, e.g. 2026 for Sep 2025 - Aug 2026
  serviceYear: number;
  months: number;
  startMonth: number;
  endMonth: number;
};

export type Territory = {
  id: string;
  number: string;
  name: string;
  city: string;
  type: TerritoryType;
  status: TerritoryStatus;
  categories: string[];
  holder?: string;
  daysOut?: number;
  daysSinceCovered: number;
  households: number;
  cardLost: boolean;
  doNotCalls: DoNotCall[];
  assignments: TerritoryAssignment[];
  boundary?: TerritoryBoundary;
  boundaryStyle?: MapStyle;
  mapShapes?: TerritoryMapShape[];
  mapLines?: TerritoryMapLine[];
  mapMarkers?: TerritoryMapMarker[];
  phoneNumbers?: string[];
  requestedBy?: string;
  reviewNeeded?: boolean;
};

export type TerritoryFilters = {
  search: string;
  status: TerritoryStatus[];
  type: TerritoryType[];
  categories: string[];
  coverage?: { covered: boolean; period: string };
  cardLostOnly: boolean;
};

export type TerritoryAccess = 'own' | 'view' | 'request';

export type TerritoryRestrictions = {
  categories: string[];
  types: TerritoryType[];
};

export type TerritoryTab =
  | 'requests'
  | 'recommended'
  | 'all'
  | 'mine'
  | 'group'
  | 'requested';

export const STATUS_LABEL: Record<TerritoryStatus, string> = {
  available: 'Available',
  in_work: 'In work',
  overdue: 'Overdue',
};

export const STATUS_COLOR: Record<TerritoryStatus, BadgeColor> = {
  available: 'green',
  in_work: 'orange',
  overdue: 'red',
};

export const TYPE_LABEL: Record<TerritoryType, string> = {
  door_to_door: 'Door to door',
  business: 'Business',
  phone: 'Call',
};

export const DEFAULT_CATEGORIES: TerritoryCategoryOption[] = [
  { id: 'dangerous', name: 'Dangerous', color: 'red' },
  { id: 'dogs', name: 'Dogs', color: 'orange' },
  { id: 'gated', name: 'Gated access', color: 'blue' },
  { id: 'rural', name: 'Rural', color: 'green' },
];

export const CATEGORY_COLORS: CategoryColor[] = [
  'blue',
  'green',
  'orange',
  'red',
  'grey',
];

// one category per color, so each stays recognisable at a glance
export const MAX_CATEGORIES = CATEGORY_COLORS.length;

export const MAX_CATEGORY_NAME = 20;

export const CATEGORY_COLOR_LABEL: Record<CategoryColor, string> = {
  blue: 'Blue',
  green: 'Green',
  orange: 'Orange',
  red: 'Red',
  grey: 'Grey',
};
