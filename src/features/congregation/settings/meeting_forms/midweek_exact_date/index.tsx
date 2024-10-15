import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useMidweekExactDate from './useMidweekExactDate';
import SwitchWithLabel from '@components/switch_with_label';

const MidweekExactDate = () => {
  const { t } = useAppTranslation();

  const { isMidweekEditor } = useCurrentUser();

  const { displayExactDate, handleDisplayExactDateToggle } =
    useMidweekExactDate();

  return (
    <SwitchWithLabel
      label={t('tr_exactDatesOnMidweekMeetings')}
      helper={t('tr_exactDatesOnMidweekMeetingsDesc')}
      checked={displayExactDate}
      onChange={handleDisplayExactDateToggle}
      readOnly={!isMidweekEditor}
    />
  );
};

export default MidweekExactDate;
