// ** FOR SETTING STATE OUTSIDE REACT COMPONENTS OR TO AVOID USE OF USECALLBACK ** //

import { promiseGetRecoil, promiseSetRecoil } from 'recoil-outside';
import { SourceWeekType } from '@definition/sources';
import {
  currentWeekState,
  epubFileState,
  isImportEPUBState,
  isImportJWOrgState,
  sourcesState,
} from '@states/sources';

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

export const sourcesFind = async (weekOf: string) => {
  const sources: SourceWeekType[] = await promiseGetRecoil(sourcesState);
  const source = sources.find((record) => record.weekOf === weekOf);

  return source;
};
