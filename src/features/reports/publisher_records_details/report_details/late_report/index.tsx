import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useLateReport from './useLateReport';
import Checkbox from '@components/checkbox';
import Typography from '@components/typography';
import { IconHelpFilled } from '@components/icons';
import InfoBanner from '@components/info_banner';
import Tooltip from '@components/tooltip';

const LateReport = () => {
  const { t } = useAppTranslation();

  const {
    show_late,
    late_sent,
    checked,
    handleChecked,
    readOnly,
    branch_submitted,
  } = useLateReport();

  if (!show_late) return <></>;

  return (
    <Stack spacing="24px">
      {branch_submitted && (
        <InfoBanner>{t('tr_alreadySubmittedWarning')}</InfoBanner>
      )}

      <Stack spacing="4px">
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
    </Stack>
  );
};

export default LateReport;
