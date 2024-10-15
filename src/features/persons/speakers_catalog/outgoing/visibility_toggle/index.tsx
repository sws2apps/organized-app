import { Box } from '@mui/material';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import Switch from '@components/switch';
import SwitcherContainer from '@components/switcher_container';
import Typography from '@components/typography';
import VisibilityOffConfirm from './visibility_off';
import useVisibilityToggle from './useVisibilityToggle';

const VisibilityToggle = () => {
  const { t } = useAppTranslation();

  const { isPublicTalkCoordinator } = useCurrentUser();

  const {
    handleToggleVisibility,
    isVisible,
    handleCloseConfirm,
    openConfirm,
    handleVisibilityOff,
  } = useVisibilityToggle();

  return (
    <Box
      sx={{
        borderBottom: '1px solid var(--accent-200)',
        paddingBottom: '16px',
      }}
    >
      {openConfirm && (
        <VisibilityOffConfirm
          open={openConfirm}
          onClose={handleCloseConfirm}
          onConfirm={handleVisibilityOff}
        />
      )}

      <SwitcherContainer>
        <Switch
          checked={isVisible}
          onChange={(e) => handleToggleVisibility(e.target.checked)}
          readOnly={!isPublicTalkCoordinator}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Typography>{t('tr_discoverableSetting')}</Typography>
          <Typography className="label-small-regular" color="var(--grey-350)">
            {t('tr_discoverableSettingDesc')}
          </Typography>
        </Box>
      </SwitcherContainer>
    </Box>
  );
};

export default VisibilityToggle;
