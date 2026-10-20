import { S89TemplateType } from '@definition/schedules';
import { ExportTemplateImage } from '@features/meetings/export_template_selector/index.types';

export type S89TemplateSelectorType = {
  selected: S89TemplateType;
  onChange: (value: S89TemplateType) => void;
  onPreviewChange?: (open: boolean) => void;
};

export type S89ImagesListType = ExportTemplateImage<S89TemplateType>;
