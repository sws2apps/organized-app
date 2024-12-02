import { useMemo } from 'react';
import { useAppTranslation } from '@hooks/index';
import { S89ImagesListType, S89TemplateSelectorType } from './index.types';
import { S89TemplateType } from '@definition/schedules';
import S89_1x1 from '@assets/img/S89_1x1.png';
import S89_1x1_Small from '@assets/img/S89_1x1_small.png';
import S89_4x1 from '@assets/img/S89_4x1.png';

const useS89TemplateSelector = ({ onChange }: S89TemplateSelectorType) => {
  const { t } = useAppTranslation();

  const images: S89ImagesListType[] = useMemo(() => {
    return [
      {
        src: S89_4x1,
        small: S89_4x1,
        id: 'S89_4x1',
        name: t('tr_templateS89Doc4x1Name'),
        desc: t('tr_templateS89Doc4x1Desc'),
      },
      {
        src: S89_1x1,
        small: S89_1x1_Small,
        id: 'S89_1x1',
        name: t('tr_templateS89Doc1x1Name'),
        desc: t('tr_templateS89Doc1x1Desc'),
      },
    ];
  }, [t]);

  const handleChange = (template: S89TemplateType) => {
    onChange(template);
  };

  return { images, handleChange };
};

export default useS89TemplateSelector;
