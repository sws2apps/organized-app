import { Box, MenuItem, Stack } from '@mui/material';
import { Select, Typography } from '@components/index';
import SwitchWithLabel from '@components/switch_with_label';
import QuickSettings from '@features/quick_settings';

type TerritoriesQuickSettingsProps = {
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
      <SwitchWithLabel
        label="Show households count"
        helper="Display the number of households next to every territory"
        checked={showHouseholds}
        onChange={onShowHouseholdsChange}
      />

      <Stack
        direction="row"
        spacing="16px"
        sx={{ alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Stack spacing="4px">
          <Typography className="body-regular" color="var(--black)">
            Overdue after
          </Typography>
          <Typography className="label-small-regular" color="var(--grey-350)">
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
