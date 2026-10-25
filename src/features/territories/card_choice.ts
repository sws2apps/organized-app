import { store } from '@states/index';
import {
  territoryCardChoiceState,
  territoryHolderChoiceState,
} from '@states/territory_preferences';
import { AssignmentCard, AssignmentHolder } from '@definition/territory';

export type HolderMode = 'publisher' | 'group';
export const savedCard = () => store.get(territoryCardChoiceState);
export const rememberCard = (card?: AssignmentCard) =>
  store.set(territoryCardChoiceState, card);
export const savedHolder = () => store.get(territoryHolderChoiceState);
export const rememberHolder = (group?: string) =>
  store.set(territoryHolderChoiceState, {
    mode: group ? 'group' : 'publisher',
    group: group ?? '',
  });

export type HolderChoice = {
  mode: HolderMode;
  publisher: string | null;
  publisherId?: string;
  groupId?: string;
  group: string | null;
};

// from the assignment being changed, else the way the last one went out
export const initialHolder = (
  current: Partial<AssignmentHolder> | undefined,
  groups: string[],
  publisher?: string
): HolderChoice => {
  if (current?.publisher || current?.group) {
    return {
      mode: current.group ? 'group' : 'publisher',
      publisherId: current.publisherId,
      groupId: current.groupId,
      group: current.group ?? null,
      publisher: publisher ?? (current.publisher || null),
    };
  }

  const saved = savedHolder();

  return {
    mode: saved.mode,
    group:
      saved.mode === 'group' && groups.includes(saved.group)
        ? saved.group
        : null,
    publisher: publisher ?? null,
  };
};

export const holderMissing = ({ mode, publisher, group }: HolderChoice) =>
  !publisher || (mode === 'group' && !group);

export const chosenHolder = ({
  mode,
  publisher,
  group,
  publisherId,
  groupId,
}: HolderChoice): AssignmentHolder =>
  mode === 'group' && group
    ? { publisher: publisher ?? '', group, publisherId, groupId }
    : { publisher: publisher ?? '', publisherId, groupId: undefined };
