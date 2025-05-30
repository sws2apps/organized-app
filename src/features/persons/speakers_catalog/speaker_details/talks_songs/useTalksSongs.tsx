import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { publicTalksLocaleState } from '@states/public_talks';
import { dbVisitingSpeakersUpdate } from '@services/dexie/visiting_speakers';
import { speakersCongregationsState } from '@states/speakers_congregations';
import { SongType } from '@definition/songs';

const useTalksSongs = (speaker: VisitingSpeakerType) => {
  const publicTalks = useAtomValue(publicTalksLocaleState);
  const congregations = useAtomValue(speakersCongregationsState);

  const [isEdit, setIsEdit] = useState(false);

  const congregation = congregations.find(
    (record) => record.id === speaker.speaker_data.cong_id
  );

  const talks = speaker.speaker_data.talks
    .filter((record) => record._deleted === false)
    .map((record) => {
      const talk = publicTalks.find(
        (item) => item.talk_number === record.talk_number
      );

      const songs = structuredClone(record.talk_songs).sort((a, b) =>
        a < b ? -1 : 1
      );

      return { talk, songs };
    });

  const handleToggleEdit = () => setIsEdit((prev) => !prev);

  const handleSongsTalkUpdate = async (
    talk_number: number,
    songs: SongType[]
  ) => {
    const talks = structuredClone(speaker.speaker_data.talks);
    const findTalk = talks.find((record) => record.talk_number === talk_number);
    findTalk.talk_songs = songs.map((record) => record.song_number);
    findTalk.updatedAt = new Date().toISOString();

    await dbVisitingSpeakersUpdate(
      { 'speaker_data.talks': talks },
      speaker.person_uid
    );
  };

  const handleSongsTalkDelete = async (talk_number: number, song: number) => {
    const talks = structuredClone(speaker.speaker_data.talks);
    const findTalk = talks.find((record) => record.talk_number === talk_number);
    findTalk.talk_songs = findTalk.talk_songs.filter(
      (record) => record !== song
    );
    findTalk.updatedAt = new Date().toISOString();

    await dbVisitingSpeakersUpdate(
      { 'speaker_data.talks': talks },
      speaker.person_uid
    );
  };

  return {
    talks,
    handleSongsTalkUpdate,
    handleSongsTalkDelete,
    handleToggleEdit,
    isEdit,
    cong_synced: congregation.cong_data.cong_id.length > 0,
  };
};

export default useTalksSongs;
