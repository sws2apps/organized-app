import { useTranslation } from 'react-i18next';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Markup } from 'interweave';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Typography from '@mui/material/Typography';
import { congSpeakersRequestsUpdateState } from '../../states/congregation';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { VisitingSpeakers } from '../../classes/VisitingSpeakers';
import { updateNewApprovedRequests } from '../../utils/visiting_speakers_utils';

const CongregationSpeakersRequestApproved = () => {
  const { t } = useTranslation('ui');

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const speakersRequests = useRecoilValue(congSpeakersRequestsUpdateState);

  const handleAcknowledge = async (cong_number) => {
    try {
      await VisitingSpeakers.acknowledgeApproval(cong_number);
      await updateNewApprovedRequests();
    } catch (err) {
      setAppMessage(err.message);
      setAppSeverity('error');
      setAppSnackOpen(true);
    }
  };

  return (
    <Box sx={{ marginBottom: '15px', borderBottom: '1px outset', paddingBottom: '15px' }}>
      <Box sx={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {speakersRequests.map((request) => (
          <Box
            key={request.cong_number}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              border: '1px outset',
              padding: '10px',
              borderRadius: '8px',
            }}
          >
            <Typography>
              <Markup
                content={t('visitingSpeakersRequestApproved', {
                  congregation: `${request.cong_name} (${request.cong_number})`,
                })}
              />
            </Typography>
            <IconButton color="primary" onClick={() => handleAcknowledge(request.cong_number)}>
              <ThumbUpIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
      <Typography>{t('visitingSpeakersRequestApprovedNote')}</Typography>
    </Box>
  );
};

export default CongregationSpeakersRequestApproved;
