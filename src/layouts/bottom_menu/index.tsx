import { Box } from '@mui/material';
import { BottomMenuProps } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useBottomMenu from './useBottomMenu';

const GLOW_BOTTOM_SPACE =
  'calc(var(--message-glow-small-offset-y) + var(--message-glow-small-blur))';

const BottomMenu = (props: BottomMenuProps) => {
  const { t } = useAppTranslation();

  const { menuRef } = useBottomMenu();

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'calc(120px + env(safe-area-inset-bottom, 0px))',
          background:
            'linear-gradient(180deg, rgba(var(--accent-100-base), 0) 0%, rgba(var(--accent-100-base), 0.85) 100%)',
          zIndex: (theme) => theme.zIndex.drawer,
          pointerEvents: 'none',
        }}
      />
      <Box
        component={'nav'}
        ref={menuRef}
        aria-label={t('tr_bottomActionsMenu')}
        sx={{
          position: 'fixed',
          backgroundColor: 'var(--accent-150)',
          border: '1px solid var(--accent-200)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          bottom: `calc(${GLOW_BOTTOM_SPACE} + env(safe-area-inset-bottom, 0px))`,
          width: 'fit-content',
          maxWidth: 'calc(100% - 32px)',
          left: '50%',
          transform: 'translate(-50%)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: 'var(--message-glow-small)',
          padding: '6px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: '4px',
        }}
      >
        {props.buttons}
      </Box>
    </>
  );
};

export default BottomMenu;
