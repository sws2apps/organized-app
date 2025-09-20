import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useMicrophoneSections from './useMicrophoneSections';
import SwitchWithLabel from '@components/switch_with_label';

const MicrophoneSections = () => {
  const { t } = useAppTranslation();

  const { isMidweekEditor } = useCurrentUser();

  const { value, handleValueChange } = useMicrophoneSections();

  return (
    <SwitchWithLabel
      label={t('tr_dutiesMicrophoneSections')}
      helper={t('tr_dutiesMicrophoneSectionsDesc')}
      checked={value}
      onChange={handleValueChange}
      readOnly={!isMidweekEditor}
    />
  );
};

export default MicrophoneSections;
