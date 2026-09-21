import { Box } from '@mui/material';
import { useNavigate } from 'react-router';
import { IconListView } from '@icons/index';
import { useBreakpoints } from '@hooks/index';
import NavBarButton from '@components/nav_bar_button';
import NavBarButtonGroup from '@components/nav_bar_button_group';
import PageTitle from '@components/page_title';
import TerritoriesMap from '@features/territories/map';

const TerritoryMapPage = () => {
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
        title="Territory coverage map"
        buttons={
          <NavBarButtonGroup>
            <NavBarButton
              text="Territories"
              icon={<IconListView />}
              onClick={() => navigate('/territories')}
            />
          </NavBarButtonGroup>
        }
      />

      <TerritoriesMap />
    </Box>
  );
};

export default TerritoryMapPage;
