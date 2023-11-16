import appDb from './db';

export const cleanMinutesReportsDeleted = async () => {
  const allData = await appDb.minutesReports.toArray();
  const appData = allData.filter((record) => record.deleted === true);

  for await (const report of appData) {
    await appDb.minutesReports.delete(report.uid);
  }
};
