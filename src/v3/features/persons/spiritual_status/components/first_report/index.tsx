import { Box } from '@mui/material';
import DatePicker from '@components/date_picker';
import Typography from '@components/typography';
import { FirstReportType } from './index.types';
import { useAppTranslation } from '@hooks/index';

const FirstReport = ({ onChange, value }: FirstReportType) => {
  const { t } = useAppTranslation();

  return (
    <Box>
      <DatePicker label={t('tr_firstReport')} value={value === null ? null : new Date(value)} onChange={onChange} />
      <Typography className="label-small-regular" color="var(--grey-350)" sx={{ padding: '4px 16px 0px 16px' }}>
        {t('tr_firstReportDesc')}
      </Typography>
    </Box>
  );
};

export default FirstReport;
