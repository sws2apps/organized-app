import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { LANGUAGE_LIST } from '@constants/index';
import { LanguageGroupProps } from './index.types';
import {
  JWLangState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { languageGroupsState } from '@states/field_service_groups';

const useLanguageGroup = ({ group }: LanguageGroupProps) => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const jwLang = useAtomValue(JWLangState);
  const groups = useAtomValue(languageGroupsState);

  const fullAccess = useMemo(() => {
    return dataView === 'main';
  }, [dataView]);

  const circuit = useMemo(() => {
    return (
      settings.cong_settings.cong_circuit.find(
        (record) => record.type === group.group_id
      )?.value ?? ''
    );
  }, [settings, group.group_id]);

  const group_name = useMemo(() => {
    return `${group.group_data.name}, ${circuit}`;
  }, [group.group_data.name, circuit]);

  const count = useMemo(() => {
    const groupMembers =
      groups.find((record) => record.group_id === group.group_id)?.group_data
        .members ?? [];

    return groupMembers.length;
  }, [group.group_id, groups]);

  const language = useMemo(() => {
    return (
      LANGUAGE_LIST.find(
        (record) => record.code.toUpperCase() === jwLang.toUpperCase()
      )?.name ?? ''
    );
  }, [jwLang]);

  return { group_name, count, language, fullAccess };
};

export default useLanguageGroup;
