import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { FeatureFlagProps } from './index.types';
import { featureFlagsState } from '@states/app';

const useFeatureFlag = ({ flag }: FeatureFlagProps) => {
  const FEATURE_FLAGS = useAtomValue(featureFlagsState);

  const display = useMemo(() => {
    return FEATURE_FLAGS[flag] ?? false;
  }, [flag, FEATURE_FLAGS]);

  return { display };
};

export default useFeatureFlag;
