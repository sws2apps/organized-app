import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useLateReport from './useLateReport';
import Checkbox from '@components/checkbox';
import Typography from '@components/typography';
import { IconInfo } from '@components/icons';

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
        <Box
          sx={{
            borderRadius: 'var(--radius-xl)',
            padding: '16px',
            backgroundColor: 'var(--orange-secondary)',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          <IconInfo color="var(--orange-dark)" />
          <Typography className="body-small-regular" color="var(--orange-dark)">
            {t('tr_alreadySubmittedWarning')}
          </Typography>
        </Box>
      )}

      <Stack spacing="4px">
        <Checkbox
          readOnly={readOnly}
          label={t('tr_lateReport')}
          checked={checked}
          onChange={(e) => handleChecked(e.target.checked)}
        />
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
