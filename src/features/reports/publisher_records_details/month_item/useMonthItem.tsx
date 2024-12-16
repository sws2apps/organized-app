import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { MonthItemProps, MonthStatusType } from './index.types';
import { monthNamesState } from '@states/app';
import { currentMonthServiceYear } from '@utils/date';
import { congFieldServiceReportsState } from '@states/field_service_reports';
import { branchFieldReportsState } from '@states/branch_field_service_reports';
import { formatDate } from '@services/dateformat';
import usePerson from '@features/persons/hooks/usePerson';

const useMonthItem = ({ month, person }: MonthItemProps) => {
  const {
    personIsEnrollmentActive,
    personIsBaptizedPublisher,
    personIsUnbaptizedPublisher,
  } = usePerson();

  const monthNames = useRecoilValue(monthNamesState);

  const reports = useRecoilValue(congFieldServiceReportsState);
  const branchReports = useRecoilValue(branchFieldReportsState);

  const [showEdit, setShowEdit] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);

  const first_report = useMemo(() => {
    if (!person) return;

    if (person.person_data.first_report?.value) {
      return formatDate(
        new Date(person.person_data.first_report.value),
        'yyyy/MM'
      );
    }

    // get all status history
    let history = [
      ...person.person_data.publisher_unbaptized.history,
      ...person.person_data.publisher_baptized.history,
    ];

    history = history.filter(
      (record) => !record._deleted && record.start_date?.length > 0
    );

    history.sort((a, b) => a.start_date.localeCompare(b.start_date));

    if (history.length === 0) return;

    const firstDate = new Date(history.at(0).start_date);

    return formatDate(firstDate, 'yyyy/MM');
  }, [person]);

  const branchReport = useMemo(() => {
    return branchReports.find((record) => record.report_date === month);
  }, [branchReports, month]);

  const branch_report_submitted = useMemo(() => {
    if (!branchReport) return;

    return branchReport.report_data.submitted;
  }, [branchReport]);

  const report = useMemo(() => {
    if (!person) return;

    return reports.find(
      (record) =>
        record.report_data.report_date === month &&
        record.report_data.person_uid === person.person_uid
    );
  }, [reports, month, person]);

  const monthname = useMemo(() => {
    const monthIndex = +month.split('/')[1] - 1;
    return monthNames[monthIndex];
  }, [month, monthNames]);

  const isCurrent = useMemo(() => {
    const current = currentMonthServiceYear();

    return month === current;
  }, [month]);

  const isAhead = useMemo(() => {
    const current = currentMonthServiceYear();

    return month > current;
  }, [month]);

  const not_publisher = useMemo(() => {
    console.log(month, first_report);
    if (!first_report || first_report?.length === 0) return true;

    if (month < first_report) return true;

    return false;
  }, [first_report, month]);

  const monthStatus: MonthStatusType = useMemo(() => {
    if (not_publisher) return;

    if (!report) return 'not_shared';

    const status = report.report_data.shared_ministry ? 'shared' : 'not_shared';
    return status;
  }, [report, not_publisher]);

  const isAP = useMemo(() => {
    return personIsEnrollmentActive(person, 'AP', month);
  }, [person, month, personIsEnrollmentActive]);

  const total_hours = useMemo(() => {
    if (!report) return 0;

    const field = report.report_data.hours.field_service;
    const credit = report.report_data.hours.credit.approved;

    return field + credit;
  }, [report]);

  const bible_studies = useMemo(() => {
    if (!report) return 0;

    return report.report_data.bible_studies;
  }, [report]);

  const comments = useMemo(() => {
    if (!report) return '';

    return report.report_data.comments;
  }, [report]);

  const isInactive = useMemo(() => {
    if (!person) return true;

    const isBaptized = personIsBaptizedPublisher(person, month);
    const isUnbaptized = personIsUnbaptizedPublisher(person, month);

    const active = isBaptized || isUnbaptized;

    return !active;
  }, [person, month, personIsBaptizedPublisher, personIsUnbaptizedPublisher]);

  const allowEdit = useMemo(() => {
    if (isInactive) return false;

    if (!first_report || first_report?.length === 0) return false;

    if (month < first_report) return false;

    if (!branchReport) return true;

    return true;
  }, [isInactive, month, first_report, branchReport]);

  const report_locked = useMemo(() => {
    return branch_report_submitted && monthStatus === 'shared';
  }, [branch_report_submitted, monthStatus]);

  const mobileShowEdit = useMemo(() => {
    if (!allowEdit) return false;

    if (isCurrent || isAhead) return false;

    return true;
  }, [allowEdit, isCurrent, isAhead]);

  const handleHover = () => {
    if (!mobileShowEdit) return;

    setShowEdit(true);
  };

  const handleUnhover = () => {
    setShowEdit(false);
  };

  const handleOpenEditor = () => {
    setShowEdit(false);
    setEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setShowEdit(false);
    setEditorOpen(false);
  };

  return {
    monthname,
    monthStatus,
    bible_studies,
    total_hours,
    isAP,
    comments,
    isCurrent,
    isAhead,
    showEdit,
    handleHover,
    handleUnhover,
    editorOpen,
    handleOpenEditor,
    handleCloseEditor,
    mobileShowEdit,
    not_publisher,
    branch_report_submitted,
    report_locked,
  };
};

export default useMonthItem;
