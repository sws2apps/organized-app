import { MetadataRecordType } from '@definition/metadata';
import appDb from '@db/appDb';

export const dbMetadataDefault = async () => {
  try {
    const metadata = await appDb.metadata.get(1);

    if (!metadata) {
      await appDb.metadata.put({
        id: 1,
        metadata: {
          cong_settings: { version: '', send_local: true },
          user_settings: { version: '', send_local: true },
          persons: { version: '', send_local: true },
          sources: { version: '', send_local: true },
          schedules: { version: '', send_local: true },
          field_service_groups: { version: '', send_local: true },
          visiting_speakers: { version: '', send_local: true },
          cong_field_service_reports: { version: '', send_local: true },
          branch_field_service_reports: { version: '', send_local: true },
          branch_cong_analysis: { version: '', send_local: true },
          speakers_congregations: { version: '', send_local: true },
          public_sources: { version: '', send_local: true },
          public_schedules: { version: '', send_local: true },
          meeting_attendance: { version: '', send_local: true },
          user_bible_studies: { version: '', send_local: true },
          user_field_service_reports: { version: '', send_local: true },
          delegated_field_service_reports: { version: '', send_local: true },
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export const dbResetExportState = async () => {
  const metadata = await appDb.metadata.get(1);

  const oldMetadata = metadata.metadata;
  const newMetadata = {} as MetadataRecordType['metadata'];

  for (const [key, values] of Object.entries(oldMetadata)) {
    newMetadata[key] = { version: values.version, send_local: true };
  }

  await appDb.metadata.update(metadata.id, {
    metadata: newMetadata,
  });
};
