import Dexie from 'dexie';

let backupDb = new Dexie('lmm_oa_backup');

backupDb.version(1).stores({
	backup: '++id, backup',
});

backupDb.on('populate', function () {
	backupDb.backup.add({
		id: 1,
		backup: '',
	});
});

export default backupDb;
