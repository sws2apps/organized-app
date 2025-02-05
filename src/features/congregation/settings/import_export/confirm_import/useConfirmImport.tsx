import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import {
  ConfirmImportProps,
  ImportChoiceType,
  ImportDbType,
  ImportFieldType,
} from './index.types';
import {
  backupFileContentsState,
  backupFileNameState,
  backupFileTypeState,
  featureFlagsState,
} from '@states/app';
import { BackupCPEType, BackupOrganizedType } from '@definition/backup';
import { PersonType } from '@definition/person';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { FieldServiceGroupType } from '@definition/field_service_groups';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { UserFieldServiceReportType } from '@definition/user_field_service_reports';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import { MeetingAttendanceType } from '@definition/meeting_attendance';
import { SchedWeekType } from '@definition/schedules';
import { SpeakersCongregationsType } from '@definition/speakers_congregations';
import { UserBibleStudyType } from '@definition/user_bible_studies';
import { BranchCongAnalysisType } from '@definition/branch_cong_analysis';
import { BranchFieldServiceReportType } from '@definition/branch_field_service_reports';
import { SourceWeekType } from '@definition/sources';
import { dbResetExportState } from '@services/dexie/metadata';
import { SettingsType } from '@definition/settings';
import { dbBranchCongAnalysisClear } from '@services/dexie/branch_cong_analysis';
import { dbBranchFieldReportClear } from '@services/dexie/branch_field_service_reports';
import { dbFieldServiceReportsClear } from '@services/dexie/cong_field_service_reports';
import { dbFieldServiceGroupClear } from '@services/dexie/field_service_groups';
import { dbMeetingAttendanceClear } from '@services/dexie/meeting_attendance';
import { dbPersonsClear } from '@services/dexie/persons';
import { dbSpeakersCongregationsClear } from '@services/dexie/speakers_congregations';
import { dbUserBibleStudyClear } from '@services/dexie/user_bible_studies';
import { dbUserFieldServiceReportsClear } from '@services/dexie/user_field_service_reports';
import { dbVisitingSpeakersClear } from '@services/dexie/visiting_speakers';
import { isDemo } from '@constants/index';
import useCongReportsImport from './useCongReportsImport';
import useMinistryReportsImport from './useMinistryReportsImport';
import usePersonsImport from './usePersonsImport';
import useServiceGroups from './useServiceGroups';
import useVisitingSpeakersImport from './useVisitingSpeakersImport';
import useAttendanceImport from './useAttendanceImport';
import useMeetingImport from './useMeetingImport';
import useImportCPE from './useImportCPE';
import useAppSettingsImport from './useAppSettingsImport';
import useImportHourglass from './useImportHourglass';
import appDb from '@db/appDb';

