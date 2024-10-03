import useStartup from './useStartup';
import PocketSignUp from '../signup';
import WaitingCircular from '@components/waiting_circular';

const PocketStartup = () => {
  const { isSignUp } = useStartup();

  return (
    <>
      {!isSignUp && <WaitingCircular variant="standard" />}
      {isSignUp && <PocketSignUp />}
    </>
  );
};

export default PocketStartup;
