import appDb from '../indexedDb/mainDb';
import { reportsFieldSum } from '../utils/app';
import { Persons } from './Persons';
import { S21s } from './S21s';
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
      publihsersReports: 0,
      publihsersPlacements: 0,
      publihsersVideos: 0,
      publihsersHours: 0,
      publihsersReturnVisits: 0,
      publihsersBibleStudies: 0,
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
  this.details.publihsersReports = appData.details.publihsersReports;
  this.details.publihsersPlacements = appData.details.publihsersPlacements;
  this.details.publihsersVideos = appData.details.publihsersVideos;
  this.details.publihsersHours = appData.details.publihsersHours;
  this.details.publihsersReturnVisits = appData.details.publihsersReturnVisits;
  this.details.publihsersBibleStudies = appData.details.publihsersBibleStudies;
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
  if (isCurrentReport) {
    // collect late reports if current month
    // check minutes reports if current month
  }

  // remove special pioneer
  const reportsNoSFTS = reports.filter(
    (report) => Persons.get(report.person_uid).isSpecialPioneer(this.month) === false
  );

  console.log('cong');
  // congregation total
  const totalPlacements = reportsFieldSum(reportsNoSFTS, 'placements');
  console.log(totalPlacements);

  const totalVideos = reportsFieldSum(reportsNoSFTS, 'videos');
  console.log(totalVideos);

  const totalHours = reportsFieldSum(reportsNoSFTS, 'hours');
  console.log(totalHours);

  const totalReturnVisits = reportsFieldSum(reportsNoSFTS, 'returnVisits');
  console.log(totalReturnVisits);

  const totalBibleStudies = reportsFieldSum(reportsNoSFTS, 'bibleStudies');
  console.log(totalBibleStudies);

  // extract publishers only
  const reportsPublishers = reportsNoSFTS.filter(
    (report) =>
      Persons.get(report.person_uid).isAuxiliaryPioneer(this.month) === false &&
      Persons.get(report.person_uid).isRegularPioneer(this.month) === false
  );
  console.log('publishers');
  const publishersPlacements = reportsFieldSum(reportsPublishers, 'placements');
  console.log(publishersPlacements);

  const publishersVideos = reportsFieldSum(reportsPublishers, 'videos');
  console.log(publishersVideos);

  const publishersHours = reportsFieldSum(reportsPublishers, 'hours');
  console.log(publishersHours);

  const publishersReturnVisits = reportsFieldSum(reportsPublishers, 'returnVisits');
  console.log(publishersReturnVisits);

  const publishersBibleStudies = reportsFieldSum(reportsPublishers, 'bibleStudies');
  console.log(publishersBibleStudies);

  // extract auxiliary pioneers
  const reportsAuxPioneers = reportsNoSFTS.filter(
    (report) => Persons.get(report.person_uid).isAuxiliaryPioneer(this.month) === true
  );
  console.log('auxP');
  const auxPioneersPlacements = reportsFieldSum(reportsAuxPioneers, 'placements');
  console.log(auxPioneersPlacements);

  const auxPioneersVideos = reportsFieldSum(reportsAuxPioneers, 'videos');
  console.log(auxPioneersVideos);

  const auxPioneersHours = reportsFieldSum(reportsAuxPioneers, 'hours');
  console.log(auxPioneersHours);

  const auxPioneersReturnVisits = reportsFieldSum(reportsAuxPioneers, 'returnVisits');
  console.log(auxPioneersReturnVisits);

  const auxPioneersBibleStudies = reportsFieldSum(reportsAuxPioneers, 'bibleStudies');
  console.log(auxPioneersBibleStudies);

  // extract regular pioneers
  const reportsFRs = reportsNoSFTS.filter(
    (report) => Persons.get(report.person_uid).isRegularPioneer(this.month) === true
  );
  console.log('FR');
  const FRPlacements = reportsFieldSum(reportsFRs, 'placements');
  console.log(FRPlacements);

  const FRVideos = reportsFieldSum(reportsFRs, 'videos');
  console.log(FRVideos);

  const FRHours = reportsFieldSum(reportsFRs, 'hours');
  console.log(FRHours);

  const FRReturnVisits = reportsFieldSum(reportsFRs, 'returnVisits');
  console.log(FRReturnVisits);

  const FRBibleStudies = reportsFieldSum(reportsFRs, 'bibleStudies');
  console.log(FRBibleStudies);
};
