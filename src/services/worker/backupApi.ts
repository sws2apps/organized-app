import type { FieldServiceMeetingReceipt } from '@definition/field_service_meetings';
import { BackupDataType } from './backupType';

const fieldServiceSyncMessage = (message: string) => {
  if (message === 'FIELD_SERVICE_FORBIDDEN')
    return 'tr_fieldServiceMeetingNotAllowed';
  if (message === 'FIELD_SERVICE_CONFLICT')
    return 'tr_fieldServiceMeetingChanged';
  return message;
};

export const apiGetCongregationBackup = async ({
  apiHost,
  userID,
  idToken,
  metadata,
}: {
  apiHost: string;
  userID: string;
  idToken: string;
  metadata: string;
}) => {
  const res = await fetch(`${apiHost}api/v3/users/${userID}/backup`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Authorization: `Bearer ${idToken}`,
      appclient: 'organized',
      appversion: import.meta.env.PACKAGE_VERSION,
      metadata,
    },
  });

  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }

  return data as BackupDataType;
};

export const apiSendCongregationBackup = async ({
  apiHost,
  userID,
  reqPayload,
  idToken,
  metadata,
}: {
  apiHost: string;
  userID: string;
  reqPayload: object;
  idToken: string;
  metadata: Record<string, string>;
}) => {
  const data = await apiSendCongregationBackupChunk({
    apiHost,
    userID,
    reqPayload,
    idToken,
    metadata,
  });

  return data;
};

export const apiGetPocketBackup = async ({
  apiHost,
  metadata,
}: {
  apiHost: string;
  metadata: string;
}) => {
  const res = await fetch(`${apiHost}api/v3/pockets/backup`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      appclient: 'organized',
      appversion: import.meta.env.PACKAGE_VERSION,
      metadata,
    },
  });

  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }

  return data as BackupDataType;
};

export const apiSendPocketBackup = async ({
  apiHost,
  reqPayload,
  metadata,
}) => {
  const res = await fetch(`${apiHost}api/v3/pockets/backup`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      appclient: 'organized',
      appversion: import.meta.env.PACKAGE_VERSION,
      metadata,
    },
    body: JSON.stringify({ cong_backup: reqPayload }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(fieldServiceSyncMessage(data.message));
  return data;
};

export const apiSendCongregationBackupChunk = async ({
  apiHost,
  userID,
  reqPayload,
  idToken,
  metadata,
}: {
  apiHost: string;
  userID: string;
  reqPayload: object;
  idToken: string;
  metadata: Record<string, string>;
}) => {
  const CHUNK_SIZE = 500 * 1024;

  const jsonStr = JSON.stringify(reqPayload);
  const totalChunks = Math.ceil(jsonStr.length / CHUNK_SIZE);
  const uploadId = crypto.randomUUID();

  const data: {
    message: string;
    field_service_meeting_receipts?: FieldServiceMeetingReceipt[];
  } = { message: '' };

  for (let i = 0; i < totalChunks; i++) {
    const chunkData = jsonStr.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);

    const res = await fetch(`${apiHost}api/v3/users/${userID}/backup/chunked`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Authorization: `Bearer ${idToken}`,
        appclient: 'organized',
        appversion: import.meta.env.PACKAGE_VERSION,
        metadata: JSON.stringify(metadata),
      },
      body: JSON.stringify({ uploadId, chunkIndex: i, totalChunks, chunkData }),
    });

    if (res.status === 409) {
      data.message = 'error_api_sync-conflict';
      return data;
    }

    const resData = await res.json();

    if (!res.ok) {
      throw new Error(fieldServiceSyncMessage(resData.message));
    }

    data.message = resData.message;
    data.field_service_meeting_receipts =
      resData.field_service_meeting_receipts;
  }

  return data;
};
