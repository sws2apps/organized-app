import { useAppTranslation } from '@hooks/index';
import { SwitchCheckboxType } from './index.types';
import useSwitchCheckbox from './useSwitchCheckbox';
import Checkbox from '@components/checkbox';

const SwitchCheckbox = ({ meeting, week }: SwitchCheckboxType) => {
  const { t } = useAppTranslation();

  const { meetingCanceled, handleToggleCanceled } = useSwitchCheckbox(
    week,
    meeting
  );

  return (
    <Checkbox
      label={t('tr_noMeeting')}
      checked={meetingCanceled}
      onChange={(e) => handleToggleCanceled(e.target.checked)}
    />
  );
};

export default SwitchCheckbox;
