import { atom, selector } from 'recoil';
import { getI18n } from 'react-i18next';

export const settingsState = atom({
	key: 'appSettings',
	default: {},
});

export const isAppLoadState = atom({
	key: 'isAppLoad',
	default: true,
});

export const apiHostState = atom({
	key: 'apiHost',
	default: '',
});

export const isAboutOpenState = atom({
	key: 'isAboutOpen',
	default: false,
});

export const isLoginOpenState = atom({
	key: 'isLoginOpen',
	default: false,
});

export const appLangState = atom({
	key: 'appLang',
	default: 'e',
});

export const uidUserState = atom({
	key: 'uidUser',
	default: '',
});

export const isCongConnectedState = atom({
	key: 'isCongConnected',
	default: false,
});

export const userPasswordState = atom({
	key: 'userPassowrd',
	default: '',
});

export const monthNamesState = selector({
	key: 'monthNames',
	get: ({ get }) => {
		const appLang = get(appLangState);

		let months = [];
		months.push(
			getI18n().getDataByLanguage(appLang).translation['global.january']
		);
		months.push(
			getI18n().getDataByLanguage(appLang).translation['global.february']
		);
		months.push(
			getI18n().getDataByLanguage(appLang).translation['global.march']
		);
		months.push(
			getI18n().getDataByLanguage(appLang).translation['global.april']
		);
		months.push(getI18n().getDataByLanguage(appLang).translation['global.may']);
		months.push(
			getI18n().getDataByLanguage(appLang).translation['global.june']
		);
		months.push(
			getI18n().getDataByLanguage(appLang).translation['global.july']
		);
		months.push(
			getI18n().getDataByLanguage(appLang).translation['global.august']
		);
		months.push(
			getI18n().getDataByLanguage(appLang).translation['global.september']
		);
		months.push(
			getI18n().getDataByLanguage(appLang).translation['global.october']
		);
		months.push(
			getI18n().getDataByLanguage(appLang).translation['global.november']
		);
		months.push(
			getI18n().getDataByLanguage(appLang).translation['global.december']
		);

		return months;
	},
});

export const shortDateFormatState = selector({
	key: 'shortDateFormat',
	get: ({ get }) => {
		const appLang = get(appLangState);
		const format =
			getI18n().getDataByLanguage(appLang).translation[
				'global.shortDateFormat'
			];
		return format;
	},
});

export const isDeleteDbOpenState = atom({
	key: 'isDeleteDbOpen',
	default: false,
});

export const isBackupDbOpenState = atom({
	key: 'isBackupDbOpen',
	default: false,
});

export const isBackupOfflineState = atom({
	key: 'isBackupOffline',
	default: false,
});

export const isBackupOnlineState = atom({
	key: 'isBackupOnline',
	default: false,
});

export const isRestoreOfflineState = atom({
	key: 'isRestoreOffline',
	default: false,
});

export const isRestoreOnlineState = atom({
	key: 'isRestoreOnline',
	default: false,
});

export const backupEncryptedState = atom({
	key: 'backupEncrypted',
	default: {},
});

export const backupJsonDataState = atom({
	key: 'backupJsonData',
	default: undefined,
});

export const isUserLoggedState = atom({
	key: 'isUserLogged',
	default: false,
});

export const isCongLoginOpenState = atom({
	key: 'isCongLoginOpen',
	default: false,
});

export const isCongCreateAccountState = atom({
	key: 'isCongCreateAccount',
	default: false,
});

export const isCongSignInState = atom({
	key: 'isCongSignIn',
	default: false,
});

export const isCongUpdateAccountState = atom({
	key: 'isCongUpdateAccount',
	default: false,
});

export const appStageState = atom({
	key: 'appStage',
	default: 'LIVE',
});
