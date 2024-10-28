import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { SongSelectorProps } from './index.types';
import { schedulesState } from '@states/schedules';
import { userDataViewState } from '@states/settings';
import { sourcesState } from '@states/sources';
import { visitingSpeakersActiveState } from '@states/visiting_speakers';

const useSongSelector = ({ onClose, week }: SongSelectorProps) => {
  const schedules = useRecoilValue(schedulesState);
  const sources = useRecoilValue(sourcesState);
  const dataView = useRecoilValue(userDataViewState);
  const speakers = useRecoilValue(visitingSpeakersActiveState);

  const [selectorOpen, setSelectorOpen] = useState(false);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const source = useMemo(() => {
    return sources.find((record) => record.weekOf === week);
  }, [sources, week]);

  const talk = useMemo(() => {
    if (!source) return;

    const talkData = source.weekend_meeting.public_talk.find(
      (record) => record.type === dataView
    );

    return talkData.value as number;
  }, [source, dataView]);

  const song = useMemo(() => {
    if (!source) return '';

    const songData = source.weekend_meeting.song_first.find(
      (record) => record.type === dataView
    );

    return songData.value;
  }, [source, dataView]);

  const speaker = useMemo(() => {
    if (!schedule) return '';

    const speakerData = schedule.weekend_meeting.speaker.part_1.find(
      (record) => record.type === dataView
    );
    return speakerData.value;
  }, [schedule, dataView]);

  const handleClose = () => {
    setSelectorOpen(false);
    onClose();
  };

  useEffect(() => {
    const load = () => {
      if (song.length > 0 || speaker.length === 0) return onClose();

      const speakerData = speakers.find(
        (record) => record.person_uid === speaker
      );

      console.log(speakerData);
    };

    load();
  }, [talk, song, speaker, speakers]);

  return { selectorOpen, handleClose };
};

export default useSongSelector;
