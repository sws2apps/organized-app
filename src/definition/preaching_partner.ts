export enum PreachingPartnerMinistryType {
  DoorToDoor,
  BibleStudy,
  PublicWitnessing,
  Zoom,
  Phone,
  Flexible,
}

export type PreachingPartnerRequestType = {
  request_uid: string;
  request_data: {
    _deleted: boolean;
    updatedAt: string;
    person_uid: string;
    date: string;
    // an anytime request keeps no start or end
    flexible: boolean;
    start?: string;
    end?: string;
    type: PreachingPartnerMinistryType;
    comment: string;
    partner_uid?: string;
    arranged_at?: string;
  };
};

// doubles as the subpage path segment
export type PreachingPartnerTab = 'my-requests' | 'congregation-requests';

export const PREACHING_PARTNER_TABS: PreachingPartnerTab[] = [
  'my-requests',
  'congregation-requests',
];

export type PreachingPartnerFilterType =
  | 'all'
  | 'door-to-door'
  | 'bible-study'
  | 'public-witnessing'
  | 'zoom'
  | 'phone'
  | 'male'
  | 'female';

export type PreachingPartnerGroupType = {
  date: string;
  requests: PreachingPartnerRequestType[];
};

export type PartnerMutation = {
  action: 'create' | 'edit' | 'join' | 'cancel' | 'delete';
  request: PreachingPartnerRequestType;
  withdrawRequestIds?: string[];
};
