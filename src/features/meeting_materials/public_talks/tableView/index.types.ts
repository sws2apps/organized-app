import { PublicTalkLocaleType } from '@definition/public_talks';
import { TalkItemType } from '../index.types';

export type TalksTableViewType = {
  talks: TalkItemType[];
};

export type TalkTableItemType = PublicTalkLocaleType & {
  history: {
    year: string;
    records: {
      date: string;
      person: string;
    }[];
  }[];
};
