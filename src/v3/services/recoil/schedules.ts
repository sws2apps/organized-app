import { promiseSetRecoil } from 'recoil-outside';
import {
  S140DataState,
  S140DownloadOpenState,
  currentScheduleState,
  dlgAssDeleteOpenState,
  dlgAutoFillOpenState,
  isAutoFillSchedState,
  isDeleteSchedState,
  isPublishOpenState,
  s89DataState,
} from '@states/schedules';

export const setPublishPocket = async (value) => {
  await promiseSetRecoil(isPublishOpenState, value);
};

export const setDlgAssDeleteOpen = async (value) => {
  await promiseSetRecoil(dlgAssDeleteOpenState, value);
};

export const setIsDeleteSched = async (value) => {
  await promiseSetRecoil(isDeleteSchedState, value);
};

export const setDlgAutofillOpen = async (value) => {
  await promiseSetRecoil(dlgAutoFillOpenState, value);
};

export const setIsAutofillSched = async (value) => {
  await promiseSetRecoil(isAutoFillSchedState, value);
};

export const setCurrentSchedule = async (value) => {
  await promiseSetRecoil(currentScheduleState, value);
};

export const setS89Data = async (value) => {
  await promiseSetRecoil(s89DataState, value);
};

export const setS140Data = async (value) => {
  await promiseSetRecoil(S140DataState, value);
};

export const setIsS140Download = async (value) => {
  await promiseSetRecoil(S140DownloadOpenState, value);
};
