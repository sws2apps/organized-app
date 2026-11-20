import { useAppTranslation } from '@hooks/index';
import { ReactNode } from 'react';
import { Box } from '@mui/material';
import { Typography } from '@components/index';
import Autocomplete from '@components/autocomplete';
import MenuSubHeader from '@components/menu_sub_header';
import { IconSearch } from '@icons/index';
import { matchesName } from '@features/territories/name_search';

type PublisherSearchProps<T> = {
  // groups first, then publishers, so the sections stay together
  options: T[];
  value: T | null;
  onChange: (value: T | null) => void;
  getName: (option: T) => string;
  getId?: (option: T) => string;
  isGroup?: (option: T) => boolean;
  label?: string;
  placeholder?: string;
  autoFocus?: boolean;
  blurOnSelect?: boolean;
  inputValue?: string;
  onInputChange?: (value: string, reason: string) => void;
  // shown after the name, e.g. a count
  renderExtra?: (option: T) => ReactNode;
  noOptionsText?: ReactNode;
};

// a search field that picks a publisher or a group: typing narrows the list
// by any part of the name, Enter takes the first match
const PublisherSearch = <T,>({
  options,
  value,
  onChange,
  getName,
  getId,
  isGroup,
  label,
  placeholder,
  autoFocus,
  blurOnSelect,
  inputValue,
  onInputChange,
  renderExtra,
  noOptionsText,
}: PublisherSearchProps<T>) => {
  const { t } = useAppTranslation();
  return (
    <Autocomplete
      label={label ?? t('tr_publisher')}
      placeholder={placeholder ?? t('tr_territorySearchPublishers')}
      startIcon={<IconSearch color="var(--grey-350)" />}
      autoFocus={autoFocus}
      autoHighlight
      blurOnSelect={blurOnSelect}
      options={options}
      value={value}
      inputValue={inputValue}
      onInputChange={
        onInputChange && ((_, next, reason) => onInputChange(next, reason))
      }
      onChange={(_, next) => onChange(next as T | null)}
      filterOptions={(items, { inputValue: query }) =>
        items.filter((item) => matchesName(getName(item as T), query))
      }
      getOptionLabel={(option) => getName(option as T)}
      isOptionEqualToValue={(option, chosen) =>
        (getId ?? getName)(option as T) === (getId ?? getName)(chosen as T)
      }
      groupBy={
        isGroup &&
        ((option) =>
          isGroup(option as T) ? t('tr_groups') : t('tr_publishers'))
      }
      renderGroup={(params) => (
        <li key={params.key}>
          <MenuSubHeader
            component="div"
            disableSticky
            sx={{
              lineHeight: 'inherit',
              paddingBlock: 'var(--radius-l) var(--radius-s)',
            }}
          >
            {params.group}
          </MenuSubHeader>
          <Box component="ul" sx={{ padding: 0, margin: 0 }}>
            {params.children}
          </Box>
        </li>
      )}
      renderOption={({ key, ...props }, option) => (
        <Box
          component="li"
          key={getId ? getId(option as T) : key}
          {...props}
          sx={{ gap: '8px' }}
        >
          <Typography className="body-regular" sx={{ flexGrow: 1 }}>
            {getName(option as T)}
          </Typography>
          {renderExtra?.(option as T)}
        </Box>
      )}
      noOptionsText={noOptionsText}
    />
  );
};

export default PublisherSearch;
