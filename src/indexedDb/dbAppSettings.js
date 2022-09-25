import appDb from './mainDb';
import backupDb from './backupDb';

export const dbUpdateAppSettings = async (settingValue, overwrite) => {
	if (overwrite) {
		await appDb.table('app_settings').put({ id: 1, ...settingValue });
	} else {
		await appDb.table('app_settings').update(1, {
			...settingValue,
		});
	}
};

export const dbGetAppSettings = async () => {
	const congData = await appDb.table('app_settings').get({ id: 1 });
	return congData;
};

export const dbSaveBackup = async (data) => {
	await backupDb.table('backup').update(1, {
		backup: data,
	});
	await appDb.close();
	await appDb.delete();
};

export const dbGetBackup = async () => {
	const appBackup = await backupDb.table('backup').get({ id: 1 });
	const backup = await appBackup.backup.text();
	return backup;
};
