import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  settingsState,
  userDataViewState,
  weekendSchedulesSongsWeekend,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { settingSchema } from '@services/dexie/schema';

const useMeetingForms = () => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const songInitial = useAtomValue(weekendSchedulesSongsWeekend);
  const [showSong, setShowSong] = useState(songInitial);

  const handleShowSongToggle = async () => {
    const initialData =
      settings.cong_settings.schedule_songs_weekend ||
      settingSchema.cong_settings.schedule_songs_weekend;

    const songsWeekend = structuredClone(initialData);

    const findRecord = songsWeekend.find((record) => record.type === dataView);

    const value = !showSong;

    if (findRecord) {
      findRecord.value = value;
      findRecord.updatedAt = new Date().toISOString();
    }

    if (!findRecord) {
      songsWeekend.push({
        _deleted: false,
        value,
        type: dataView,
        updatedAt: new Date().toISOString(),
      });
    }

    await dbAppSettingsUpdate({
      'cong_settings.schedule_songs_weekend': songsWeekend,
    });
  };

  useEffect(() => {
    setShowSong(songInitial);
  }, [songInitial]);

  return { showSong, handleShowSongToggle };
};

export default useMeetingForms;
