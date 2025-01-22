import { useEffect, useState } from 'react';
import { displaySnackNotification } from '@services/recoil/app';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import { getMessageByCode } from '@services/i18n/translation';
import { FormS4Props } from '../index.types';
import { UserFieldServiceMonthlyReportType } from '@definition/user_field_service_reports';
import {
  congFieldServiceReportSchema,
  delegatedFieldServiceReportSchema,
  userFieldServiceMonthlyReportSchema,
} from '@services/dexie/schema';
import { dbUserFieldServiceReportsSave } from '@services/dexie/user_field_service_reports';
import { dbDelegatedFieldServiceReportsSave } from '@services/dexie/delegated_field_service_reports';
import { dbFieldServiceReportsSave } from '@services/dexie/cong_field_service_reports';
import { DelegatedFieldServiceReportType } from '@definition/delegated_field_service_reports';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';

const useMinistryShared = ({ month, person_uid, publisher }: FormS4Props) => {
  const {
    shared_ministry,
    month_name,
    read_only,
    delegatedReport,
    userReport,
    isSelf,
    congReport,
  } = useMinistryMonthlyRecord({ month, person_uid, publisher });

  const [checked, setChecked] = useState(shared_ministry);

  const handleToggleChecked = async (value: boolean) => {
    try {
      if (publisher) {
        if (isSelf) {
          let report: UserFieldServiceMonthlyReportType;

          if (!userReport) {
            report = structuredClone(userFieldServiceMonthlyReportSchema);
            report.report_date = month;
          }

          if (userReport) {
            report = structuredClone(userReport);
          }

          report.report_data.shared_ministry = value;
          report.report_data.updatedAt = new Date().toISOString();

          await dbUserFieldServiceReportsSave(report);
        }

        if (!isSelf) {
          let report: DelegatedFieldServiceReportType;

          if (!delegatedReport) {
            report = structuredClone(delegatedFieldServiceReportSchema);
            report.report_id = crypto.randomUUID();
            report.report_data.report_date = month;
            report.report_data.person_uid = person_uid;
          }

          if (delegatedReport) {
            report = structuredClone(delegatedReport);
          }

          report.report_data.shared_ministry = value;
          report.report_data.updatedAt = new Date().toISOString();

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

        report.report_data.shared_ministry = value;
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
    setChecked(shared_ministry);
  }, [shared_ministry]);

  return { checked, handleToggleChecked, read_only, month_name };
};

export default useMinistryShared;
