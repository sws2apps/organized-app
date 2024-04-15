import { getI18n } from 'react-i18next';
import appDb from '../../shared/indexedDb/mainDb';

class SettingClass {
	constructor() {
		this.username = '';
		this.source_lang = 'e';
		this.cong_number = '';
		this.cong_name = '';
		this.cong_role = [];
		this.class_count = 1;
		this.midweek_meeting_day = 1;
		this.meeting_time = undefined;
		this.isScheduleConverted = undefined;
		this.isCongVerified = undefined;
		this.isAssignmentsConverted = undefined;
		this.isCongUpdated2 = undefined;
		this.user_avatar = undefined;
		this.account_version = undefined;
		this.co_name = '';
		this.co_displayName = '';
		this.personAssignmentsConverted = undefined;
		this.autoBackup = true;
		this.autoBackup_interval = 5;
		this.schedule_useFullname = false;
		this.account_type = '';
		this.opening_prayer_MM_autoAssign = false;
		this.user_local_uid = '';
		this.opening_prayer_WM_autoAssign = false;
		this.user_members_delegate = [];
		this.weekend_meeting_day = 6;
		this.midweek_meeting_useExactDate = false;
		this.weekend_meeting_useSubstituteSpeaker = false;
	}
}

SettingClass.prototype.load = async function () {
	const congData = (await appDb.app_settings.toArray())[0];

	this.username = congData.username;
	this.source_lang = congData.source_lang;
	this.cong_number = congData.cong_number;
	this.cong_name = congData.cong_name;
	this.cong_role = congData.cong_role;
	this.class_count = congData.class_count;
	this.midweek_meeting_day = congData.midweek_meeting_day;
	this.meeting_time = congData.meeting_time;
	this.isScheduleConverted = congData.isScheduleConverted;
	this.isCongVerified = congData.isCongVerified;
	this.isAssignmentsConverted = congData.isAssignmentsConverted;
	this.isCongUpdated2 = congData.isCongUpdated2;
	this.user_avatar = congData.user_avatar;
	this.account_version = congData.account_version;
	this.co_name = congData.co_name;
	this.co_displayName = congData.co_displayName;
	this.personAssignmentsConverted = congData.personAssignmentsConverted;
	this.autoBackup = congData.autoBackup;
	this.autoBackup_interval = congData.autoBackup_interval;
	this.schedule_useFullname = congData.schedule_useFullname;
	this.account_type = congData.account_type;
	this.opening_prayer_MM_autoAssign = congData.opening_prayer_MM_autoAssign;
	this.user_local_uid = congData.user_local_uid || '';
	this.user_members_delegate = congData.user_members_delegate || [];
	this.opening_prayer_WM_autoAssign = congData.opening_prayer_WM_autoAssign;
	this.weekend_meeting_day = congData.weekend_meeting_day;
	this.midweek_meeting_useExactDate = congData.midweek_meeting_useExactDate;
	this.weekend_meeting_useSubstituteSpeaker = congData.weekend_meeting_useSubstituteSpeaker;
};

SettingClass.prototype.update = async function (setting, overwrite) {
	try {
		const index = (await appDb.app_settings.toArray())[0].id;
		if (overwrite) {
			await appDb.app_settings.put({ id: index, ...setting });
			await this.load();
		} else {
			await appDb.app_settings.update(index, { id: index, ...setting });
			await this.load();
		}
	} catch (err) {
		console.log(err);
	}
};

SettingClass.prototype.shortDateFormat = function () {
	return getI18n().getDataByLanguage(this.source_lang).ui['shortDateFormat'];
};

SettingClass.prototype.monthNames = function () {
	const appLang = this.appLang();

	let months = [];
	months.push(getI18n().getDataByLanguage(appLang).ui['january']);
	months.push(getI18n().getDataByLanguage(appLang).ui['february']);
	months.push(getI18n().getDataByLanguage(appLang).ui['march']);
	months.push(getI18n().getDataByLanguage(appLang).ui['april']);
	months.push(getI18n().getDataByLanguage(appLang).ui['may']);
	months.push(getI18n().getDataByLanguage(appLang).ui['june']);
	months.push(getI18n().getDataByLanguage(appLang).ui['july']);
	months.push(getI18n().getDataByLanguage(appLang).ui['august']);
	months.push(getI18n().getDataByLanguage(appLang).ui['september']);
	months.push(getI18n().getDataByLanguage(appLang).ui['october']);
	months.push(getI18n().getDataByLanguage(appLang).ui['november']);
	months.push(getI18n().getDataByLanguage(appLang).ui['december']);

	return months;
};

SettingClass.prototype.appLang = function () {
	return localStorage.getItem('app_lang') || 'e';
};

export const Setting = new SettingClass();
