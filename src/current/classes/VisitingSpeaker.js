export class VisitingSpeakerClass {
  constructor(uid) {
    this.person_uid = uid;
    this.person_name = '';
    this.person_displayName = '';
    this.is_elder = false;
    this.is_ms = false;
    this.talks = [];
    this.is_unavailable = false;
    this.is_deleted = false;
    this.cong_name = '';
    this.cong_number = '';
    this.cong_id = '';
    this.is_local = false;
    this.email = '';
    this.phone = '';
    this.changes = [];
  }
}

VisitingSpeakerClass.prototype.updateTalks = function (talks) {
  this.changes = this.changes.filter((record) => record.field !== 'talks');
  this.changes.push({ date: new Date().toISOString(), field: 'talks', value: talks });
  this.talks = talks;
};

VisitingSpeakerClass.prototype.updateDetails = function (field, value) {
  this.changes = this.changes.filter((record) => record.field !== field);
  this.changes.push({ date: new Date().toISOString(), field: field, value: value });
  this[field] = value;
};
