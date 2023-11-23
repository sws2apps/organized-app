import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { AutoComplete, Typography } from '@components';
import { IconFindCountry, IconSearch } from '@icons';
import { useAppTranslation } from '@hooks';
import useCountry from './useCountry';

const CountrySelector = ({ handleCountryChange }) => {
  const { setOpenPicker, selected, options, handleOnChange, isLoading, openPicker } = useCountry({
    handleCountryChange,
  });

  const { t } = useAppTranslation();

  return (
    <AutoComplete
      open={openPicker}
      onOpen={() => setOpenPicker(true)}
      onClose={() => setOpenPicker(false)}
      isOptionEqualToValue={(option, value) => option.code === value.code}
      getOptionLabel={(option) => option.name}
      options={options}
      renderOption={(props, option) => (
        <Box component="li" {...props} sx={{ margin: 0, padding: 0 }}>
          <Typography variant="body-regular">{option.name}</Typography>
        </Box>
      )}
      loading={isLoading}
      value={selected}
      onChange={(e, value) => handleOnChange(value)}
      label={t('selectCountry')}
      startIcon={<IconFindCountry color="var(--black)" />}
      endIcon={<IconSearch color="var(--accent-350)" />}
    />
  );
};

CountrySelector.propTypes = {
  handleCountryChange: PropTypes.func.isRequired,
};

export default CountrySelector;
