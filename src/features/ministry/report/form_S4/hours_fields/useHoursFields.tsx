import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { FormS4Props } from '../index.types';
import { congSpecialMonthsState } from '@states/settings';
import { UserFieldServiceMonthlyReportType } from '@definition/user_field_service_reports';
import {
  congFieldServiceReportSchema,
  userFieldServiceMonthlyReportSchema,
} from '@services/dexie/schema';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { dbUserFieldServiceReportsSave } from '@services/dexie/user_field_service_reports';
import { dbDelegatedFieldServiceReportsSave } from '@services/dexie/delegated_field_service_reports';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import { dbFieldServiceReportsSave } from '@services/dexie/cong_field_service_reports';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';
import usePerson from '@features/persons/hooks/usePerson';

const useHoursFields = ({ month, person_uid, publisher }: FormS4Props) => {
  const { t } = useAppTranslation();

  const specialMonths = useRecoilValue(congSpecialMonthsState);

  const { personIsEnrollmentActive } = usePerson();

  const {
    person,
    read_only,
    hours_fields,
    hours_total,
    isSelf,
    userReport,
    delegatedReport,
    hours_credit_enabled,
    congReport,
  } = useMinistryMonthlyRecord({
    month,
    person_uid,
    publisher,
  });

  const goal = useMemo(() => {
    if (!person) return;

    let value: number;

    const isAP = personIsEnrollmentActive(person, 'AP', month);
    const isFR = personIsEnrollmentActive(person, 'FR', month);

    if (isAP) {
      // check for allowed 15h
      const isSpecial = specialMonths.find((record) =>
        record.months.includes(month)
      );
      value = isSpecial ? 15 : 30;
    }

    if (isFR) {
      value = 50;
    }

    return value;
  }, [person, month, specialMonths, personIsEnrollmentActive]);

  const [hours, setHours] = useState(hours_fields);

  const hoursValidator = async (value: string) => {
    if (!publisher) return true;

    if (!userReport) return true;

    let daily: string;

    if (typeof userReport.report_data.hours.field_service === 'number') {
      daily = `${userReport.report_data.hours.field_service}:00`;
    }

    daily = userReport.report_data.hours.field_service.daily;

    const [hoursDaily, minutesDaily] = daily.split(':').map(Number);
    const [hoursValue, minutesValue] = value.split(':').map(Number);

    const totalDaily = hoursDaily * 60 + (minutesDaily || 0);
    const totalValue = hoursValue * 60 + minutesValue;

    if (totalValue < totalDaily) {
      await displaySnackNotification({
        header: t('tr_hoursDecreaseError'),
        message: t('tr_hoursDecreaseErrorDesc'),
        severity: 'error',
      });

      return false;
    }

    return true;
  };

  const handleHoursChange = async (value: string) => {
    setHours(value);

    try {
      if (publisher) {
        const monthReport = isSelf ? userReport : delegatedReport;

        let report: UserFieldServiceMonthlyReportType;

        if (!monthReport) {
          report = structuredClone(userFieldServiceMonthlyReportSchema);
          report.report_date = month;

          if (!isSelf) {
            report.report_data.person_uid = person_uid;
          }
        }

        if (monthReport) {
          report = structuredClone(monthReport);
        }

        let daily: string;

        if (typeof report.report_data.hours.field_service === 'number') {
          daily = `${report.report_data.hours.field_service}:00`;
        }

        daily = report.report_data.hours.field_service.daily;

        const [hoursDaily, minutesDaily] = daily.split(':').map(Number);
        const [hoursValue, minutesValue] = value.split(':').map(Number);

        const totalDaily = hoursDaily * 60 + (minutesDaily || 0);
        const totalValue = hoursValue * 60 + minutesValue;

        const finalValue = totalValue - totalDaily;

        const remains = finalValue % 60;
        const hours = (finalValue - remains) / 60;

        report.report_data.hours.field_service.monthly = `${hours}:${String(remains).padStart(2, '0')}`;

        if (value !== '0:00') {
          report.report_data.shared_ministry = true;
        }

        report.report_data.updatedAt = new Date().toISOString();

        if (isSelf) {
          await dbUserFieldServiceReportsSave(report);
        }

        if (!isSelf) {
          await dbDelegatedFieldServiceReportsSave(report);
        }
      }

      if (!publisher) {
        let report: CongFieldServiceReportType;

        if (!congReport) {
          report = structuredClone(congFieldServiceReportSchema);
          report.report_id = crypto.randomUUID();
          report.report_data.report_date = month;
          report.report_data.person_uid = person_uid;
        }

        if (congReport) {
          report = structuredClone(congReport);
        }

        report.report_data.shared_ministry = true;
        report.report_data.hours.field_service = +value.split(':').at(0);
        report.report_data.updatedAt = new Date().toISOString();

        await dbFieldServiceReportsSave(report);
      }
    } catch (error) {
      console.error(error);

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    setHours(hours_fields);
  }, [hours_fields]);

  return {
    read_only,
    goal,
    hours_credit_enabled,
    hours,
    hours_total,
    handleHoursChange,
    hoursValidator,
    isSelf,
  };
};

export default useHoursFields;
