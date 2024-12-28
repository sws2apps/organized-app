import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { sourcesState } from '@states/sources';
import { SongSourceType } from './index.types';
import { songsState } from '@states/songs';
import { useAppTranslation } from '@hooks/index';
import {
  JWLangLocaleState,
  JWLangState,
  userDataViewState,
} from '@states/settings';
import { SongType } from '@definition/songs';
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

  const sources = useRecoilValue(sourcesState);
  const songs = useRecoilValue(songsState);
  const lang = useRecoilValue(JWLangState);
  const dataView = useRecoilValue(userDataViewState);
  const schedules = useRecoilValue(schedulesState);
  const sourceLang = useRecoilValue(JWLangLocaleState);

  const [songTitle, setSongTitle] = useState('');
  const [selectedSong, setSelectedSong] = useState<SongType>(null);

  const songLocale = t('tr_song', { lng: sourceLang });

  const source = sources.find((record) => record.weekOf === week);
  const schedule = schedules.find((record) => record.weekOf === week);

  const handleSongChange = async (song: SongType) => {
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
    if (source) {
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

      const title = songs.find((record) => record.song_number === +song);
      const result = title ? `${songLocale} ${title.song_title}` : song;

      setSongTitle(result as string);
      setSelectedSong(title ? title : null);
    }
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

  return { songTitle, songs, selectedSong, handleSongChange, sourceLang };
};

export default useSongSource;
