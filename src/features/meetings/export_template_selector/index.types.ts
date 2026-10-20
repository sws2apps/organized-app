export type ExportTemplateImage<T extends string> = {
  id: T;
  src: string;
  small: string;
  name: string;
  desc: string;
};

export type ExportTemplateSelectorProps<T extends string> = {
  images: ExportTemplateImage<T>[];
  selected: T;
  onChange: (value: T) => void;
  label: string;
  showDescriptions?: boolean;
  onPreviewChange?: (open: boolean) => void;
};
