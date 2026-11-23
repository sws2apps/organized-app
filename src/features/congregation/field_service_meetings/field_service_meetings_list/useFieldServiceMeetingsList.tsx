import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { FieldServiceMeetingFormattedType } from '@definition/field_service_meetings';
import { fieldServiceMeetingsWeekRangeState } from '@states/field_service_meetings';
import { fieldServiceMeetingAgenda } from '@utils/field_service_meetings';
import { addDays, formatDate, getWeekDate } from '@utils/date';

const useFieldServiceMeetingsList = (
  meetings: FieldServiceMeetingFormattedType[]
) => {
  const referenceDate = useAtomValue(fieldServiceMeetingsWeekRangeState);

  const days = useMemo(() => {
    const start = getWeekDate(new Date(referenceDate));
    return fieldServiceMeetingAgenda(
      meetings,
      formatDate(start, 'yyyy/MM/dd'),
      formatDate(addDays(start, 6), 'yyyy/MM/dd')
    );
  }, [meetings, referenceDate]);

  return { days };
};

export default useFieldServiceMeetingsList;
