/*
This file holds the source of the truth from the tables "volunteer_activities"
and "volunteer_activity_participants".
*/

import { atom } from 'jotai';
import {
  VolunteerActivityParticipantType,
  VolunteerActivityType,
} from '@definition/volunteer_activities';
import { userDataViewState } from './settings';

export const volunteerActivitiesDbState = atom<VolunteerActivityType[]>([]);

export const volunteerActivityParticipantsDbState = atom<
  VolunteerActivityParticipantType[]
>([]);

export const volunteerActivitiesState = atom((get) => {
  const activities = get(volunteerActivitiesDbState);
  const dataView = get(userDataViewState);

  return activities
    .filter((record) => {
      if (record.activity_data._deleted) return false;

      if (dataView === 'main') return record.activity_data.type === 'main';

      return (
        record.activity_data.type === 'main' ||
        record.activity_data.type === dataView
      );
    })
    .sort((a, b) => a.activity_data.start.localeCompare(b.activity_data.start));
});

export const volunteerActivityParticipantsState = atom((get) => {
  const participants = get(volunteerActivityParticipantsDbState);

  return participants.filter((record) => !record.participation_data._deleted);
});

export const volunteerActivitiesOpenCountState = atom((get) => {
  const activities = get(volunteerActivitiesState);
  const participants = get(volunteerActivityParticipantsState);
  const now = new Date().toISOString();

  return activities.filter((activity) => {
    if (activity.activity_data.start <= now) return false;

    const count = participants.filter(
      (record) =>
        record.participation_data.activity_uid === activity.activity_uid
    ).length;

    return count < activity.activity_data.participant_goal;
  }).length;
});
