import { MouseEvent, forwardRef, useState } from 'react';
import {
  Autocomplete as MUIAutocomplete,
  Box,
  BoxProps,
  Paper,
} from '@mui/material';
import { AutocompletePropsType, CustomPaperType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import Divider from '@components/divider';
import IconButton from '@components/icon_button';
import { IconClose } from '@components/icons';
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
      sx={{
        padding: '8px 0px',
        '& .MuiAutocomplete-option': {
          padding: '8px 12px 8px 16px !important',
          color: 'var(--black)',
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
    height = 48,
    showInputClearButton = false,
    label,
    optionsHeader,
    styleIcon,
    decorator,
    decoratorColor,
    variant,
    ...defaultProps
  } = props;

  const [inputText, setInputText] = useState('');
  const inputClearEnabled = showInputClearButton && !props.multiple;

  const decoratorColorValue = decoratorColor ?? 'var(--orange-dark)';

  return (
    <MUIAutocomplete
      {...defaultProps}
      fullWidth={true}
      inputValue={
        inputClearEnabled ? (props.inputValue ?? inputText) : props.inputValue
      }
      onInputChange={(event, value, reason) => {
        if (inputClearEnabled) setInputText(value);
        props.onInputChange?.(event, value, reason);
      }}
      disableClearable={inputClearEnabled || props.disableClearable}
      sx={{
        '.MuiOutlinedInput-root': {
          padding: '0px 14px',
        },
        '.MuiInputBase-adornedEnd': {
          paddingRight: inputClearEnabled
            ? '80px !important'
            : '14px !important',
        },
        '.MuiAutocomplete-input': {
          padding: '0px !important',
        },
        ...props.sx,
      }}
      slotProps={{
        ...props.slotProps,
        listbox: {
          ...props.slotProps?.listbox,
          component: CustomListBoxComponent,
        },
        paper: {
          ...props.slotProps?.paper,
          optionsHeader,
        },
      }}
      noOptionsText={
        props.noOptionsText || (
          <Box sx={{ backgroundColor: 'var(--white)' }}>
            <Typography
              className="body-regular"
              sx={{
                color: 'var(--grey-350)',
              }}
            >
              {t('tr_noOptions')}
            </Typography>
          </Box>
        )
      }
      loadingText={
        <Box sx={{ backgroundColor: 'var(--white)' }}>
          <Typography className="body-regular">{t('tr_loading')}</Typography>
        </Box>
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant={variant || 'outlined'}
          label={label}
          slotProps={{
            input: {
              ...params.slotProps.input,
              endAdornment: (
                <>
                  {inputClearEnabled &&
                    !props.disabled &&
                    !props.readOnly &&
                    !props.disableClearable &&
                    ((props.inputValue ?? inputText).length > 0 ||
                      !!props.value) && (
                      <IconButton
                        aria-label={props.clearText || t('tr_clear')}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={(event) => {
                          setInputText('');
                          props.onInputChange?.(event, '', 'clear');
                          props.onChange?.(event, null, 'clear');
                        }}
                        sx={{
                          position: 'absolute',
                          right:
                            props.forcePopupIcon === false ? '8px' : '36px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          margin: 0,
                        }}
                      >
                        <IconClose
                          color="var(--black)"
                          width={20}
                          height={20}
                        />
                      </IconButton>
                    )}
                  {params.slotProps.input.endAdornment}
                </>
              ),
            },
            htmlInput: params.slotProps.htmlInput,
          }}
          startIcon={startIcon}
          endIcon={endIcon}
          height={height}
          styleIcon={styleIcon ?? true}
          sx={
            decorator
              ? {
                  '.MuiOutlinedInput-root': {
                    borderRadius: 'var(--radius-l)',
                    '& fieldset': {
                      border: `1px solid ${decoratorColorValue}`,
                    },
                    '&:hover fieldset': {
                      border: `1px solid ${decoratorColorValue}`,
                    },
                    '&.Mui-focused fieldset': {
                      border: `1px solid ${decoratorColorValue}`,
                    },
                  },
                  '.MuiInputLabel-root': {
                    color: decoratorColorValue,
                    '&.Mui-focused': {
                      color: decoratorColorValue,
                    },
                  },
                }
              : {}
          }
        />
      )}
      slots={{
        paper: CustomPaper,
      }}
    />
  );
};

export default Autocomplete;
