export type S89ClassType = {
  name: string;
  checked?: boolean;
};

export type S89DetailsRowType = {
  field: string;
  value: string;
  align?: 'left' | 'center' | 'right' | 'justify';
};

export type S89ToBeGivenType = {
  main_hall: boolean;
  aux_class_1: boolean;
  aux_class_2?: boolean;
  lang: string;
};

export type S89FooterType = {
  lang: string;
};

export type S89HeaderType = {
  lang: string;
};

export type S89StudentNoteProps = {
  lang: string;
};
