import {
  HallCleaningConfigType,
  HallCleaningSlotType,
} from '@services/app/schedules';

export const CLEANING_FIELD_MIN_WIDTH = 260;

export const hallCleaningSlotLabel = (
  slot: HallCleaningSlotType,
  config: HallCleaningConfigType,
  t: (key: string) => string
) => {
  if (slot === 'yearly') return t('tr_yearlyCleaning');
  if (slot === 'weekend') return t('tr_weekend');

  return config.period.value === 'week'
    ? t('tr_regularCleaning')
    : t('tr_midweek');
};
