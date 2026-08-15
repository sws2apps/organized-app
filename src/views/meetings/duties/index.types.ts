import { PageType } from '@views/components/page/index.types';

export type DutiesCardIconType =
  | 'audio'
  | 'video'
  | 'audioVideo'
  | 'microphone'
  | 'stage'
  | 'entranceAttendant'
  | 'auditoriumAttendant'
  | 'hospitality'
  | 'videoconferenceHost'
  | 'custom';

export type DutiesSchedulePersonType = {
  id: string;
  name: string;
};

export type DutiesScheduleRowType = {
  id: string;
  date: string;
  persons: DutiesSchedulePersonType[];
  event?: string;
};

export type DutiesScheduleCardType = {
  id: string;
  name: string;
  icon: DutiesCardIconType;
  rows: DutiesScheduleRowType[];
};

export type DutiesCardLayoutType = {
  id: string;
  name: string;
  icon: DutiesCardIconType;
  span: number;
  height: number;
  columns: DutiesScheduleRowType[][];
};

export type DutiesCardPlacementType = {
  card: DutiesCardLayoutType;
  left: number;
  top: number;
};

export type TemplateMeetingDutiesProps = {
  congregation: string;
  lang: string;
  duties: DutiesScheduleCardType[];
  orientation?: PageType['orientation'];
  fontSize?: number;
};

export type DutiesCardProps = {
  card: DutiesCardLayoutType;
  width: number;
  fontSize: number;
};

export type DutiesCardRowProps = {
  row?: DutiesScheduleRowType;
  fontSize: number;
  divided: boolean;
};
