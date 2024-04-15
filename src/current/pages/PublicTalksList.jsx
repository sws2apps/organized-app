import { useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Typography from '@mui/material/Typography';
import WaitingPage from '../components/WaitingPage';
import { apiFetchPublicTalks } from '../api';
import { publicTalksState } from '../states/sourceMaterial';
import { congAccountConnectedState } from '../states/congregation';
import { appMessageState, appSeverityState, appSnackOpenState } from '../states/notification';
import { S34s } from '../classes/S34s';
import { PublicTalkContainer, PublicTalkPagination } from '../features/publicTalks';

const PublicTalksList = () => {
  const { t } = useTranslation('ui');

  const [publicTalks, setPublicTalks] = useRecoilState(publicTalksState);

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const congAccountConnected = useRecoilValue(congAccountConnectedState);

  const [page, setPage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleDownloadTalks = async () => {
    try {
      setIsProcessing(true);

      const { status, data } = await apiFetchPublicTalks();

      if (status !== 200) {
        setAppMessage(data.message);
        setAppSeverity('warning');
        setIsProcessing(false);
        setAppSnackOpen(true);
        return;
      }

      await S34s.reset(data);
      setPublicTalks(S34s.getLocal());

      setIsProcessing(false);
    } catch (err) {
      setAppMessage(err.message);
      setAppSeverity('error');
      setIsProcessing(false);
      setAppSnackOpen(true);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'space-between', maxWidth: '900px' }}>
        <Typography sx={{ marginBottom: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}>
          {t('publicTalksList')}
        </Typography>

        {congAccountConnected && (
          <Button
            variant="outlined"
            startIcon={<CloudDownloadIcon />}
            onClick={handleDownloadTalks}
            disabled={isProcessing}
          >
            {t('download')}
          </Button>
        )}
      </Box>

      <Box sx={{ maxWidth: '900px' }}>
        {!isProcessing && publicTalks.length > 0 && (
          <PublicTalkPagination count={publicTalks.length} page={page} handleChangePage={handleChangePage} />
        )}

        <Box sx={{ margin: '10px 0 20px 0' }}>
          {isProcessing && <WaitingPage />}
          {!isProcessing && publicTalks.length > 0 && <PublicTalkContainer currentPage={page} />}
          {!isProcessing && publicTalks.length === 0 && (
            <Typography sx={{ marginTop: '20px' }}>{t('downloadPublicTalks')}</Typography>
          )}
        </Box>

        {!isProcessing && publicTalks.length > 0 && (
          <PublicTalkPagination count={publicTalks.length} page={page} handleChangePage={handleChangePage} />
        )}
      </Box>
    </Box>
  );
};

export default PublicTalksList;
