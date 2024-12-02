import { Stack } from '@mui/material';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useFirstReport from './useFirstReport';
import DatePicker from '@components/date_picker';
import Typography from '@components/typography';

const FirstReport = () => {
  const { t } = useAppTranslation();

  const { isPersonEditor } = useCurrentUser();

  const { handleChangeFirstReport, value } = useFirstReport();

  return (
    <Stack>
      <DatePicker
        label={t('tr_firstReport')}
        value={value}
        onChange={handleChangeFirstReport}
        maxDate={new Date()}
        readOnly={!isPersonEditor}
      />

      <Typography
        className="label-small-regular"
        color="var(--grey-350)"
        sx={{ padding: '8px 16px 0px 16px' }}
      >
        {t('tr_firstReportDesc')}
      </Typography>
    </Stack>
  );
};

export default FirstReport;
