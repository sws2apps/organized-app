type fieldService =
  | 'Special pioneer'
  | 'Regular pioneer'
  | 'Auxiliary pioneer'
  | 'Publisher';

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
  responsibility?: 'Elder' | 'Ministerial Servant';
  fieldService?: fieldService;
  inactiveLastReportDate?: Date;
}

export interface PersonMonthlyReport {
  fieldService?: fieldService;
  sharedAnyFormOfTheMinistry: boolean;
  bibleStudies?: number;
  totalHours?: number;
  comments?: string;
}

export interface AnnualReport {
  year: number;
  months: PersonMonthlyReport[];
}

export interface PersonWithAnnualReport extends Person {
  serviceReports: AnnualReport[];
}

export interface TerritoryGroup {
  name?: string;
  members: (Person | PersonWithAnnualReport)[];
}
