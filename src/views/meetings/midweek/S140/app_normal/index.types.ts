import { ReactNode } from 'react';

export type S140WeekHeaderType = {
  title: string;
  secondary?: ReactNode;
};

export type S140PartTimeType = {
  time: string;
  color: string;
  backgroundColor: string;
  isClosingSong?: boolean;
};

export type S140SourceType = {
  source?: string;
  node?: ReactNode;
  secondary?: string;
  color?: string;
  duration?: string;
};

export type S140SongType = {
  song: string;
};

export type S140PersonType = {
  primary: string;
  secondary?: string;
  direction?: 'row' | 'column';
};

export type S140SectionType = {
  icon: ReactNode;
  section: string;
  color: string;
  secondary?: ReactNode;
};

export type S140HallType = {
  name: string;
  counselor?: string;
};
