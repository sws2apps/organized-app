import { Box, Stack } from '@mui/material';
import { IconClose, IconHelp } from '@components/icons';
import { VipInfoTipProps } from './index.types';
import useVipInfoTip from './useVipInfoTip';
import Button from '@components/button';
import Markup from '@components/text_markup';
import IconButton from '@components/icon_button';

const VipInfoTip = (props: VipInfoTipProps) => {
  const { handleToggleVisibility, label, message, messageShown } =
    useVipInfoTip(props);

  return (
    <Stack spacing="16px">
      {messageShown && (
        <Box
          sx={{
            borderRadius: '12px',
            width: '100%',
            maxWidth: '800px',
            border: '1px solid var(--accent-300)',
            gap: '8px',
            padding: '16px',
            backgroundColor: 'var(--accent-100)',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}
        >
          <Markup
            className="body-small-regular"
            anchorClassName="body-small-semibold"
            color="var(--accent-400)"
            content={message}
          />

          <IconButton onClick={handleToggleVisibility} sx={{ padding: 0 }}>
            <IconClose color="var(--accent-400)" />
          </IconButton>
        </Box>
      )}

      <Button
        variant="small"
        sx={{ minHeight: '32px', height: '32px', width: 'fit-content' }}
        startIcon={<IconHelp />}
        onClick={handleToggleVisibility}
        disableAutoStretch
      >
        {label}
      </Button>
    </Stack>
  );
};

export default VipInfoTip;
