import { useState } from 'react';
import type {
  CleaningExportRange,
  CleaningExportPeriod,
} from '@definition/hall_cleaning_export';
import type { HallCleaningLayoutType } from '@views/activities/hall_cleaning/index.types';
import { currentServiceYear } from '@utils/date';
import { cleaningYearRange } from '@utils/hall_cleaning_export';

const useCleaningExportOptions = (
  selectedWeek: string,
  currentWeek: string
) => {
  const [startWeek, setStartWeek] = useState(selectedWeek || currentWeek);
  const [endWeek, setEndWeek] = useState(selectedWeek || currentWeek);
  const [exportDetailed, setExportDetailed] = useState(true);
  const [exportRotation, setExportRotation] = useState(false);
  const [rotationYear, setRotationYear] = useState(
    Number(currentServiceYear())
  );
  const [rotationPeriod, setRotationPeriod] =
    useState<CleaningExportPeriod>('service_year');
  const [rotationStart, setRotationStart] = useState(
    selectedWeek || currentWeek
  );
  const [rotationEnd, setRotationEnd] = useState(selectedWeek || currentWeek);
  const rotationRange: CleaningExportRange =
    rotationPeriod !== 'custom'
      ? cleaningYearRange(rotationYear, rotationPeriod === 'service_year')
      : { start: rotationStart, end: rotationEnd };
  const [layout, setLayout] = useState<HallCleaningLayoutType>('list');

  const rangeValid = !!startWeek && !!endWeek && startWeek <= endWeek;
  const rotationRangeValid =
    !!rotationRange.start &&
    !!rotationRange.end &&
    rotationRange.start <= rotationRange.end;
  return {
    startWeek,
    endWeek,
    exportDetailed,
    setExportDetailed,
    exportRotation,
    setExportRotation,
    rotationYear,
    setRotationYear,
    rotationPeriod,
    setRotationPeriod,
    rotationStart,
    rotationEnd,
    handleRotationStart: (value: string) => {
      setRotationStart(value);
      if (value > rotationEnd) setRotationEnd(value);
    },
    handleRotationEnd: setRotationEnd,
    handleSetStartWeek: (value: string) => {
      setStartWeek(value);
      if (value > endWeek) setEndWeek(value);
    },
    handleSetEndWeek: setEndWeek,
    layout,
    handleSetLayout: setLayout,

    rotationRange,
    rotationRangeValid,
    rangeValid,
  };
};
export default useCleaningExportOptions;
