import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { formatDate } from '@services/dateformat';
import { addDays, addMonths, currentReportMonth } from '@utils/date';
import { ReminderItemProps } from './index.types';
import { branchFieldReportsState } from '@states/branch_field_service_reports';
import { secretaryRoleState } from '@states/settings';
import useCurrentUser from '@hooks/useCurrentUser';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';
import usePerson from '@features/persons/hooks/usePerson';

const useReminders = () => {
  const { t } = useAppTranslation();

  const { personIsPublisher } = usePerson();

  const currentReport = useMemo(() => currentReportMonth(), []);

  const { person } = useCurrentUser();

  const { status } = useMinistryMonthlyRecord({
    month: currentReport,
    person_uid: person?.person_uid,
    publisher: true,
  });

  const branchReports = useRecoilValue(branchFieldReportsState);
  const isSecretary = useRecoilValue(secretaryRoleState);

  const [reminders, setReminders] = useState<ReminderItemProps[]>([]);

  const checkPubReport = useMemo(() => {
    if (!person) return false;

    const isPublisher = personIsPublisher(person, currentReport);

    if (!isPublisher) return false;

    if (status !== 'pending') return false;

    const nextMonth = addMonths(`${currentReport}/01`, 1).getMonth();
    const todayMonth = new Date().getMonth();
    const todayDate = new Date().getDate();

    if (nextMonth === todayMonth && todayDate <= 6) {
      return true;
    }

    return false;
  }, [currentReport, person, personIsPublisher, status]);

  const checkBranchReport = useMemo(() => {
    if (!isSecretary) return false;

    const branchReport = branchReports.find(
      (record) => record.report_date === currentReport
    );

    const submitted = branchReport?.report_data.submitted ?? false;

    if (submitted) return false;

    const nextMonth = addMonths(`${currentReport}/01`, 1).getMonth();
    const todayMonth = new Date().getMonth();
    const todayDate = new Date().getDate();

    if (nextMonth === todayMonth && todayDate >= 10 && todayDate <= 28) {
      return true;
    }

    return false;
  }, [branchReports, currentReport, isSecretary]);

  const reminderMeTomorrow = () => {
    const tomorrow = addDays(new Date(), 1);

    localStorage.setItem(
      'organized_reminder',
      formatDate(tomorrow, 'yyyy/MM/dd')
    );

    setReminders([]);
  };

  useEffect(() => {
    const today = formatDate(new Date(), 'yyyy/MM/dd');
    const reminderDate = localStorage.getItem('organized_reminder');

    if (reminderDate && reminderDate > today) {
      return;
    }

    const values: ReminderItemProps[] = [];

    if (checkPubReport) {
      values.push({
        id: 'publisher-report',
        title: t('tr_reminderPublisherReport'),
        description: t('tr_reminderPublisherReportDesc'),
        path: '/ministry-report',
      });
    }

    if (checkBranchReport) {
      values.push({
        id: 'branch-report',
        title: t('tr_reminderBranchReport'),
        description: t('tr_reminderBranchReportDesc'),
        path: '/reports/branch-office',
      });
    }

    setReminders(values);
  }, [checkPubReport, checkBranchReport, t]);

  return { reminders, reminderMeTomorrow };
};

export default useReminders;
