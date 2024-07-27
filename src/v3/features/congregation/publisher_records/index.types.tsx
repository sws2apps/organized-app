export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
  responsibility?: 'Elder' | 'Ministerial Servant';
  fieldService?:
    | 'Special pioneer'
    | 'Regular pioneer'
    | 'Auxiliary pioneer'
    | 'Publisher';
  inactiveLastReportDate?: Date;
}

export interface PersonMonthlyReport {
  sharedAnyFormOfTheMinistry: boolean;
  bibleStudies?: number;
  totalHours?: number;
  comments?: string;
}

interface AnnualReport {
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
