import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useDutiesSistersAll from './useSistersAllDuties';
import SwitchWithLabel from '@components/switch_with_label';

const DutiesSistersAll = () => {
  const { t } = useAppTranslation();

  const { isDutiesEditor } = useCurrentUser();

  const { value, handleValueChange } = useDutiesSistersAll();

  return (
    <SwitchWithLabel
      label={t('tr_dutiesSistersAll')}
      helper={t('tr_dutiesSistersAllDesc')}
      checked={value}
      onChange={handleValueChange}
      readOnly={!isDutiesEditor}
    />
  );
};

export default DutiesSistersAll;
