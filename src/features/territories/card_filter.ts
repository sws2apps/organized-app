import type { Territory, TerritoryFilters } from '@definition/territory';

// Digital or printed: how the territories are out right now;
// kept free of app imports so the Node test runner can load this file.

export type CardFilter = TerritoryFilters['card'][number];

export const openCard = (territory: Territory): CardFilter | undefined => {
  const open = territory.assignments.find((item) => !item.returnedOn);

  return open && (open.card ?? 'unknown');
};

export const matchesCard = (territory: Territory, cards: CardFilter[]) => {
  if (cards.length === 0) return true;

  const card = openCard(territory);

  return !!card && cards.includes(card);
};

export const cardsOut = (territories: Territory[]) => {
  const out = { digital: 0, printed: 0 };

  for (const territory of territories) {
    const card = openCard(territory);
    if (card && card !== 'unknown') out[card] += 1;
  }

  return out;
};
