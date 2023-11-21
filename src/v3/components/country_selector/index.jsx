import PropTypes from 'prop-types';
import { Autocomplete, Box, CircularProgress, TextField } from '@mui/material';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import useCountry from './useCountry';
import { useAppTranslation } from '@hooks';

const CountrySelector = ({ handleCountryChange }) => {
  const { setOpenPicker, selected, options, handleOnChange, isLoading, openPicker } = useCountry({
    handleCountryChange,
  });

  const { t } = useAppTranslation();

  return (
    <Autocomplete
      id="asynchronous-demo"
      fullWidth={true}
      sx={{ maxWidth: '900px' }}
      open={openPicker}
      onOpen={() => setOpenPicker(true)}
      onClose={() => setOpenPicker(false)}
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

CountrySelector.propTypes = {
  handleCountryChange: PropTypes.func.isRequired,
};

export default CountrySelector;
