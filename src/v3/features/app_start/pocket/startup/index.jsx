import { Box } from '@mui/material';
import { WaitingCircular } from '@components';
import PocketSignUp from '../signup';
import useStartup from './useStartup';

const PocketStartup = () => {
  const { isSignUp } = useStartup();

  return (
    <Box>
      {isSignUp && <PocketSignUp />}
      {!isSignUp && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: { tablet: 'auto', laptop: 'calc(100vh - 180px)' },
          }}
        >
          <WaitingCircular variant="standard" />
        </Box>
      )}
    </Box>
  );
};

export default PocketStartup;
