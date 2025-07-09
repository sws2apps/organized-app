import { ReactNode } from 'react';

export type SiblingAssignmentProps = {
  children?: ReactNode;
  type: string;
  label: string;
};

export type SiblingOption = {
  type: string;
  label: string;
};
