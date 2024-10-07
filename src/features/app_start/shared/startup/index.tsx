import { Box } from '@mui/material';
import WaitingCircular from '@components/waiting_circular';
import AccountChooser from '@features/app_start/shared/account_chooser';
import PocketStartup from '@features/app_start/pocket/startup';
import VipStartup from '@features/app_start/vip/startup';
import StartupIllustration from '../illustration';
import UnauthorizedRole from '../unauthorized_role';
import useStartup from './useStartup';
import Organized3DLoader from '@components/organized_3d_loader';

const Startup = () => {
  const { isSetup, isAuth, isAccountChoose, accountType, isUnauthorizedRole } =
    useStartup();

  if (isSetup) {
    return (
      <>
        {isAuth && <Organized3DLoader width={72} height={72} />}
        {!isAuth && (
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: {
                mobile: 'column',
                laptop: isUnauthorizedRole ? 'column' : 'row',
              },
              gap: { mobile: '16px', laptop: '24px' },
              marginBottom: '32px',
              overflow: 'auto',
            }}
          >
            {!isUnauthorizedRole && (
              <>
                <Box
                  sx={{
                    maxWidth: { mobile: '100%', laptop: '552px' },
                    padding: { mobile: '16px', laptop: '32px' },
                    borderRadius: 'var(--radius-xxl)',
                    border: '1px solid var(--accent-300)',
                    background: 'var(--white)',
                    display: 'flex',
                    flex: { mobile: '1 0 250px', laptop: '1 0 0' },
                  }}
                >
                  {isAccountChoose && <AccountChooser />}
                  {!isAccountChoose && (
                    <>
                      {accountType === 'vip' && <VipStartup />}
                      {accountType === 'pocket' && <PocketStartup />}
                    </>
                  )}
                </Box>

                <StartupIllustration />
              </>
            )}
            {isUnauthorizedRole && <UnauthorizedRole />}
          </Box>
        )}
      </>
    );
  }

  return <Organized3DLoader width={72} height={72} />;
};

export default Startup;
