import { Box } from '@mui/material';
import { useBreakpoints, useUpNavigation } from '@hooks/index';
import PageTitle from '@components/page_title';
import TerritoriesStatistics from '@features/territories/statistics';

const TerritoryStatisticsPage = () => {
  const { goUp } = useUpNavigation();
  const { tablet688Up } = useBreakpoints();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        paddingBottom: tablet688Up ? '0px' : '60px',
      }}
    >
      <PageTitle
        title="Territory coverage statistics"
        onBack={() => goUp('/')}
      />

      <TerritoriesStatistics />
    </Box>
  );
};

export default TerritoryStatisticsPage;
