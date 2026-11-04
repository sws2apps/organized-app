import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import { settingsState } from '@states/settings';
import { fieldServiceMeetingPermissions } from '@utils/field_service_meetings';

const useFieldServiceMeetingsPermissions = () => {
  const settings = useAtomValue(settingsState);
  const groups = useAtomValue(fieldWithLanguageGroupsState);
  return useMemo(
    () => fieldServiceMeetingPermissions(settings, groups),
    [settings, groups]
  );
};
export default useFieldServiceMeetingsPermissions;
