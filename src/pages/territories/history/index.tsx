import { Box } from '@mui/material';
import { useNavigate } from 'react-router';
import { useBreakpoints } from '@hooks/index';
import { IconExport } from '@icons/index';
import PageTitle from '@components/page_title';
import NavBarButton from '@components/nav_bar_button';
import NavBarButtonGroup from '@components/nav_bar_button_group';
import TerritoriesHistory from '@features/territories/history';

const TerritoryHistoryPage = () => {
  const navigate = useNavigate();
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
        title="Assignment history"
        onBack={() => navigate('/territories')}
        buttons={
          <NavBarButtonGroup>
            <NavBarButton text="Export S-13" icon={<IconExport />} />
          </NavBarButtonGroup>
        }
      />

      <TerritoriesHistory />
    </Box>
  );
};

export default TerritoryHistoryPage;
