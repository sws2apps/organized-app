import { AES, Utf8 } from 'crypto-es';
import { TABLE_ENCRYPTION_MAP } from '@constants/table_encryption_map';

export const generateKey = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => ('00' + b.toString(16)).slice(-2))
    .join('');
};

export const encryptData = (data: string, passphrase: string) => {
  data = JSON.stringify(data);
  const encryptedData = AES.encrypt(data, passphrase).toString();
  return encryptedData;
};

export const decryptData = (
  data: string,
  passphrase: string,
  field: string,
  table?: string
) => {
  try {
    const decryptedData = AES.decrypt(data, passphrase);
    const str = decryptedData.toString(Utf8);
    const result: string = JSON.parse(str);

    return result;
  } catch (error) {
    let msg = 'An error occurred while decrypting';
    msg += ` ${field}`;

    if (table) {
      msg += ` in ${table}`;
    }

    throw new Error(`${msg}: ${error.message}`);
  }
};

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
      if (
        data[key] !== null &&
        data[key] !== undefined &&
        typeof data[key] === 'object'
      ) {
        encryptObject({ data: data[key], table, accessCode, masterKey });
      }

      continue;
    }

    if (
      data[key] !== null &&
      data[key] !== undefined &&
      secretKey === 'shared'
    ) {
      data[key] = encryptData(JSON.stringify(data[key]), accessCode);
    }

    if (
      data[key] !== null &&
      data[key] !== undefined &&
      secretKey === 'private'
    ) {
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
      if (
        data[key] !== null &&
        data[key] !== undefined &&
        typeof data[key] === 'object'
      ) {
        decryptObject({ data: data[key], table, accessCode, masterKey });
      }

      continue;
    }

    // ignore null value or empty string
    if (data[key] === null || data[key] === undefined || data[key] === '') {
      delete data[key];
      continue;
    }

    if (
      data[key] !== null &&
      data[key] !== undefined &&
      typeof data[key] === 'string'
    ) {
      if (secretKey === 'shared') {
        data[key] = JSON.parse(decryptData(data[key], accessCode, key, table));
      }

      if (secretKey === 'private') {
        data[key] = JSON.parse(decryptData(data[key], masterKey, key, table));
      }
    }
  }
};
