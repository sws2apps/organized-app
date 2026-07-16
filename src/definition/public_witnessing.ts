export type PublicWitnessingShiftType = {
  start_time: string; // "HH:mm"
  end_time: string; // "HH:mm"
};

export type PublicWitnessingDayScheduleType = {
  weekday: number; // 1 (Monday) – 7 (Sunday)
  shifts: PublicWitnessingShiftType[];
};

export type PublicWitnessingLocationType = {
  location_uid: string;
  location_data: {
    _deleted: boolean;
    updatedAt: string;
    name: string;
    address: string;
    cart_stored_at: string;
    max_publishers: number;
    description: string;
    sort_index: number;
    schedule: PublicWitnessingDayScheduleType[];
  };
};

export type PublicWitnessingPublisherType = {
  name: string;
  // Set when the publisher is a congregation person; free-text partners
  // (non-app users) have a name only.
  person_uid?: string;
};

export type PublicWitnessingArrangementType = {
  arrangement_uid: string;
  arrangement_data: {
    _deleted: boolean;
    updatedAt: string;
    location_uid: string;
    date: string; // "yyyy/MM/dd"
    start_time: string; // "HH:mm"
    end_time: string; // "HH:mm"
    // person_uid of the author — only the author (and admins) may edit.
    created_by: string;
    partner_needed: boolean;
    // Publishers still wanted when partner_needed; the shift stays joinable
    // until this many partners have been arranged.
    partner_count?: number;
    publishers: PublicWitnessingPublisherType[];
  };
};
