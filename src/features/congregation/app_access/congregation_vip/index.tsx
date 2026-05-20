import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { CongregationVIPType } from './index.types';
import CongregationAdmin from '../congregation_admin';
import CongregationBaptized from '../congregation_baptized';
import Divider from '@components/divider';
import JoinRequests from '../join_requests';
import WaitingLoader from '@components/waiting_loader';
import { CardSection, CardSectionHeader, CardSectionContent } from '../../settings/shared_styles';

const CongregationVIP = ({ isLoading }: CongregationVIPType) => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  return (
    <CardSection>
      <CardSectionHeader
        title={t('tr_baptizedAndAppointed')}
        description={t('tr_baptizedAndAppointedDesc')}
      />
      <CardSectionContent>
      {isLoading && <WaitingLoader size={56} variant="standard" />}

      {!isLoading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <JoinRequests />
          
          <Box
            sx={{
              display: 'flex',
              flexDirection: desktopUp ? 'row' : 'column',
              gap: '16px',
              alignItems: 'stretch',
            }}
          >
            <Box sx={{ flex: 1 }}>
              <CongregationAdmin />
            </Box>
            
            <Divider 
              orientation={desktopUp ? 'vertical' : 'horizontal'} 
              flexItem 
              color="var(--accent-200)" 
            />
            
            <Box sx={{ flex: 1 }}>
              <CongregationBaptized />
            </Box>
          </Box>
        </Box>
      )}
      </CardSectionContent>
    </CardSection>
  );
};

export default CongregationVIP;
