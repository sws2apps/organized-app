import { useQueryClient } from '@tanstack/react-query';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import Typography from '@mui/material/Typography';
import { congSpeakersRequestsState } from '../../states/congregation';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import {
  apiApproveCongregationSpeakersRequest,
  apiDisapproveCongregationSpeakersRequest,
  apiGetCongregationSpeakersRequests,
} from '../../api';

const CongregationSpeakersRequests = () => {
  const { t } = useTranslation('ui');

  const queryClient = useQueryClient();

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const speakersRequests = useRecoilValue(congSpeakersRequestsState);

  const handleApprove = async (cong_id) => {
    try {
      const { status } = await apiApproveCongregationSpeakersRequest(cong_id);
      if (status === 200) {
        await queryClient.prefetchQuery({
          queryKey: ['congregationSpeakersRequests'],
          queryFn: apiGetCongregationSpeakersRequests,
        });
      }
    } catch (err) {
      setAppMessage(err.message);
      setAppSeverity('error');
      setAppSnackOpen(true);
    }
  };

  const handleDisapprove = async (cong_id) => {
    try {
      const { status } = await apiDisapproveCongregationSpeakersRequest(cong_id);
      if (status === 200) {
        await queryClient.prefetchQuery({
          queryKey: ['congregationSpeakersRequests'],
          queryFn: apiGetCongregationSpeakersRequests,
        });
      }
    } catch (err) {
      setAppMessage(err.message);
      setAppSeverity('error');
      setAppSnackOpen(true);
    }
  };

  return (
    <Box sx={{ marginBottom: '15px', borderBottom: '1px outset', paddingBottom: '15px' }}>
      <Typography>{t('visitingSpeakersRequestHeading')}</Typography>
      <Box sx={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {speakersRequests.map((request) => (
          <Box
            key={request.cong_id}
            sx={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              alignItems: 'center',
              border: '1px outset',
              padding: '10px',
              borderRadius: '8px',
            }}
          >
            <Typography
              sx={{ marginRight: '20px', fontWeight: 'bold' }}
            >{`${request.cong_name} (${request.cong_number})`}</Typography>
            <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Button
                variant="outlined"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() => handleApprove(request.cong_id)}
              >
                {t('accept')}
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DoNotDisturbOnIcon />}
                onClick={() => handleDisapprove(request.cong_id)}
              >
                {t('reject')}
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CongregationSpeakersRequests;
