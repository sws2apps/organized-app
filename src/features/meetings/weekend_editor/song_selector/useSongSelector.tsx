import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { SongSelectorProps } from './index.types';
import { schedulesState } from '@states/schedules';
import { JWLangState, userDataViewState } from '@states/settings';
import { sourcesState } from '@states/sources';
import { visitingSpeakersActiveState } from '@states/visiting_speakers';
import { songsState } from '@states/songs';
import { sourcesSongConclude } from '@services/app/sources';
import { dbSourcesUpdate } from '@services/dexie/sources';
import { dbSchedUpdate } from '@services/dexie/schedules';

const useSongSelector = ({ onClose, week, schedule_id }: SongSelectorProps) => {
  const schedules = useRecoilValue(schedulesState);
  const sources = useRecoilValue(sourcesState);
  const dataView = useRecoilValue(userDataViewState);
  const speakers = useRecoilValue(visitingSpeakersActiveState);
  const songs = useRecoilValue(songsState);
  const lang = useRecoilValue(JWLangState);

  const [selectorOpen, setSelectorOpen] = useState(false);
  const [options, setOptions] = useState<number[]>([]);
  const [selected, setSelected] = useState('');

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const source = useMemo(() => {
    return sources.find((record) => record.weekOf === week);
  }, [sources, week]);

  const outgoing_talk = useMemo(() => {
    if (!schedule_id) return;

    return schedule.weekend_meeting.outgoing_talks.find(
      (record) => record.id === schedule_id
    );
  }, [schedule, schedule_id]);

  const talk = useMemo(() => {
    if (!schedule_id) {
      if (!source) return;

      const talkData = source.weekend_meeting.public_talk.find(
        (record) => record.type === dataView
      );

      return talkData.value as number;
    }

    if (!outgoing_talk) return;

    return outgoing_talk.public_talk;
  }, [source, dataView, outgoing_talk, schedule_id]);

  const song = useMemo(() => {
    if (!schedule_id) {
      if (!source) return '';

      const songData = source.weekend_meeting.song_first.find(
        (record) => record.type === dataView
      );

      return songData.value;
    }

    if (!outgoing_talk) return;

    return outgoing_talk.opening_song;
  }, [source, dataView, outgoing_talk, schedule_id]);

  const speaker = useMemo(() => {
    if (!schedule_id) {
      if (!schedule) return '';

      const speakerData = schedule.weekend_meeting.speaker.part_1.find(
        (record) => record.type === dataView
      );

      return speakerData.value;
    }

    if (!outgoing_talk) return '';

    return outgoing_talk.speaker;
  }, [schedule, dataView, outgoing_talk, schedule_id]);

  const songsOptions = useMemo(() => {
    return songs.filter((record) => options.includes(record.song_number));
  }, [songs, options]);

  const handleClose = () => {
    setSelectorOpen(false);
    onClose();
  };

  const handleSelectSong = (song: string) => {
    setSelected(song);
  };

  const isSongDisabled = (song: number) => {
    const songMiddle = source.weekend_meeting.song_middle[lang];

    const songConclude = sourcesSongConclude({
      dataView,
      lang,
      meeting: 'weekend',
      source,
    });

    const value = song.toString();

    return value === songMiddle || value === songConclude;
  };

  const handleAddSong = async () => {
    if (selected.length === 0) return;

    if (!schedule_id) {
      const song = structuredClone(source.weekend_meeting.song_first);

      let data = song.find((record) => record.type === dataView);

      if (!data) {
        song.push({ type: dataView, updatedAt: '', value: '' });
        data = song.find((record) => record.type === dataView);
      }

      data.updatedAt = new Date().toISOString();
      data.value = selected.toString();

      await dbSourcesUpdate(week, { 'weekend_meeting.song_first': song });
    }

    if (schedule_id) {
      const outgoingTalks = structuredClone(
        schedule.weekend_meeting.outgoing_talks
      );

      const outgoingSchedule = outgoingTalks.find(
        (record) => record.id === schedule_id
      );

      outgoingSchedule.opening_song = selected.toString();
      outgoingSchedule.updatedAt = new Date().toISOString();

      await dbSchedUpdate(week, {
        'weekend_meeting.outgoing_talks': outgoingTalks,
      });
    }

    onClose();
  };

  useEffect(() => {
    const load = () => {
      if (song.length > 0 || speaker.length === 0) return onClose();

      const talkData = speakers.find(
        (record) =>
          record.person_uid === speaker &&
          record.speaker_data.talks.some(
            (t) => t.talk_number === talk && t._deleted === false
          )
      );

      if (!talkData) return onClose();

      const songsData = talkData.speaker_data.talks.find(
        (record) => record.talk_number === talk && record._deleted === false
      ).talk_songs;

      if (songsData.length === 0) return onClose();

      setOptions(songsData);
      setSelectorOpen(true);
    };

    load();
  }, [talk, song, speaker, speakers, onClose]);

  return {
    selectorOpen,
    handleClose,
    songsOptions,
    handleSelectSong,
    selected,
    isSongDisabled,
    handleAddSong,
  };
};

export default useSongSelector;
