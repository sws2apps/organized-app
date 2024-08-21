import { Autocomplete, Box, TextField } from '@mui/material';
import { AutocompleteMutilePropsType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import Typography from '@components/typography';
import { CustomListBoxComponent, CustomPaper } from '@components/autocomplete';

CustomListBoxComponent.displayName = 'CustomListBoxComponent';

const AutocompleteMultiple = <T,>(props: AutocompleteMutilePropsType<T>) => {
  const { t } = useAppTranslation();

  const height = props.height || 44;

  const varHeight = (56 - height) / 2;

  return (
    <Autocomplete
      multiple
      {...props}
      clearIcon={false}
      PaperComponent={CustomPaper}
      ListboxComponent={CustomListBoxComponent}
      sx={{
        '& .MuiAutocomplete-popupIndicator': {
          color: 'var(--black)',
        },
      }}
      noOptionsText={
        <Box sx={{ backgroundColor: 'var(--white)' }}>
          <Typography className="body-regular">{t('tr_noOptions')}</Typography>
        </Box>
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label}
          placeholder={props.placeholder}
          variant="standard"
          sx={{
            '.MuiInputBase-root': {
              minHeight: `${height}px`,
              paddingTop: 'auto',
              paddingBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            },
            '.MuiInputBase-input': {
              paddingTop: `calc(14.5px - ${varHeight}px)`,
              paddingBottom: `calc(14.5px - ${varHeight}px)`,
              flex: '1 0 0',
              color: 'var(--black)',
            },
            '.MuiInput-root:hover:before': {
              borderBottom: '1px solid var(--accent-main)',
              outline: 0,
            },
            '.MuiInput-root:before': {
              borderBottom: '1px solid var(--accent-300) !important',
            },
            '.MuiInput-root:after': {
              borderBottom: '1px solid var(--accent-main)',
            },
            '.MuiInputLabel-root': {
              color: 'var(--accent-350)',
              '&.Mui-focused': {
                color: 'var(--accent-main)',
              },
            },
          }}
        />
      )}
    />
  );
};

export default AutocompleteMultiple;
