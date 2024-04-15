import PocketSignUp from '../signup';
import useStartup from './useStartup';

const PocketStartup = () => {
  const { isSignUp } = useStartup();

  return <>{isSignUp && <PocketSignUp />}</>;
};

export default PocketStartup;
