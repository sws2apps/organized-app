import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useHourFormat from './useHourFormat';
import SwitchWithLabel from '@components/switch_with_label';

const HourFormat = () => {
  const { t } = useAppTranslation();

  const { isAdmin } = useCurrentUser();

  const { handleHour24Toggle, hour24 } = useHourFormat();

  return (
    <SwitchWithLabel
      label={t('tr_24hFormat')}
      checked={hour24}
      onChange={handleHour24Toggle}
      readOnly={!isAdmin}
    />
  );
};

export default HourFormat;
