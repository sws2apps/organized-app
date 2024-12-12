import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useLateReport from './useLateReport';
import Checkbox from '@components/checkbox';
import Typography from '@components/typography';

const LateReport = () => {
  const { t } = useAppTranslation();

  const { show_late, late_sent, checked, handleChecked, readOnly } =
    useLateReport();

  if (!show_late) return <></>;

  return (
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
  );
};

export default LateReport;
