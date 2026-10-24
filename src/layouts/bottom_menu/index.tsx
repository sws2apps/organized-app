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
        className="mui-fixed"
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
        className="mui-fixed"
        sx={{
          position: 'fixed',
          bottom: `calc(${GLOW_BOTTOM_SPACE} + env(safe-area-inset-bottom, 0px))`,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          pointerEvents: 'none',
        }}
      >
        <Box
          component={'nav'}
          ref={menuRef}
          aria-label={t('tr_bottomActionsMenu')}
          sx={{
            backgroundColor: 'var(--accent-150)',
            border: '1px solid var(--accent-200)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            width: 'fit-content',
            maxWidth: 'calc(100% - 32px)',
            boxShadow: 'var(--message-glow-small)',
            padding: '6px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: '4px',
            pointerEvents: 'auto',
          }}
        >
          {props.buttons}
        </Box>
      </Box>
    </>
  );
};

export default BottomMenu;
