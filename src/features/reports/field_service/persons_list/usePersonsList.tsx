import { useEffect, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useBreakpoints } from '@hooks/index';
import {
  personFilterFieldServiceReportState,
  selectedMonthFieldServiceReportState,
} from '@states/field_service_reports';
import { PersonType } from '@definition/person';
import usePersons from '@features/persons/hooks/usePersons';

let scrollPosition = 0;

const usePersonsList = () => {
  const { desktopUp } = useBreakpoints();

  const { getPublishersActive } = usePersons();

  const currentFilter = useRecoilValue(personFilterFieldServiceReportState);
  const currentMonth = useRecoilValue(selectedMonthFieldServiceReportState);

  const persons = useMemo(() => {
    const result: PersonType[] = [];

    if (currentFilter === 'active') {
      const data = getPublishersActive(currentMonth);
      result.push(...data);
    }

    return result;
  }, [currentFilter, currentMonth, getPublishersActive]);

  useEffect(() => {
    setTimeout(() => {
      if (!desktopUp) {
        if (window.scrollY !== scrollPosition) {
          window.scrollTo({ top: scrollPosition });
        }
      }
    }, 100);
  }, [desktopUp]);

  useEffect(() => {
    const handleScroll = () => {
      scrollPosition = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [desktopUp]);

  return { persons };
};

export default usePersonsList;
