import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { CongregationVIPType } from './index.types';
import CongregationAdmin from '../congregation_admin';
import CongregationBaptized from '../congregation_baptized';
import Divider from '@components/divider';
import JoinRequests from '../join_requests';
import UsersContainer from '../users_container';
import WaitingLoader from '@components/waiting_loader';

const CongregationVIP = ({ isLoading }: CongregationVIPType) => {
  const { t } = useAppTranslation();

  const { tabletUp } = useBreakpoints();

  return (
    <UsersContainer
      title={t('tr_baptizedAndAppointed')}
      description={t('tr_baptizedAndAppointedDesc')}
    >
      {isLoading && <WaitingLoader size={56} variant="standard" />}

      {!isLoading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <JoinRequests />
          
          <Box
            sx={{
              display: 'flex',
              flexDirection: tabletUp ? 'row' : 'column',
              gap: '16px',
              alignItems: 'stretch',
            }}
          >
            <Box sx={{ flex: 1 }}>
              <CongregationAdmin />
            </Box>
            
            <Divider 
              orientation={tabletUp ? 'vertical' : 'horizontal'} 
              flexItem 
              color="var(--accent-200)" 
            />
            
            <Box sx={{ flex: 1 }}>
              <CongregationBaptized />
            </Box>
          </Box>
        </Box>
      )}
    </UsersContainer>
  );
};

export default CongregationVIP;
