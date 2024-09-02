import { Box } from '@mui/material';
import { IconInfo } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import Card from '@components/card';
import Typography from '@components/typography';

const ReportDetails = () => {
  const { t } = useAppTranslation();

  return (
    <Card sx={{ position: 'sticky', top: '72px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <IconInfo color="var(--grey-350)" />
        <Typography color="var(--grey-350)">
          {t('tr_reportPageInfo')}
        </Typography>
      </Box>
    </Card>
  );
};

export default ReportDetails;
