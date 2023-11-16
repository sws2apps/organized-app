import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import TextField from '@mui/material/TextField';
import { appMessageState, appSeverityState, appSnackOpenState } from '../states/notification';
import { apiFetchCountries } from '../api';

const CountrySelect = ({ setCountry }) => {
  const { t } = useTranslation('ui');
  const queryClient = useQueryClient();

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const [selected, setSelected] = useState(null);

  const options = countries.map((country) => {
    return { name: country.countryName, code: country.countryCode };
  });

  const handleOnChange = (value) => {
    setSelected(value);
    setCountry(value);
  };

  useEffect(() => {
    let active = true;

    if (!isLoading) {
      return undefined;
    }

    const fetchCongregations = async () => {
      setIsLoading(true);
      await queryClient.prefetchQuery({
        queryKey: ['countries'],
        queryFn: apiFetchCountries,
      });
      const result = queryClient.getQueryData(['countries']);

      if (active && result.status === 200) {
        if (Array.isArray(result.data)) setCountries(result.data);
      }

      if (result.status !== 200) {
        setAppSeverity('warning');
        setAppMessage(t('countriesFetchError'));
        setAppSnackOpen(true);
      }

      setIsLoading(false);
    };

    fetchCongregations();

    return () => {
      active = false;
    };
  }, [isLoading, queryClient, t, setAppSeverity, setAppMessage, setAppSnackOpen]);

  useEffect(() => {
    if (openPicker && countries.length === 0) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [countries, openPicker]);

  return (
    <Autocomplete
      id="asynchronous-demo"
      fullWidth={true}
      sx={{ maxWidth: '900px' }}
      open={openPicker}
      onOpen={() => {
        setOpenPicker(true);
      }}
      onClose={() => {
        setOpenPicker(false);
      }}
      isOptionEqualToValue={(option, value) => option.code === value.code}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={isLoading}
      value={selected}
      onChange={(e, value) => handleOnChange(value)}
      noOptionsText={t('noOptions')}
      loadingText={t('loading')}
      renderOption={(props, option) => (
        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
          <EditLocationIcon sx={{ marginRight: '8px' }} />
          {option.name}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t('selectCountry')}
          InputProps={{
            ...params.InputProps,
            startAdornment: <EditLocationIcon sx={{ marginLeft: '5px' }} />,
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default CountrySelect;
