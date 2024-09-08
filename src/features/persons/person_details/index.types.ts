import { BadgeColor, CustomClassName } from '@definition/app';
import { PersonType } from '@definition/person';

export type PersonDetailsProps = {
  person: PersonType;
  month: string;
  className?: CustomClassName;
  badgesOverride?: { name: string; color: BadgeColor }[];
};
