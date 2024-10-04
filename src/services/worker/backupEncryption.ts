import { decryptData, encryptData } from '@services/encryption';
import { TABLE_ENCRYPTION_MAP } from '@constants/table_encryption_map';

export const encryptObject = <T extends object>({
  data,
  table,
  accessCode,
  masterKey,
}: {
  data: T;
  table: string;
  accessCode?: string;
  masterKey?: string;
}) => {
  const keys = Object.keys(data);
  const encryptionMap = TABLE_ENCRYPTION_MAP[table] as Record<string, string>;

  for (const key of keys) {
    const secretKey = encryptionMap[key];

    if (!secretKey) {
      if (typeof data[key] === 'object') {
        encryptObject({ data: data[key], table, accessCode, masterKey });
      }

      continue;
    }

    if (secretKey === 'shared') {
      data[key] = encryptData(JSON.stringify(data[key]), accessCode);
    }

    if (secretKey === 'private') {
      data[key] = encryptData(JSON.stringify(data[key]), masterKey);
    }
  }
};

export const decryptObject = <T extends object>({
  data,
  table,
  accessCode,
  masterKey,
}: {
  data: T;
  table: string;
  accessCode: string;
  masterKey?: string;
}) => {
  const keys = Object.keys(data);
  const encryptionMap = TABLE_ENCRYPTION_MAP[table] as Record<string, string>;

  for (const key of keys) {
    const secretKey = encryptionMap[key];

    if (!secretKey) {
      if (typeof data[key] === 'object') {
        decryptObject({ data: data[key], table, accessCode, masterKey });
      }

      continue;
    }

    if (secretKey === 'shared') {
      data[key] = JSON.parse(decryptData(data[key], accessCode));
    }

    if (secretKey === 'private') {
      data[key] = JSON.parse(decryptData(data[key], masterKey));
    }
  }
};
