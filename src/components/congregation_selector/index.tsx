import { Box, createFilterOptions } from '@mui/material';
import { IconCongregation, IconSearch } from '@icons/index';
import { CongregationResponseType } from '@definition/api';
import { useAppTranslation } from '@hooks/index';
import { CongregationSelectorType } from './index.types';
import AutoComplete from '@components/autocomplete';
import Typography from '@components/typography';
import useCongregation from './useCongregation';
import WaitingLoader from '@components/waiting_loader';

const filter = createFilterOptions<CongregationResponseType>({ trim: true });

/**
 * Component for selecting a congregation.
 * @param {Object} props - Props for the CongregationSelector component.
 * @param {CountryType} props.country - The selected country.
 * @param {(value: CongregationResponseType) => void} props.setCongregation - Function to set the selected congregation.
 * @returns {JSX.Element} CongregationSelector component.
 */
const CongregationSelector = ({
  country_code,
  setCongregation,
  label,
  cong_number,
  freeSolo = false,
  freeSoloChange,
  freeSoloValue,
  readOnly,
}: CongregationSelectorType) => {
  const { t } = useAppTranslation();

  const { setValue, value, setInputValue, options, isLoading, inputValue } =
    useCongregation(country_code, cong_number, freeSoloValue);

  const selectorLabel = label || t('tr_yourCongregation');

  return (
    <AutoComplete
      freeSolo={freeSolo}
      readOnly={readOnly}
      isOptionEqualToValue={(option, value) =>
        option.congNumber === value.congNumber
      }
      getOptionLabel={(option: CongregationResponseType) => {
        if (typeof option === 'string') {
          return option;
        }

        let label = option.congName.trim();

        if (option.congNumber.length > 0) {
          label += `, ${option.congNumber}`;
        }
        return label;
      }}
      filterOptions={(options, params) => {
        if (!freeSolo) return options;

        const filtered = filter(options, params);

        if (params.inputValue !== '') {
          filtered.push({
            congName: params.inputValue,
            address: '',
            circuit: '',
            congNumber: '',
            location: null,
            midweekMeetingTime: null,
            weekendMeetingTime: null,
          });
        }

        return filtered;
      }}
      options={options}
      autoComplete={true}
      includeInputInList={true}
      inputValue={inputValue}
      value={value}
      onChange={(_, newValue: CongregationResponseType) => {
        const isCongExist = options.find(
          (record) => record.congName === newValue.congName
        );

        if (freeSolo && !isCongExist) {
          return freeSoloChange?.(newValue?.congName || '');
        }

        setValue(newValue);
        setCongregation(newValue);
      }}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      loading={isLoading}
      label={selectorLabel}
      startIcon={
        <IconCongregation
          color={value ? 'var(--black)' : 'var(--accent-350)'}
        />
      }
      endIcon={
        freeSolo && isLoading ? (
          <WaitingLoader
            size={24}
            color="var(--accent-350)"
            variant="standard"
          />
        ) : (
          <IconSearch color={value ? 'var(--black)' : 'var(--accent-350)'} />
        )
      }
      renderOption={(props, option) => {
        let optionValue = option.congName.trim();

        if (option.congNumber.length === 0) {
          optionValue = `${t('tr_add')} “${optionValue}”`;
        }

        if (option.congNumber.length > 0) {
          optionValue += `, ${option.congNumber}`;
        }

        return (
          <Box
            component="li"
            {...props}
            sx={{ margin: 0, padding: 0 }}
            key={option.congNumber}
          >
            <Typography>{optionValue}</Typography>
          </Box>
        );
      }}
    />
  );
};

export default CongregationSelector;
