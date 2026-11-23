import { useAtomValue } from 'jotai';
import { dutiesScheduleWeeklyState } from '@states/settings';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useMicrophoneSections from './useMicrophoneSections';
import SectionsSettings from '@features/congregation/settings/meeting_duties/sections_settings';
import SwitchWithLabel from '@components/switch_with_label';

const MicrophoneSections = () => {
  const { t } = useAppTranslation();
  const weekly = useAtomValue(dutiesScheduleWeeklyState);

  const { isDutiesEditor } = useCurrentUser();

  const { value, handleValueChange } = useMicrophoneSections();

  return (
    <SwitchWithLabel
      label={t('tr_dutiesMicrophoneSections')}
      action={value && !weekly ? <SectionsSettings /> : undefined}
      helper={t(
        weekly
          ? 'tr_dutiesWeeklyMicrophonesDesc'
          : 'tr_dutiesMicrophoneSectionsDesc'
      )}
      checked={value}
      onChange={handleValueChange}
      readOnly={!isDutiesEditor}
      disabled={weekly}
    />
  );
};

export default MicrophoneSections;
