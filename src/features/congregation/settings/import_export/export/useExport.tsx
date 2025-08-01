import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { saveAs } from 'file-saver';
import { displaySnackNotification } from '@services/states/app';
import { ExportType } from './index.types';
import { getMessageByCode } from '@services/i18n/translation';
import { personsState } from '@states/persons';
import { settingsState } from '@states/settings';
import { branchCongAnalysisState } from '@states/branch_cong_analysis';
import { branchFieldReportsState } from '@states/branch_field_service_reports';
import { congFieldServiceReportsState } from '@states/field_service_reports';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import { meetingAttendanceState } from '@states/meeting_attendance';
import { schedulesState } from '@states/schedules';
import { sourcesState } from '@states/sources';
import { speakersCongregationsActiveState } from '@states/speakers_congregations';
import { visitingSpeakersActiveState } from '@states/visiting_speakers';
import { assignmentState } from '@states/assignment';
import { weekTypeState } from '@states/weekType';
import { userFieldServiceReportsState } from '@states/user_field_service_reports';
import { userBibleStudiesState } from '@states/user_bible_studies';
import { upcomingEventsActiveState } from '@states/upcoming_events';
import { formatDate } from '@utils/date';

const useExport = ({ onClose }: ExportType) => {
  const persons = useAtomValue(personsState);
  const settings = useAtomValue(settingsState);
  const branchCongAnalysis = useAtomValue(branchCongAnalysisState);
  const branchFieldReports = useAtomValue(branchFieldReportsState);
  const congFieldReports = useAtomValue(congFieldServiceReportsState);
  const fieldServiceGroups = useAtomValue(fieldWithLanguageGroupsState);
  const meetingAttendance = useAtomValue(meetingAttendanceState);
  const schedules = useAtomValue(schedulesState);
  const sources = useAtomValue(sourcesState);
  const visitingSpeakers = useAtomValue(visitingSpeakersActiveState);
  const assignments = useAtomValue(assignmentState);
  const weekTypes = useAtomValue(weekTypeState);
  const speakersCongregations = useAtomValue(speakersCongregationsActiveState);
  const userFieldReports = useAtomValue(userFieldServiceReportsState);
  const userBibleStudies = useAtomValue(userBibleStudiesState);
  const upcomingEvents = useAtomValue(upcomingEventsActiveState);

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
        week_type_name: record.week_type_name.E,
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
          upcoming_events: upcomingEvents,
          user_field_service_reports: userFieldReports.filter(
            (record) => !record.report_data._deleted
          ),
          user_bible_studies: userBibleStudies.filter(
            (record) => !record.person_data._deleted
          ),
          visiting_speakers: visitingSpeakers,
          week_type: handleGetWeekTypes(),
        },
      };

      const prettyJsonData = JSON.stringify(backupData);

      const blob = new Blob([prettyJsonData], { type: 'application/json' });

      saveAs(blob, filename);

      onClose?.();

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
