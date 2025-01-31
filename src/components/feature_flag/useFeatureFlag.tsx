import { useMemo } from 'react';
import { FEATURE_FLAGS } from '@constants/flags';
import { FeatureFlagProps } from './index.types';

const useFeatureFlag = ({ flag }: FeatureFlagProps) => {
  const display = useMemo(() => {
    return FEATURE_FLAGS[flag] ?? false;
  }, [flag]);

  return { display };
};

export default useFeatureFlag;
