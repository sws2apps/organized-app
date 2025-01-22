import { Box, Menu } from '@mui/material';
import { IconArrowDown } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { HoursCreditPresetsProps } from './index.types';
import useHoursCreditPresets from './useHoursCreditPresets';
import Typography from '@components/typography';
import PresetItem from './preset_item';

const HoursCreditPresets = (props: HoursCreditPresetsProps) => {
  const { t } = useAppTranslation();

  const { presetsOpen, handleTogglePresets, presets, handleClosePreset } =
    useHoursCreditPresets();

  return (
    <>
      <Box sx={{ flex: 1 }}>
        <Box
          onClick={props.readOnly ? null : handleTogglePresets}
          sx={{
            width: 'fit-content',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            cursor: !props.readOnly && 'pointer',
          }}
        >
          <Typography sx={{ userSelect: 'none' }}>
            {t('tr_creditHours')}
          </Typography>

          {!props.readOnly && (
            <IconArrowDown
              color="var(--black)"
              sx={{
                transform: presetsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          )}
        </Box>
      </Box>

      {props.anchorEl.current && (
        <Menu
          disableAutoFocus={true}
          disableAutoFocusItem={true}
          disableScrollLock={true}
          anchorEl={props.anchorEl.current}
          open={presetsOpen}
          onClose={handleTogglePresets}
          sx={{
            padding: '8px 0',
            '& li': {
              borderBottom: '1px solid var(--accent-200)',
            },
            '& li:last-child': {
              borderBottom: 'none',
            },
          }}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          slotProps={{
            paper: {
              style: {
                borderRadius: 'var(--radius-l)',
                border: '1px solid var(--accent-200)',
                backgroundColor: 'var(--white)',
                width: props.anchorEl.current.clientWidth,
              },
            },
          }}
        >
          <Typography
            className="body-small-semibold"
            color="var(--grey-400)"
            sx={{ padding: '4px 16px' }}
          >
            {t('tr_presets')}
          </Typography>

          {presets.map((preset) => (
            <PresetItem
              key={preset.name}
              preset={preset}
              onClose={handleClosePreset}
              onSelect={props.onSelect}
            />
          ))}
        </Menu>
      )}
    </>
  );
};

export default HoursCreditPresets;
