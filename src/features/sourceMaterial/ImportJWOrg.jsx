import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Checkbox from '@mui/material/Checkbox';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { isImportJWOrgState } from '../../states/sourceMaterial';
import { apiHostState, isOnlineState } from '../../states/main';
import { addJwDataToDb } from '../../utils/epubParser';
import { displayError } from '../../utils/error';
import { fetchSourceMaterial } from '../../api';
import { Sources } from '../../classes/Sources';

const sharedStyles = {
  jwLoad: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20px',
  },
  textCircular: {
    marginTop: '20px',
  },
};

const ImportJWOrg = () => {
  const cancel = useRef();

  const { t } = useTranslation('ui');

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const [open, setOpen] = useRecoilState(isImportJWOrgState);

  const apiHost = useRecoilValue(apiHostState);
  const isOnline = useRecoilValue(isOnlineState);

  const [isLoading, setIsLoading] = useState(false);
  const [isChoosing, setIsChoosing] = useState(true);
  const [isUpdateOld, setIsUpdateOld] = useState(false);
  const [downloadIssue, setDownloadIssue] = useState('');
  const [issueOptions, setIssueOptions] = useState([]);

  const handleDlgClose = (event, reason) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return;
    }
    setOpen(false);
  };

  const fetchSourcesJw = async (issue = '') => {
    try {
      if (apiHost !== '') {
        cancel.current = false;

        const data = await fetchSourceMaterial(issue);

        if (!cancel.current) {
          if (data && data.length > 0) {
            await addJwDataToDb(data);
            setIsLoading(false);
            return;
          }

          setAppMessage(displayError('sourceNotFoundUnavailable'));
          setAppSeverity('error');
          setAppSnackOpen(true);
          setOpen(false);
        }
      }
    } catch (err) {
      setAppMessage(err.message);
      setAppSeverity('error');
      setAppSnackOpen(true);
      setOpen(false);
    }
  };

  const handleImportActions = async () => {
    setIsChoosing(false);
    setIsLoading(true);

    if (!isChoosing && !isLoading) {
      handleDlgClose();
      return;
    }

    if (!isUpdateOld) await fetchSourcesJw();
    if (isUpdateOld) await fetchSourcesJw(downloadIssue);
  };

  useEffect(() => {
    const options = Sources.oldestIssues();
    setIssueOptions(Sources.oldestIssues());
    setDownloadIssue(options[options.length - 1].value);
  }, []);

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, []);

  return (
    <Box>
      {open && isOnline && (
        <Dialog open={open} onClose={handleDlgClose}>
          <DialogTitle>
            <Typography sx={{ lineHeight: 1.2, fontSize: '13px' }}>{t('importJwTitle')}</Typography>
          </DialogTitle>
          <DialogContent>
            {isChoosing && (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Checkbox checked={isUpdateOld} onChange={(e) => setIsUpdateOld(e.target.checked)} />
                  <Typography>{t('downloadOldSourceMaterials')}</Typography>
                </Box>

                {isUpdateOld && (
                  <TextField
                    id="outlined-select-month-issue"
                    select
                    label={t('mwbIssueMonth')}
                    size="small"
                    sx={{ minWidth: '130px', marginLeft: '50px', marginTop: '20px' }}
                    defaultValue={5}
                    value={downloadIssue}
                    onChange={(e) => setDownloadIssue(e.target.value)}
                  >
                    {issueOptions.map((issue) => (
                      <MenuItem key={issue.value} value={issue.value}>
                        {issue.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Box>
            )}
            {!isChoosing && (
              <Container sx={sharedStyles.jwLoad}>
                {isLoading && (
                  <>
                    <CircularProgress color="secondary" size={'70px'} disableShrink />
                    <Typography variant="body1" align="center" sx={sharedStyles.textCircular}>
                      {t('downloadInProgress')}
                    </Typography>
                  </>
                )}
                {!isLoading && (
                  <>
                    <CheckCircleIcon color="success" sx={{ fontSize: '100px' }} />
                    <Typography variant="body1" align="center" sx={sharedStyles.textCircular}>
                      {t('importCompleted')}
                    </Typography>
                  </>
                )}
              </Container>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDlgClose} color="primary" autoFocus disabled={!isChoosing && !isLoading}>
              {t('cancel')}
            </Button>
            <Button onClick={handleImportActions} color="primary" autoFocus disabled={!isChoosing && isLoading}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default ImportJWOrg;
