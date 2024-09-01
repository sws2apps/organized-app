import { ReactElement, useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  IconLanguageCourse,
  IconSchool,
  IconSchoolForEvangelizers,
  IconWork,
} from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { CreditItemProps } from './index.types';
import { displaySnackNotification } from '@services/recoil/app';
import {
  reportUserSelectedMonthState,
  userFieldServiceMonthlyReportsState,
} from '@states/user_field_service_reports';
import {
  PioneerEventType,
  UserFieldServiceMonthlyReportType,
} from '@definition/user_field_service_reports';
import { userFieldServiceMonthlyReportSchema } from '@services/dexie/schema';
import { dbUserFieldServiceReportsSave } from '@services/dexie/user_field_service_reports';
import { getMessageByCode } from '@services/i18n/translation';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';

const useCreditItem = ({ credit }: CreditItemProps) => {
  const { t } = useAppTranslation();

  const currentMonth = useRecoilValue(reportUserSelectedMonthState);
  const reports = useRecoilValue(userFieldServiceMonthlyReportsState);

  const [value, setValue] = useState(credit.value);

  const { refreshSharedMinistry, approved_assignments_included, status } =
    useMinistryMonthlyRecord(currentMonth);

  const monthReport = useMemo(() => {
    return reports.find((record) => record.report_date === currentMonth);
  }, [reports, currentMonth]);

  const label = useMemo(() => {
    let result = '';

    if (credit.event === 'approved_assignment') {
      result = t('tr_approvedAssignments');
    }

    if (credit.event === 'language_class') {
      result = t('tr_languageCourse');
    }

    if (credit.event === 'pioneer_school') {
      result = t('tr_pioneerSchool');
    }

    if (credit.event === 'ske') {
      result = t('tr_SKE');
    }

    return result;
  }, [t, credit.event]);

  const icon = useMemo(() => {
    let result: ReactElement;

    if (credit.event === 'approved_assignment') {
      result = <IconWork color="var(--black)" />;
    }

    if (credit.event === 'language_class') {
      result = <IconLanguageCourse color="var(--black)" />;
    }

    if (credit.event === 'pioneer_school') {
      result = <IconSchool color="var(--black)" />;
    }

    if (credit.event === 'ske') {
      result = <IconSchoolForEvangelizers color="var(--black)" />;
    }

    return result;
  }, [credit.event]);

  const desc = useMemo(() => {
    let result: string;

    if (credit.event === 'language_class') {
      result = t('tr_ministryTimeHours', { ministryTime: 25 - value });
    }

    if (credit.event === 'pioneer_school') {
      result = t('tr_ministryTimeHours', { ministryTime: 30 - value });
    }

    if (credit.event === 'ske') {
      result = t('tr_ministryTimeHours', { ministryTime: 160 - value });
    }

    if (credit.event === 'approved_assignment') {
      result = t('tr_approvedAssignmentsIncluded', {
        hours: approved_assignments_included,
      });
    }

    return result;
  }, [t, value, credit.event, approved_assignments_included]);

  const handleValueChange = async (value: number) => {
    if (status !== 'pending') return;

    try {
      let report: UserFieldServiceMonthlyReportType;

      if (!monthReport) {
        report = structuredClone(userFieldServiceMonthlyReportSchema);
        report.report_date = currentMonth;
      }

      if (monthReport) {
        report = structuredClone(monthReport);
      }

      const events = report.report_data.hours_credits.events;
      const event = events.find((record) => record.event === credit.event);

      if (!event) {
        events.push({ event: credit.event as PioneerEventType, value: value });
      }

      if (event) {
        event.value = value;
      }

      report.report_data.shared_ministry = refreshSharedMinistry(report);
      report.report_data.updatedAt = new Date().toISOString();

      await dbUserFieldServiceReportsSave(report);
    } catch (error) {
      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const validatorHours = async (value: number) => {
    if (credit.event === 'language_class') {
      // check the language class duration for later
      if (value <= 25) return true;
    }

    if (credit.event === 'pioneer_school') {
      if (value <= 30) return true;
    }

    if (credit.event === 'ske') {
      // sum all service year reports hours during the SKE
      if (value <= 160) return true;
    }

    await displaySnackNotification({
      header: t('tr_creditHoursMaxReached'),
      message: t('tr_creditHoursMaxReachedDesc'),
      severity: 'error',
    });

    return false;
  };

  useEffect(() => {
    setValue(credit.value);
  }, [credit.value]);

  return {
    label,
    icon,
    desc,
    value,
    handleValueChange,
    validatorHours,
    status,
  };
};

export default useCreditItem;
