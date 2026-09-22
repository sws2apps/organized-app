import { Territory } from '@definition/territory';

export type TerritoryPrintData = Territory & {
  mapImage?: string;
  qrImage?: string;
  notes?: string;
};

export type TerritoryTemplateProps = {
  congregation: string;
  territories: TerritoryPrintData[];
  lang: string;
  printedOn: string;
  showMap?: boolean;
};
