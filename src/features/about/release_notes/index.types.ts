export type ReleaseNoteFeature = {
  src: string;
  tr_title: string;
  tr_desc: string;
};

export type ReleaseNote = {
  key: string;
  version: string;
  date: string;
  features: ReleaseNoteFeature[];
  improvements: string[];
};
