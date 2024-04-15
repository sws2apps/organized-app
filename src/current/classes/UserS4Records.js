import dateFormat from 'dateformat';
import appDb from '../../shared/indexedDb/mainDb';
import { UserS4DailyReportClass } from './UserS4DailyReport';

class UserS4RecordsClass {
	constructor() {
		this.list = [];
	}
}

UserS4RecordsClass.prototype.loadAll = async function () {
	this.list.length = 0;

	const allData = await appDb.user_field_service_reports.toArray();
	const appData = allData.filter((record) => record.isDeleted !== true);

	for (const record of appData) {
		const S4Daily = new UserS4DailyReportClass();
		S4Daily.report_uid = record.report_uid;
		S4Daily.month = record.month;
		S4Daily.month_date = record.month_date;
		S4Daily.placements = record.placements;
		S4Daily.videos = record.videos;
		S4Daily.duration = record.duration;
		S4Daily.duration_start = record.duration_start;
		S4Daily.returnVisits = record.returnVisits;
		S4Daily.bibleStudies = record.bibleStudies;
		S4Daily.comments = record.comments;
		S4Daily.isDeleted = record.isDeleted;
		S4Daily.isSubmitted = record.isSubmitted;
		S4Daily.isPending = record.isPending;
		S4Daily.isS4 = record.isS4;
		S4Daily.isS21 = record.isS21;
		S4Daily.changes = record.changes;
		this.list.push(S4Daily);
	}
};

UserS4RecordsClass.prototype.getByUid = function (report_uid) {
	return this.list.find((record) => record.report_uid === report_uid);
};

UserS4RecordsClass.prototype.get = async function (month_date) {
	const tmpMonthValue = new Date(month_date);
	const record = this.list.find((record) => record.month_date === month_date);

	if (record) return record;

	if (!record) {
		const monthStart = new Date(tmpMonthValue.getFullYear(), tmpMonthValue.getMonth(), 1);

		const dailyRecord = new UserS4DailyReportClass();
		dailyRecord.month = dateFormat(monthStart, 'yyyy/mm/dd');
		dailyRecord.month_date = month_date;
		await dailyRecord.save();

		this.list.push(dailyRecord);

		return dailyRecord;
	}
};

UserS4RecordsClass.prototype.getS4 = function (month) {
	const record = this.list.find((record) => record.month === month && record.isS4 === true);
	return record;
};

UserS4RecordsClass.prototype.getS21 = function (month) {
	const record = this.list.find((record) => record.month === month && record.isS21 === true);
	return record;
};

UserS4RecordsClass.prototype.cleanDeleted = async function () {
	const allData = await appDb.user_field_service_reports.toArray();
	const appData = allData.filter((record) => record.isDeleted === true);

	for await (const record of appData) {
		await appDb.user_field_service_reports.delete(record.report_uid);
	}
};

UserS4RecordsClass.prototype.delete = async function (report_uid) {
	await appDb.user_field_service_reports.delete(report_uid);

	this.list = this.list.filter((record) => record.report_uid !== report_uid);
};

UserS4RecordsClass.prototype.mergeFromBackup = async function (reportsBackup) {
	for await (const report of reportsBackup) {
		// remove deleted records
		if (report.isDeleted) {
			const isExist = this.getByUid(report.report_uid);
			if (isExist) await this.delete(report.report_uid);

			continue;
		}

		// update existing record
		const oldRecord = this.getByUid(report.report_uid);

		// add new record and continue loop
		if (!oldRecord) {
			const dailyRecord = new UserS4DailyReportClass();
			dailyRecord.report_uid = report.report_uid;
			dailyRecord.month = report.month;
			dailyRecord.month_date = report.month_date;
			dailyRecord.placements = report.placements;
			dailyRecord.videos = report.videos;
			dailyRecord.duration = report.duration;
			dailyRecord.duration_start = report.duration_start;
			dailyRecord.returnVisits = report.returnVisits;
			dailyRecord.bibleStudies = report.bibleStudies;
			dailyRecord.comments = report.comments;
			dailyRecord.isDeleted = report.isDeleted;
			dailyRecord.isSubmitted = report.isSubmitted;
			dailyRecord.isPending = report.isPending;
			dailyRecord.isS4 = report.isS4;
			dailyRecord.isS21 = report.isS21;
			dailyRecord.changes = report.changes;

			await dailyRecord.save();
			this.list.push(dailyRecord);

			continue;
		}

		// update existing
		if (oldRecord) {
			const newChanges = report.changes || [];
			const oldChanges = oldRecord.changes || [];

			for (const change of newChanges) {
				// update S4 and S21 records
				if (report.isS4 || report.isS21) {
					const oldDate = oldChanges[0] ? new Date(oldChanges[0].date) : undefined;
					const newDate = new Date(change.date);

					let isUpdate = false;

					if (!oldDate) isUpdate = true;
					if (oldDate && oldDate < newDate) isUpdate = true;

					if (isUpdate) {
						oldRecord.changes = [];
						oldRecord.changes.push(change);

						for (const [key, value] of Object.entries(report)) {
							if (key !== 'changes') oldRecord[key] = value;
						}
					}
				}

				// update daily records
				if (!report.isS4 && !report.isS21) {
					const oldChange = oldChanges.find((item) => item.field === change.field);

					if (!oldChange) {
						oldRecord[change.field] = change.value;
						if (!oldRecord.changes) oldRecord.changes = [];
						oldRecord.changes.push(change);
					}

					if (oldChange) {
						const oldDate = new Date(oldChange.date);
						const newDate = new Date(change.date);

						if (newDate > oldDate) {
							oldRecord[change.field] = change.value;
							oldRecord.changes = oldRecord.changes.filter((item) => item.field !== change.field);
							oldRecord.changes.push(change);
						}
					}
				}
			}

			await oldRecord.save();
		}
	}
};

export const UserS4Records = new UserS4RecordsClass();
