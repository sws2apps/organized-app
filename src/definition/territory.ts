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
  addedById?: string;
  // where the house is on the map, when it could be found
  position?: [number, number];
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
  dashed?: boolean;
};

export type TerritoryMapLine = {
  id: string;
  path: [number, number][];
  style: 'solid' | 'dashed';
  // drawn before colours existed: solid ones are blue, dashed ones green
  color?: MapColor;
};

export type TerritoryMapDraft = {
  boundary?: TerritoryBoundary;
  boundaryStyle?: MapStyle;
  shapes: TerritoryMapShape[];
  lines: TerritoryMapLine[];
  markers: TerritoryMapMarker[];
};

// how the territory went out: on the phone, or as a printed card to take back
export type AssignmentCard = 'digital' | 'printed';

export type TerritoryAssignment = {
  id: string;
  // always a person; empty only on old records that named a group instead
  publisher: string;
  publisherId?: string;
  groupId?: string;
  // the field service group it went out for, by name; the publisher took it
  group?: string;
  assignedOn: string;
  returnedOn?: string;
  completed?: boolean;
  // the service year the work was returned in, e.g. 2026 for Sep 2025 - Aug 2026
  serviceYear: number;
  months: number;
  startMonth: number;
  endMonth: number;
  // Campaign identity; legacy coverage flags are retained for compatibility.
  campaign?: { id: string; name: string; coverage?: boolean };
  // what the publisher found this time, e.g. the languages spoken; never printed
  note?: string;
  // unset on records from before the choice existed
  card?: AssignmentCard;
};

// a "Special campaign" event in Organized, or the territory app's own entry;
// start and end are calendar days, yyyy-mm-dd
export type TerritoryCampaign = {
  id: string;
  name: string;
  start: string;
  end: string;
  group?: string;
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
  holderId?: string;
  assignedElsewhere?: boolean;
  requestPending?: boolean;
  lastReturnedAt?: string;
  lastCompletedAt?: string;
  holderGroupId?: string;
  holderGroup?: string;
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
  requestedById?: string;
  reviewNeeded?: boolean;
  // standing information, printed on the card: no names or addresses
  notes?: string;
  // a short caution printed in red on the map front, e.g. a dog behind a gate
  warning?: string;
};

// a publisher or a field service group a territory can go to
export type TerritoryAssignee = { id: string; name: string; group: boolean };

// who a territory goes to: a publisher, for themselves or for a group
export type AssignmentHolder = Pick<
  TerritoryAssignment,
  'publisher' | 'group' | 'publisherId' | 'groupId'
>;

export type TerritoryFilters = {
  search: string;
  status: TerritoryStatus[];
  type: TerritoryType[];
  categories: string[];
  coverage?: { covered: boolean; period: string };
  cardLostOnly: boolean;
  // out now for a field service group
  forGroups?: boolean;
  // how the territory is out now; `unknown` for open records without the field
  card: (AssignmentCard | 'unknown')[];
  holder?: string;
  holderId?: string;
  assignedElsewhere?: boolean;
  requestPending?: boolean;
  lastReturnedAt?: string;
  lastCompletedAt?: string;
  holderGroupId?: string;
  // the holder's earlier territories too, not only the ones held now
  holderPast?: boolean;
  // worked for the special campaign, or not yet assigned for it
  campaign?: { id: string; worked: boolean };
};

export type TerritoryAccess = 'own' | 'view' | 'request';

export type TerritoryRecommendations = {
  cooldownMonths: number;
  categories: string[];
  types: TerritoryType[];
};

export const DEFAULT_RECOMMENDATIONS: TerritoryRecommendations = {
  cooldownMonths: 0,
  categories: [],
  types: [],
};

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
  available: 'tr_territoryAvailable',
  in_work: 'tr_territoryInWork',
  overdue: 'tr_overdue',
};

export const STATUS_COLOR: Record<TerritoryStatus, BadgeColor> = {
  available: 'green',
  in_work: 'orange',
  overdue: 'red',
};

export const TYPE_LABEL: Record<TerritoryType, string> = {
  door_to_door: 'tr_territoryTypeDoorToDoor',
  business: 'tr_territoryTypeBusiness',
  phone: 'tr_territoryTypeCall',
};

export const CARD_LABEL: Record<AssignmentCard, string> = {
  digital: 'tr_territoryDigitalMap',
  printed: 'tr_territoryPrintedMap',
};

export const DEFAULT_CATEGORIES: TerritoryCategoryOption[] = [
  { id: 'rural', name: 'Rural', color: 'green' },
];

// once among the defaults; taken out of stored data when it loads
export const RETIRED_CATEGORIES = ['dangerous', 'dogs', 'gated'];

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

// a territory's notes and an assignment's note alike
export const MAX_NOTE_LENGTH = 500;

export const CATEGORY_COLOR_LABEL: Record<CategoryColor, string> = {
  blue: 'tr_blue',
  green: 'tr_green',
  orange: 'tr_orange',
  red: 'tr_territoryRed',
  grey: 'tr_slate',
};
