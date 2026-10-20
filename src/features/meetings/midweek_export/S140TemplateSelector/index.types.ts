import { S140TemplateType } from '@definition/schedules';
import { ExportTemplateImage } from '@features/meetings/export_template_selector/index.types';

export type S140TemplateSelectorType = {
  selected: S140TemplateType;
  onChange: (value: S140TemplateType) => void;
  onPreviewChange?: (open: boolean) => void;
};

export type S140ImagesListType = ExportTemplateImage<S140TemplateType>;
