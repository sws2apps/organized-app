import { useMemo } from 'react';
import { useAppTranslation } from '@hooks/index';
import {
  S140ImagesListType,
  S140TemplateSelectorType,
  S140TemplateType,
} from './index.types';
import S140_default from '@assets/img/S140_default.png';

const useS140TemplateSelector = ({ onChange }: S140TemplateSelectorType) => {
  const { t } = useAppTranslation();

  const images: S140ImagesListType[] = useMemo(() => {
    return [
      {
        src: S140_default,
        small: S140_default,
        id: 'S140_default',
        name: t('tr_templateS140DefaultName'),
        desc: t('tr_templateS140DefaultDesc'),
      },
    ];
  }, [t]);

  const handleChange = (template: S140TemplateType) => {
    onChange(template);
  };

  return { images, handleChange };
};

export default useS140TemplateSelector;
