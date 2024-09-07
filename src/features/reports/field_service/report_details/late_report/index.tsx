import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { LateReportProps } from './index.types';
import useLateReport from './useLateReport';
import Checkbox from '@components/checkbox';
import Typography from '@components/typography';

const LateReport = ({ person }: LateReportProps) => {
  const { t } = useAppTranslation();

  const { show_late, late_sent, checked, handleChecked, readOnly } =
    useLateReport(person);

  return (
    <>
      {show_late && (
        <Stack spacing="4px" alignItems="flex-end">
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
      )}
    </>
  );
};

export default LateReport;
