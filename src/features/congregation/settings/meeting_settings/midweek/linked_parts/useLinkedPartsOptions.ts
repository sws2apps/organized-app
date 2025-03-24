import useAppTranslation from '@hooks/useAppTranslation';
import { LinkedPartsOption } from './index.types';

const useLinkedPartsOptions = () => {
  const { t } = useAppTranslation();

  const options: LinkedPartsOption[] = [
    { id: 'Do_Not_Link', name: t('tr_doNotLink') },
    {
      id: 'MM_Chairman_A',
      name: t('tr_chairman'),
    },
    {
      id: 'MM_TGWTalk',
      name: t('tr_tgwTalk'),
    },
    {
      id: 'MM_TGWGems',
      name: t('tr_tgwGems'),
    },
    {
      id: 'MM_LCPart1',
      name: `${t('tr_livingPart')} (${t('tr_lcPartNum', { partNumber: '1' })})`,
    },
    {
      id: 'MM_LCPart2',
      name: `${t('tr_livingPart')} (${t('tr_lcPartNum', { partNumber: '2' })})`,
    },
    {
      id: 'MM_LCPart3',
      name: `${t('tr_livingPart')} (${t('tr_lcPartNum', { partNumber: '3' })})`,
    },
    {
      id: 'MM_LCCBSConductor',
      name: t('tr_congregationBibleStudyConductor'),
    },
    {
      id: 'MM_LCCBSReader',
      name: t('tr_congregationBibleStudyReader'),
    },
  ];

  return options;
};

export default useLinkedPartsOptions;
