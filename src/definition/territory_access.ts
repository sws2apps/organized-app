import type {
  TerritoryAccess,
  TerritoryRestrictions,
} from '@definition/territory';

export type TerritoryAccessContext = {
  editor: boolean;
  publisher: string;
  publisherId?: string;
  legacyIdentitySafe?: boolean;
  groupId?: string;
  eligiblePublisher: boolean;
  access: TerritoryAccess;
  groupHolder?: string;
  restricted: TerritoryRestrictions;
};

export type TerritoryServerAccess = {
  scope: string;
  manager: boolean;
  eligible: boolean;
  access: TerritoryAccess;
  groupIds: string[];
  restricted: TerritoryRestrictions;
};
