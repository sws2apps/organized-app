import { Territory } from '@definition/territory';

export type TerritoryPrintData = Territory & {
  mapImage?: string;
  showHouseholds?: boolean;
  notes?: string;
};

export type TerritoryTemplateProps = {
  congregation: string;
  territories: TerritoryPrintData[];
  lang: string;
  printedOn: string;
  parts: { front: boolean; back: boolean };
};
