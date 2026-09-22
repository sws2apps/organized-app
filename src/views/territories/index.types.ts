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
  // the map side and the do-not-call side can each be left out
  parts: { front: boolean; back: boolean };
};
