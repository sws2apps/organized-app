import { useCallback, useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { apiGetApprovedVisitingSpeakersAccess, apiUpdateVisitingSpeakersAccess } from '../../api';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { Setting } from '../../classes/Setting';

const LocalSpeakersAccess = ({ speakersAccessOpen }) => {
  const { t } = useTranslation('ui');

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const [isProcessing, setIsProcessing] = useState(true);
  const [options, setOptions] = useState([]);

  const isEditor = Setting.cong_role.includes('public_talk_coordinator');

  const fetchData = useCallback(async () => {
    setIsProcessing(true);
    const { status, data } = await apiGetApprovedVisitingSpeakersAccess();
    if (status === 200) setOptions(data);
    setIsProcessing(false);
  }, []);

  const handleChange = async (value) => {
    try {
      setIsProcessing(true);
      const { status, data } = await apiUpdateVisitingSpeakersAccess(value);
      if (status === 200) {
        setOptions(data);
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
    if (speakersAccessOpen) {
      fetchData();
    }
  }, [fetchData, speakersAccessOpen]);

  return (
    <Collapse in={speakersAccessOpen} timeout="auto" unmountOnExit>
      <Box sx={{ border: '1px outset', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
        {isProcessing && (
          <CircularProgress
            color="secondary"
            size={20}
            disableShrink={true}
            sx={{ display: 'flex', margin: '10px auto' }}
          />
        )}
        {!isProcessing && (
          <Box>
            {options.length === 0 && <Typography>{t('visitingSpeakersAccessNone')}</Typography>}
            {options.length > 0 && (
              <Box sx={{ marginBottom: '15px' }}>
                <Typography sx={{ marginBottom: '15px' }}>{t('visitingSpeakersAccessList')}</Typography>
                <Autocomplete
                  id="public_talk_selector"
                  size="small"
                  readOnly={!isEditor}
                  multiple
                  fullWidth
                  sx={{ padding: '0 15px' }}
                  value={options}
                  onChange={(e, value) => handleChange(value)}
                  options={options}
                  getOptionLabel={(option) => `(${option.cong_number}) ${option.cong_name}`}
                  isOptionEqualToValue={(option, value) => option.cong_number === value.cong_number}
                  renderInput={(params) => <TextField {...params} variant="standard" />}
                  noOptionsText={t('noMatchRecord')}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Collapse>
  );
};

export default LocalSpeakersAccess;
