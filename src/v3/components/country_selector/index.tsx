import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { AutoComplete, Typography } from '@components';
import { IconFindCountry, IconSearch } from '@icons';
import { useAppTranslation } from '@hooks/index';
import useCountry from './useCountry';
import { CountryType } from './index.types';

const CountrySelector = ({ handleCountryChange }: { handleCountryChange: (value: CountryType) => void }) => {
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
          <Typography className="body-regular">{option.name}</Typography>
        </Box>
      )}
      loading={isLoading}
      value={selected}
      onChange={(e, value) => handleOnChange(value)}
      label={t('trans_selectCountry')}
      startIcon={<IconFindCountry color={selected ? 'var(--black)' : 'var(--accent-350)'} />}
      endIcon={<IconSearch color={selected ? 'var(--black)' : 'var(--accent-350)'} />}
    />
  );
};

CountrySelector.propTypes = {
  handleCountryChange: PropTypes.func.isRequired,
};

export default CountrySelector;
