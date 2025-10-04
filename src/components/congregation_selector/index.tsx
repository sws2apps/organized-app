import { Box } from '@mui/material';
import { IconCongregation, IconSearch } from '@icons/index';
import { CongregationResponseType } from '@definition/api';
import { useAppTranslation } from '@hooks/index';
import { CongregationSelectorType } from './index.types';
import AutoComplete from '@components/autocomplete';
import Typography from '@components/typography';
import IconLoading from '@components/icon_loading';
import useCongregation from './useCongregation';

/**
 * Component for selecting a congregation.
 * @param {Object} props - Props for the CongregationSelector component.
 * @param {(value: CongregationResponseType) => void} props.setCongregation - Function to set the selected congregation.
 * @returns {JSX.Element} CongregationSelector component.
 */
const CongregationSelector = ({
  setCongregation,
  label,
  freeSolo = false,
  freeSoloChange,
  freeSoloValue,
  readOnly,
  country_guid,
  cong_name,
}: CongregationSelectorType) => {
  const { t } = useAppTranslation();

  const { setValue, value, setInputValue, options, isLoading, inputValue } =
    useCongregation(country_guid, cong_name, freeSoloValue);

  const selectorLabel = label || t('tr_yourCongregation');

  return (
    <AutoComplete
      freeSolo={freeSolo}
      readOnly={readOnly}
      isOptionEqualToValue={(option, value) => {
        return option.congName === value.congName;
      }}
      getOptionLabel={(option: CongregationResponseType) => {
        if (typeof option === 'string') {
          return option;
        }

        const label = option.congName.trim();

        return label;
      }}
      filterOptions={(options, params) => {
        if (!freeSolo) return options;

        if (params.inputValue !== '') {
          options.push({
            congName: params.inputValue,
            address: '',
            circuit: '',
            congGuid: '',
            language: '',
            location: null,
            midweekMeetingTime: null,
            weekendMeetingTime: null,
          });
        }

        return options;
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
          <IconLoading color="var(--accent-350)" />
        ) : (
          <IconSearch color={value ? 'var(--black)' : 'var(--accent-350)'} />
        )
      }
      renderOption={(props, option) => {
        let optionValue = option.congName.trim();

        const inOptions = options.find(
          (record) => record.congName === optionValue
        );

        if (!inOptions) {
          optionValue = `${t('tr_add')} “${optionValue}”`;
        }

        return (
          <Box
            component="li"
            {...props}
            sx={{ margin: 0, padding: 0 }}
            key={option.congName}
          >
            <Typography>{optionValue}</Typography>
          </Box>
        );
      }}
    />
  );
};

export default CongregationSelector;
