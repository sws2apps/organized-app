import type { ImportDbType } from '@definition/backup';
import { dbImportBackupData } from '@services/dexie/backup';

export const importBackupData = async (data: ImportDbType) => {
  await dbImportBackupData(data);
};
