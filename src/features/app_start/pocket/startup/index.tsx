import useStartup from './useStartup';
import PocketSignUp from '../signup';
import WaitingLoader from '@components/waiting_loader';

const PocketStartup = () => {
  const { isSignUp } = useStartup();

  return (
    <>
      {!isSignUp && <WaitingLoader type="lottie" variant="standard" />}
      {isSignUp && <PocketSignUp />}
    </>
  );
};

export default PocketStartup;
