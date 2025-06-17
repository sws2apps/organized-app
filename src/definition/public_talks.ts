export type PublicTalksViewType = 'list' | 'table';

export type PublicTalkType = {
  talk_number: number;
  talk_title: { [language: string]: string };
};

export type PublicTalkLocaleType = {
  talk_number: number;
  talk_title: string;
};
