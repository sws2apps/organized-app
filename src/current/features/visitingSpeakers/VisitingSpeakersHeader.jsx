import { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
import IconButton from '@mui/material/IconButton';
import KeyIcon from '@mui/icons-material/Key';
import ShareIcon from '@mui/icons-material/Share';
import SignalWifiConnectedNoInternet4Icon from '@mui/icons-material/SignalWifiConnectedNoInternet4';
import SignalWifiStatusbarConnectedNoInternet4Icon from '@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4';
import Typography from '@mui/material/Typography';
import SignalWifi4BarIcon from '@mui/icons-material/SignalWifi4Bar';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { VisitingSpeakers } from '../../classes/VisitingSpeakers';
import { apiUploadVisitingSpeakers } from '../../api';
import { congAccountConnectedState } from '../../states/congregation';
import { apiGetCongregationSpeakersList } from '../../api/congregation';
import { refreshScreenState } from '../../states/main';
import { dbExportTable } from '../../indexedDb/dbUtility';
import { Setting } from '../../classes/Setting';

const VisitingSpeakersHeader = ({ cong, isSelf, handleToggleAccessOpen }) => {
  const { t } = useTranslation('ui');

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setRefreshScreen = useSetRecoilState(refreshScreenState);

  const congConnected = useRecoilValue(congAccountConnectedState);

  const [isProcessing, setIsProcessing] = useState(false);

  const requestDispproved = cong.request_status === 'disapproved';
  const requestPending = cong.request_status === 'pending';

  const isEditor = Setting.cong_role.includes('public_talk_coordinator');

  const handleShareSpeakers = async (e) => {
    try {
      e.stopPropagation();

      setIsProcessing(true);

      const data = await dbExportTable('visiting_speakers');
      const { status } = await apiUploadVisitingSpeakers(data);

      if (status === 200) {
        setAppMessage(t('congrationOutgoingSpeakersShared'));
        setAppSeverity('success');
        setAppSnackOpen(true);
      }

      if (status !== 200) {
        setAppMessage(t('congrationOutgoingSpeakersShareError'));
        setAppSeverity('warning');
        setAppSnackOpen(true);
      }

      setIsProcessing(false);
    } catch (err) {
      setIsProcessing(false);
      setAppMessage(err.message);
      setAppSeverity('error');
      setAppSnackOpen(true);
    }
  };

  const handleDownloadSpeakers = async (e) => {
    try {
      e.stopPropagation();

      setIsProcessing(true);

      const { status, data } = await apiGetCongregationSpeakersList(cong.cong_id);
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

  const handleDeleteCongregation = async (e) => {
    try {
      e.stopPropagation();

      setIsProcessing(true);

      await VisitingSpeakers.deleteCongregation(cong.cong_number);
      setRefreshScreen((prev) => !prev);

      setIsProcessing(false);
    } catch (err) {
      setIsProcessing(false);
      setAppMessage(err.message);
      setAppSeverity('error');
      setAppSnackOpen(true);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '10px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        {isSelf && <HomeIcon color="primary" sx={{ fontSize: '25px' }} />}
        {!isSelf && cong.is_local && <SignalWifiConnectedNoInternet4Icon color="primary" sx={{ fontSize: '25px' }} />}
        {!isSelf && !cong.is_local && !requestDispproved && (
          <SignalWifi4BarIcon color={requestPending ? 'warning' : 'success'} sx={{ fontSize: '25px' }} />
        )}
        {requestDispproved && <SignalWifiStatusbarConnectedNoInternet4Icon color="error" sx={{ fontSize: '25px' }} />}
        <Typography>{`${cong.cong_name} (${cong.cong_number})`}</Typography>
      </Box>

      {isProcessing && <CircularProgress color="secondary" size={30} disableShrink={true} />}

      {isEditor && congConnected && !isProcessing && isSelf && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <IconButton aria-label="share" color="error" onClick={handleToggleAccessOpen} sx={{ padding: '4px' }}>
            <KeyIcon />
          </IconButton>
          <IconButton aria-label="share" color="primary" onClick={handleShareSpeakers} sx={{ padding: '4px' }}>
            <ShareIcon />
          </IconButton>
        </Box>
      )}

      {isEditor && !isProcessing && !isSelf && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!requestDispproved && congConnected && !cong.is_local && (
            <IconButton aria-label="share" color="secondary" sx={{ padding: '4px' }} onClick={handleDownloadSpeakers}>
              <CloudSyncIcon />
            </IconButton>
          )}

          <IconButton aria-label="delete" color="error" sx={{ padding: '4px' }} onClick={handleDeleteCongregation}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default VisitingSpeakersHeader;
