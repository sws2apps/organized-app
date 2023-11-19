import { Box } from '@mui/material';
import PocketSignUp from '../signup';
import useStartup from './useStartup';

const PocketStartup = () => {
  const { isSignUp } = useStartup();

  return <Box>{isSignUp && <PocketSignUp />}</Box>;
};

export default PocketStartup;
