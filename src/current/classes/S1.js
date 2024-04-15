import appDb from '../../shared/indexedDb/mainDb';
import { reportsFieldSum } from '../utils/app';
import { LateReports } from './LateReports';
import { MinutesReports } from './MinutesReports';
import { Persons } from './Persons';
import { S21s } from './S21s';
import { S88s } from './S88s';
import { ServiceYear } from './ServiceYear';

export class S1Class {
	constructor(report_uid) {
		this.report_uid = report_uid;
		this.report = 'S1';
		this.service_year = '';
		this.month = '';
		this.details = {
			isFinalized: false,
			isSubmitted: false,
			activePublishers: 0,
			weekendMeetingAttendanceAvg: 0,
			totalReports: 0,
			totalPlacements: 0,
			totalVideos: 0,
			totalHours: 0,
			totalReturnVisits: 0,
			totalBibleStudies: 0,
			publishersReports: 0,
			publishersPlacements: 0,
			publishersVideos: 0,
			publishersHours: 0,
			publishersReturnVisits: 0,
			publishersBibleStudies: 0,
			auxPioneersReports: 0,
			auxPioneersPlacements: 0,
			auxPioneersVideos: 0,
			auxPioneersHours: 0,
			auxPioneersReturnVisits: 0,
			auxPioneersBibleStudies: 0,
			FRReports: 0,
			FRPlacements: 0,
			FRVideos: 0,
			FRHours: 0,
			FRReturnVisits: 0,
			FRBibleStudies: 0,
		};
		this.updatedAt = null;
	}
}

S1Class.prototype.loadDetails = async function () {
	const appData = await appDb.branchReports.get(this.report_uid);
	this.service_year = appData.service_year;
	this.month = appData.month;
	this.details.isFinalized = appData.details.isFinalized;
	this.details.isSubmitted = appData.details.isSubmitted;
	this.details.activePublishers = appData.details.activePublishers;
	this.details.weekendMeetingAttendanceAvg = appData.details.weekendMeetingAttendanceAvg;
	this.details.totalReports = appData.details.totalReports;
	this.details.totalPlacements = appData.details.totalPlacements;
	this.details.totalVideos = appData.details.totalVideos;
	this.details.totalHours = appData.details.totalHours;
	this.details.totalReturnVisits = appData.details.totalReturnVisits;
	this.details.totalBibleStudies = appData.details.totalBibleStudies;
	this.details.publishersReports = appData.details.publishersReports;
	this.details.publishersPlacements = appData.details.publishersPlacements;
	this.details.publishersVideos = appData.details.publishersVideos;
	this.details.publishersHours = appData.details.publishersHours;
	this.details.publishersReturnVisits = appData.details.publishersReturnVisits;
	this.details.publishersBibleStudies = appData.details.publishersBibleStudies;
	this.details.auxPioneersReports = appData.details.auxPioneersReports;
	this.details.auxPioneersPlacements = appData.details.auxPioneersPlacements;
	this.details.auxPioneersVideos = appData.details.auxPioneersVideos;
	this.details.auxPioneersHours = appData.details.auxPioneersHours;
	this.details.auxPioneersReturnVisits = appData.details.auxPioneersReturnVisits;
	this.details.auxPioneersBibleStudies = appData.details.auxPioneersBibleStudies;
	this.details.FRReports = appData.details.FRReports;
	this.details.FRPlacements = appData.details.FRPlacements;
	this.details.FRVideos = appData.details.FRVideos;
	this.details.FRHours = appData.details.FRHours;
	this.details.FRReturnVisits = appData.details.FRReturnVisits;
	this.details.FRBibleStudies = appData.details.FRBibleStudies;
	this.updatedAt = appData.updatedAt;
};

