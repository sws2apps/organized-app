import { FormControl, FormHelperText, InputLabel, Theme } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { dropdownPaper, SelectStyled } from './index.styles';
import { SelectPropsType } from './index.types';
import MenuItem from '@components/menuitem';
import Typography from '@components/typography';

/**
 * Custom select component.
 *
 * @param props The props for the CustomSelect component.
 * @returns A custom select input field.
 */
const Select = ({ helperText, ...props }: SelectPropsType) => {
  const { t } = useAppTranslation();

  return (
    <FormControl fullWidth sx={props.sx} disabled={props.disabled ?? false}>
      <InputLabel
        className="body-regular"
        sx={{
          color: props.error ? 'var(--red-main)' : 'var(--accent-350)',
          '&.Mui-focused': { color: 'var(--accent-main)' },
          '&[data-shrink=false]': {
            transform: 'translate(14px, 12px) scale(1)',
          },
          '&.Mui-disabled': { color: 'var(--accent-200)' },
        }}
      >
        {props.label}
      </InputLabel>
      <SelectStyled
        {...props}
        size="small"
        fullWidth
        inputProps={{
          ...props.inputProps,
        }}
        MenuProps={{
          slotProps: {
            paper: {
              sx: (theme: Theme) => ({
                ...dropdownPaper(theme),
                width: !props.children ? '300px !important' : 'auto',
              }),
              className: 'small-card-shadow',
            },
          },
        }}
      >
        {(props.children as []).length === 0 && (
          <MenuItem value="">
            <Typography
              className="body-small-regular"
              sx={{
                color: 'var(--grey-350)',
              }}
            >
              {t('tr_noOptions')}
            </Typography>
          </MenuItem>
        )}

        {(props.children as []).length > 0 && props.children}
      </SelectStyled>
      {helperText && (
        <FormHelperText
          className="label-small-regular"
          sx={{
            color: props.error ? 'var(--red-main)' : 'var(--grey-350)',
          }}
        >
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default Select;
