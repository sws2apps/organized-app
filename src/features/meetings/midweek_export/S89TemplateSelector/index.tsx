import { useAppTranslation } from '@hooks/index';
import ExportTemplateSelector from '@features/meetings/export_template_selector';
import { S89TemplateSelectorType } from './index.types';
import useS89TemplateSelector from './useS89TemplateSelector';

const S89TemplateSelector = (props: S89TemplateSelectorType) => {
  const { t } = useAppTranslation();
  const { images, handleChange } = useS89TemplateSelector(props);

  return (
    <ExportTemplateSelector
      images={images}
      selected={props.selected}
      onChange={handleChange}
      label={t('tr_templateS89')}
      onPreviewChange={props.onPreviewChange}
    />
  );
};

export default S89TemplateSelector;
