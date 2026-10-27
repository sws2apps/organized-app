export type CircuitOverseerEventCategory =
  | 'midweek'
  | 'weekend'
  | 'field_service'
  | 'appointed_brothers'
  | 'pioneers'
  | 'elders'
  | 'shepherding'
  | 'additional_meeting'
  | 'hospitality';

export type CircuitOverseerEventType = {
  event_uid: string;
  event_data: {
    _deleted: boolean;
    updatedAt: string;
    visit_id: string;
    day: number; // 0 (Monday) – 6 (Sunday) of the visit week
    time: string; // "HH:mm"
    category: CircuitOverseerEventCategory;
    address: string;
    notes: string;
    hosts: string[]; // person_uid, hospitality only
    elders_only: boolean;
  };
};

export type CircuitOverseerVisitDayType = {
  day: number;
  date: Date;
  events: CircuitOverseerEventType[];
};
