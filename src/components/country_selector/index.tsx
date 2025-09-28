import { Box, createFilterOptions } from '@mui/material';
import { IconFindCountry, IconSearch } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import { CountrySelectorType } from './index.types';
import useCountry from './useCountry';
import AutoComplete from '@components/autocomplete';
import Typography from '@components/typography';
import { CountryResponseType } from '@definition/api';

/**
 * Component for selecting a country.
 * @param {CountrySelectorProps} props - Props for the CountrySelector component.
 * @returns {JSX.Element} CountrySelector component.
 */

const CountrySelector = (props: CountrySelectorType) => {
  const {
    setOpenPicker,
    selected,
    handleOnChange,
    isLoading,
    openPicker,
    countries,
  } = useCountry(props);

  const { t } = useAppTranslation();

  return (
    <AutoComplete
      filterOptions={createFilterOptions({ trim: true })}
      readOnly={props.readOnly ?? false}
      open={openPicker}
      onOpen={() => setOpenPicker(true)}
      onClose={() => setOpenPicker(false)}
      isOptionEqualToValue={(option, value) =>
        option.countryCode === value.countryCode
      }
      getOptionLabel={(option: CountryResponseType) => option.countryName}
      options={countries}
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          sx={{ margin: 0, padding: 0 }}
          key={option.countryCode}
        >
          <Typography className="body-regular">{option.countryName}</Typography>
        </Box>
      )}
      loading={isLoading}
      value={selected}
      onChange={(e, value: CountryResponseType) => handleOnChange(value)}
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
