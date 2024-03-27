import { forwardRef } from 'react';
import { Autocomplete, Box, BoxProps, Paper, PaperProps } from '@mui/material';
import TextField from '@components/textfield';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import { AutocompletePropsType } from './index.types';

const CustomPaper = (props: PaperProps) => {
  return (
    <Paper
      {...props}
      elevation={1}
      sx={{
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-l)',
        border: '1px solid var(--accent-200)',
      }}
      className="small-card-shadow"
    />
  );
};

const CustomListBoxComponent = forwardRef((props: BoxProps, ref) => {
  return (
    <Box
      ref={ref}
      {...props}
      component="ul"
      sx={{
        padding: '8px 0px',
        '& .MuiAutocomplete-option': {
          padding: '8px 12px 8px 16px !important',
          minHeight: '36px !important',
          backgroundColor: 'unset',
          borderBottom: '1px solid var(--accent-200)',
          '&:hover': {
            backgroundColor: 'var(--accent-100)',
            '& p': {
              color: 'var(--accent-dark)',
            },
          },
        },
        '& .MuiAutocomplete-option:last-child': {
          borderBottom: 'none',
        },
      }}
    />
  );
});

CustomListBoxComponent.displayName = 'CustomListBoxComponent';

const CustomAutoComplete = <T,>(props: AutocompletePropsType<T>) => {
  const { t } = useAppTranslation();

  const startIcon = props.startIcon;
  const endIcon = props.endIcon;
  const label = props.label;

  const defaultProps = { ...props };
  delete defaultProps.startIcon;
  delete defaultProps.endIcon;
  delete defaultProps.label;

  return (
    <Autocomplete
      {...defaultProps}
      fullWidth={true}
      sx={{
        '.MuiOutlinedInput-root': {
          padding: '0px 14px',
        },
        '.MuiInputBase-adornedEnd': {
          paddingRight: '14px !important',
        },
        '.MuiAutocomplete-input': {
          padding: '0px !important',
        },
      }}
      PaperComponent={CustomPaper}
      ListboxComponent={CustomListBoxComponent}
      noOptionsText={
        <Box sx={{ backgroundColor: 'var(--white)' }}>
          <Typography className="body-regular">{t('tr_noOptions')}</Typography>
        </Box>
      }
      loadingText={
        <Box sx={{ backgroundColor: 'var(--white)' }}>
          <Typography className="body-regular">{t('tr_loading')}</Typography>
        </Box>
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          InputProps={{ ...params.InputProps }}
          startIcon={startIcon}
          endIcon={endIcon}
          height={48}
        />
      )}
    />
  );
};

export default CustomAutoComplete;
