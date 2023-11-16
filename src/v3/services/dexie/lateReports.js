import appDb from './db';

export const cleanLateReportsDeleted = async () => {
  const allData = await appDb.lateReports.toArray();
  const appData = allData.filter((record) => record.deleted === true);

  for await (const report of appData) {
    await appDb.lateReports.delete(report.uid);
  }
};
