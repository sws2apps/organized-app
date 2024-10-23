import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { MonthItemProps, MonthStatusType } from './index.types';
import { monthNamesState } from '@states/app';
import { currentMonthServiceYear } from '@utils/date';
import { personIsEnrollmentActive } from '@services/app/persons';
import { congFieldServiceReportsState } from '@states/field_service_reports';

const useMonthItem = ({ month, person }: MonthItemProps) => {
  const monthNames = useRecoilValue(monthNamesState);

  const reports = useRecoilValue(congFieldServiceReportsState);

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

  const monthStatus: MonthStatusType = useMemo(() => {
    if (!report) return;

    const status = report.report_data.shared_ministry ? 'shared' : 'not_shared';
    return status;
  }, [report]);

  const isAP = useMemo(() => {
    return personIsEnrollmentActive(person, 'AP', month);
  }, [person, month]);

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

  return {
    monthname,
    monthStatus,
    bible_studies,
    total_hours,
    isAP,
    comments,
    isCurrent,
    isAhead,
  };
};

export default useMonthItem;
