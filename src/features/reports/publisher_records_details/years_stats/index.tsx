import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useYearsStats from './useYearsStats';
import Card from '@components/card';
import ScrollableTabs from '@components/scrollable_tabs';
import Typography from '@components/typography';

const YearsStats = () => {
  const { t } = useAppTranslation();

  const { tabletUp } = useBreakpoints();

  const { tabs, intial_value } = useYearsStats();

  return (
    <Card sx={{ flex: 0.8, width: '100%' }}>
      <Typography className="h2">{t('tr_serviceYear')}</Typography>

      <ScrollableTabs
        variant={tabletUp ? 'fullWidth' : 'scrollable'}
        tabs={tabs}
        value={intial_value}
      />
    </Card>
  );
};

export default YearsStats;
