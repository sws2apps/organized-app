import { ReactNode } from 'react';

export type S140WeekHeaderType = {
  title: string;
  secondary?: string;
  lang: string;
};

export type S140PartTimeType = {
  time: string;
  color: string;
  backgroundColor: string;
  isClosingSong?: boolean;
  lang: string;
};

export type S140SourceType = {
  source?: string;
  node?: ReactNode;
  secondary?: string;
  color?: string;
  duration?: string;
  lang: string;
};

export type S140SongType = {
  song: string;
  lang: string;
};

export type S140PersonType = {
  primary: string;
  secondary?: string;
  direction?: 'row' | 'column';
  lang: string;
};

export type S140SectionType = {
  icon: ReactNode;
  section: string;
  color: string;
  secondary?: ReactNode;
  lang: string;
};

export type S140HallType = {
  name: string;
  counselor?: string;
  group?: string;
  lang: string;
};
