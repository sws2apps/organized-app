import { SessionResponseType } from '@definition/api';

export type SessionItemType = {
  onTerminate: (session: SessionResponseType) => void;
  session: SessionResponseType;
};
