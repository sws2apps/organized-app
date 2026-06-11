import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { CongregationVIPType } from './index.types';
import CongregationAdmin from '../congregation_admin';
import CongregationBaptized from '../congregation_baptized';
import Divider from '@components/divider';
import JoinRequests from '../join_requests';
import WaitingLoader from '@components/waiting_loader';
import { CardSection, CardSectionHeader, CardSectionContent } from '../../settings/shared_styles';
import { ColumnStack, FlexPanel } from '../index.styles';

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
        <ColumnStack>
          <JoinRequests />
          
          <Box
            sx={{
              display: 'flex',
              flexDirection: desktopUp ? 'row' : 'column',
              gap: '16px',
              alignItems: 'stretch',
            }}
          >
            <FlexPanel>
              <CongregationAdmin />
            </FlexPanel>
            
            <Divider 
              orientation={desktopUp ? 'vertical' : 'horizontal'} 
              flexItem 
              color="var(--accent-200)" 
            />
            
            <FlexPanel>
              <CongregationBaptized />
            </FlexPanel>
          </Box>
        </ColumnStack>
      )}
      </CardSectionContent>
    </CardSection>
  );
};

export default CongregationVIP;

