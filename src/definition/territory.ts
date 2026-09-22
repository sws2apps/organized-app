import { BadgeColor } from '@definition/app';

export type TerritoryStatus = 'available' | 'in_work' | 'overdue';

export type TerritoryType = 'door_to_door' | 'business' | 'phone';

// categories are defined by the congregation, so an id is any stored string
export type TerritoryCategory = string;

// a fixed set: the blue is the midweek meeting blue, not the theme accent,
// so a category keeps its colour whatever colour scheme the app uses
export type CategoryColor = 'blue' | 'green' | 'orange' | 'red' | 'grey';

export type TerritoryCategoryOption = {
  id: TerritoryCategory;
  name: string;
  color: CategoryColor;
};

export type DoNotCall = {
  id: string;
  address: string;
  // the householder, when the congregation recorded one
  name?: string;
  date: string;
  addedBy: string;
};

// a closed ring of [longitude, latitude] pairs, in GeoJSON order
export type TerritoryBoundary = [number, number][];

// what a territory carries on the congregation map besides its borders
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

export type TerritoryMapShape = {
  id: string;
  path: TerritoryBoundary;
  border: MapColor | 'transparent';
  fill: MapColor | 'transparent';
  label?: string;
};

export type TerritoryMapLine = {
  id: string;
  path: [number, number][];
  style: 'solid' | 'dashed';
};

export type TerritoryMapDraft = {
  boundary?: TerritoryBoundary;
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
  categories: TerritoryCategory[];
  holder?: string;
  daysOut?: number;
  daysSinceCovered: number;
  households: number;
  // the printed card went missing and has to be printed again
  cardLost: boolean;
  doNotCalls: DoNotCall[];
  assignments: TerritoryAssignment[];
  // the area drawn on the congregation map, when it has been mapped
  boundary?: TerritoryBoundary;
  // streets, walking routes and notes drawn inside that area
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
  categories: TerritoryCategory[];
  // a period the territory was, or was not, covered in
  coverage?: { covered: boolean; period: string };
  cardLostOnly: boolean;
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

// the congregation keeps a short list of its own labels
export const MAX_CATEGORIES = 4;

export const DEFAULT_CATEGORIES: TerritoryCategoryOption[] = [
  { id: 'dangerous', name: 'Dangerous', color: 'red' },
  { id: 'dogs', name: 'Dogs', color: 'orange' },
  { id: 'gated', name: 'Gated access', color: 'blue' },
];

export const CATEGORY_COLORS: CategoryColor[] = [
  'blue',
  'green',
  'orange',
  'red',
  'grey',
];

export const CATEGORY_COLOR_LABEL: Record<CategoryColor, string> = {
  blue: 'Blue',
  green: 'Green',
  orange: 'Orange',
  red: 'Red',
  grey: 'Grey',
};
