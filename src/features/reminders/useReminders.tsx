import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { formatDate } from '@services/dateformat';
import { addDays, addMonths, currentReportMonth } from '@utils/date';
import { ReminderItemProps } from './index.types';
import { branchFieldReportsState } from '@states/branch_field_service_reports';
import useCurrentUser from '@hooks/useCurrentUser';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';
import usePerson from '@features/persons/hooks/usePerson';

const useReminders = () => {
  const { t } = useAppTranslation();

  const { personIsPublisher } = usePerson();

  const currentReport = useMemo(() => currentReportMonth(), []);

  const { isSecretary, person } = useCurrentUser();

  const { status } = useMinistryMonthlyRecord(currentReport);

  const branchReports = useRecoilValue(branchFieldReportsState);

  const [reminders, setReminders] = useState<ReminderItemProps[]>([]);

  const checkPubReport = useCallback(() => {
    const isPublisher = personIsPublisher(person, currentReport);

    if (!isPublisher) return;

    if (status !== 'pending') return;

    const nextMonth = addMonths(`${currentReport}/01`, 1).getMonth();
    const todayMonth = new Date().getMonth();
    const todayDate = new Date().getDate();

    if (nextMonth === todayMonth && todayDate <= 6) {
      setReminders((prev) => {
        const newValues = prev.filter(
          (record) => record.id !== 'publisher-report'
        );

        newValues.push({
          id: 'publisher-report',
          title: t('tr_reminderPublisherReport'),
          description: t('tr_reminderPublisherReportDesc'),
          path: '/ministry-report',
        });

        return newValues;
      });
    }
  }, [status, currentReport, t, person, personIsPublisher]);

  const checkBranchReport = useCallback(() => {
    if (!isSecretary) return;

    const branchReport = branchReports.find(
      (record) => record.report_date === currentReport
    );

    const submitted = branchReport?.report_data.submitted ?? false;

    if (submitted) return;

    const nextMonth = addMonths(`${currentReport}/01`, 1).getMonth();
    const todayMonth = new Date().getMonth();
    const todayDate = new Date().getDate();

    if (nextMonth === todayMonth && todayDate >= 10 && todayDate <= 28) {
      setReminders((prev) => {
        const newValues = prev.filter(
          (record) => record.id !== 'branch-report'
        );

        newValues.push({
          id: 'branch-report',
          title: t('tr_reminderBranchReport'),
          description: t('tr_reminderBranchReportDesc'),
          path: '/reports/branch-office',
        });

        return newValues;
      });
    }
  }, [isSecretary, branchReports, currentReport, t]);

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

    checkPubReport();

    checkBranchReport();
  }, [checkPubReport, checkBranchReport]);

  return { reminders, reminderMeTomorrow };
};

export default useReminders;
