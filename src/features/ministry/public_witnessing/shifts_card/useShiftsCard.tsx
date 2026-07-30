import { useCallback, useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  publicWitnessingArrangementsState,
  publicWitnessingSelectedDateState,
  publicWitnessingViewState,
} from '@states/public_witnessing';
import { firstDayWeekState, userLocalUIDState } from '@states/settings';
import { PublicWitnessingArrangementType } from '@definition/public_witnessing';
import {
  addDays,
  formatDate,
  formatDateShortMonth,
  getWeekStartDate,
} from '@utils/date';
import {
  generateDayNames,
  generateMonthNames,
  getTranslation,
} from '@services/i18n/translation';
import {
  DayShiftsType,
  ShiftSlotStatus,
  ShiftSlotType,
  ShiftsCardProps,
} from './index.types';

const parseDate = (date: string) => {
  const [year, month, day] = date.split('/').map(Number);
  return new Date(year, month - 1, day);
};

// getDay(): 0 = Sunday; schedule weekdays: 1 (Monday) – 7 (Sunday).
const getScheduleWeekday = (date: Date) => date.getDay() || 7;

// A seeker keeps the slot open until the partners they asked for have joined;
// a booking made with a partner closes the slot entirely.
const isSeekingPartner = (
  records: PublicWitnessingArrangementType[],
  publisherCount: number,
  capacity: number
) =>
  records.some((record) => {
    const { partner_needed, partner_count, publishers } = record.arrangement_data;
    if (!partner_needed) return false;

    const wanted = publishers.length + (partner_count ?? 1);
    return publisherCount < Math.min(wanted, capacity);
  });

const getSlotStatus = (
  isPast: boolean,
  records: PublicWitnessingArrangementType[],
  seekingPartner: boolean
): ShiftSlotStatus => {
  if (isPast) return 'past';
  if (records.length === 0) return 'available';
  return seekingPartner ? 'partner_needed' : 'full';
};

