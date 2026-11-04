import { ReactNode } from 'react';
import { S140Classroom } from '../shared/index.utils';

export type S140NamesType = {
  id?: string;
  primary?: string;
  secondary?: string;
};

export type S140RowType = {
  time?: string;
  timeColor: string;
  timeBackground: string;
  title?: string;
  titleNode?: ReactNode;
  titleColor?: string;
  duration?: string;
  reference?: string;
  text?: string;
  labels?: string[];
  names?: S140NamesType;
  classrooms?: S140Classroom[];
  classNames?: S140NamesType[];
  backgroundColor?: string;
  last?: boolean;
  lang: string;
};

export type S140SectionBarType = {
  icon: ReactNode;
  section: string;
  color: string;
  lang: string;
};

export type S140WeekHeaderType = {
  title: string;
  event?: string;
  lang: string;
};

export type S140SongTitleType = {
  song: string;
  title?: string;
};
