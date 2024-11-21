import { useEffect, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { congregationCreateStepState } from '@states/app';
import CongregationAccessCode from './congregation_access_code';
import CongregationDetails from './congregation_details';
import CongregationMasterKey from './congregation_master_key';

const useCongregationCreate = () => {
  const { t } = useAppTranslation();

  const currentStep = useRecoilValue(congregationCreateStepState);

  const steps = useMemo(() => {
    return [
      {
        label: t('tr_congregationDetails'),
        Component: <CongregationDetails />,
      },
      { label: t('tr_createMasterKey'), Component: <CongregationMasterKey /> },
      {
        label: t('tr_createAccessCode'),
        Component: <CongregationAccessCode />,
      },
    ];
  }, [t]);

  useEffect(() => {
    const stepIconTexts: NodeListOf<HTMLElement> =
      document.querySelectorAll('.MuiStepIcon-text');

    stepIconTexts.forEach((text) => {
      text.classList.add('label-small-medium');
    });
  }, []);

  return { steps, currentStep };
};

export default useCongregationCreate;
