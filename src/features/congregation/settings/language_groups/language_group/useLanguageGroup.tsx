import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useCurrentUser } from '@hooks/index';
import { LANGUAGE_LIST } from '@constants/index';
import { LanguageGroupProps } from './index.types';
import {
  settingsState,
  userDataViewState,
  userLocalUIDState,
} from '@states/settings';

const useLanguageGroup = ({ group }: LanguageGroupProps) => {
  const { isAdmin } = useCurrentUser();

  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const userUID = useAtomValue(userLocalUIDState);

  const fullAccess = useMemo(() => {
    if (!isAdmin) return false;

    return dataView === 'main';
  }, [dataView, isAdmin]);

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
    const groupMembers = group.group_data.members ?? [];

    return groupMembers.length;
  }, [group]);

  const language = useMemo(() => {
    const sourceLanguages = settings.cong_settings.source_material.language;

    const jwLang =
      sourceLanguages.find((record) => record.type === group.group_id)?.value ??
      'E';

    return (
      LANGUAGE_LIST.find(
        (record) => record.code.toUpperCase() === jwLang.toUpperCase()
      )?.name ?? ''
    );
  }, [settings, group.group_id]);

  const allowEdit = useMemo(() => {
    if (isAdmin) return true;

    const member = group.group_data.members.find(
      (record) => record.person_uid === userUID
    );

    return member?.isOverseer || member?.isAssistant || false;
  }, [group, userUID, isAdmin]);

  return { group_name, count, language, fullAccess, allowEdit };
};

export default useLanguageGroup;
