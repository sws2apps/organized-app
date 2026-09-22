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

export type PreachingPartnerTab = 'mine' | 'congregation';

export type PreachingPartnerFilterType =
  | 'all'
  | 'door-to-door'
  | 'bible-study'
  | 'public-witnessing'
  | 'male'
  | 'female';

export type PreachingPartnerGroupType = {
  date: string;
  requests: PreachingPartnerRequestType[];
};
