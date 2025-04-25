import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { LANGUAGE_LIST } from '@constants/index';
import { personsActiveState } from '@states/persons';
import { LanguageGroupProps } from './index.types';
import { settingsState, userDataViewState } from '@states/settings';

const useLanguageGroup = ({ group }: LanguageGroupProps) => {
  const persons = useAtomValue(personsActiveState);
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);

  const fullAccess = useMemo(() => {
    return dataView === 'main';
  }, [dataView]);

  const circuit = useMemo(() => {
    return (
      settings.cong_settings.cong_circuit.find(
        (record) => record.type === group.id
      )?.value || ''
    );
  }, [settings, group.id]);

  const group_name = useMemo(() => {
    return `${group.name}, ${circuit}`;
  }, [group.name, circuit]);

  const personsInGroup = useMemo(() => {
    return persons.filter((record) => {
      if (Array.isArray(record.person_data.categories)) {
        return false;
      }

      return record.person_data.categories.value.includes(group.id);
    });
  }, [group.id, persons]);

  const count = useMemo(() => {
    return personsInGroup.length;
  }, [personsInGroup]);

  const language = useMemo(() => {
    return (
      LANGUAGE_LIST.find(
        (record) => record.code.toUpperCase() === group.language.toUpperCase()
      )?.name || ''
    );
  }, [group.language]);

  return { group_name, count, language, fullAccess };
};

export default useLanguageGroup;
