import { HTMLInputTypeAttribute, useState } from 'react';
import {
  IconButton,
  InputAdornment,
  TextField as MUITextField,
} from '@mui/material';
import { IconVisibility, IconVisibilityOff } from '@components/icons';
import { TextFieldTypeProps } from './index.types';

/**
 * A custom text field component.
 *
 * @param {TextFieldTypeProps} props - The props for the CustomTextField component.
 * @returns {JSX.Element} - JSX.Element
 */
const TextField = (props: TextFieldTypeProps) => {
  const {
    height,
    startIcon,
    endIcon,
    styleIcon,
    InputProps,
    resetHelperPadding,
    success,
    ...defaultProps
  } = props;
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [inputType, setInputType] = useState<HTMLInputTypeAttribute>(
    props.type
  );

  const heightLocal = height || 44;
  const endIconLocal =
    props.type === 'password' ? (
      showAccessCode ? (
        <IconVisibilityOff />
      ) : (
        <IconVisibility />
      )
    ) : (
      endIcon
    );
  const styleIconLocal = styleIcon ?? true;

  const varHeight = (56 - heightLocal) / 2;

  const isMultiLine = props.multiline || props.rows;

  const handleToggleAccessCode = () => {
    setShowAccessCode((prev) => {
      if (!prev) setInputType('text');
      if (prev) setInputType(props.type);

      return !prev;
    });
  };

  return (
    <MUITextField
      {...defaultProps}
      type={inputType}
      fullWidth
      sx={{
        '.MuiInputBase-root': {
          height: isMultiLine ? 'auto' : `${heightLocal}px`,
          paddingTop: isMultiLine ? '0' : 'auto',
          paddingBottom: isMultiLine ? '0' : 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        },
        '.MuiInputBase-input': {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          paddingTop: `calc(14.5px - ${varHeight}px)`,
          paddingBottom: `calc(14.5px - ${varHeight}px)`,
          flex: '1 0 0',
          color:
            props.value || props.inputProps?.value
              ? 'var(--black)'
              : 'var(--accent-400)',
        },
        '.MuiInput-root:before': {
          borderBottom: '1px solid var(--accent-300) !important',
        },
        '.MuiInput-root:after': {
          borderBottom: '1px solid var(--accent-main)',
        },
        '.MuiInput-root:hover:before': {
          borderBottom: '1px solid var(--accent-main)',
          outline: 0,
        },
        '.MuiOutlinedInput-root': {
          borderRadius: 'var(--radius-l)',
          color: 'var(--black)',
          '& svg': {
            boxSizing: 'content-box',
          },
          '& fieldset': {
            border: success
              ? '1px solid var(--green-main)'
              : '1px solid var(--accent-350)',
          },
          '&:hover fieldset': {
            border: success
              ? '1px solid var(--green-main)'
              : '1px solid var(--accent-main)',
          },
          '&.Mui-focused fieldset': {
            border: success
              ? '1px solid var(--green-main)'
              : '1px solid var(--accent-main)',
          },
          '&.Mui-error': {
            '&:hover fieldset': {
              border: '1px solid var(--red-main)',
            },
            '&.Mui-focused fieldset': {
              border: '1px solid var(--red-main)',
            },
          },
        },
        '.MuiInputLabel-root': {
          color: success ? 'var(--green-main)' : 'var(--accent-350)',
          '&.Mui-focused': {
            color: success ? 'var(--green-main)' : 'var(--accent-350)',
          },
          '&.Mui-error': {
            color: 'var(--red-main)',
          },
        },

        '& .MuiSvgIcon-root': {
          color: 'var(--accent-350)',
        },

        '.MuiFormLabel-root[data-shrink=false]': { top: `-${varHeight}px` },
        '& > .MuiAutocomplete-popupIndicator': {
          '& svg, & svg g, & svg g path': 'var(--black)',
        },
        ...props.sx,
      }}
      InputProps={{
        ...InputProps,
        className: props.className,
        startAdornment: startIcon ? (
          <InputAdornment
            position="start"
            sx={{
              height: 0,
              maxHeight: 0,
              marginRight: 0,
              '& svg, & svg g, & svg g path': styleIconLocal
                ? {
                    fill: startIcon.props.color
                      ? startIcon.props.color
                      : props.value
                        ? 'var(--black)'
                        : 'var(--accent-350)',
                  }
                : {},
            }}
          >
            {startIcon}
          </InputAdornment>
        ) : (
          InputProps?.startAdornment
        ),
        endAdornment: endIconLocal ? (
          <InputAdornment
            position="end"
            sx={{
              height: 0,
              maxHeight: 0,
              marginRight: 0,
              '& svg, & svg g, & svg g path': styleIconLocal
                ? {
                    fill: endIconLocal.props.color ?? 'var(--accent-350)',
                  }
                : {},
            }}
          >
            {props.type !== 'password' && endIconLocal}
            {props.type === 'password' && (
              <IconButton
                onClick={handleToggleAccessCode}
                sx={{ margin: 0, padding: 0 }}
              >
                {endIconLocal}
              </IconButton>
            )}
          </InputAdornment>
        ) : (
          <InputAdornment
            position="end"
            sx={{
              '& svg, & svg g, & svg g path': {
                fill: 'var(--black)',
              },
            }}
          >
            {InputProps?.endAdornment}
          </InputAdornment>
        ),
      }}
      FormHelperTextProps={{
        component: 'div',
        style: {
          margin: 0,
          padding: resetHelperPadding ? 0 : '4px 16px 0px 16px',
          color: success
            ? 'var(--green-main)'
            : props.error
              ? 'var(--red-main)'
              : 'inherit',
        },
      }}
    />
  );
};

export default TextField;
