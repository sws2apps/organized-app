import { useMemo } from 'react';
import { useAppTranslation } from '@hooks/index';
import { S140ImagesListType, S140TemplateSelectorType } from './index.types';
import { S140TemplateType } from '@definition/schedules';
import S140_default from '@assets/img/S140_default.png';
import S140_app_normal from '@assets/img/S140_app_normal.png';

const useS140TemplateSelector = ({ onChange }: S140TemplateSelectorType) => {
  const { t } = useAppTranslation();

  const images: S140ImagesListType[] = useMemo(() => {
    return [
      {
        src: S140_app_normal,
        small: S140_app_normal,
        id: 'S140_app_normal',
        name: t('tr_templateS140AppNormalName'),
        desc: t('tr_templateS140DescUp2Weeks'),
      },
      {
        src: S140_default,
        small: S140_default,
        id: 'S140_default',
        name: t('tr_templateS140DefaultName'),
        desc: t('tr_templateS140DescUp2Weeks'),
      },
    ];
  }, [t]);

  const handleChange = (template: S140TemplateType) => {
    onChange(template);
  };

  return { images, handleChange };
};

export default useS140TemplateSelector;
