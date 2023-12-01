import { atom } from 'recoil';

export const isAutoFillSchedState = atom({
  key: 'isAutoFillSched',
  default: false,
});

export const isDeleteSchedState = atom({
  key: 'isDeleteSched',
  default: false,
});

export const isS89OpenState = atom({
  key: 'isS89Open',
  default: false,
});

export const dlgAutoFillOpenState = atom({
  key: 'dlgAutoFillOpen',
  default: false,
});

export const dlgAssDeleteOpenState = atom({
  key: 'dlgAssDeleteOpen',
  default: false,
});

export const isDlgActionOpenState = atom({
  key: 'isDlgActionOpen',
  default: false,
});

export const currentScheduleState = atom({
  key: 'currentSchedule',
  default: '',
});

export const currentScheduleNameState = atom({
  key: 'currentScheduleName',
  default: '',
});

export const currentWeekSchedState = atom({
  key: 'currentWeekSched',
  default: '',
});

export const weekListSchedState = atom({
  key: 'weekListSched',
  default: [],
});

export const weeksToDeleteState = atom({
  key: 'weeksToDelete',
  default: [],
});

export const schedActionTypeState = atom({
  key: 'schedActionType',
  default: '',
});

export const isReloadScheduleState = atom({
  key: 'isReloadSchedule',
  default: false,
});

export const s89DataState = atom({
  key: 's89Data',
  default: [],
});

export const isPublishOpenState = atom({
  key: 'isPublishOpenState',
  default: false,
});

export const publishSchedTypeState = atom({
  key: 'publishSchedType',
  default: 'sws-pocket',
});

export const scheduleToSentState = atom({
  key: 'scheduleToSent',
  default: '',
});

export const reloadWeekSummaryState = atom({
  key: 'reloadWeekSummary',
  default: false,
});

export const scheduleUseFullnameState = atom({
  key: 'scheduleUseFullname',
  default: false,
});

export const refreshCurrentWeekState = atom({
  key: 'refreshCurrentWeek',
  default: false,
});

export const S140DataState = atom({
  key: 'S140Data',
  default: [],
});

export const S140DownloadOpenState = atom({
  key: 'S140DownloadOpen',
  default: false,
});

export const weekendMeetingDownloadOpenState = atom({
  key: 'WeekendMeetingDownloadOpen',
  default: false,
});

export const weekendMeetingDataState = atom({
  key: 'weekendMeetingData',
  default: [],
});

export const S89DownloadOpenState = atom({
  key: 'S89DownloadOpen',
  default: false,
});

export const S89DownloadLoadingState = atom({
  key: 'S89DownloadLoading',
  default: true,
});