const useConfirmImport = ({ onClose }: ConfirmImportProps) => {
  const { t } = useAppTranslation();

  const { getPersons } = usePersonsImport();
  const { getServiceGroups } = useServiceGroups();
  const { getSpeakersCongregations, getVisitingSpeakers } =
    useVisitingSpeakersImport();
  const { getUserBibleStudies, getUserReports } = useMinistryReportsImport();
  const { getBranchCongAnalysis, getBranchFieldReports, getCongFieldReports } =
    useCongReportsImport();
  const { getAttendances } = useAttendanceImport();
  const { getSchedules, getSources } = useMeetingImport();
  const { getCongSettings, getUserSettings } = useAppSettingsImport();

  const {
    migratePersons,
    migrateServiceGroups,
    migrateSpeakers,
    migrateCongReports,
    migrateBranchReports,
    migrateAttendances,
    migrateSchedules,
    migrateSources,
  } = useImportCPE();

  const {
    migrateHourglassPersons,
    migrateFieldServiceGroups,
    migrateCongFieldServiceReports,
    migrateHourglassAttendance,
    migrateBranchFieldServiceReports,
  } = useImportHourglass();

  const filename = useRecoilValue(backupFileNameState);
  const backupFileType = useRecoilValue(backupFileTypeState);
  const backupFileContents = useRecoilValue(backupFileContentsState);
  const FEATURE_FLAGS = useRecoilValue(featureFlagsState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [selected, setSelected] = useState<ImportChoiceType>({
    persons: false,
    field_service_groups: false,
    visiting_speakers: false,
    user_field_service_reports: false,
    cong_field_service_reports: false,
    meeting_attendance: false,
    midweek_history: false,
    weekend_history: false,
    cong_settings: false,
    user_settings: false,
  });

  const backupContents = useMemo(() => {
    return JSON.parse(backupFileContents);
  }, [backupFileContents]);

  const persons = useMemo(() => {
    if (backupFileType === 'Organized') {
      const backup = backupContents as BackupOrganizedType;
      const backupData = backup.data['persons'] as PersonType[];
      return backupData.filter((record) => !record._deleted.value);
    }

    if (backupFileType === 'CPE') {
      const backup = backupContents as BackupCPEType;
      const oldPersons = backup.persons;

      return migratePersons(oldPersons);
    }

    if (backupFileType === 'Hourglass') {
      return migrateHourglassPersons(backupContents) as PersonType[];
    }

    return [];
  }, [backupFileType, backupContents, migratePersons, migrateHourglassPersons]);

  const field_service_groups = useMemo(() => {
    if (backupFileType === 'Organized') {
      const backup = backupContents as BackupOrganizedType;
      const backupData = backup.data[
        'field_service_groups'
      ] as FieldServiceGroupType[];
      return backupData.filter((record) => !record.group_data._deleted);
    }

    if (backupFileType === 'CPE') {
      const backup = backupContents as BackupCPEType;
      const oldGroups = backup.fieldServiceGroup;

      return migrateServiceGroups(oldGroups);
    }

    if (backupFileType === 'Hourglass') {
      return migrateFieldServiceGroups(
        backupContents
      ) as FieldServiceGroupType[];
    }

    return [];
  }, [
    backupFileType,
    backupContents,
    migrateServiceGroups,
    migrateFieldServiceGroups,
  ]);

  const visiting_speakers = useMemo(() => {
    if (backupFileType === 'Organized') {
      const backup = backupContents as BackupOrganizedType;
      const backupData = backup.data[
        'visiting_speakers'
      ] as VisitingSpeakerType[];
      return backupData.filter((record) => !record._deleted.value);
    }

    if (backupFileType === 'CPE') {
      const backup = backupContents as BackupCPEType;
      const oldCongregations = backup.visiting_speakers;

      const result = migrateSpeakers(oldCongregations);
      return result.speakers;
    }

    return [];
  }, [backupFileType, backupContents, migrateSpeakers]);

  const user_field_service_reports = useMemo(() => {
    if (backupFileType === 'Organized') {
      const backup = backupContents as BackupOrganizedType;
      const backupData = backup.data[
        'user_field_service_reports'
      ] as UserFieldServiceReportType[];
      return backupData.filter((record) => !record.report_data._deleted);
    }

    return [];
  }, [backupFileType, backupContents]);

  const cong_field_service_reports = useMemo(() => {
    if (backupFileType === 'Organized') {
      const backup = backupContents as BackupOrganizedType;
      const backupData = backup.data[
        'cong_field_service_reports'
      ] as CongFieldServiceReportType[];
      return backupData.filter((record) => !record.report_data._deleted);
    }

    if (backupFileType === 'CPE') {
      const backup = backupContents as BackupCPEType;
      const oldReports = backup.fieldServiceReports;

      return migrateCongReports(oldReports);
    }

    if (backupFileType === 'Hourglass') {
      return migrateCongFieldServiceReports(
        backupContents
      ) as CongFieldServiceReportType[];
    }

    return [];
  }, [
    backupFileType,
    backupContents,
    migrateCongReports,
    migrateCongFieldServiceReports,
  ]);

  const meeting_attendance = useMemo(() => {
    if (backupFileType === 'Organized') {
      const backup = backupContents as BackupOrganizedType;
      const backupData = backup.data[
        'meeting_attendance'
      ] as MeetingAttendanceType[];
      return backupData;
    }

    if (backupFileType === 'CPE') {
      const backup = backupContents as BackupCPEType;
      const oldAttendances = backup.meetingAttendance;

      return migrateAttendances(oldAttendances);
    }

    if (backupFileType === 'Hourglass') {
      return migrateHourglassAttendance(
        backupContents
      ) as MeetingAttendanceType[];
    }

    return [];
  }, [
    backupFileType,
    backupContents,
    migrateAttendances,
    migrateHourglassAttendance,
  ]);

  const schedules = useMemo(() => {
    if (backupFileType === 'Organized') {
      const backup = backupContents as BackupOrganizedType;
      const backupData = backup.data['sched'] as SchedWeekType[];
      return backupData;
    }

    if (backupFileType === 'CPE') {
      const backup = backupContents as BackupCPEType;
      const oldSchedules = backup.sched;

      return migrateSchedules(oldSchedules);
    }

    return [];
  }, [backupFileType, backupContents, migrateSchedules]);

  const cong_settings = useMemo(() => {
    if (backupFileType === 'Organized') {
      const backup = backupContents as BackupOrganizedType;
      const backupData = backup.data['app_settings'] as SettingsType;

      return backupData?.cong_settings;
    }
  }, [backupFileType, backupContents]);

  const user_settings = useMemo(() => {
    if (backupFileType === 'Organized') {
      const backup = backupContents as BackupOrganizedType;
      const backupData = backup.data['app_settings'] as SettingsType;

      return backupData?.user_settings;
    }
  }, [backupFileType, backupContents]);

  const selectedAll = useMemo(() => {
    if (persons.length > 0 && !selected.persons) {
      return false;
    }

    if (
      cong_field_service_reports.length > 0 &&
      !selected.cong_field_service_reports
    ) {
      return false;
    }

    if (field_service_groups.length > 0 && !selected.field_service_groups) {
      return false;
    }

    if (meeting_attendance.length > 0 && !selected.meeting_attendance) {
      return false;
    }

    if (schedules.length > 0 && !selected.midweek_history) {
      return false;
    }

    if (schedules.length > 0 && !selected.weekend_history) {
      return false;
    }

    if (
      user_field_service_reports.length > 0 &&
      !selected.user_field_service_reports
    ) {
      return false;
    }

    if (visiting_speakers.length > 0 && !selected.visiting_speakers) {
      return false;
    }

    if (cong_settings && !selected.cong_settings) {
      return false;
    }

    if (user_settings && !selected.user_settings) {
      return false;
    }

    if (Object.values(selected).every((value) => !value)) return false;

    return true;
  }, [
    selected,
    persons,
    cong_field_service_reports,
    field_service_groups,
    meeting_attendance,
    schedules,
    user_field_service_reports,
    visiting_speakers,
    cong_settings,
    user_settings,
  ]);

  const inderterminate = useMemo(() => {
    if (selectedAll) return false;

    return Object.values(selected).some((value) => value);
  }, [selectedAll, selected]);

  const handleSelectAll = () => {
    if (inderterminate || selectedAll) {
      setSelected((prev) => {
        const data = structuredClone(prev);

        for (const key of Object.keys(data)) {
          data[key] = false;
        }

        return data;
      });
    }

    if (!inderterminate && !selectedAll) {
      setSelected((prev) => {
        const data = structuredClone(prev);

        if (persons.length > 0) {
          data.persons = true;
        }

        if (cong_field_service_reports.length > 0) {
          data.cong_field_service_reports = true;
        }

        if (field_service_groups.length > 0) {
          data.field_service_groups = true;
        }

        if (meeting_attendance.length > 0) {
          data.meeting_attendance = true;
        }

        if (schedules.length > 0) {
          data.midweek_history = true;
        }

        if (schedules.length > 0) {
          data.weekend_history = true;
        }

        if (user_field_service_reports.length > 0) {
          data.user_field_service_reports = true;
        }

        if (visiting_speakers.length > 0) {
          data.visiting_speakers = true;
        }

        if (cong_settings) {
          data.cong_settings = true;
        }

        if (user_settings) {
          data.user_settings = true;
        }

        return data;
      });
    }
  };

  const handleSelectData = (field: ImportFieldType, checked: boolean) => {
    setSelected((prev) => {
      const data = structuredClone(prev);
      data[field] = checked;

      if (field === 'persons' && !checked) {
        data.cong_field_service_reports = false;
        data.field_service_groups = false;
        data.midweek_history = false;
        data.visiting_speakers = false;
        data.weekend_history = false;
      }

      const needsPerson: ImportFieldType[] = [
        'cong_field_service_reports',
        'field_service_groups',
        'midweek_history',
        'visiting_speakers',
        'weekend_history',
      ];

      if (needsPerson.includes(field) && checked) {
        data.persons = true;
      }

      return data;
    });
  };

  const handleImportData = async () => {
    if (isProcessing) return;

    if (Object.values(selected).every((value) => !value)) return;

    try {
      setIsProcessing(true);

      const backup = backupContents as BackupOrganizedType;

      const data = {} as ImportDbType;

      if (selected.persons) {
        data.persons = await getPersons(persons);
      }

      if (selected.field_service_groups) {
        data.field_service_groups =
          await getServiceGroups(field_service_groups);
      }

      if (selected.visiting_speakers) {
        if (backupFileType === 'Organized') {
          const backupData = backup.data[
            'speakers_congregations'
          ] as SpeakersCongregationsType[];

          const speakers_congregations = backupData.filter(
            (record) => !record._deleted.value
          );

          data.visiting_speakers = await getVisitingSpeakers(visiting_speakers);

          data.speakers_congregations = await getSpeakersCongregations(
            speakers_congregations
          );
        }

        if (backupFileType === 'CPE') {
          const backup = backupContents as BackupCPEType;
          const oldCongregations = backup.visiting_speakers;

          const { congregations, speakers } = migrateSpeakers(oldCongregations);

          data.visiting_speakers = speakers;
          data.speakers_congregations = congregations;
        }
      }

      if (selected.user_field_service_reports) {
        const backupData = backup.data[
          'user_bible_studies'
        ] as UserBibleStudyType[];

        const user_bible_studies = backupData.filter(
          (record) => !record.person_data._deleted
        );

        data.user_field_service_reports = await getUserReports(
          user_field_service_reports
        );
        data.user_bible_studies = await getUserBibleStudies(user_bible_studies);
      }

      if (selected.cong_field_service_reports) {
        data.cong_field_service_reports = await getCongFieldReports(
          cong_field_service_reports
        );

        if (backupFileType === 'Organized') {
          const backupAnalysisData = backup.data[
            'branch_cong_analysis'
          ] as BranchCongAnalysisType[];

          const branch_cong_analysis = backupAnalysisData.filter(
            (record) => !record.report_data._deleted
          );

          const backupBranchReportsData = backup.data[
            'branch_field_service_reports'
          ] as BranchFieldServiceReportType[];

          const branch_field_service_reports = backupBranchReportsData.filter(
            (record) => !record.report_data._deleted
          );

          data.branch_cong_analysis =
            await getBranchCongAnalysis(branch_cong_analysis);

          data.branch_field_service_reports = await getBranchFieldReports(
            branch_field_service_reports
          );
        }

        if (backupFileType === 'CPE') {
          const backup = backupContents as BackupCPEType;
          const oldReports = backup.branchReports;
          data.branch_field_service_reports = migrateBranchReports(oldReports);
        }

        if (backupFileType === 'Hourglass') {
          data.branch_field_service_reports =
            migrateBranchFieldServiceReports(backupContents);
        }
      }

      if (selected.meeting_attendance) {
        data.meeting_attendance = await getAttendances(meeting_attendance);
      }

      if (selected.cong_settings) {
        data.cong_settings = await getCongSettings(cong_settings);
      }

      if (selected.user_settings) {
        data.user_settings = await getUserSettings(user_settings);
      }

      const isMidweek = selected.midweek_history;
      const isWeekend = selected.weekend_history;

      if (isMidweek || isWeekend) {
        data.sched = getSchedules(schedules, isMidweek, isWeekend);

        if (backupFileType === 'Organized') {
          const sources = backup.data['sources'] as SourceWeekType[];
          data.sources = getSources(sources);
        }

        if (backupFileType === 'CPE') {
          const backup = backupContents as BackupCPEType;
          const oldSources = backup.sources;
          const oldSchedules = backup.sched;
          data.sources = migrateSources(oldSources, oldSchedules);
        }
      }

      if (data.branch_cong_analysis) {
        await dbBranchCongAnalysisClear();
        await appDb.branch_cong_analysis.bulkPut(data.branch_cong_analysis);
      }

      if (data.branch_field_service_reports) {
        await dbBranchFieldReportClear();
        await appDb.branch_field_service_reports.bulkPut(
          data.branch_field_service_reports
        );
      }

      if (data.cong_field_service_reports) {
        await dbFieldServiceReportsClear();
        await appDb.cong_field_service_reports.bulkPut(
          data.cong_field_service_reports
        );
      }

      if (data.field_service_groups) {
        await dbFieldServiceGroupClear();
        await appDb.field_service_groups.bulkPut(data.field_service_groups);
      }

      if (data.meeting_attendance) {
        await dbMeetingAttendanceClear();
        await appDb.meeting_attendance.bulkPut(data.meeting_attendance);
      }

      if (data.persons) {
        await dbPersonsClear();
        await appDb.persons.bulkPut(data.persons);
      }

      if (data.sched) {
        await appDb.sched.bulkPut(data.sched);
      }

      if (data.sources) {
        await appDb.sources.bulkPut(data.sources);
      }

      if (data.speakers_congregations) {
        await dbSpeakersCongregationsClear();
        await appDb.speakers_congregations.bulkPut(data.speakers_congregations);
      }

      if (data.user_bible_studies) {
        await dbUserBibleStudyClear();
        await appDb.user_bible_studies.bulkPut(data.user_bible_studies);
      }

      if (data.user_field_service_reports) {
        await dbUserFieldServiceReportsClear();
        await appDb.user_field_service_reports.bulkPut(
          data.user_field_service_reports
        );
      }

      if (data.visiting_speakers) {
        await dbVisitingSpeakersClear();
        await appDb.visiting_speakers.bulkPut(data.visiting_speakers);
      }

      if (data.cong_settings) {
        await appDb.app_settings.update(1, {
          cong_settings: data.cong_settings,
        });
      }

      if (data.user_settings) {
        await appDb.app_settings.update(1, {
          user_settings: data.user_settings,
        });
      }

      await displaySnackNotification({
        severity: 'success',
        header: t('tr_importDataCompleted'),
        message: t('tr_importDataCompletedDesc'),
      });

      await dbResetExportState();

      if (
        backupFileType === 'Hourglass' &&
        isDemo &&
        FEATURE_FLAGS['HOURGLASS_IMPORT']
      ) {
        setIsProcessing(false);
        onClose?.();
        return;
      }

      setTimeout(() => {
        window.location.href = './';
      }, 2000);

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

  return {
    filename,
    persons,
    isProcessing,
    handleImportData,
    handleSelectData,
    selected,
    field_service_groups,
    visiting_speakers,
    user_field_service_reports,
    cong_field_service_reports,
    meeting_attendance,
    schedules,
    selectedAll,
    inderterminate,
    handleSelectAll,
    cong_settings,
    user_settings,
  };
};

export default useConfirmImport;
