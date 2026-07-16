import { useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  publicWitnessingArrangementsState,
  publicWitnessingSelectedDateState,
} from '@states/public_witnessing';
import { userLocalUIDState } from '@states/settings';
import { addDays, formatDate } from '@utils/date';
import {
  generateDayNames,
  generateMonthNames,
  getTranslation,
} from '@services/i18n/translation';
import { ShiftSlotType, ShiftsCardProps } from './index.types';

const useShiftsCard = ({ location }: ShiftsCardProps) => {
  const [selectedDate, setSelectedDate] = useAtom(
    publicWitnessingSelectedDateState
  );
  const arrangements = useAtomValue(publicWitnessingArrangementsState);
  const userUID = useAtomValue(userLocalUIDState);

  const today = formatDate(new Date(), 'yyyy/MM/dd');

  const dateObj = useMemo(() => {
    const [year, month, day] = selectedDate.split('/').map(Number);
    return new Date(year, month - 1, day);
  }, [selectedDate]);

  const dateLabel = useMemo(() => {
    const dayName = generateDayNames()[dateObj.getDay()];
    const shortDate = getTranslation({
      key: 'tr_longDateNoYearLocale',
      params: {
        month: generateMonthNames()[dateObj.getMonth()],
        date: dateObj.getDate(),
      },
    });
    return `${dayName}, ${shortDate}`;
  }, [dateObj]);

  const handlePreviousDay = () => {
    setSelectedDate(formatDate(addDays(dateObj, -1), 'yyyy/MM/dd'));
  };

  const handleNextDay = () => {
    setSelectedDate(formatDate(addDays(dateObj, 1), 'yyyy/MM/dd'));
  };

  const goToToday = () => setSelectedDate(today);

  // Shifts are never stored per date — the day's slots come from the
  // location's weekday schedule, merged with the arrangements booked for
  // that date.
  const slots = useMemo<ShiftSlotType[]>(() => {
    // getDay(): 0 = Sunday; schedule weekdays: 1 (Monday) – 7 (Sunday).
    const weekday = dateObj.getDay() === 0 ? 7 : dateObj.getDay();
    const daySchedule = location.location_data.schedule.find(
      (day) => day.weekday === weekday
    );
    if (!daySchedule) return [];

    const now = new Date();

    return daySchedule.shifts.map((shift) => {
      const slotArrangements = arrangements.filter(
        (record) =>
          record.arrangement_data.location_uid === location.location_uid &&
          record.arrangement_data.date === selectedDate &&
          record.arrangement_data.start_time === shift.start_time
      );

      const publishers = slotArrangements.flatMap((record) =>
        record.arrangement_data.publishers.map((publisher) => publisher.name)
      );

      const isPast =
        selectedDate < today ||
        (selectedDate === today &&
          shift.end_time <= formatDate(now, 'HH:mm'));

      // A seeker keeps the slot open (orange) until the partners they asked
      // for have joined; a booking with a partner closes the slot entirely.
      const unsatisfiedSeeker = slotArrangements.some((record) => {
        if (!record.arrangement_data.partner_needed) return false;
        const wanted = record.arrangement_data.partner_count ?? 1;
        return (
          publishers.length <
          Math.min(
            record.arrangement_data.publishers.length + wanted,
            location.location_data.max_publishers
          )
        );
      });

      const status = isPast
        ? 'past'
        : slotArrangements.length === 0
          ? 'available'
          : unsatisfiedSeeker
            ? 'partner_needed'
            : 'full';

      return {
        start_time: shift.start_time,
        end_time: shift.end_time,
        status,
        publishers,
        arrangements: slotArrangements,
        myArrangement: slotArrangements.find(
          (record) => record.arrangement_data.created_by === userUID
        ),
      };
    });
  }, [dateObj, location, arrangements, selectedDate, today, userUID]);

  return {
    dateLabel,
    isToday: selectedDate === today,
    slots,
    handlePreviousDay,
    handleNextDay,
    goToToday,
  };
};

export default useShiftsCard;
