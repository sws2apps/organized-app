import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { sourcesState } from '@states/sources';
import { SongSourceType } from './index.types';
import { songsLocaleState } from '@states/songs';
import { useAppTranslation } from '@hooks/index';
import {
  JWLangLocaleState,
  JWLangState,
  userDataViewState,
} from '@states/settings';
import { SongLocaleType } from '@definition/songs';
import { sourcesSongConclude } from '@services/app/sources';
import { dbSourcesUpdate } from '@services/dexie/sources';
import { CongregationStringType } from '@definition/sources';
import { schedulesState } from '@states/schedules';
import { dbSchedUpdate } from '@services/dexie/schedules';

const useSongSource = ({
  meeting,
  type,
  week,
  schedule_id,
}: SongSourceType) => {
  const { t } = useAppTranslation();

  const sources = useAtomValue(sourcesState);
  const songs = useAtomValue(songsLocaleState);
  const lang = useAtomValue(JWLangState);
  const dataView = useAtomValue(userDataViewState);
  const schedules = useAtomValue(schedulesState);
  const sourceLang = useAtomValue(JWLangLocaleState);

  const songLocale = useMemo(() => {
    return t('tr_song', { lng: sourceLang });
  }, [t, sourceLang]);

  const source = useMemo(() => {
    return sources.find((record) => record.weekOf === week);
  }, [sources, week]);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const initialValues = useMemo(() => {
    const values: { title: string; song: SongLocaleType } = {
      title: '',
      song: null,
    };

    if (!source) return values;

    let song: string;

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
    values.title = findSong ? `${songLocale} ${findSong.song_title}` : song;

    values.song = findSong ?? null;

    return values;
  }, [
    meeting,
    songs,
    source,
    lang,
    type,
    songLocale,
    dataView,
    schedule,
    schedule_id,
  ]);

  const [songTitle, setSongTitle] = useState(initialValues.title);
  const [selectedSong, setSelectedSong] = useState(initialValues.song);

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
    setSongTitle(initialValues.title);
    setSelectedSong(initialValues.song);
  }, [initialValues]);

  return { songTitle, songs, selectedSong, handleSongChange, sourceLang };
};

export default useSongSource;
