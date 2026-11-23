import appDb from '@db/appDb';
import {
  VolunteerActivityParticipantType,
  VolunteerActivityType,
} from '@definition/volunteer_activities';

const dbUpdateMetadata = async (
  table: 'volunteer_activities' | 'volunteer_activity_participants'
) => {
  const metadata = await appDb.metadata.get(1);

  if (!metadata) return;

  metadata.metadata[table] = {
    ...metadata.metadata[table],
    send_local: true,
  };

  await appDb.metadata.put(metadata);
};

export const dbVolunteerActivitySave = async (
  activity: VolunteerActivityType
) => {
  await appDb.volunteer_activities.put(activity);
  await dbUpdateMetadata('volunteer_activities');
};

export const dbVolunteerParticipantSave = async (
  participant: VolunteerActivityParticipantType
) => {
  await appDb.volunteer_activity_participants.put(participant);
  await dbUpdateMetadata('volunteer_activity_participants');
};
