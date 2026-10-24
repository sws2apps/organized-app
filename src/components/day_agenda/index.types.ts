import { ReactNode } from 'react';

export type DayAgendaSlot = {
  key: string;
  time: string;
  dateTime?: string;
  countLabel?: string;
  content: ReactNode;
};

export type DayAgendaProps = {
  title: string;
  subtitle?: string;
  countLabel?: string;
  slots: DayAgendaSlot[];
};
