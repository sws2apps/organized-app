import { promiseSetRecoil } from 'recoil-outside';
import { currentWeekState, epubFileState, isImportEPUBState, isImportJWOrgState } from '@states/sources';

export const setEpubFile = async (value: File) => {
  await promiseSetRecoil(epubFileState, value);
};

export const setIsImportEPUB = async (value) => {
  await promiseSetRecoil(isImportEPUBState, value);
};

export const setIsImportJWOrg = async (value) => {
  await promiseSetRecoil(isImportJWOrgState, value);
};

export const setCurrentWeek = async (value) => {
  await promiseSetRecoil(currentWeekState, value);
};
