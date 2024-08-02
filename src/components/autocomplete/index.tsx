import { MouseEvent, forwardRef } from 'react';
import {
  Autocomplete as MUIAutocomplete,
  Box,
  BoxProps,
  Paper,
} from '@mui/material';
import { AutocompletePropsType, CustomPaperType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import Divider from '@components/divider';
import TextField from '@components/textfield';
import Typography from '@components/typography';

export const CustomPaper = ({
  optionsHeader,
  ...otherProps
}: CustomPaperType) => {
  const handleMouseDown = (event: MouseEvent) => {
    event.preventDefault();
  };

  return (
    <Paper
      {...otherProps}
      elevation={1}
      sx={{
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-l)',
        border: '1px solid var(--accent-200)',
      }}
      className="small-card-shadow"
      onMouseDown={handleMouseDown}
    >
      {optionsHeader && (
        <>
          <Box sx={{ padding: '8px 12px 8px 16px' }}>{optionsHeader}</Box>
          <Divider color="var(--accent-200)" />
        </>
      )}
      {otherProps.children}
    </Paper>
  );
};

export const CustomListBoxComponent = forwardRef((props: BoxProps, ref) => {
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
            backgroundColor: 'var(--accent-150)',
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

const Autocomplete = <T,>(props: AutocompletePropsType<T>) => {
  const { t } = useAppTranslation();

  const {
    startIcon,
    endIcon,
    label,
    optionsHeader,
    styleIcon,
    decorator,
    ...defaultProps
  } = props;

  return (
    <MUIAutocomplete
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
      PaperComponent={(paperProps) => (
        <CustomPaper {...paperProps} optionsHeader={optionsHeader} />
      )}
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
          label={props.value ? label : ''}
          placeholder={props.value ? '' : label}
          InputProps={{ ...params.InputProps }}
          startIcon={startIcon}
          endIcon={endIcon}
          height={48}
          styleIcon={styleIcon ?? true}
          sx={
            decorator === 'error'
              ? {
                  '.MuiOutlinedInput-root': {
                    '& fieldset': {
                      border: '1px solid var(--red-main)',
                    },
                    '&:hover fieldset': {
                      border: '1px solid var(--red-main)',
                    },
                    '&.Mui-focused fieldset': {
                      border: '1px solid var(--red-main)',
                    },
                  },
                  '.MuiInputLabel-root': {
                    color: 'var(--red-main)',
                    '&.Mui-focused': {
                      color: 'var(--red-main)',
                    },
                  },
                }
              : {}
          }
        />
      )}
    />
  );
};

export default Autocomplete;
