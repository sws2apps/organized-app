import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { sourcesState } from '@states/sources';
import { SongSourceType } from './index.types';
import { songsLocaleState, songsState } from '@states/songs';
import { useAppTranslation } from '@hooks/index';
import { settingsState } from '@states/settings';
import { SongLocaleType } from '@definition/songs';
import { sourcesSongConclude } from '@services/app/sources';
import { dbSourcesUpdate } from '@services/dexie/sources';
import { CongregationStringType } from '@definition/sources';
import { schedulesState } from '@states/schedules';
import { dbSchedUpdate } from '@services/dexie/schedules';
import { LANGUAGE_LIST } from '@constants/index';

const useSongSource = ({
  meeting,
  type,
  week,
  schedule_id,
  dataView,
}: SongSourceType) => {
  const { t } = useAppTranslation();

  const sources = useAtomValue(sourcesState);
  const songs = useAtomValue(songsLocaleState);
  const songsAll = useAtomValue(songsState);
  const settings = useAtomValue(settingsState);
  const schedules = useAtomValue(schedulesState);

  const lang = useMemo(() => {
    return (
      settings.cong_settings.source_material.language.find(
        (record) => record.type === dataView
      )?.value ?? 'E'
    );
  }, [settings, dataView]);

  const sourceLang = useMemo(() => {
    const locale =
      LANGUAGE_LIST.find((record) => record.code.toUpperCase() === lang)
        ?.threeLettersCode || 'eng';

    return locale;
  }, [lang]);

  const songLocale = useMemo(() => {
    return t('tr_song', { lng: sourceLang });
  }, [t, sourceLang]);

  const source = useMemo(() => {
    return sources.find((record) => record.weekOf === week);
  }, [sources, week]);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const initialValue = useMemo(() => {
    if (!source) return null;

    let song: string = null;

    if (meeting === 'midweek') {
      if (type === 'opening') {
        song = source.midweek_meeting.song_first[lang];
      }

      if (type === 'middle') {
        song = source.midweek_meeting.song_middle[lang];
      }

      if (type === 'concluding') {
        song = sourcesSongConclude({
          meeting: 'midweek',
          source,
          dataView,
          lang,
        });
      }
    }

    if (meeting === 'weekend') {
      if (type === 'opening') {
        song =
          source.weekend_meeting.song_first.find(
            (record) => record.type === dataView
          )?.value || '';
      }

      if (type === 'middle') {
        song = source.weekend_meeting.song_middle[lang];
      }

      if (type === 'concluding') {
        song = sourcesSongConclude({
          meeting: 'weekend',
          source,
          dataView,
          lang,
        });
      }

      if (type === 'outgoing') {
        const outgoingSchedule = schedule.weekend_meeting.outgoing_talks.find(
          (record) => record.id === schedule_id
        );
        song = outgoingSchedule.opening_song;
      }
    }

    const findSong = songs.find((record) => record.song_number === +song);

    return findSong ?? null;
  }, [meeting, songs, source, lang, type, dataView, schedule, schedule_id]);

  const songTitle = useMemo(() => {
    const findSong = songsAll.find(
      (record) => record.song_number === initialValue?.song_number
    );

    if (!findSong) return '';

    const title = findSong.song_title[lang];

    return `${songLocale} ${title}`;
  }, [initialValue, songsAll, lang, songLocale]);

  const [selectedSong, setSelectedSong] = useState(initialValue);

  const handleSongChange = async (song: SongLocaleType) => {
    const value = song?.song_number.toString() || '';

    const findOrCreateRecord = (song: CongregationStringType[]) => {
      let data = song.find((record) => record.type === dataView);

      if (!data) {
        song.push({ type: dataView, updatedAt: '', value: '' });
        data = song.find((record) => record.type === dataView);
      }

      return data;
    };

    if (meeting === 'midweek') {
      if (type === 'concluding') {
        const song = structuredClone(
          source.midweek_meeting.song_conclude.override
        );

        const data = findOrCreateRecord(song);
        data.updatedAt = new Date().toISOString();
        data.value = value;

        await dbSourcesUpdate(week, {
          'midweek_meeting.song_conclude.override': song,
        });
      }
    }

    if (meeting === 'weekend') {
      if (type === 'opening') {
        const song = structuredClone(source.weekend_meeting.song_first);

        const data = findOrCreateRecord(song);
        data.updatedAt = new Date().toISOString();
        data.value = value;

        await dbSourcesUpdate(week, { 'weekend_meeting.song_first': song });
      }

      if (type === 'concluding') {
        const song = structuredClone(
          source.weekend_meeting.song_conclude.override
        );

        const data = findOrCreateRecord(song);
        data.updatedAt = new Date().toISOString();
        data.value = value;

        await dbSourcesUpdate(week, {
          'weekend_meeting.song_conclude.override': song,
        });
      }

      if (type === 'outgoing') {
        const outgoingTalks = structuredClone(
          schedule.weekend_meeting.outgoing_talks
        );

        const outgoingSchedule = outgoingTalks.find(
          (record) => record.id === schedule_id
        );

        outgoingSchedule.updatedAt = new Date().toISOString();
        outgoingSchedule.opening_song = value;

        await dbSchedUpdate(week, {
          'weekend_meeting.outgoing_talks': outgoingTalks,
        });
      }
    }
  };

  useEffect(() => {
    setSelectedSong(initialValue);
  }, [initialValue]);

  return { songTitle, songs, selectedSong, handleSongChange, sourceLang };
};

export default useSongSource;
