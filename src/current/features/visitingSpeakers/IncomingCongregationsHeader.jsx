import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { apiGetCongregationSpeakersList } from '../../api/congregation';
import { VisitingSpeakers } from '../../classes/VisitingSpeakers';
import { refreshScreenState } from '../../states/main';
import { congAccountConnectedState } from '../../states/congregation';
import { Setting } from '../../classes/Setting';

const IncomingCongregationsHeader = ({ handleCongregationAdd }) => {
  const { t } = useTranslation('ui');

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setRefreshScreen = useSetRecoilState(refreshScreenState);

  const congConnected = useRecoilValue(congAccountConnectedState);
  const screenRefresh = useRecoilValue(refreshScreenState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [congsList, setCongsList] = useState([]);

  const handleDownloadAllSpeakers = async () => {
    try {
      setIsProcessing(true);

      const { status, data } = await apiGetCongregationSpeakersList();
      if (status === 200) {
        await VisitingSpeakers.updateIncomingSpeakers(data);
        setRefreshScreen((prev) => !prev);
      }

      setIsProcessing(false);
    } catch (err) {
      setIsProcessing(false);
      setAppMessage(err.message);
      setAppSeverity('error');
      setAppSnackOpen(true);
    }
  };

  useEffect(() => {
    const congs = VisitingSpeakers.congregations
      .filter((record) => record.cong_number !== +Setting.cong_number)
      .sort((a, b) => {
        return a.cong_name > b.cong_name ? 1 : -1;
      });
    setCongsList(congs);
  }, [screenRefresh]);

  return (
    <Box sx={{ marginTop: '15px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
      <Button variant="outlined" startIcon={<AddCircleIcon />} onClick={handleCongregationAdd}>
        {t('congregationAdd')}
      </Button>
      {congConnected && congsList.length > 0 && (
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<CloudSyncIcon />}
          disabled={isProcessing}
          onClick={handleDownloadAllSpeakers}
        >
          {t('downloadAllSpeakers')}
        </Button>
      )}
    </Box>
  );
};

export default IncomingCongregationsHeader;
