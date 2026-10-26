import { useId } from 'react';
import { Box, Popover } from '@mui/material';
import { CUSTOM_DUTY_ICONS } from '@constants/duty_icons';
import { IconCustomDuty } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import IconButton from '@components/icon_button';
import { DutyIconSelectorProps } from './index.types';
import useDutyIconSelector from './useDutyIconSelector';

const DutyIconSelector = ({
  value,
  disabled,
  onChange,
}: DutyIconSelectorProps) => {
  const { t } = useAppTranslation();
  const id = useId();
  const {
    icons,
    buttons,
    columns,
    handleKeyDown,
    anchorEl,
    handleOpen,
    handleClose,
    handleSelect,
    focusSelected,
  } = useDutyIconSelector({ value, disabled, onChange });
  const iconLabel = (icon: typeof value) =>
    t(
      icon === 'default' ? 'tr_dutyIconDefault' : CUSTOM_DUTY_ICONS[icon].label
    );
  const open = Boolean(anchorEl) && !disabled;

  return (
    <>
      <IconButton
        aria-label={`${t('tr_dutyIcon')}: ${iconLabel(value)}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        disabled={disabled}
        onClick={handleOpen}
        sx={{
          margin: 0,
          width: '44px',
          height: '44px',
          borderRadius: 'var(--radius-l)',
          color: 'var(--accent-dark)',
          border: '1px solid var(--accent-350)',
          '&[aria-expanded="true"], &:focus-visible': {
            borderColor: 'var(--accent-main)',
          },
          '&.Mui-disabled': {
            color: 'var(--accent-200)',
            borderColor: 'var(--accent-200)',
          },
        }}
      >
        <IconCustomDuty icon={value} color="currentColor" />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        slotProps={{
          transition: { onEntered: focusSelected },
          paper: {
            role: 'dialog',
            'aria-label': t('tr_dutyIcon'),
            className: 'small-card-shadow',
            sx: {
              padding: 'var(--dialog-header-gap)',
              marginTop: 'var(--radius-s)',
              backgroundColor: 'var(--white)',
              borderRadius: 'var(--radius-l)',
            },
          },
        }}
      >
        <Box
          role="radiogroup"
          aria-label={t('tr_dutyIcon')}
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, auto)`,
            gap: 'var(--dialog-header-gap)',
          }}
        >
          {icons.map((icon, index) => (
            <IconButton
              key={icon}
              aria-label={iconLabel(icon)}
              role="radio"
              aria-checked={value === icon}
              tabIndex={value === icon ? 0 : -1}
              ref={(button) => {
                buttons.current[index] = button;
              }}
              onKeyDown={(event) => handleKeyDown(event, index)}
              disabled={disabled}
              onClick={() => handleSelect(icon)}
              sx={{
                margin: 0,
                width: 'calc(var(--dialog-gap-mobile) * 3)',
                height: 'calc(var(--dialog-gap-mobile) * 3)',
                borderRadius: 'var(--radius-l)',
                color: disabled ? 'var(--grey-350)' : 'var(--accent-dark)',
                border: '1px solid transparent',
                '&[aria-checked="true"]': {
                  color: disabled ? 'var(--accent-200)' : 'var(--accent-main)',
                  borderColor: disabled
                    ? 'var(--accent-200)'
                    : 'var(--accent-main)',
                },
              }}
            >
              <IconCustomDuty icon={icon} color="currentColor" />
            </IconButton>
          ))}
        </Box>
      </Popover>
    </>
  );
};

export default DutyIconSelector;
