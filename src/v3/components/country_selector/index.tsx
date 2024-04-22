import { Box } from '@mui/material';
import AutoComplete from '@components/autocomplete';
import Typography from '@components/typography';
import { IconFindCountry, IconSearch } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import useCountry from './useCountry';
import { CountryType } from './index.types';

/**
 * Component for selecting a country.
 * @param {CountrySelectorProps} props - Props for the CountrySelector component.
 * @param {(value: CountryType) => void} props.handleCountryChange - Function to handle country change.
 * @returns {JSX.Element} CountrySelector component.
 */
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
      getOptionLabel={(option: CountryType) => option.name}
      options={options}
      renderOption={(props, option) => (
        <Box component="li" {...props} sx={{ margin: 0, padding: 0 }}>
          <Typography className="body-regular">{option.name}</Typography>
        </Box>
      )}
      loading={isLoading}
      value={selected}
      onChange={(e, value: CountryType) => handleOnChange(value)}
      label={t('tr_selectCountry')}
      startIcon={<IconFindCountry color={selected ? 'var(--black)' : 'var(--accent-350)'} />}
      endIcon={<IconSearch color={selected ? 'var(--black)' : 'var(--accent-350)'} />}
    />
  );
};

export default CountrySelector;
