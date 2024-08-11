import { PublicTalkType } from '@definition/public_talks';
import { TalkItemType } from '../index.types';

export type TalksTableViewType = {
  talks: TalkItemType[];
};

export type TalkTableItemType = PublicTalkType & {
  history: {
    year: string;
    records: {
      date: string;
      person: string;
    }[];
  }[];
};
