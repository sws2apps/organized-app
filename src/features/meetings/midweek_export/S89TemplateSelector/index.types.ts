import { S89TemplateType } from '@definition/schedules';

export type S89TemplateSelectorType = {
  selected: S89TemplateType;
  onChange: (value: S89TemplateType) => void;
};

export type S89TemplateItemType = {
  selected: S89TemplateType;
  item: S89ImagesListType;
  onChange: (value: S89TemplateType) => void;
};

export type S89ImagesListType = {
  src: string;
  small: string;
  id: S89TemplateType;
  name: string;
  desc: string;
};
