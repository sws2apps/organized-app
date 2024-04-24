import { useRecoilValue } from 'recoil';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { publicTalksState } from '@states/publicTalks';
import { dbVisitingSpeakersLocalCongSpeakerUpdate } from '@services/dexie/visiting_speakers';

const useTalksSongs = (speaker: VisitingSpeakerType) => {
  const publicTalks = useRecoilValue(publicTalksState);

  const talks = speaker.talks
    .filter((record) => record._deleted === null)
    .map((record) => {
      const talk = publicTalks.find((item) => item.talk_number === record.talk_number);
      const songs = structuredClone(record.talk_songs).sort((a, b) => (a < b ? -1 : 1));

      return { talk, songs };
    });

  const handleSongsTalkUpdate = async (talk_number: number, songs: number[]) => {
    const talks = structuredClone(speaker.talks);
    const findTalk = talks.find((record) => record.talk_number === talk_number);
    findTalk.talk_songs = songs;
    findTalk.updatedAt = new Date().toISOString();

    await dbVisitingSpeakersLocalCongSpeakerUpdate({ talks }, speaker.person_uid);
  };

  const handleSongsTalkDelete = async (talk_number: number, song: number) => {
    const talks = structuredClone(speaker.talks);
    const findTalk = talks.find((record) => record.talk_number === talk_number);
    findTalk.talk_songs = findTalk.talk_songs.filter((record) => record !== song);
    findTalk.updatedAt = new Date().toISOString();

    await dbVisitingSpeakersLocalCongSpeakerUpdate({ talks }, speaker.person_uid);
  };

  return { talks, handleSongsTalkUpdate, handleSongsTalkDelete };
};

export default useTalksSongs;
