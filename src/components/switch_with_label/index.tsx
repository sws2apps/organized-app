import { useId } from 'react';
import { useBreakpoints } from '@hooks/index';
import { Box } from '@mui/material';
import { SwitchWithLabelProps } from './index.types';
import Switch from '@components/switch';
import SwitcherContainer from '@components/switcher_container';
import Typography from '@components/typography';

const SwitchWithLabel = ({
  label,
  helper,
  action,
  checked,
  onChange,
  readOnly,
  disabled,
}: SwitchWithLabelProps) => {
  const id = useId();
  const { tablet500Down, laptopUp } = useBreakpoints();

  return (
    <SwitcherContainer
      {...(action && {
        sx: {
          display: 'grid',
          gridTemplateColumns: tablet500Down
            ? 'minmax(0, 1fr) auto'
            : laptopUp
              ? 'auto minmax(0, 1fr) auto'
              : 'minmax(0, 1fr) auto auto',
          gridTemplateAreas: tablet500Down
            ? '"content switch" "action action"'
            : laptopUp
              ? '"switch content action"'
              : '"content action switch"',
          alignItems: 'center',
          columnGap: 'var(--dialog-gap-mobile)',
          rowGap: 'var(--dialog-header-gap)',
          width: '100%',
        },
      })}
    >
      <Switch
        checked={checked}
        disabled={disabled}
        slotProps={{
          input: {
            'aria-labelledby': `${id}-label`,
            'aria-describedby': helper ? `${id}-helper` : undefined,
          },
        }}
        sx={{ flexShrink: 0, gridArea: 'switch' }}
        onChange={(e) => onChange?.(e.target.checked)}
        readOnly={readOnly}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          flex: 1,
          minWidth: 0,
          gridArea: 'content',
        }}
      >
        <Typography id={`${id}-label`} sx={{ color: 'var(--black)' }}>
          {label}
        </Typography>
        {helper && (
          <Typography
            id={`${id}-helper`}
            className="label-small-regular"
            sx={{ color: 'var(--grey-350)' }}
          >
            {helper}
          </Typography>
        )}
      </Box>
      {action && (
        <Box sx={{ display: 'flex', gridArea: 'action', justifySelf: 'end' }}>
          {action}
        </Box>
      )}
    </SwitcherContainer>
  );
};

export default SwitchWithLabel;
