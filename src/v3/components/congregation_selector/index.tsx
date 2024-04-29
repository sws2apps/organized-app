import { Box } from '@mui/material';
import { IconCongregation, IconSearch } from '@icons/index';
import { CongregationResponseType } from '@definition/api';
import { useAppTranslation } from '@hooks/index';
import { CongregationSelectorType } from './index.types';
import AutoComplete from '@components/autocomplete';
import Typography from '@components/typography';
import useCongregation from './useCongregation';

const CongregationSelector = ({ country_code, setCongregation, label, cong_number }: CongregationSelectorType) => {
  const { t } = useAppTranslation();

  const { setValue, value, setInputValue, options, isLoading } = useCongregation(country_code, cong_number);

  const selectorLabel = label || t('tr_yourCongregation');

  return (
    <AutoComplete
      isOptionEqualToValue={(option, value) => option.congNumber === value.congNumber}
      getOptionLabel={(option: CongregationResponseType) => `${option.congName.trim()}, ${option.congNumber}`}
      filterOptions={(x) => x}
      options={options}
      autoComplete={true}
      includeInputInList={true}
      value={value}
      onChange={(event, newValue: CongregationResponseType) => {
        setValue(newValue);
        setCongregation(newValue);
      }}
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
      loading={isLoading}
      label={selectorLabel}
      startIcon={<IconCongregation color={value ? 'var(--black)' : 'var(--accent-350)'} />}
      endIcon={<IconSearch color={value ? 'var(--black)' : 'var(--accent-350)'} />}
      renderOption={(props, option) => (
        <Box component="li" {...props} sx={{ margin: 0, padding: 0 }} key={option.congNumber}>
          <Typography>
            {option.congName.trim()}, {option.congNumber}
          </Typography>
        </Box>
      )}
    />
  );
};

export default CongregationSelector;
