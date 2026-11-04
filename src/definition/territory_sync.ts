import type {
  MapColor,
  TerritoryBoundary,
  TerritoryCategoryOption,
  TerritoryRecommendations,
  Territory,
  TerritoryAccess,
  TerritoryType,
} from '@definition/territory';

export type TerritoryWireAssignment = {
  id: string;
  personId: string;
  groupId?: string;
  campaignId?: string;
  assignedAt: string;
  returnedAt?: string;
  completed?: boolean;
  notes?: string;
  content?: string;
  card?: 'digital' | 'printed';
};
export type TerritoryWireDetails = {
  dataView: string;
  type: TerritoryType;
  categories: string[];
  cardLost: boolean;
  households?: number;
  content: string;
  privateContent: string;
};
export type TerritoryWireRecord = TerritoryWireDetails & {
  id: string;
  revision: number;
  updatedAt: string;
  deleted: boolean;
  requestedBy?: string;
  inUse?: boolean;
  requestPending?: boolean;
  lastReturnedAt?: string;
  lastCompletedAt?: string;
  assignment?: TerritoryWireAssignment;
  history: TerritoryWireAssignment[];
  doNotCalls: { id: string; addedBy: string; content: string }[];
};
export type TerritoryGrant = {
  personId: string;
  eligible: boolean;
  access: TerritoryAccess;
  groupIds: string[];
  dataViews: string[];
  restrictedCategories: string[];
  restrictedTypes: TerritoryType[];
};
export type TerritoryWirePolicy = {
  revision: number;
  grants: TerritoryGrant[];
  content: string;
};
export type TerritorySnapshot = {
  manager: boolean;
  revision: number;
  policy: TerritoryWirePolicy;
  records: TerritoryWireRecord[];
};
export type TerritoryCommand = { expectedRevision: number } & (
  | {
      action: 'reconcile';
      details: TerritoryWireDetails;
      assignment?: TerritoryWireAssignment;
      history: TerritoryWireAssignment[];
      requestedBy?: string;
      doNotCalls: TerritoryWireRecord['doNotCalls'];
    }
  | { action: 'delete' | 'request' | 'cancel_request' }
  | {
      action: 'return';
      completed: boolean;
      notes?: string;
      returnedAt?: string;
      households?: number;
    }
  | { action: 'assignment_note'; notes: string }
  | { action: 'do_not_call'; entryId: string; content?: string }
);
export type TerritoryBatch = {
  expectedRevision: number;
  operationId: string;
  commands: { id: string; command: TerritoryCommand }[];
};
export type TerritoryPendingChange = {
  id: string;
  dataView: string;
  before?: Territory;
  after?: Territory;
  baseRevision: number;
};
export type TerritoryPendingOperation = {
  id: string;
  changes: TerritoryPendingChange[];
  prepared?: TerritoryBatch;
};
export type TerritorySyncState = {
  scope: string;
  settings?: TerritorySharedSettings;
  settingsDirty?: boolean;
  settingsBaseline?: TerritorySharedSettings;
  localGrants?: TerritoryGrant[];
  queue: TerritoryPendingOperation[];
  revision: number;
};
export type TerritorySyncStatus =
  | 'idle'
  | 'pending'
  | 'syncing'
  | 'conflict'
  | 'identity'
  | 'unavailable'
  | 'failed';

export type TerritorySharedSettings = {
  categories: TerritoryCategoryOption[];
  boundary?: TerritoryBoundary;
  borderColor: MapColor;
  borderDashed: boolean;
  recommendations: TerritoryRecommendations;
  overdueMonths: number;
};

export type TerritoryPendingReview = {
  queue: TerritoryPendingOperation[];
  settings?: TerritorySharedSettings;
};
export type TerritorySettingsUpdate = {
  dirty: boolean;
  baseline?: TerritorySharedSettings;
  sent?: TerritorySharedSettings;
};
