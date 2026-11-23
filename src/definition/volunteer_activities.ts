export const DEFAULT_ACTIVITY_START_HOUR = 9;

export type VolunteerActivityType = {
  activity_uid: string;
  activity_data: {
    _deleted: boolean;
    updatedAt: string;
    type: string;
    name: string;
    description: string;
    start: string;
    participant_goal: number;
    allow_extra: boolean;
  };
};

export type VolunteerActivityParticipantType = {
  participation_uid: string;
  participation_data: {
    _deleted: boolean;
    updatedAt: string;
    activity_uid: string;
    person_uid: string;
    person_name: string;
  };
};
