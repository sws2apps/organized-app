import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { UserFieldServiceMonthlyReportType } from '@definition/user_field_service_reports';
import {
  congFieldServiceReportSchema,
  userFieldServiceMonthlyReportSchema,
} from '@services/dexie/schema';
import { debounceUserFieldServiceSave } from '@services/app/user_field_service_reports';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { userLocalUIDState } from '@states/settings';
import { debounceDelegatedFieldServiceSave } from '@services/app/delegated_field_service_reports';
import { FormS4Props } from '../index.types';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import { debounceFieldServiceSave } from '@services/app/cong_field_service_reports';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';

const useComments = ({ month, person_uid, publisher }: FormS4Props) => {
  const userUID = useRecoilValue(userLocalUIDState);

  const { comments, read_only, userReport, delegatedReport, congReport } =
    useMinistryMonthlyRecord({ month, person_uid, publisher });

  const [value, setValue] = useState(comments);

  const handleCommentsChange = async (value: string) => {
    setValue(value);

    try {
      if (publisher) {
        const monthReport =
          userUID === person_uid ? userReport : delegatedReport;

        let report: UserFieldServiceMonthlyReportType;

        if (!monthReport) {
          report = structuredClone(userFieldServiceMonthlyReportSchema);
          report.report_date = month;

          if (userUID !== person_uid) {
            report.report_data.person_uid = person_uid;
          }
        }

        if (monthReport) {
          report = structuredClone(monthReport);
        }

        report.report_data.comments = value;
        report.report_data.updatedAt = new Date().toISOString();

        if (userUID === person_uid) {
          debounceUserFieldServiceSave(report);
        }

        if (userUID !== person_uid) {
          debounceDelegatedFieldServiceSave(report);
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

        report.report_data.comments = value;
        report.report_data.updatedAt = new Date().toISOString();

        debounceFieldServiceSave(report);
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
    setValue(comments);
  }, [comments]);

  return { value, handleCommentsChange, read_only };
};

export default useComments;
