// ** FOR SETTING STATE OUTSIDE REACT COMPONENTS OR TO AVOID USE OF USECALLBACK ** //

import { store } from '@states/index';
import {
  currentWeekState,
  epubFileState,
  isImportEPUBState,
  isImportJWOrgState,
  sourcesState,
} from '@states/sources';

export const setEpubFile = (value: File) => {
  store.set(epubFileState, value);
};

export const setIsImportEPUB = (value: boolean) => {
  store.set(isImportEPUBState, value);
};

export const setIsImportJWOrg = (value: boolean) => {
  store.set(isImportJWOrgState, value);
};

export const setCurrentWeek = (value: string) => {
  store.set(currentWeekState, value);
};

export const sourcesFind = (weekOf: string) => {
  const sources = store.get(sourcesState);
  const source = sources.find((record) => record.weekOf === weekOf);

  return source;
};
