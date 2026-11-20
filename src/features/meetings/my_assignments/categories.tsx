import { ReactElement } from 'react';
import { AssignmentHistoryType } from '@definition/schedules';
import {
  IconCircuitOverseer,
  IconLivingPart,
  IconMinistryPart,
  IconPodium,
  IconTalk,
  IconTreasuresPart,
  IconWatchtowerStudy,
} from '@components/icons';

export type AssignmentCategory = {
  color: string;
  icon: (color: string) => ReactElement;
};

const CATEGORIES = {
  treasures: {
    color: 'var(--treasures-from-gods-word)',
    icon: (color) => <IconTreasuresPart color={color} />,
  },
  ministry: {
    color: 'var(--apply-yourself-to-the-field-ministry)',
    icon: (color) => <IconMinistryPart color={color} />,
  },
  living: {
    color: 'var(--living-as-christians)',
    icon: (color) => <IconLivingPart color={color} />,
  },
  midweek: {
    color: 'var(--midweek-meeting)',
    icon: (color) => <IconPodium color={color} />,
  },
  midweekCircuitOverseer: {
    color: 'var(--midweek-meeting)',
    icon: (color) => <IconCircuitOverseer color={color} />,
  },
  weekendCircuitOverseer: {
    color: 'var(--weekend-meeting)',
    icon: (color) => <IconCircuitOverseer color={color} />,
  },
  talk: {
    color: 'var(--weekend-meeting)',
    icon: (color) => <IconTalk color={color} />,
  },
  watchtower: {
    color: 'var(--weekend-meeting)',
    icon: (color) => <IconWatchtowerStudy color={color} />,
  },
  weekend: {
    color: 'var(--weekend-meeting)',
    icon: (color) => <IconPodium color={color} />,
  },
} satisfies Record<string, AssignmentCategory>;

// a new assignment type needs a category above and a rule here
export const getAssignmentCategory = (
  history: AssignmentHistoryType
): AssignmentCategory => {
  const key = history.assignment.key ?? '';

  if (key.startsWith('MM_TGW')) return CATEGORIES.treasures;
  if (key.startsWith('MM_AYF')) return CATEGORIES.ministry;
  if (key.startsWith('MM_LC')) return CATEGORIES.living;
  if (key === 'MM_CircuitOverseer') return CATEGORIES.midweekCircuitOverseer;
  if (key === 'WM_CircuitOverseer') return CATEGORIES.weekendCircuitOverseer;
  if (key.startsWith('MM_')) return CATEGORIES.midweek;
  if (key.startsWith('WM_WTStudy')) return CATEGORIES.watchtower;
  if (key.includes('Speaker')) return CATEGORIES.talk;

  return CATEGORIES.weekend;
};
