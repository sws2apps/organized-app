import { format } from 'date-fns';

import appDb from '../../db';

const useCongReportsMigrate = () => {
  const handleMigrateCongReports = async () => {
    const oldReports = await appDb.fieldServiceReports.toArray();

    const reports = [];

    for (const report of oldReports) {
      for (const record of report.months) {
        const shared =
          +record.bibleStudies > 0 ||
          +record.hourCredit > 0 ||
          +record.hours > 0 ||
          +record.minutes > 0 ||
          +record.placements > 0 ||
          +record.returnVisits > 0 ||
          +record.videos > 0;

        reports.push({
          report_id: record.uid,
          report_data: {
            _deleted: false,
            updatedAt: new Date().toISOString(),
            report_date: format(new Date(record.month_value), 'yyyy/MM'),
            person_uid: report.person_uid,
            shared_ministry: shared,
            hours: {
              field_service: +record.hours,
              credit: { value: 0, approved: +record.hourCredit },
            },
            bible_studies: +record.bibleStudies,
            comments: record.comments,
            late: { value: false, submitted: '' },
            status: 'confirmed',
          },
        });
      }
    }

    return reports;
  };

  return { handleMigrateCongReports };
};

export default useCongReportsMigrate;
