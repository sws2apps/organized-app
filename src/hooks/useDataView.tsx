import { createContext, useContext } from 'react';
import { useAtomValue } from 'jotai';
import { userDataViewState } from '@states/settings';

export const DataViewOverrideContext = createContext<string | null>(null);

export const useDataView = () => {
  const override = useContext(DataViewOverrideContext);
  const globalView = useAtomValue(userDataViewState);
  return override || globalView;
};
