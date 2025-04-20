// ** FOR SETTING STATE OUTSIDE REACT COMPONENTS OR TO AVOID USE OF USECALLBACK ** //

import { store } from '@states/index';
import {
  S140DataState,
  S140DownloadOpenState,
  assignmentsHistoryState,
  currentScheduleState,
  dlgAssDeleteOpenState,
  dlgAutoFillOpenState,
  isAutoFillSchedState,
  isDeleteSchedState,
  isPublishOpenState,
  s89DataState,
} from '@states/schedules';
import {
  AssignmentHistoryType,
  MidweekMeetingDataType,
  S89DataType,
} from '@definition/schedules';

export const setPublishPocket = (value: boolean) => {
  store.set(isPublishOpenState, value);
};

export const setDlgAssDeleteOpen = (value: boolean) => {
  store.set(dlgAssDeleteOpenState, value);
};

export const setIsDeleteSched = (value: boolean) => {
  store.set(isDeleteSchedState, value);
};

export const setDlgAutofillOpen = (value: boolean) => {
  store.set(dlgAutoFillOpenState, value);
};

export const setIsAutofillSched = (value: boolean) => {
  store.set(isAutoFillSchedState, value);
};

export const setCurrentSchedule = (value: string) => {
  store.set(currentScheduleState, value);
};

export const setS89Data = (value: S89DataType[]) => {
  store.set(s89DataState, value);
};

export const setS140Data = (value: MidweekMeetingDataType[]) => {
  store.set(S140DataState, value);
};

export const setIsS140Download = (value: boolean) => {
  store.set(S140DownloadOpenState, value);
};

export const setAssignmentsHistory = (value: AssignmentHistoryType[]) => {
  store.set(assignmentsHistoryState, value);
};
