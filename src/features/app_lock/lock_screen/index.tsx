import { PropsWithChildren, ReactNode } from 'react';
import { Fade, Modal, Stack } from '@mui/material';
import Typography from '@components/typography';
import { AppLockCard, AppLockPage } from '../index.styles';

type LockScreenProps = PropsWithChildren & {
  open: boolean;
  title: string;
  description: ReactNode;
};

const TITLE_ID = 'app-lock-title';
const DESCRIPTION_ID = 'app-lock-description';

// a modal, so dialogs already open in the app below can't keep the focus
const LockScreen = ({
  open,
  title,
  description,
  children,
}: LockScreenProps) => {
  return (
    <Modal
      open={open}
      hideBackdrop
      closeAfterTransition
      sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
    >
      {/* no fade in: the app below must never show through */}
      <Fade in={open} appear={false} timeout={{ exit: 350 }}>
        <AppLockPage
          role="dialog"
          aria-modal
          aria-labelledby={TITLE_ID}
          aria-describedby={DESCRIPTION_ID}
        >
          <AppLockCard key={title}>
            <Stack spacing="8px">
              <Typography className="h1" component="h1" id={TITLE_ID}>
                {title}
              </Typography>
              <Typography
                id={DESCRIPTION_ID}
                className="body-regular"
                sx={{ color: 'var(--grey-400)' }}
              >
                {description}
              </Typography>
            </Stack>

            {children}
          </AppLockCard>
        </AppLockPage>
      </Fade>
    </Modal>
  );
};

export default LockScreen;