S1Class.prototype.generate = async function () {
	const reports = [];
	const data = {};

	// get active publishers
	data.activePublishers = Persons.getActivePublishers(this.month).length;

	// get average weekend meeting attendance
	const S88 = S88s.list.find((item) => item.uid === this.service_year);
	const S3 = S88.months.find((item) => item.month_value === this.month);
	data.weekendMeetingAttendanceAvg = S3?.summaryMeeting('weekend').average || 0;

	// collect active S-4 reports
	const allS21s = S21s.getAll(this.service_year);
	for (const S21 of allS21s) {
		if (S21.hasReport(this.month)) {
			const currentMonth = S21.months.find((item) => item.month_value === this.month);
			reports.push({
				person_uid: S21.person_uid,
				service_year: this.service_year,
				...currentMonth,
			});
		}
	}

	const isCurrentReport = ServiceYear.currentReportMonth() === this.month;

	// collect late reports if current month
	if (isCurrentReport) {
		for (const lateReport of LateReports.reports) {
			const S21 = S21s.get(lateReport.service_year, lateReport.person_uid);
			if (S21.hasReport(lateReport.month)) {
				const currentMonth = S21.months.find((item) => item.month_value === lateReport.month);
				reports.push({
					person_uid: S21.person_uid,
					service_year: lateReport.service_year,
					...currentMonth,
				});
			}
		}
	}

	// check minutes reports if current month
	let minutesReports = 0;
	if (isCurrentReport) {
		minutesReports = MinutesReports.countTotal();
	}

	// remove special pioneer
	const reportsNoSFTS = reports.filter(
		(report) => Persons.get(report.person_uid).isSpecialPioneer(this.month) === false
	);

	// congregation total
	data.totalReports = reportsNoSFTS.length;
	data.totalPlacements = reportsFieldSum(reportsNoSFTS, 'placements');
	data.totalVideos = reportsFieldSum(reportsNoSFTS, 'videos');
	data.totalHours = reportsFieldSum(reportsNoSFTS, 'hours', minutesReports);
	data.totalReturnVisits = reportsFieldSum(reportsNoSFTS, 'returnVisits');
	data.totalBibleStudies = reportsFieldSum(reportsNoSFTS, 'bibleStudies');

	// extract publishers only
	const reportsPublishers = reportsNoSFTS.filter(
		(report) =>
			Persons.get(report.person_uid).isAuxiliaryPioneer(this.month) === false &&
			Persons.get(report.person_uid).isRegularPioneer(this.month) === false
	);
	data.publishersReports = reportsPublishers.length;
	data.publishersPlacements = reportsFieldSum(reportsPublishers, 'placements');
	data.publishersVideos = reportsFieldSum(reportsPublishers, 'videos');
	data.publishersHours = reportsFieldSum(reportsPublishers, 'hours', minutesReports);
	data.publishersReturnVisits = reportsFieldSum(reportsPublishers, 'returnVisits');
	data.publishersBibleStudies = reportsFieldSum(reportsPublishers, 'bibleStudies');

	// extract auxiliary pioneers
	const reportsAuxPioneers = reportsNoSFTS.filter(
		(report) => Persons.get(report.person_uid).isAuxiliaryPioneer(this.month) === true
	);
	data.auxPioneersReports = reportsAuxPioneers.length;
	data.auxPioneersPlacements = reportsFieldSum(reportsAuxPioneers, 'placements');
	data.auxPioneersVideos = reportsFieldSum(reportsAuxPioneers, 'videos');
	data.auxPioneersHours = reportsFieldSum(reportsAuxPioneers, 'hours');
	data.auxPioneersReturnVisits = reportsFieldSum(reportsAuxPioneers, 'returnVisits');
	data.auxPioneersBibleStudies = reportsFieldSum(reportsAuxPioneers, 'bibleStudies');

	// extract regular pioneers
	const reportsFRs = reportsNoSFTS.filter(
		(report) => Persons.get(report.person_uid).isRegularPioneer(this.month) === true
	);
	data.FRReports = reportsFRs.length;
	data.FRPlacements = reportsFieldSum(reportsFRs, 'placements');
	data.FRVideos = reportsFieldSum(reportsFRs, 'videos');
	data.FRHours = reportsFieldSum(reportsFRs, 'hours');
	data.FRReturnVisits = reportsFieldSum(reportsFRs, 'returnVisits');
	data.FRBibleStudies = reportsFieldSum(reportsFRs, 'bibleStudies');
	data.isFinalized = true;
	data.isSubmitted = false;

	const appData = {
		report_uid: this.report_uid,
		report: this.report,
		service_year: this.service_year,
		month: this.month,
		updatedAt: new Date(),
		details: data,
	};

	await appDb.branchReports.update(this.report_uid, appData);

	this.details.isFinalized = appData.details.isFinalized;
	this.details.isSubmitted = appData.details.isSubmitted;
	this.details.activePublishers = appData.details.activePublishers;
	this.details.weekendMeetingAttendanceAvg = appData.details.weekendMeetingAttendanceAvg;
	this.details.totalReports = appData.details.totalReports;
	this.details.totalPlacements = appData.details.totalPlacements;
	this.details.totalVideos = appData.details.totalVideos;
	this.details.totalHours = appData.details.totalHours;
	this.details.totalReturnVisits = appData.details.totalReturnVisits;
	this.details.totalBibleStudies = appData.details.totalBibleStudies;
	this.details.publishersReports = appData.details.publishersReports;
	this.details.publishersPlacements = appData.details.publishersPlacements;
	this.details.publishersVideos = appData.details.publishersVideos;
	this.details.publishersHours = appData.details.publishersHours;
	this.details.publishersReturnVisits = appData.details.publishersReturnVisits;
	this.details.publishersBibleStudies = appData.details.publishersBibleStudies;
	this.details.auxPioneersReports = appData.details.auxPioneersReports;
	this.details.auxPioneersPlacements = appData.details.auxPioneersPlacements;
	this.details.auxPioneersVideos = appData.details.auxPioneersVideos;
	this.details.auxPioneersHours = appData.details.auxPioneersHours;
	this.details.auxPioneersReturnVisits = appData.details.auxPioneersReturnVisits;
	this.details.auxPioneersBibleStudies = appData.details.auxPioneersBibleStudies;
	this.details.FRReports = appData.details.FRReports;
	this.details.FRPlacements = appData.details.FRPlacements;
	this.details.FRVideos = appData.details.FRVideos;
	this.details.FRHours = appData.details.FRHours;
	this.details.FRReturnVisits = appData.details.FRReturnVisits;
	this.details.FRBibleStudies = appData.details.FRBibleStudies;
};

S1Class.prototype.setAsSubmitted = async function () {
	const appData = { ...this };
	appData.updatedAt = new Date();
	appData.details.isSubmitted = true;

	await appDb.branchReports.update(this.report_uid, appData);

	// remove late reports records
	for await (const lateReport of LateReports.reports) {
		await LateReports.remove(lateReport.person_uid, lateReport.month);
	}

	// remove minutes records if round up to 1 hour
	const minutesReports = MinutesReports.countTotal();
	if (minutesReports > 0) {
		for await (const minutesReport of MinutesReports.reports) {
			await MinutesReports.remove(minutesReport.person_uid, minutesReport.month);
		}
	}

	this.details.isSubmitted = appData.details.isSubmitted;
};

S1Class.prototype.undoSubmission = async function () {
	const appData = { ...this };
	appData.updatedAt = new Date();
	appData.details.isSubmitted = false;

	await appDb.branchReports.update(this.report_uid, appData);

	this.details.isSubmitted = appData.details.isSubmitted;
};

S1Class.prototype.isSubmitted = function () {
	return this.details.isSubmitted || false;
};
