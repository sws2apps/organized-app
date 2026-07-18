import { InformationBoardCategory } from '@definition/information_board';
import { informationBoardSchema } from '@services/dexie/schema';
import { atom } from 'jotai';

export const informationBoardState = atom(informationBoardSchema);

export const selectedCategory = atom<InformationBoardCategory>(
  'general_information'
);
