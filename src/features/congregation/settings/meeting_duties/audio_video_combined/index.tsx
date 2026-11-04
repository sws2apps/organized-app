import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useAudioVideoCombined from './useAudioVideoCombined';
import SwitchWithLabel from '@components/switch_with_label';

const AudioVideoCombined = () => {
  const { t } = useAppTranslation();

  const { isDutiesEditor } = useCurrentUser();

  const { value, handleValueChange } = useAudioVideoCombined();

  return (
    <SwitchWithLabel
      label={t('tr_dutiesAudioVideoCombined')}
      helper={t('tr_dutiesAudioVideoCombinedDesc')}
      checked={value}
      onChange={handleValueChange}
      readOnly={!isDutiesEditor}
    />
  );
};

export default AudioVideoCombined;
