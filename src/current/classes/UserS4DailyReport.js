import appDb from '../../shared/indexedDb/mainDb';

export class UserS4DailyReportClass {
	constructor() {
		this.report_uid = window.crypto.randomUUID();
		this.month = '';
		this.month_date = '';
		this.placements = 0;
		this.videos = 0;
		this.duration = 0;
		this.duration_start = '';
		this.returnVisits = 0;
		this.bibleStudies = [];
		this.comments = '';
		this.isDeleted = false;
		this.isSubmitted = false;
		this.isPending = false;
		this.isS4 = false;
		this.isS21 = false;
		this.changes = [];
	}
}

UserS4DailyReportClass.prototype.save = async function () {
	await appDb.user_field_service_reports.put({ ...this }, this.report_uid);
};
