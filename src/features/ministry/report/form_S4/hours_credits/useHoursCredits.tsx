import { useEffect, useRef, useState } from 'react';
import { useAppTranslation } from '@hooks/index';
import { FormS4Props } from '../index.types';
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

const useHoursCredits = ({ month, person_uid, publisher }: FormS4Props) => {
  const { t } = useAppTranslation();

  const fieldRef = useRef<Element>(null);

  const {
    read_only,
    hours_credits,
    isSelf,
    userReport,
    delegatedReport,
    congReport,
  } = useMinistryMonthlyRecord({
    month,
    person_uid,
    publisher,
  });

  const [hours, setHours] = useState(hours_credits);

  const hoursValidator = async (value: string) => {
    if (!publisher) return true;

    if (!userReport) return true;

    let daily: string;

    if (typeof userReport.report_data.hours.credit === 'number') {
      daily = `${userReport.report_data.hours.credit}:00`;
    }

    daily = userReport.report_data.hours.credit.daily;

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

        if (
          report.report_data.hours.credit['value'] &&
          typeof report.report_data.hours.credit['value'] === 'number'
        ) {
          daily = `${report.report_data.hours.credit['value']}:00`;
        }

        daily = report.report_data.hours.credit.daily;

        const [hoursDaily, minutesDaily] = daily.split(':').map(Number);
        const [hoursValue, minutesValue] = value.split(':').map(Number);

        const totalDaily = hoursDaily * 60 + (minutesDaily || 0);
        const totalValue = hoursValue * 60 + minutesValue;

        const finalValue = totalValue - totalDaily;

        const remains = finalValue % 60;
        const hours = (finalValue - remains) / 60;

        report.report_data.hours.credit.monthly = `${hours}:${String(remains).padStart(2, '0')}`;

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
        report.report_data.hours.credit.approved = +value.split(':').at(0);
        report.report_data.updatedAt = new Date().toISOString();

        await dbFieldServiceReportsSave(report);
      }
    } catch (error) {
      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleSelectPreset = async (value: number, name: string) => {
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

        const monthly = report.report_data.hours.credit.monthly || '';

        const [hoursMonthly, minutesMonthly] = monthly.split(':').map(Number);

        const finalValue =
          hoursMonthly * 60 + (minutesMonthly || 0) + value * 60;

        const remains = finalValue % 60;
        const hours = (finalValue - remains) / 60;

        report.report_data.hours.credit.monthly = `${hours}:${String(remains).padStart(2, '0')}`;

        let comments = report.report_data.comments;
        comments = comments === '' ? '' : `${comments}; `;

        report.report_data.comments = `${comments}${name}: ${value}h`;
        report.report_data.shared_ministry = true;
        report.report_data.updatedAt = new Date().toISOString();

        if (isSelf) {
          await dbUserFieldServiceReportsSave(report);
        }

        if (!isSelf) {
          await dbDelegatedFieldServiceReportsSave(report);
        }

        await displaySnackNotification({
          header: t('tr_ministry'),
          message: t('tr_hoursCreditPresetAddedInfo'),
          severity: 'success',
        });
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

        report.report_data.hours.credit.approved += value;

        let comments = report.report_data.comments;
        comments = comments === '' ? '' : `${comments}; `;

        report.report_data.comments = `${comments}${name}: ${value}h`;
        report.report_data.shared_ministry = true;
        report.report_data.updatedAt = new Date().toISOString();

        await dbFieldServiceReportsSave(report);
      }
    } catch (error) {
      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    setHours(hours_credits);
  }, [hours_credits]);

  return {
    read_only,
    hours,
    handleHoursChange,
    hoursValidator,
    fieldRef,
    handleSelectPreset,
    isSelf,
  };
};

export default useHoursCredits;
