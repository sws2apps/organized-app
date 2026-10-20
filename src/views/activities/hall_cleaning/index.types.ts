export type HallCleaningLayoutType = 'list' | 'cards' | 'turns' | 'rotation';

export type HallCleaningExportGroupType = {
  name: string;
  color: string;
};

export type HallCleaningExportRowType = {
  id: string;
  date: string;
  weekday?: string;
  dateKey?: string;
  month?: string;
  isMajor?: boolean;
  label?: string;
  group?: HallCleaningExportGroupType;
  groups?: HallCleaningExportGroupType[];
  responsible?: string;
  persons: string[];
  participants?: string[];
};

export type HallCleaningTurnGroupType = HallCleaningExportGroupType & {
  id: string;
  leaders: string[];
  badges?: HallCleaningExportGroupType[];
  responsible?: string;
  label?: string;
  participants?: string[];
};

export type HallCleaningTurnType = {
  id: string;
  month?: string;
  label: string[];
  weekLabel?: string;
  startDate?: string;
  groups: string[];
};

export type RowPagesType = Record<string, number>;

export type RowPagesProps = {
  rowPages?: RowPagesType;
  onRowPage?: (id: string, page: number) => void;
};

export type TemplateHallCleaningProps = RowPagesProps & {
  congregation: string;
  lang: string;
  layout: HallCleaningLayoutType;
  version?: 'draft' | 'published';
  rows: HallCleaningExportRowType[];
  groups: HallCleaningTurnGroupType[];
  turns: HallCleaningTurnType[];
};

export type CleaningRowsProps = RowPagesProps & {
  rows: HallCleaningExportRowType[];
};

export type CleaningTurnsProps = RowPagesProps & {
  groups: HallCleaningTurnGroupType[];
  turns: HallCleaningTurnType[];
};

export type RowPageProbeProps = {
  id: string;
  onRowPage?: RowPagesProps['onRowPage'];
};

export type MajorCleaningDetailsProps = {
  row: HallCleaningExportRowType;
};

export type CleaningMonthCardsProps = CleaningTurnsProps & {
  rows: HallCleaningExportRowType[];
};
