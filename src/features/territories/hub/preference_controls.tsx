import { useAtom } from 'jotai';
import { Stack } from '@mui/material';
import { Select, Typography } from '@components/index';
import MenuItem from '@components/menuitem';
import SwitchWithLabel from '@components/switch_with_label';
import { useAppTranslation } from '@hooks/index';
import {
  territoriesShowHouseholdsState,
  territoriesShowDoNotCallCountState,
  territoriesShowDoNotCallMapState,
} from '@states/territories';

export const TerritoryDisplaySettings = () => {
  const { t } = useAppTranslation();
  const [households, setHouseholds] = useAtom(territoriesShowHouseholdsState);
  const [doNotCalls, setDoNotCalls] = useAtom(
    territoriesShowDoNotCallCountState
  );
  const [doNotCallMap, setDoNotCallMap] = useAtom(
    territoriesShowDoNotCallMapState
  );
  return (
    <Stack spacing="16px">
      <SwitchWithLabel
        label={t('tr_territoryHouseholds')}
        helper={t('tr_territoryHouseholdsDescription')}
        inputProps={{ 'aria-label': t('tr_territoryHouseholds') }}
        checked={households}
        onChange={setHouseholds}
      />
      <SwitchWithLabel
        label={t('tr_showDoNotCallCount')}
        helper={t('tr_showDoNotCallCountDescription')}
        inputProps={{ 'aria-label': t('tr_showDoNotCallCount') }}
        checked={doNotCalls}
        onChange={setDoNotCalls}
      />
      <SwitchWithLabel
        label={t('tr_showDoNotCallMap')}
        helper={t('tr_showDoNotCallMapDescription')}
        inputProps={{ 'aria-label': t('tr_showDoNotCallMap') }}
        checked={doNotCallMap}
        onChange={setDoNotCallMap}
      />
    </Stack>
  );
};

export const TerritoryOverdueSettings = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => {
  const { t } = useAppTranslation();
  return (
    <Stack spacing="8px">
      <Select
        label={t('tr_territoryOverdue')}
        value={String(value)}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        {[3, 4, 5, 6, 9, 12].map((months) => (
          <MenuItem key={months} value={String(months)}>
            {t('tr_territoryMonths', { count: months })}
          </MenuItem>
        ))}
      </Select>
      <Typography className="body-small-regular" color="var(--grey-400)">
        {t('tr_territoryOverdueDescription')}
      </Typography>
    </Stack>
  );
};
