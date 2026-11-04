import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useDutiesSisters from './useSistersDuties';
import SwitchWithLabel from '@components/switch_with_label';

const DutiesSisters = () => {
  const { t } = useAppTranslation();

  const { isDutiesEditor } = useCurrentUser();

  const { value, handleValueChange } = useDutiesSisters();

  return (
    <SwitchWithLabel
      label={t('tr_dutiesAssignSisters')}
      helper={t('tr_dutiesAssignSistersDesc')}
      checked={value}
      onChange={handleValueChange}
      readOnly={!isDutiesEditor}
    />
  );
};

export default DutiesSisters;
