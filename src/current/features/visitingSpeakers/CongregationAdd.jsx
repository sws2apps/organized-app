import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { congAccountConnectedState } from '../../states/congregation';
import { apiFindCongregationSpeakers, apiRequestAccessCongregationSpeakers } from '../../api';
import { VisitingSpeakers } from '../../classes/VisitingSpeakers';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { refreshScreenState } from '../../states/main';

const CongregationAdd = ({ isOpen, setOpen }) => {
  const { t } = useTranslation('ui');

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setScreenRefresh = useSetRecoilState(refreshScreenState);

  const congAccountConnected = useRecoilValue(congAccountConnectedState);

  const [congName, setCongName] = useState('');
  const [congNumber, setCongNumber] = useState('');
  const [isSync, setIsSync] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedCong, setSelectedCong] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isSearching, setIsSearching] = useState('');

  const handleSelectCong = (value) => {
    setSelectedCong(value);
    setIsSync(value !== null);
  };

  const handleClose = () => {
    setCongName('');
    setCongNumber('');
    setSelectedCong(null);
    setOpen(false);
  };

  const handleCreateCongreation = async () => {
    try {
      // check if cong exist
      const tmpNumber = selectedCong?.cong_number || congNumber;
      const isExist = VisitingSpeakers.getCongregation(tmpNumber);

      if (isExist) {
        setAppMessage(t('congregationExists'));
        setAppSeverity('warning');
        setAppSnackOpen(true);
        return;
      }

      if (selectedCong !== null) {
        const { status } = await apiRequestAccessCongregationSpeakers(selectedCong.cong_id);
        if (status !== 200) {
          setAppMessage(t('visitingSpeakersRequestError'));
          setAppSeverity('error');
          setAppSnackOpen(true);
          return;
        }
      }

      const obj = {
        cong_id: selectedCong === null ? undefined : selectedCong.cong_id,
        cong_name: selectedCong === null ? congName : selectedCong.cong_name,
        cong_number: selectedCong === null ? congNumber : selectedCong.cong_number,
      };

      await VisitingSpeakers.createCongregation(obj);

      setScreenRefresh((prev) => !prev);
      handleClose();
    } catch (err) {
      setAppMessage(err.message);
      setAppSeverity('error');
      setAppSnackOpen(true);
    }
  };

  useEffect(() => {
    let active = true;
    let fetchTimer;

    try {
      if (inputValue.length < 2) {
        setOptions(selectedCong ? [selectedCong] : []);
        return undefined;
      }

      const fetchCongregations = async (name) => {
        try {
          setIsSearching(true);
          const { status, data } = await apiFindCongregationSpeakers(name);
          if (status === 200) {
            if (active) {
              setOptions(data);
            }
          }
          setIsSearching(false);
        } catch (err) {
          setIsSearching(false);
          throw new Error(err);
        }
      };

      const testValue = selectedCong ? `(${selectedCong.cong_number}) ${selectedCong.cong_name}` : '';
      if (inputValue !== testValue) {
        fetchTimer = setTimeout(() => {
          fetchCongregations(inputValue);
        }, 2000);
      }
    } catch (err) {
      setIsSearching(false);
    }

    return () => {
      active = false;
      if (fetchTimer) clearTimeout(fetchTimer);
    };
  }, [inputValue, selectedCong]);

  return (
    <Collapse in={isOpen} timeout="auto" unmountOnExit>
      <Box
        sx={{ border: '1px outset', margin: '15px 0', borderRadius: '3px', padding: '20px 10px', maxWidth: '400px' }}
      >
        <Box>
          <Typography sx={{ fontSize: '14px', lineHeight: 1.4, marginBottom: '15px' }}>
            {t('congrationAddLabel')}
          </Typography>
          <TextField
            label={t('congregation')}
            variant="outlined"
            fullWidth
            size="small"
            sx={{ maxWidth: '500px', minWidth: '250px', marginBottom: '15px' }}
            value={congName}
            onChange={(e) => setCongName(e.target.value)}
            InputProps={{ readOnly: isSync }}
          />
          <TextField
            label={t('number')}
            variant="outlined"
            type="number"
            size="small"
            sx={{ maxWidth: '250px', minWidth: '100px' }}
            value={congNumber}
            onChange={(e) => setCongNumber(e.target.value)}
            InputProps={{ readOnly: isSync }}
          />
        </Box>

        {congAccountConnected && (
          <Box sx={{ margin: '20px 0' }}>
            <Typography sx={{ fontSize: '14px', lineHeight: 1.4, marginBottom: '15px' }}>
              {t('congrationAddLabelAlternate')}
            </Typography>

            <Autocomplete
              fullWidth={true}
              sx={{ maxWidth: '400px' }}
              size="small"
              isOptionEqualToValue={(option, value) => option.cong_number === value.cong_number}
              getOptionLabel={(option) => `(${option.cong_number}) ${option.cong_name}`}
              filterOptions={(x) => x}
              options={options}
              autoComplete
              includeInputInList
              value={selectedCong}
              noOptionsText={t('noOptions')}
              loadingText={t('loading')}
              onChange={(_, newValue) => {
                handleSelectCong(newValue);
              }}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                  ({option.cong_number}) {option.cong_name}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('congregation')}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isSearching ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Box>
        )}

        <Box sx={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={handleClose}>
            {t('cancel')}
          </Button>
          <Button
            variant="outlined"
            color="success"
            startIcon={<SaveIcon />}
            disabled={selectedCong === null && (congName.length === 0 || congNumber.length === 0)}
            onClick={handleCreateCongreation}
          >
            {t('save')}
          </Button>
        </Box>
      </Box>
    </Collapse>
  );
};

export default CongregationAdd;
