import { Box } from '@mui/material';
import AutoComplete from '@components/autocomplete';
import Typography from '@components/typography';
import { IconCongregation, IconSearch } from '@icons/index';
import useCongregation from './useCongregation';
import { useAppTranslation } from '@hooks/index';
import { CountryType } from '../country_selector/index.types';
import { CongregationResponseType } from '@definition/api';

/**
 * Component for selecting a congregation.
 * @param {Object} props - Props for the CongregationSelector component.
 * @param {CountryType} props.country - The selected country.
 * @param {(value: CongregationResponseType) => void} props.setCongregation - Function to set the selected congregation.
 * @returns {JSX.Element} CongregationSelector component.
 */
const CongregationSelector = ({
  country,
  setCongregation,
}: {
  country: CountryType;
  setCongregation: (value: CongregationResponseType) => void;
}) => {
  const { setValue, value, setInputValue, options, isLoading } = useCongregation({ country });

  const { t } = useAppTranslation();

  return (
    <AutoComplete
      isOptionEqualToValue={(option, value) => option.congNumber === value.congNumber}
      getOptionLabel={(option: CongregationResponseType) => `${option.congName.trim()}, ${option.congNumber}`}
      filterOptions={(x) => x}
      options={options}
      autoComplete={true}
      includeInputInList={true}
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue as CongregationResponseType);
        setCongregation(newValue as CongregationResponseType);
      }}
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
      loading={isLoading}
      label={t('tr_yourCongregation')}
      startIcon={<IconCongregation color={value ? 'var(--black)' : 'var(--accent-350)'} />}
      endIcon={<IconSearch color={value ? 'var(--black)' : 'var(--accent-350)'} />}
      renderOption={(props, option) => (
        <Box component="li" {...props} sx={{ margin: 0, padding: 0 }}>
          <Typography className="body-regular">
            {option.congName.trim()}, {option.congNumber}
          </Typography>
        </Box>
      )}
    />
  );
};

export default CongregationSelector;
