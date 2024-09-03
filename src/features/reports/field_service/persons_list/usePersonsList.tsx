import { useEffect, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useBreakpoints } from '@hooks/index';
import {
  congFieldServiceReportsState,
  personFilterFieldServiceReportState,
  selectedMonthFieldServiceReportState,
} from '@states/field_service_reports';
import { PersonType } from '@definition/person';
import usePersons from '@features/persons/hooks/usePersons';

let scrollPosition = 0;

const usePersonsList = () => {
  const { desktopUp } = useBreakpoints();

  const {
    getPublishersActive,
    getPublishersInactive,
    getPublishersBaptized,
    getPublishersUnbaptized,
    getAppointedBrothers,
    getAuxiliaryPioneers,
    getRegularPioneers,
  } = usePersons();

  const currentFilter = useRecoilValue(personFilterFieldServiceReportState);
  const currentMonth = useRecoilValue(selectedMonthFieldServiceReportState);
  const reports = useRecoilValue(congFieldServiceReportsState);

  const active_publishers = useMemo(() => {
    const result = getPublishersActive(currentMonth);
    return result;
  }, [getPublishersActive, currentMonth]);

  const inactive_publishers = useMemo(() => {
    const result = getPublishersInactive(currentMonth);
    return result;
  }, [getPublishersInactive, currentMonth]);

  const baptized_publishers = useMemo(() => {
    const result = getPublishersBaptized(currentMonth);
    return result;
  }, [getPublishersBaptized, currentMonth]);

  const unbaptized_publishers = useMemo(() => {
    const result = getPublishersUnbaptized(currentMonth);
    return result;
  }, [getPublishersUnbaptized, currentMonth]);

  const unsubmitted_reports = useMemo(() => {
    const result = active_publishers.filter((record) => {
      const reportReceived = reports.some(
        (report) =>
          report.report_data.person_uid === record.person_uid &&
          report.report_data.report_date === currentMonth &&
          report.report_data.shared_ministry
      );

      return reportReceived ? false : true;
    });

    return result;
  }, [active_publishers, reports, currentMonth]);

  const appointed_brothers = useMemo(() => {
    const result = getAppointedBrothers(currentMonth);
    return result;
  }, [getAppointedBrothers, currentMonth]);

  const auxiliary_pioneers = useMemo(() => {
    const result = getAuxiliaryPioneers(currentMonth);
    return result;
  }, [getAuxiliaryPioneers, currentMonth]);

  const regular_pioneers = useMemo(() => {
    const result = getRegularPioneers(currentMonth);
    return result;
  }, [getRegularPioneers, currentMonth]);

  const persons = useMemo(() => {
    const result: PersonType[] = [];

    if (currentFilter === 'active') {
      result.push(...active_publishers);
    }

    if (currentFilter === 'inactive') {
      result.push(...inactive_publishers);
    }

    if (currentFilter === 'unbaptized') {
      result.push(...unbaptized_publishers);
    }

    if (currentFilter === 'baptized') {
      result.push(...baptized_publishers);
    }

    if (currentFilter === 'not_submitted') {
      result.push(...unsubmitted_reports);
    }

    if (currentFilter === 'appointed') {
      result.push(...appointed_brothers);
    }

    if (currentFilter === 'AP') {
      result.push(...auxiliary_pioneers);
    }

    if (currentFilter === 'FR') {
      result.push(...regular_pioneers);
    }

    return result;
  }, [
    currentFilter,
    active_publishers,
    inactive_publishers,
    baptized_publishers,
    unbaptized_publishers,
    unsubmitted_reports,
    appointed_brothers,
    auxiliary_pioneers,
    regular_pioneers,
  ]);

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
