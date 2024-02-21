/*
This file holds the source of the truth from the table "sched".
*/

import memoize from 'fast-memoize';
import { atom, selector } from 'recoil';

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
