import { Table } from 'dexie';
import {
  VolunteerActivityParticipantType,
  VolunteerActivityType,
} from '@definition/volunteer_activities';

export type VolunteerActivitiesTable = {
  volunteer_activities: Table<VolunteerActivityType>;
  volunteer_activity_participants: Table<VolunteerActivityParticipantType>;
};

export const volunteerActivitiesSchema = {
  volunteer_activities: '&activity_uid, activity_data',
  volunteer_activity_participants: '&participation_uid, participation_data',
};
