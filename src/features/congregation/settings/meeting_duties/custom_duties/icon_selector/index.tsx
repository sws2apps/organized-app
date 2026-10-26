import { useId } from 'react';
import { Box, Popover, Stack } from '@mui/material';
import { CUSTOM_DUTY_ICONS } from '@constants/duty_icons';
import { IconCustomDuty } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';
import IconButton from '@components/icon_button';
import Tooltip from '@components/tooltip';
import Typography from '@components/typography';
import { DutyIconSelectorProps } from './index.types';
import useDutyIconSelector from './useDutyIconSelector';

const DutyIconSelector = ({
  value,
  disabled,
  onChange,
}: DutyIconSelectorProps) => {
  const { t } = useAppTranslation();
  const labelId = useId();
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
  } = useDutyIconSelector({
    value,
    disabled,
    onChange,
  });

  const selectedLabel = t(
    value === 'default' ? 'tr_dutyIconDefault' : CUSTOM_DUTY_ICONS[value].label
  );
  const open = Boolean(anchorEl) && !disabled;

  return (
    <>
      <Tooltip title={`${t('tr_dutyIcon')}: ${selectedLabel}`}>
        <IconButton
          aria-label={`${t('tr_dutyIcon')}: ${selectedLabel}`}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? `${labelId}-popover` : undefined}
          disabled={disabled}
          onClick={handleOpen}
          sx={{
            margin: 0,
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-l)',
            border: '1px solid var(--accent-350)',
            color: 'var(--accent-350)',
            '&[aria-expanded="true"]': { borderColor: 'var(--accent-main)' },
            '&.Mui-disabled': {
              borderColor: 'var(--accent-200)',
              color: 'var(--accent-200)',
            },
          }}
        >
          <IconCustomDuty icon={value} color="currentColor" />
        </IconButton>
      </Tooltip>
      <Popover
        id={`${labelId}-popover`}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        slotProps={{
          transition: { onEntered: focusSelected },
          paper: {
            role: 'dialog',
            'aria-labelledby': labelId,
            className: 'small-card-shadow',
            sx: {
              width: 'calc(var(--dialog-gap-mobile) * 21)',
              maxWidth: 'calc(100vw - var(--dialog-gap-mobile) * 2)',
              padding: 'var(--dialog-gap-mobile)',
              marginTop: 'var(--radius-s)',
              backgroundColor: 'var(--white)',
              border: '1px solid var(--accent-200)',
              borderRadius: 'var(--radius-l)',
            },
          },
        }}
      >
        <Stack spacing="var(--dialog-header-gap)">
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--dialog-header-gap)',
            }}
          >
            <Typography id={labelId} className="body-small-semibold">
              {t('tr_dutyIcon')}
            </Typography>
            <Button
              variant="small"
              sx={{ minHeight: 'calc(var(--dialog-gap-mobile) * 3)' }}
              disableAutoStretch
              disabled={disabled || value === 'default'}
              onClick={() => handleSelect('default')}
              startIcon={<IconCustomDuty />}
            >
              {t('tr_dutyIconDefault')}
            </Button>
          </Stack>
          <Box
            role="radiogroup"
            aria-labelledby={labelId}
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gap: 'var(--dialog-header-gap)',
            }}
          >
            {icons.map((icon, index) => (
              <IconButton
                key={icon}
                aria-label={t(CUSTOM_DUTY_ICONS[icon].label)}
                role="radio"
                aria-checked={value === icon}
                tabIndex={
                  value === icon || (value === 'default' && index === 0)
                    ? 0
                    : -1
                }
                ref={(button) => {
                  buttons.current[index] = button;
                }}
                onKeyDown={(event) => handleKeyDown(event, index)}
                disabled={disabled}
                onClick={() => handleSelect(icon)}
                sx={{
                  margin: 0,
                  minWidth: 0,
                  borderRadius: 'var(--radius-l)',
                  padding: 'var(--dialog-header-gap)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--radius-s)',
                  color: disabled ? 'var(--grey-350)' : 'var(--accent-dark)',
                  border: '1px solid var(--accent-200)',
                  '&[aria-checked="true"]': {
                    backgroundColor: 'var(--accent-150)',
                    borderColor: 'var(--accent-main)',
                    boxShadow: 'inset 0 0 0 1px var(--accent-main)',
                  },
                }}
              >
                <IconCustomDuty icon={icon} color="currentColor" />
                <Typography
                  className="label-small-medium"
                  sx={{ overflowWrap: 'anywhere', color: 'inherit' }}
                >
                  {t(CUSTOM_DUTY_ICONS[icon].label)}
                </Typography>
              </IconButton>
            ))}
          </Box>
        </Stack>
      </Popover>
    </>
  );
};

export default DutyIconSelector;
