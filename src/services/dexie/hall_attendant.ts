import appDb from '@db/appDb';
import { HallInfo } from '@definition/hall_attendant';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { emptyHallInfo, nextHallTimestamp } from '@utils/hall_info';

export const dbHallInfoUpdate = (
  view: string,
  update: (info: HallInfo, timestamp: string) => void
) =>
  appDb.transaction('rw', appDb.app_settings, appDb.metadata, async () => {
    const settings = await appDb.app_settings.get(1);
    if (
      !settings?.user_settings.cong_role.some((role) =>
        ['admin', 'coordinator', 'secretary', 'hall_attendant_info'].includes(
          role
        )
      )
    )
      throw new Error('error_api_unauthorized-request');
    const all = structuredClone(
      settings.cong_settings.hall_attendant_info ?? []
    );
    let info = all.find((row) => row.type === view);
    if (!info) {
      info = emptyHallInfo(view);
      all.push(info);
    }
    const timestamp = nextHallTimestamp(info);
    update(info, timestamp);
    info.updatedAt = timestamp;
    await dbAppSettingsUpdate({ 'cong_settings.hall_attendant_info': all });
  });
