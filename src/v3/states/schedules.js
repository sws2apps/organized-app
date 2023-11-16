/*
This file holds the source of the truth from the table "sched".
*/

import memoize from 'fast-memoize';
import { atom, selector } from 'recoil';
import { getHistoryInfo } from '@services/cpe/schedules';
import { publicTalkCoordinatorRoleState } from './settings';
import { publicTalksLocaleState } from './publicTalks';
import { shortDateFormatState } from './app';
import { formatDate } from '@services/dateformat';

export const schedulesState = atom({
  key: 'schedules',
  default: [],
});

export const scheduleByWeek = memoize((weekOf) =>
  selector({
    key: `weekOf-${weekOf}`,
    get: ({ get }) => {
      const schedules = get(schedulesState);
      const schedule = schedules.find((record) => record.weekOf === weekOf);

      return schedule;
    },
  })
);

export const isPublishOpenState = atom({
  key: 'isPublishOpen',
  default: false,
});

export const assignmentsHistoryState = selector({
  key: 'assignmentsHistory',
  get: async ({ get }) => {
    const schedules = get(schedulesState);

    let result = [];

    for await (const { weekOf } of schedules) {
      const history = await getHistoryInfo(weekOf);
      result = result.concat(history);
    }

    return result;
  },
});

export const talkHistoryState = selector({
  key: 'talkHistory',
  get: async ({ get }) => {
    const schedules = get(schedulesState);
    const publicTalkCoordinatorRole = get(publicTalkCoordinatorRoleState);
    const talksList = get(publicTalksLocaleState);
    const shortDateFormat = get(shortDateFormatState);

    let result = [];

    if (publicTalkCoordinatorRole) {
      for (const talk of talksList) {
        let history = schedules.filter((schedule) => schedule.public_talk === talk.talk_number);
        history = history.map((record) => {
          const obj = {};
          obj.weekOf = record.weekOf;
          obj.weekOfFormatted = formatDate(record.weekOf, shortDateFormat);
          obj.speaker1 = record.speaker1 || '';
          obj.speaker_1_dispName = record.speaker_1_dispName;
          obj.speaker2 = record.speaker2 || '';
          obj.speaker_2_dispName = record.speaker_2_dispName;
          return obj;
        });

        const obj = {
          talk_number: talk.talk_number,
          history,
          last_delivered: '',
          last_delivered_formatted: '',
        };

        if (history.length > 0) {
          obj.last_delivered = history[0].weekOf;
          obj.last_delivered_formatted = history[0].weekOfFormatted;
        }

        result.push(obj);
      }
    }

    return result;
  },
});

export const dlgAutoFillOpenState = atom({
  key: 'dlgAutoFillOpen',
  default: false,
});

export const isDeleteSchedState = atom({
  key: 'isDeleteSched',
  default: false,
});

export const dlgAssDeleteOpenState = atom({
  key: 'dlgAssDeleteOpen',
  default: false,
});

export const isAutoFillSchedState = atom({
  key: 'isAutoFillSched',
  default: false,
});

export const currentScheduleState = atom({
  key: 'currentSchedule',
  default: '',
});

export const s89DataState = atom({
  key: 's89Data',
  default: [],
});

export const S140DataState = atom({
  key: 'S140Data',
  default: [],
});

export const S140DownloadOpenState = atom({
  key: 'S140DownloadOpen',
  default: false,
});
