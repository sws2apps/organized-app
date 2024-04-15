export class S4Class {
  constructor(month_value) {
    this.uid = window.crypto.randomUUID();
    this.month_value = month_value;
    this.placements = '';
    this.videos = '';
    this.hours = '';
    this.hourCredit = '';
    this.minutes = '';
    this.returnVisits = '';
    this.bibleStudies = '';
    this.comments = '';
    this.changes = [];
  }
}
