export type CleaningExportPeriod = 'year' | 'service_year' | 'custom';

export type CleaningExportRange = {
  start: string;
  end: string;
  firstDate?: string;
  lastDate?: string;
};
export type CleaningRotationSlot = {
  date: string;
  meeting: 'midweek' | 'weekend';
  groups: string[];
};
export type CleaningRotationWeek = {
  week: string;
  slots: CleaningRotationSlot[];
};
export type CleaningRotationRange = {
  id: string;
  start: string;
  end: string;
  groups: string[];
  meeting?: 'midweek' | 'weekend';
};

export type CleaningExportReadiness = {
  connected: boolean;
  publishedAvailable: boolean;
  cleaning: { selected: boolean; rangeValid: boolean; hasAssignments: boolean };
  rotation: { selected: boolean; rangeValid: boolean; hasAssignments: boolean };
};