const useShiftsCard = ({ location }: ShiftsCardProps) => {
  const [view, setView] = useAtom(publicWitnessingViewState);
  const [selectedDate, setSelectedDate] = useAtom(
    publicWitnessingSelectedDateState
  );

  const arrangements = useAtomValue(publicWitnessingArrangementsState);
  const userUID = useAtomValue(userLocalUIDState);
  const firstDayWeek = useAtomValue(firstDayWeekState);

  const today = formatDate(new Date(), 'yyyy/MM/dd');
  const currentTime = formatDate(new Date(), 'HH:mm');

  const dateObj = useMemo(() => parseDate(selectedDate), [selectedDate]);

  const periodDates = useMemo<Date[]>(() => {
    if (view === 'day') return [dateObj];

    if (view === 'week') {
      const start = getWeekStartDate(dateObj, firstDayWeek);
      return Array.from({ length: 7 }, (_, index) => addDays(start, index));
    }

    const lastOfMonth = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth() + 1,
      0
    );

    const dates: Date[] = [];
    let cursor = getWeekStartDate(
      new Date(dateObj.getFullYear(), dateObj.getMonth(), 1),
      firstDayWeek
    );

    while (cursor <= lastOfMonth || dates.length % 7 !== 0) {
      dates.push(cursor);
      cursor = addDays(cursor, 1);
    }

    return dates;
  }, [view, dateObj, firstDayWeek]);

  const arrangementsBySlot = useMemo(() => {
    const index = new Map<string, PublicWitnessingArrangementType[]>();

    for (const record of arrangements) {
      const { location_uid, date, start_time } = record.arrangement_data;
      if (location_uid !== location.location_uid) continue;

      const key = `${date}|${start_time}`;
      const slotRecords = index.get(key);

      if (slotRecords) slotRecords.push(record);
      else index.set(key, [record]);
    }

    return index;
  }, [arrangements, location.location_uid]);

  // Shifts are never stored per date — a day's slots come from the location's
  // weekday schedule, merged with the arrangements booked for that date.
  const buildSlots = useCallback(
    (date: Date, dateKey: string): ShiftSlotType[] => {
      const daySchedule = location.location_data.schedule.find(
        (day) => day.weekday === getScheduleWeekday(date)
      );
      if (!daySchedule) return [];

      const capacity = location.location_data.max_publishers ?? 3;

      return daySchedule.shifts.map((shift) => {
        const records =
          arrangementsBySlot.get(`${dateKey}|${shift.start_time}`) ?? [];

        const publishers = records.flatMap((record) =>
          record.arrangement_data.publishers.map((publisher) => publisher.name)
        );

        const isPast =
          dateKey < today ||
          (dateKey === today && shift.end_time <= currentTime);

        return {
          date: dateKey,
          start_time: shift.start_time,
          end_time: shift.end_time,
          status: getSlotStatus(
            isPast,
            records,
            isSeekingPartner(records, publishers.length, capacity)
          ),
          publishers,
          arrangements: records,
          myArrangement: records.find(
            (record) => record.arrangement_data.created_by === userUID
          ),
        };
      });
    },
    [location, arrangementsBySlot, today, currentTime, userUID]
  );

  const days = useMemo<DayShiftsType[]>(() => {
    return periodDates.map((date) => {
      const dateKey = formatDate(date, 'yyyy/MM/dd');

      return {
        date: dateKey,
        dateObj: date,
        isToday: dateKey === today,
        inPeriod: view !== 'month' || date.getMonth() === dateObj.getMonth(),
        slots: buildSlots(date, dateKey),
      };
    });
  }, [periodDates, buildSlots, today, view, dateObj]);

  const label = useMemo(() => {
    if (view === 'month') {
      return getTranslation({
        key: 'tr_monthYear',
        params: {
          month: generateMonthNames()[dateObj.getMonth()],
          year: dateObj.getFullYear(),
        },
      });
    }

    if (view === 'week') {
      const start = getWeekStartDate(dateObj, firstDayWeek);

      return getTranslation({
        key: 'tr_dateRangeNoYear',
        params: {
          startDate: formatDateShortMonth(start),
          endDate: formatDateShortMonth(addDays(start, 6)),
        },
      });
    }

    const dayName = generateDayNames()[dateObj.getDay()];
    const shortDate = getTranslation({
      key: 'tr_longDateNoYearLocale',
      params: {
        month: generateMonthNames()[dateObj.getMonth()],
        date: dateObj.getDate(),
      },
    });

    return `${dayName}, ${shortDate}`;
  }, [view, dateObj, firstDayWeek]);

  const isCurrentPeriod = useMemo(() => {
    const todayObj = parseDate(today);

    if (view === 'day') return selectedDate === today;

    if (view === 'week') {
      return (
        getWeekStartDate(dateObj, firstDayWeek).getTime() ===
        getWeekStartDate(todayObj, firstDayWeek).getTime()
      );
    }

    return (
      dateObj.getFullYear() === todayObj.getFullYear() &&
      dateObj.getMonth() === todayObj.getMonth()
    );
  }, [view, selectedDate, today, dateObj, firstDayWeek]);

  const shiftPeriod = (direction: 1 | -1) => {
    if (view === 'month') {
      const next = new Date(
        dateObj.getFullYear(),
        dateObj.getMonth() + direction,
        1
      );
      setSelectedDate(formatDate(next, 'yyyy/MM/dd'));
      return;
    }

    const step = view === 'week' ? 7 : 1;
    setSelectedDate(formatDate(addDays(dateObj, direction * step), 'yyyy/MM/dd'));
  };

  const handlePrevious = () => shiftPeriod(-1);

  const handleNext = () => shiftPeriod(1);

  const goToToday = () => setSelectedDate(today);

  const handleSelectDay = (date: string) => {
    setSelectedDate(date);
    setView('day');
  };

  return {
    view,
    label,
    isCurrentPeriod,
    days,
    handlePrevious,
    handleNext,
    goToToday,
    handleViewChange: setView,
    handleSelectDay,
  };
};

export default useShiftsCard;
