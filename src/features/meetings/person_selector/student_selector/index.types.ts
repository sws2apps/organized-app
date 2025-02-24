import { AssignmentCode } from '@definition/assignment';
import { PersonOptionsType } from '../index.types';

export type StudentIconType = {
  type?: AssignmentCode;
  value?: PersonOptionsType;
};

export type SectionHeader = 'male' | 'female' | 'group';
