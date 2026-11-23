import { useAppTranslation } from '@hooks/index';
import { Stack } from '@mui/material';
import { useAtomValue } from 'jotai';
import QuickSettings from '@features/quick_settings';
import { territoryLocalModeState } from '@states/territories';
import RecommendationSettings from '@features/territories/hub/recommendation_settings';
import {
  TerritoryDisplaySettings,
  TerritoryOverdueSettings,
} from '@features/territories/hub/preference_controls';

type TerritoriesQuickSettingsProps = {
  open: boolean;
  onClose: VoidFunction;
  overdueMonths: number;
  onOverdueMonthsChange: (value: number) => void;
};

const TerritoriesQuickSettings = ({
  open,
  onClose,
  overdueMonths,
  onOverdueMonthsChange,
}: TerritoriesQuickSettingsProps) => {
  const { t } = useAppTranslation();

  const local = useAtomValue(territoryLocalModeState);
  return (
    <QuickSettings title={t('tr_territories')} open={open} onClose={onClose}>
      <Stack spacing="16px" sx={{ width: '100%' }}>
        <TerritoryDisplaySettings />
        <TerritoryOverdueSettings
          value={overdueMonths}
          onChange={onOverdueMonthsChange}
        />
        {local && <RecommendationSettings />}
      </Stack>
    </QuickSettings>
  );
};
export default TerritoriesQuickSettings;
