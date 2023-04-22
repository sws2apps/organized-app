export class S4Class {
  constructor(month_value) {
    this.uid = window.crypto.randomUUID();
    this.month_value = month_value;
    this.placements = '';
    this.videos = '';
    this.hours = '';
    this.minutes = '';
    this.isMinutesPosted = false;
    this.returnVisits = '';
    this.bibleStudies = '';
    this.comments = '';
    this.noReport = false;
    this.latePosted = '';
  }
}
