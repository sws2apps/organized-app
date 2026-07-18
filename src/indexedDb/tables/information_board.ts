import { InformationBoardType } from '@definition/information_board';
import { Table } from 'dexie';

export type InformationBoardTable = {
  information_board: Table<InformationBoardType>;
};

export const informationBoardSchema = {
  information_board: '++id, information',
};
