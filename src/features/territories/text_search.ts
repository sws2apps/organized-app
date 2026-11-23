import type { Territory } from '@definition/territory';
import { territoryHolderText } from '@features/territories/group_holder';

// number, name, locality, holder, categories and the territory's notes
export const matchesText = (territory: Territory, query: string) =>
  [
    territory.number,
    territory.name,
    territory.city,
    territoryHolderText(territory),
    territory.categories.join(' '),
    territory.notes ?? '',
  ]
    .join(' ')
    .toLowerCase()
    .includes(query.toLowerCase());
