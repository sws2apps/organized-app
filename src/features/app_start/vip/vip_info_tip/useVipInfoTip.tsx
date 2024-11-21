import { useMemo, useState } from 'react';
import { useAppTranslation } from '@hooks/index';
import { VipInfoTipProps } from './index.types';

const useVipInfoTip = ({ variant }: VipInfoTipProps) => {
  const { t } = useAppTranslation();

  const [messageShown, setMessageShown] = useState(false);

  const label = useMemo(() => {
    if (variant === 'congregationSearch') {
      return t('tr_cantFindCongregation');
    }

    if (variant === 'congregationCodes') {
      return t('tr_howAreTheCodesDifferent');
    }
  }, [variant, t]);

  const message = useMemo(() => {
    if (variant === 'congregationSearch') {
      return t('tr_cantFindCongregationDesc');
    }

    if (variant === 'congregationCodes') {
      return t('tr_howAreTheCodesDifferentDesc');
    }
  }, [variant, t]);

  const handleToggleVisibility = () => {
    setMessageShown((prev) => !prev);
  };

  return { label, message, messageShown, handleToggleVisibility };
};

export default useVipInfoTip;
