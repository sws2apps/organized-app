import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useLockOverride from './useLockOverride';
import Checkbox from '@components/checkbox';
import { IconHelpFilled } from '@components/icons';
import Tooltip from '@components/tooltip';

const LockOverride = () => {
  const { t } = useAppTranslation();

  const { show_override, checked, handleChecked } = useLockOverride();

  if (!show_override) return <></>;

  return (
    <Stack spacing="4px">
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Checkbox
          label={t('tr_lockOverrideReport')}
          checked={checked}
          onChange={(e) => handleChecked(e.target.checked)}
          sx={{ marginRight: '4px' }}
        />
        <Tooltip
          title={t('tr_lockOverrideReportTooltip')}
          placement="bottom-start"
          variant="icon"
        >
          <IconHelpFilled width={16} height={16} />
        </Tooltip>
      </Box>
    </Stack>
  );
};

export default LockOverride;
