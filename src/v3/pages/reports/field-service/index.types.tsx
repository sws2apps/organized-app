export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  responsibility?: 'Elder' | 'Ministerial Servant';
  fieldService?:
    | 'Special pioneer'
    | 'Regular pioneer'
    | 'Auxiliary pioneer'
    | 'Publisher';
  gender: 'male' | 'female';
}

export interface PublisherReport {
  isLate?: boolean;
  sharedAnyFormOfTheMinistry?: boolean;
  bibleStudies?: number;
  comments?: string;
}

export interface PioneerReport {
  isLate?: boolean;
  totalHours?: number;
  bibleStudies?: number;
  comments?: string;
}

export interface PersonWithReport extends Person {
  report?: PioneerReport & PublisherReport;
}
