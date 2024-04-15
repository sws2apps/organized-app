export class LateReportClass {
  constructor() {
    this.uid = window.crypto.randomUUID();
    this.person_uid = '';
    this.service_year = '';
    this.month = '';
    this.deleted = false;
  }
}
