import { useAppTranslation } from '@hooks/index';
import ExportTemplateSelector from '@features/meetings/export_template_selector';
import { S140TemplateSelectorType } from './index.types';
import useS140TemplateSelector from './useS140TemplateSelector';

const S140TemplateSelector = (props: S140TemplateSelectorType) => {
  const { t } = useAppTranslation();
  const { images, handleChange } = useS140TemplateSelector(props);

  return (
    <ExportTemplateSelector
      images={images}
      selected={props.selected}
      onChange={handleChange}
      label={t('tr_templateS140')}
      onPreviewChange={props.onPreviewChange}
    />
  );
};

export default S140TemplateSelector;
