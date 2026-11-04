import { ReactNode } from 'react';

export type DayAgendaSlot = {
  key: string;
  time: string;
  dateTime?: string;
  content: ReactNode;
};

export type DayAgendaProps = {
  title: string;
  subtitle?: string;
  slots: DayAgendaSlot[];
};
