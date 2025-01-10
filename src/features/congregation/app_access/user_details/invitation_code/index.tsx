import { Box, InputAdornment } from '@mui/material';
import { IconCopy, IconInvite, IconSync } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { DetailsContainer } from '../shared_styles';
import { copyToClipboard } from '@utils/common';
import useInvitationCode from './useInvitationCode';
import Button from '@components/button';
import DeleteCode from './delete_code';
import IconButton from '@components/icon_button';
import Markup from '@components/text_markup';
import TextField from '@components/textfield';
import Typography from '@components/typography';
import WaitingLoader from '@components/waiting_loader';

const InvitationCode = () => {
  const { t } = useAppTranslation();

  const {
    code,
    handleRegenerateCode,
    handleCloseDelete,
    handleOpenDelete,
    isDelete,
    isProcessing,
    currentUser,
  } = useInvitationCode();

  return (
    <DetailsContainer>
      {isDelete && (
        <DeleteCode
          user={currentUser}
          open={isDelete}
          onClose={handleCloseDelete}
        />
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <Typography className="h2">{t('tr_invitationCode')}</Typography>

          <Markup
            className="body-regular"
            anchorClassName="h4"
            color="var(--grey-400)"
            content={t('tr_invitationCodeInstruction')}
          />
        </Box>
      </Box>

      {currentUser.profile.pocket_invitation_code && (
        <>
          <TextField
            label={t('tr_invitationCode')}
            sx={{ marginBottom: '-8px' }}
            slotProps={{ input: { readOnly: true } }}
            value={code}
            endIcon={
              <InputAdornment
                position="end"
                sx={{
                  position: 'relative',
                  right: '-12px',
                  gap: '16px',
                }}
              >
                <IconButton
                  title={t('tr_regenerateInvitationCode')}
                  sx={{ borderRadius: 'var(--radius-max)' }}
                  onClick={handleRegenerateCode}
                >
                  <IconSync
                    color="var(--accent-400)"
                    className="organized-generate-icon"
                  />
                </IconButton>
                <IconButton
                  title={t('tr_copy')}
                  sx={{ borderRadius: 'var(--radius-max)' }}
                  onClick={() => copyToClipboard(code)}
                >
                  <IconCopy color="var(--accent-400)" />
                </IconButton>
              </InputAdornment>
            }
          />

          <Button
            variant="tertiary"
            sx={{
              color: 'var(--red-main)',
              border: '1px solid var(--red-main)',
              '&:hover': {
                backgroundColor: 'var(--red-secondary)',
                border: '1px solid var(--red-main)',
              },
              '&:active': {
                backgroundColor: 'var(--accent-100)',
                border: '1px solid var(--red-main)',
              },
            }}
            onClick={handleOpenDelete}
          >
            {t('tr_deleteInvitationCode')}
          </Button>
        </>
      )}

      {!currentUser.profile.pocket_invitation_code && (
        <Button
          variant="tertiary"
          startIcon={
            isProcessing ? (
              <WaitingLoader size={22} variant="standard" />
            ) : (
              <IconInvite color="var(--accent-dark)" />
            )
          }
          disabled={isProcessing}
          onClick={handleRegenerateCode}
        >
          {t('tr_generateInvitationCode')}
        </Button>
      )}
    </DetailsContainer>
  );
};

export default InvitationCode;
