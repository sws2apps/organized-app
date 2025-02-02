import { PropsWithChildren } from 'react';
import useFeatureFlags from './useFeatureFlags';
import WaitingLoader from '@components/waiting_loader';

const FeatureFlagsWrapper = ({ children }: PropsWithChildren) => {
  const { isLoading } = useFeatureFlags();

  if (isLoading) return <WaitingLoader type="lottie" />;

  return <>{children}</>;
};

export default FeatureFlagsWrapper;
