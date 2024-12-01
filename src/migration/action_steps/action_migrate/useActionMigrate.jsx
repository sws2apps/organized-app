import { useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { migrationStepState } from '../../states/main';
import organizedDb from '../../../indexedDb/appDb';
import usePersonMigrate from './usePersonMigrate';
import useSnackBar from '../../hooks/useSnackBar';
import useBranchReportsMigrate from './useBranchReportsMigrate';
import useCongReportsMigrate from './useCongReportsMigrate';
import useAttendanceMigrate from './useAttendanceMigrate';
import useSchedulesMigrate from './useSchedulesMigrate';
import useFieldGroupsMigrate from './useFieldGroupsMigrate';
import useSourcesMigrate from './useSourcesMigrate';
import useSpeakersMigrate from './useSpeakersMigrate';

const useActionMigrate = () => {
  const { showMessage } = useSnackBar();

  const { migratePersons } = usePersonMigrate();
  const { handleMigrateBranchReports } = useBranchReportsMigrate();
  const { handleMigrateCongReports } = useCongReportsMigrate();
  const { handleMigrateAttendances } = useAttendanceMigrate();
  const { handleMigrateSchedules } = useSchedulesMigrate();
  const { handleMigrateGroups } = useFieldGroupsMigrate();
  const { handleMigrateSources } = useSourcesMigrate();
  const { handleMigrateSpeakers } = useSpeakersMigrate();

  const setCurrentStep = useSetRecoilState(migrationStepState);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleMigrate = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      const persons = await migratePersons();
      await organizedDb.persons.bulkPut(persons);

      const branchReports = await handleMigrateBranchReports();
      await organizedDb.branch_field_service_reports.bulkPut(branchReports);

      const congReports = await handleMigrateCongReports();
      await organizedDb.cong_field_service_reports.bulkPut(congReports);

      const attendances = await handleMigrateAttendances();
      await organizedDb.meeting_attendance.bulkPut(attendances);

      const groups = await handleMigrateGroups();
      await organizedDb.field_service_groups.bulkPut(groups);

      const schedules = await handleMigrateSchedules();
      await organizedDb.sched.bulkPut(schedules);

      const sources = await handleMigrateSources();
      if (sources) {
        await organizedDb.sources.bulkPut(sources);
      }

      const { congregations, speakers } = await handleMigrateSpeakers();
      await organizedDb.speakers_congregations.clear();
      await organizedDb.speakers_congregations.bulkPut(congregations);

      await organizedDb.visiting_speakers.clear();
      await organizedDb.visiting_speakers.bulkPut(speakers);

      setIsProcessing(false);

      setCurrentStep(3);
    } catch (error) {
      console.error(error);
      setIsProcessing(false);

      showMessage(error.message, 'error');
    }
  };

  return { isProcessing, handleMigrate };
};

export default useActionMigrate;
