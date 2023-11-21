import PropTypes from 'prop-types';
import { Autocomplete, Box, CircularProgress, TextField } from '@mui/material';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import useCongregation from './useCongregation';
import { useAppTranslation } from '@hooks';

const CongregationSelector = ({ country, setCongregation }) => {
  const { setValue, value, setInputValue, options, isLoading } = useCongregation({ country });

  const { t } = useAppTranslation();

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
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
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

CongregationSelector.propTypes = {
  country: PropTypes.object,
  setCongregation: PropTypes.func,
};

export default CongregationSelector;
