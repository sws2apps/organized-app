import CustomTypography from '@components/typography';
import useAppTranslation from '@hooks/useAppTranslation';
import { Box, InputAdornment } from '@mui/material';
import { ShareInvitationCodeModalWindowProps } from './share_invitation_code_modal_window.types';
import CustomTextField from '@components/textfield';
import { IconCopy, IconShare } from '@components/icons';
import { StyledCustomIconButton } from './share_invitation_code_modal_window.styled';
import CustomButton from '@components/button';

const ShareInvitationCodeModalWindow = (
  props: ShareInvitationCodeModalWindowProps
) => {
  const { t } = useAppTranslation();

  const shareButtonAction = () => {
    // TODO: Add Share Button action
  };

  const copyButtonAction = () => {
    // TODO: Add Copy Button action
    navigator.clipboard.writeText(props.invitation_code);
  };

  return (
    <Box
      sx={{
        borderRadius: 'var(--radius-xl)',
        maxWidth: '500px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        backgroundColor: 'var(--white)',
      }}
      className="pop-up-shadow"
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <CustomTypography className="h2" color={'var(--black)'}>
          {t('tr_invitePersonTitle', { PersonName: props.name })}
        </CustomTypography>
        <CustomTypography className="body-regular" color={'var(--grey-400)'}>
          {t('tr_inviteUserDesc')}
        </CustomTypography>
      </Box>

      <CustomTextField
        value={props.invitation_code}
        label={t('tr_invitationCode')}
        endAdornment={
          <InputAdornment
            position="end"
            sx={{
              position: 'relative',
              right: '-12px',
              gap: '16px',
            }}
          >
            <StyledCustomIconButton
              onClick={shareButtonAction}
              title={t('tr_share')}
            >
              <IconShare color="var(--accent-400)" />
            </StyledCustomIconButton>
            <StyledCustomIconButton
              onClick={copyButtonAction}
              title={t('tr_copy')}
            >
              <IconCopy color="var(--accent-400)" />
            </StyledCustomIconButton>
          </InputAdornment>
        }
      />

      <CustomButton variant="main">{t('tr_done')}</CustomButton>
    </Box>
  );
};

export default ShareInvitationCodeModalWindow;
