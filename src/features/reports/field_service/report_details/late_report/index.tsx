import { Box, Stack } from '@mui/material';
import { IconHelpFilled } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { LateReportProps } from './index.types';
import useLateReport from './useLateReport';
import Checkbox from '@components/checkbox';
import Typography from '@components/typography';
import Tooltip from '@components/tooltip';

const LateReport = ({ person }: LateReportProps) => {
  const { t } = useAppTranslation();

  const { show_late, late_sent, checked, handleChecked, readOnly } =
    useLateReport(person);

  return (
    <>
      {show_late && (
        <Stack spacing="4px" alignItems="flex-end">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              readOnly={readOnly}
              label={t('tr_lateReport')}
              checked={checked}
              onChange={(e) => handleChecked(e.target.checked)}
              sx={{ marginRight: '4px' }}
            />
            <Tooltip
              title={t('tr_lateReportTooltip')}
              placement="bottom-start"
              variant="icon"
            >
              <IconHelpFilled width={16} height={16} />
            </Tooltip>
          </Box>

          <Typography
            align="right"
            className="label-small-medium"
            color="var(--grey-400)"
          >
            {late_sent}
          </Typography>
        </Stack>
      )}
    </>
  );
};

export default LateReport;
