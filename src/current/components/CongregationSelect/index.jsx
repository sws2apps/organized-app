import { useTranslation } from 'react-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import TextField from '@mui/material/TextField';
import useCongregationSelect from './useCongregationSelect';

const CongregationSelect = ({ country, setCongregation, fetchCongregations }) => {
  const { t } = useTranslation('ui');

  const { options, value, setValue, setInputValue, isLoading } = useCongregationSelect({
    country,
    fetcher: fetchCongregations,
  });

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
