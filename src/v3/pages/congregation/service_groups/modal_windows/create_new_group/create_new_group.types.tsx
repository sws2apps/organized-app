import { MouseEventHandler } from 'react';

type localPerson = {
  userName: string;
  userUid: string;
};

export type CreateNewGroupModalWindowProps = {
  onCreateButtonClick?: () => {
    groupName: string;
    groupOverseer: localPerson;
    assistent: localPerson;
    publishers: localPerson[];
  };

  onCancelButtonClick?: MouseEventHandler<HTMLAnchorElement>;
};
