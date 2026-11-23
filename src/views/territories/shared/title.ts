import { TerritoryPrintData } from '@views/territories/index.types';

export const titleOf = (territory: TerritoryPrintData) =>
  [territory.number, territory.city].filter(Boolean).join(' – ');
