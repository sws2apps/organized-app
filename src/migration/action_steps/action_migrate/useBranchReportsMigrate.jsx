import { format } from 'date-fns';

import appDb from '../../db';

const useBranchReportsMigrate = () => {
  const handleMigrateBranchReports = async () => {
    const oldReports = await appDb.branchReports.toArray();

    const reports = oldReports.map((record) => {
      return {
        report_date: format(new Date(record.month), 'yyyy/MM'),
        report_data: {
          _deleted: false,
          updatedAt: new Date(record.updatedAt).toISOString(),
          publishers_active: record.details.activePublishers,
          weekend_meeting_average: record.details.weekendMeetingAttendanceAvg,
          submitted: record.details.isSubmitted,
          publishers: {
            report_count: record.details.publishersReports,
            bible_studies: record.details.totalBibleStudies,
          },
          APs: {
            report_count: record.details.auxPioneersReports,
            hours: record.details.auxPioneersHours,
            bible_studies: record.details.auxPioneersBibleStudies,
          },
          FRs: {
            report_count: record.details.FRReports,
            hours: record.details.FRHours,
            bible_studies: record.details.FRBibleStudies,
          },
        },
      };
    });

    return reports;
  };

  return { handleMigrateBranchReports };
};

export default useBranchReportsMigrate;
