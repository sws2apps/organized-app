export type S140TemplateType = 'S140_default' | 'S140_app_normal';

export type S140TemplateSelectorType = {
  selected: S140TemplateType;
  onChange: (value: S140TemplateType) => void;
};

export type S140TemplateItemType = {
  selected: S140TemplateType;
  item: S140ImagesListType;
  onChange: (value: S140TemplateType) => void;
};

export type S140ImagesListType = {
  src: string;
  small: string;
  id: S140TemplateType;
  name: string;
  desc: string;
};
