import { atom } from 'jotai';
import { AppLocalType } from '@definition/app_local';

export const appLocalsState = atom<AppLocalType[]>([]);