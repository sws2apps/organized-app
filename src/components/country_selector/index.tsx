import { Box, createFilterOptions } from '@mui/material';
import { IconFindCountry, IconSearch } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import { CountrySelectorType, CountryType } from './index.types';
import useCountry from './useCountry';
import AutoComplete from '@components/autocomplete';
import Typography from '@components/typography';

/**
 * Component for selecting a country.
 * @param {CountrySelectorProps} props - Props for the CountrySelector component.
 * @param {(value: CountryType) => void} props.handleCountryChange - Function to handle country change.
 * @returns {JSX.Element} CountrySelector component.
 */

const CountrySelector = (props: CountrySelectorType) => {
  const {
    setOpenPicker,
    selected,
    options,
    handleOnChange,
    isLoading,
    openPicker,
  } = useCountry(props);

  const { t } = useAppTranslation();

  return (
    <AutoComplete
      filterOptions={createFilterOptions({ trim: true })}
      readOnly={props.readOnly ?? false}
      open={openPicker}
      onOpen={() => setOpenPicker(true)}
      onClose={() => setOpenPicker(false)}
      isOptionEqualToValue={(option, value) => option.code === value.code}
      getOptionLabel={(option: CountryType) => option.name}
      options={options}
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          sx={{ margin: 0, padding: 0 }}
          key={option.code}
        >
          <Typography className="body-regular">{option.name}</Typography>
        </Box>
      )}
      loading={isLoading}
      value={selected}
      onChange={(e, value: CountryType) => handleOnChange(value)}
      label={t('tr_selectCountry')}
      startIcon={
        <IconFindCountry
          color={selected ? 'var(--black)' : 'var(--accent-350)'}
        />
      }
      endIcon={
        <IconSearch color={selected ? 'var(--black)' : 'var(--accent-350)'} />
      }
    />
  );
};

export default CountrySelector;
