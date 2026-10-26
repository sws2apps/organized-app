import { useId } from 'react';
import { Box, Stack } from '@mui/material';
import { CUSTOM_DUTY_ICONS } from '@constants/duty_icons';
import { IconCustomDuty } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';
import IconButton from '@components/icon_button';
import InfoNote from '@components/info_note';
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
  const { icons, buttons, columns, handleKeyDown } = useDutyIconSelector({
    value,
    disabled,
    onChange,
  });

  return (
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
          onClick={() => onChange('default')}
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
              value === icon || (value === 'default' && index === 0) ? 0 : -1
            }
            ref={(button) => {
              buttons.current[index] = button;
            }}
            onKeyDown={(event) => handleKeyDown(event, index)}
            disabled={disabled}
            onClick={() => onChange(icon)}
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
      {value === 'meals' && <InfoNote message={t('tr_dutyIconMealsHint')} />}
    </Stack>
  );
};

export default DutyIconSelector;
