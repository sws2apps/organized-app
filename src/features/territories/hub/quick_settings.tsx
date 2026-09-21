import { Box, MenuItem, Stack } from '@mui/material';
import { Select, Switch, Typography } from '@components/index';
import QuickSettings from '@features/quick_settings';

export type TerritoriesQuickSettingsProps = {
  open: boolean;
  onClose: VoidFunction;
  showHouseholds: boolean;
  onShowHouseholdsChange: (value: boolean) => void;
  overdueMonths: number;
  onOverdueMonthsChange: (value: number) => void;
};

const TerritoriesQuickSettings = ({
  open,
  onClose,
  showHouseholds,
  onShowHouseholdsChange,
  overdueMonths,
  onOverdueMonthsChange,
}: TerritoriesQuickSettingsProps) => (
  <QuickSettings title="Territories" open={open} onClose={onClose}>
    <Stack spacing="16px" sx={{ width: '100%' }}>
      <Stack
        direction="row"
        spacing="16px"
        sx={{ alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Stack spacing="2px">
          <Typography className="body-regular" color="var(--black)">
            Show households count
          </Typography>
          <Typography className="label-small-regular" color="var(--grey-400)">
            Display the number of households next to every territory
          </Typography>
        </Stack>

        <Switch
          checked={showHouseholds}
          onChange={(_, value) => onShowHouseholdsChange(value)}
        />
      </Stack>

      <Stack
        direction="row"
        spacing="16px"
        sx={{ alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Stack spacing="2px">
          <Typography className="body-regular" color="var(--black)">
            Overdue after
          </Typography>
          <Typography className="label-small-regular" color="var(--grey-400)">
            Months a publisher may hold a territory before it counts as overdue
          </Typography>
        </Stack>

        <Box sx={{ width: '116px', flexShrink: 0 }}>
          <Select
            label="Months"
            value={String(overdueMonths)}
            onChange={(event) =>
              onOverdueMonthsChange(Number(event.target.value))
            }
          >
            {[3, 4, 5, 6, 9, 12].map((months) => (
              <MenuItem key={months} value={String(months)}>
                <Typography className="body-regular">{months}</Typography>
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Stack>
    </Stack>
  </QuickSettings>
);

export default TerritoriesQuickSettings;
