import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { saveAs } from 'file-saver';
import { formatDate } from '@services/dateformat';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { personsState } from '@states/persons';
import { settingsState } from '@states/settings';
import { branchCongAnalysisState } from '@states/branch_cong_analysis';
import { branchFieldReportsState } from '@states/branch_field_service_reports';
import { congFieldServiceReportsState } from '@states/field_service_reports';
import { fieldGroupsState } from '@states/field_service_groups';
import { meetingAttendanceState } from '@states/meeting_attendance';
import { schedulesState } from '@states/schedules';
import { sourcesState } from '@states/sources';
import { speakersCongregationsActiveState } from '@states/speakers_congregations';
import { visitingSpeakersActiveState } from '@states/visiting_speakers';
import { assignmentState } from '@states/assignment';
import { weekTypeState } from '@states/weekType';

const useExport = () => {
  const persons = useRecoilValue(personsState);
  const settings = useRecoilValue(settingsState);
  const branchCongAnalysis = useRecoilValue(branchCongAnalysisState);
  const branchFieldReports = useRecoilValue(branchFieldReportsState);
  const congFieldReports = useRecoilValue(congFieldServiceReportsState);
  const fieldServiceGroups = useRecoilValue(fieldGroupsState);
  const meetingAttendance = useRecoilValue(meetingAttendanceState);
  const schedules = useRecoilValue(schedulesState);
  const sources = useRecoilValue(sourcesState);
  const visitingSpeakers = useRecoilValue(visitingSpeakersActiveState);
  const assignments = useRecoilValue(assignmentState);
  const weekTypes = useRecoilValue(weekTypeState);
  const speakersCongregations = useRecoilValue(
    speakersCongregationsActiveState
  );

  const [isProcessing, setIsProcessing] = useState(false);

  const filename = useMemo(() => {
    const now = formatDate(new Date(), 'yyyy-MM-dd_HH:mm:ss').replace('_', 'T');

    return `Organized-backup-${now}.json`;
  }, []);

  const handleGetSettings = () => {
    const app_settings = structuredClone(settings);

    app_settings.cong_settings.cong_master_key = undefined;
    app_settings.cong_settings.cong_access_code = undefined;

    return app_settings;
  };

  const handleGetAssignments = () => {
    const assignmentsList = assignments.map((record) => {
      return {
        code: record.code,
        assignment_type_name: record.assignment_type_name.E,
      };
    });

    return assignmentsList;
  };

  const handleGetWeekTypes = () => {
    const weekTypesList = weekTypes.map((record) => {
      return {
        id: record.id,
        week_type_name: record.week_type_name.EN,
      };
    });

    return weekTypesList;
  };

  const handleDownload = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      const backupData = {
        name: 'Organized',
        exported: new Date().toISOString(),
        version: import.meta.env.PACKAGE_VERSION,
        data: {
          assignments: handleGetAssignments(),
          app_settings: handleGetSettings(),
          branch_cong_analysis: branchCongAnalysis,
          branch_field_service_reports: branchFieldReports,
          cong_field_service_reports: congFieldReports,
          field_service_groups: fieldServiceGroups,
          meeting_attendance: meetingAttendance,
          persons: persons.filter((record) => !record._deleted.value),
          sched: schedules,
          sources,
          speakers_congregations: speakersCongregations,
          visiting_speakers: visitingSpeakers,
          week_type: handleGetWeekTypes(),
        },
      };

      const prettyJsonData = JSON.stringify(backupData);

      const blob = new Blob([prettyJsonData], { type: 'application/json' });

      saveAs(blob, filename);

      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);

      console.error(error);

      displaySnackNotification({
        severity: 'error',
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
      });
    }
  };

  return { filename, isProcessing, handleDownload };
};

export default useExport;
