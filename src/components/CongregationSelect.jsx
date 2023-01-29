import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import TextField from '@mui/material/TextField';
import { apiFetchCongregations } from '../api/congregation';

const CongregationSelect = ({ country, setCongregation }) => {
  const queryClient = useQueryClient();

  const { t } = useTranslation('ui');

  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let active = true;
    let fetchTimer;

    try {
      if (inputValue.length < 2) {
        setOptions(value ? [value] : []);
        return undefined;
      }

      const fetchCongregations = async (name) => {
        setIsLoading(true);
        await queryClient.prefetchQuery({
          queryKey: ['congregations_by_country'],
          queryFn: () => apiFetchCongregations(country.code, name),
        });
        const tmpCongregations = queryClient.getQueryData(['congregations_by_country']);
        if (active) {
          setOptions(tmpCongregations.data);
        }

        setIsLoading(false);
      };

      const testValue = value ? `(${value.congNumber}) ${value.congName}` : '';
      if (inputValue !== testValue) {
        fetchTimer = setTimeout(() => {
          fetchCongregations(inputValue);
        }, 2000);
      }
    } catch (err) {
      setIsLoading(false);
    }

    return () => {
      active = false;
      if (fetchTimer) clearTimeout(fetchTimer);
    };
  }, [country, value, inputValue, queryClient]);

  return (
    <Autocomplete
      id="select-congregation"
      fullWidth={true}
      sx={{ maxWidth: '900px' }}
      isOptionEqualToValue={(option, value) => option.congNumber === value.congNumber}
      getOptionLabel={(option) => `(${option.congNumber}) ${option.congName}`}
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      value={value}
      noOptionsText={t('noOptions')}
      loadingText={t('loading')}
      onChange={(event, newValue) => {
        setValue(newValue);
        setCongregation(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderOption={(props, option) => (
        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
          <HomeWorkIcon color="secondary" sx={{ marginRight: '8px' }} />({option.congNumber}) {option.congName}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t('congregation')}
          InputProps={{
            ...params.InputProps,
            startAdornment: <HomeWorkIcon color="secondary" sx={{ marginLeft: '5px' }} />,
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

export default CongregationSelect;
