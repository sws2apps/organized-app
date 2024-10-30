import { Box, InputAdornment } from '@mui/material';
import { IconCopy, IconShare } from '@components/icons';
import { StyledIconButton } from './index.styles';
import { InvitationCodeType } from './index.types';
import { copyToClipboard } from '@utils/common';
import { useAppTranslation } from '@hooks/index';
import useInvitationCode from './useInvitationCode';
import Button from '@components/button';
import TextField from '@components/textfield';
import Typography from '@components/typography';

const InvitationCode = ({ onClose, user }: InvitationCodeType) => {
  const { t } = useAppTranslation();

  const { handleShareCode, isShareSupported } = useInvitationCode(user.code);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <Typography className="h2">
          {t('tr_invitePersonTitle', { PersonName: user.name })}
        </Typography>
        <Typography color={'var(--grey-400)'}>
          {t('tr_inviteUserDesc')}
        </Typography>
      </Box>

      <TextField
        value={user.code}
        label={t('tr_invitationCode')}
        slotProps={{ input: { readOnly: true } }}
        endIcon={
          <InputAdornment
            position="end"
            sx={{
              position: 'relative',
              right: '-12px',
            }}
          >
            {isShareSupported && (
              <StyledIconButton onClick={handleShareCode} title={t('tr_share')}>
                <IconShare color="var(--accent-400)" />
              </StyledIconButton>
            )}

            <StyledIconButton
              onClick={() => copyToClipboard(user.code)}
              title={t('tr_copy')}
            >
              <IconCopy color="var(--accent-400)" />
            </StyledIconButton>
          </InputAdornment>
        }
      />

      <Button variant="main" sx={{ width: '100%' }} onClick={onClose}>
        {t('tr_done')}
      </Button>
    </>
  );
};

export default InvitationCode;
