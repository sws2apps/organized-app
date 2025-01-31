import { FeatureFlagProps } from './index.types';
import useFeatureFlag from './useFeatureFlag';

const FeatureFlag = (props: FeatureFlagProps) => {
  const { display } = useFeatureFlag(props);

  if (!display) return <></>;

  return <>{props.children}</>;
};

export default FeatureFlag;
