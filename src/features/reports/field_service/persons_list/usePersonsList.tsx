import { useCallback, useEffect, useMemo } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useBreakpoints } from '@hooks/index';
import { AssignmentCode } from '@definition/assignment';
import {
  congFieldServiceReportsState,
  personFilterFieldServiceReportState,
  personSearchFieldServiceReportState,
  selectedMonthFieldServiceReportState,
  selectedPublisherReportState,
} from '@states/field_service_reports';
import { PersonType } from '@definition/person';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import { congFieldServiceReportSchema } from '@services/dexie/schema';
import { dbFieldServiceReportsBulkSave } from '@services/dexie/cong_field_service_reports';
import { getRandomNumber } from '@utils/common';
import { branchFieldReportsState } from '@states/branch_field_service_reports';
import {
  fieldGroupsState,
  languageGroupsState,
} from '@states/field_service_groups';
import { fieldGroupsSortMembersByName } from '@services/app/field_service_groups';
import { userDataViewState } from '@states/settings';
import usePerson from '@features/persons/hooks/usePerson';
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

  const { personIsEnrollmentActive, personIsBaptizedPublisher } = usePerson();

  const [search, setSearch] = useAtom(personSearchFieldServiceReportState);

  const setSelectedPublisher = useSetAtom(selectedPublisherReportState);

  const currentFilter = useAtomValue(personFilterFieldServiceReportState);
  const currentMonth = useAtomValue(selectedMonthFieldServiceReportState);
  const reports = useAtomValue(congFieldServiceReportsState);
  const branchReports = useAtomValue(branchFieldReportsState);
  const groups = useAtomValue(fieldGroupsState);
  const dataView = useAtomValue(userDataViewState);
  const languageGroups = useAtomValue(languageGroupsState);

  const languageGroup = useMemo(() => {
    return languageGroups.find((g) => g.group_id === dataView);
  }, [languageGroups, dataView]);

  const filterByLanguageGroup = useCallback(
    (options: PersonType[]) => {
      if (dataView === 'main') {
        return options;
      }

      return options.filter((record) => {
        if (!languageGroup) return true;

        return languageGroup.group_data.members.some(
          (m) => m.person_uid === record.person_uid
        );
      });
    },
    [languageGroup, dataView]
  );

  const active_publishers = useMemo(() => {
    const result = getPublishersActive(currentMonth);

    return filterByLanguageGroup(result);
  }, [getPublishersActive, currentMonth, filterByLanguageGroup]);

  const inactive_publishers = useMemo(() => {
    const result = getPublishersInactive(currentMonth);

    return filterByLanguageGroup(result);
  }, [getPublishersInactive, currentMonth, filterByLanguageGroup]);

  const baptized_publishers = useMemo(() => {
    const result = getPublishersBaptized(currentMonth);

    return filterByLanguageGroup(result);
  }, [getPublishersBaptized, currentMonth, filterByLanguageGroup]);

  const unbaptized_publishers = useMemo(() => {
    const result = getPublishersUnbaptized(currentMonth);

    return filterByLanguageGroup(result);
  }, [getPublishersUnbaptized, currentMonth, filterByLanguageGroup]);

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

  const verified_reports = useMemo(() => {
    const result = active_publishers.filter((record) => {
      const reportReceived = reports.some(
        (report) =>
          report.report_data.person_uid === record.person_uid &&
          report.report_data.report_date === currentMonth &&
          report.report_data.shared_ministry &&
          report.report_data.status === 'confirmed'
      );

      return reportReceived;
    });

    return result;
  }, [active_publishers, reports, currentMonth]);

  const unverified_reports = useMemo(() => {
    const result = active_publishers.filter((record) => {
      const reportReceived = reports.some(
        (report) =>
          report.report_data.person_uid === record.person_uid &&
          report.report_data.report_date === currentMonth &&
          report.report_data.shared_ministry &&
          report.report_data.status === 'received'
      );

      return reportReceived;
    });

    return result;
  }, [active_publishers, reports, currentMonth]);

  const appointed_brothers = useMemo(() => {
    const result = getAppointedBrothers(currentMonth);

    return filterByLanguageGroup(result);
  }, [getAppointedBrothers, currentMonth, filterByLanguageGroup]);

  const auxiliary_pioneers = useMemo(() => {
    const result = getAuxiliaryPioneers(currentMonth);

    return filterByLanguageGroup(result);
  }, [getAuxiliaryPioneers, currentMonth, filterByLanguageGroup]);

  const regular_pioneers = useMemo(() => {
    const result = getRegularPioneers(currentMonth);

    return filterByLanguageGroup(result);
  }, [getRegularPioneers, currentMonth, filterByLanguageGroup]);

  const group_members = useMemo(() => {
    if (!currentFilter.startsWith('group-')) return [];

    const index = +currentFilter.split('-')[1] - 1;
    const group = groups.find(
      (record) => record.group_data.sort_index === index
    );

    if (!group) return [];

    const result: PersonType[] = [];

    const group_members = fieldGroupsSortMembersByName(
      group.group_data.members
    );

    for (const member of group_members) {
      const person = active_publishers.find(
        (record) => record.person_uid === member.person_uid
      );

      if (!person) continue;

      result.push(person);
    }

    return result;
  }, [currentFilter, groups, active_publishers]);

  const language_group_members = useMemo(() => {
    if (!currentFilter.startsWith('language-group-')) return [];

    const groupId = currentFilter.replace('language-group-', '');

    const group = languageGroups.find((g) => g.group_id === groupId);

    if (!group) return [];

    const result: PersonType[] = [];

    const group_members = fieldGroupsSortMembersByName(
      group.group_data.members
    );

    for (const member of group_members) {
      const person = active_publishers.find(
        (record) => record.person_uid === member.person_uid
      );

      if (!person) continue;

      result.push(person);
    }

    return result;
  }, [currentFilter, active_publishers, languageGroups]);

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

    if (currentFilter === 'unverified') {
      result.push(...unverified_reports);
    }

    if (currentFilter === 'verified') {
      result.push(...verified_reports);
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

    if (currentFilter.startsWith('group-')) {
      result.push(...group_members);
    }

    if (currentFilter.startsWith('language-group-')) {
      result.push(...language_group_members);
    }

    return result.filter(
      (record) =>
        record.person_data.person_lastname.value
          .toLowerCase()
          .includes(search.toLocaleLowerCase()) ||
        record.person_data.person_firstname.value
          .toLowerCase()
          .includes(search.toLocaleLowerCase())
    );
  }, [
    search,
    currentFilter,
    active_publishers,
    inactive_publishers,
    baptized_publishers,
    unbaptized_publishers,
    unsubmitted_reports,
    appointed_brothers,
    auxiliary_pioneers,
    regular_pioneers,
    group_members,
    unverified_reports,
    verified_reports,
    language_group_members,
  ]);

  const report_editable = useMemo(() => {
    if (active_publishers.length === 0) return false;

    const report = branchReports.find(
      (record) => record.report_date === currentMonth
    );

    if (!report) return true;

    return !report.report_data.submitted;
  }, [branchReports, currentMonth, active_publishers]);

  const handleAddRandomData = async () => {
    const reportsToSave: CongFieldServiceReportType[] = [];

    for (const person of active_publishers) {
      let report = reports.find(
        (record) =>
          record.report_data.person_uid === person.person_uid &&
          record.report_data.report_date === currentMonth
      );

      if (!report) {
        report = structuredClone(congFieldServiceReportSchema);
        report.report_id = crypto.randomUUID();
        report.report_data.person_uid = person.person_uid;
        report.report_data.report_date = currentMonth;
      }

      if (report) report = structuredClone(report);

      const isAP = personIsEnrollmentActive(person, 'AP', currentMonth);
      const isFMF = personIsEnrollmentActive(person, 'FMF', currentMonth);
      const isFR = personIsEnrollmentActive(person, 'FR', currentMonth);
      const isFS = personIsEnrollmentActive(person, 'FS', currentMonth);
      const isBaptized = personIsBaptizedPublisher(person, currentMonth);

      if (isFMF || isFS) {
        report.report_data.hours.field_service = getRandomNumber(100, 115);

        if (isFMF) report.report_data.bible_studies = getRandomNumber(20, 30);
        if (isFS) report.report_data.bible_studies = getRandomNumber(15, 20);
      }

      if (isFR) {
        const reportCredit =
          person.person_data.assignments
            .find((a) => a.type === dataView)
            ?.values.includes(AssignmentCode.MINISTRY_HOURS_CREDIT) ?? false;

        if (reportCredit) {
          const service = getRandomNumber(20, 40);
          const credit = 55 - service;

          report.report_data.hours.field_service = service;
          report.report_data.hours.credit = { approved: credit, value: 0 };
        }

        if (!reportCredit) {
          report.report_data.hours.field_service = getRandomNumber(50, 60);
        }

        report.report_data.bible_studies = getRandomNumber(10, 15);
      }

      if (isAP) {
        report.report_data.hours.field_service = getRandomNumber(30, 40);
        report.report_data.bible_studies = getRandomNumber(5, 10);
      }

      if (!isFMF && !isFS && !isFR && !isAP && isBaptized) {
        report.report_data.bible_studies = getRandomNumber(1, 5);
      }

      report.report_data.shared_ministry = true;
      report.report_data.status = 'confirmed';
      report.report_data.updatedAt = new Date().toISOString();
      reportsToSave.push(report);
    }

    await dbFieldServiceReportsBulkSave(reportsToSave);
  };

  const handleSearchChange = (value: string) => setSearch(value);

  useEffect(() => {
    if (persons.length === 0) {
      setSelectedPublisher(undefined);
    }
  }, [persons, setSelectedPublisher]);

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

  return {
    persons,
    handleAddRandomData,
    report_editable,
    search,
    handleSearchChange,
  };
};

export default usePersonsList;
