import { useAppTranslation } from '@hooks/index';
import { QuickSettingsHallCleaningProps } from './index.types';
import HallCleaningSettingsBody from '@features/congregation/settings/hall_cleaning/settings_body';
import QuickSettings from '@features/quick_settings';

const QuickSettingsHallCleaning = ({
  open,
  onClose,
}: QuickSettingsHallCleaningProps) => {
  const { t } = useAppTranslation();

  return (
    <QuickSettings title={t('tr_hallCleaning')} open={open} onClose={onClose}>
      <HallCleaningSettingsBody />
    </QuickSettings>
  );
};

export default QuickSettingsHallCleaning;
