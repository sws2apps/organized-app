import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { personsActiveState } from '@states/persons';
import { AssignmentCode } from '@definition/assignment';
import {
  dbVisitingSpeakersUpdate,
  dbVisitingSpeakersDelete,
} from '@services/dexie/visiting_speakers';
import { publicTalksState } from '@states/public_talks';
import { PublicTalkType } from '@definition/public_talks';
import { myCongSpeakersState } from '@states/visiting_speakers';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { fullnameOptionState } from '@states/settings';
import { SongType } from '@definition/songs';

const useEdit = (speaker: VisitingSpeakerType) => {
  const activePersons = useRecoilValue(personsActiveState);
  const publicTalks = useRecoilValue(publicTalksState);
  const outgoingSpeakers = useRecoilValue(myCongSpeakersState);
  const fullnameOption = useRecoilValue(fullnameOptionState);

  const [openSongAdd, setOpenSongAdd] = useState(false);
  const [addedTalk, setAddedTalk] = useState({} as PublicTalkType);
  const [selectedSongs, setSelectedSongs] = useState<number[]>([]);
  const [openSpeakerDetails, setOpenSpeakerDetails] = useState(false);

  const speakers = activePersons.filter((record) =>
    record.person_data.assignments.find(
      (assignment) =>
        assignment._deleted === false &&
        assignment.code === AssignmentCode.WM_Speaker
    )
  );

  const speakersOnRecord = speakers.filter((record) =>
    outgoingSpeakers.find((speaker) => speaker.person_uid === record.person_uid)
      ? false
      : true
  );

  const selectedSpeaker =
    speakers.find((record) => record.person_uid === speaker.person_uid)
      ?.person_uid || '';

  const selectedTalks =
    outgoingSpeakers
      .find((record) => record.person_uid === speaker.person_uid)
      ?.speaker_data.talks.filter((record) => record._deleted === false)
      .map((record) => {
        const talk = publicTalks.find(
          (item) => item.talk_number === record.talk_number
        );
        return talk;
      }) || [];

  const handleChangeSpeaker = async (value: string) => {
    await dbVisitingSpeakersUpdate({ person_uid: value }, speaker.person_uid);
  };

  const handleDeleteSpeaker = async (person_uid: string) => {
    await dbVisitingSpeakersDelete(person_uid);
  };

  const handleTalksUpdate = async (value: PublicTalkType[]) => {
    const talks = structuredClone(speaker.speaker_data.talks);

    for (const selectedTalk of value) {
      const findTalk = talks.find(
        (record) => record.talk_number === selectedTalk.talk_number
      );

      if (findTalk && findTalk._deleted !== null) {
        findTalk._deleted = false;
        findTalk.updatedAt = new Date().toISOString();
        setAddedTalk(selectedTalk);
        setSelectedSongs([]);
      }

      if (!findTalk) {
        talks.push({
          _deleted: false,
          talk_number: selectedTalk.talk_number,
          talk_songs: [],
          updatedAt: new Date().toISOString(),
        });
        setAddedTalk(selectedTalk);
        setSelectedSongs([]);
      }
    }

    talks.sort((a, b) => (a.talk_number > b.talk_number ? 1 : -1));

    await dbVisitingSpeakersUpdate(
      { 'speaker_data.talks': talks },
      speaker.person_uid
    );
    setOpenSongAdd(true);
  };

  const handleTalksDelete = async (talk_number: number) => {
    const talks = structuredClone(speaker.speaker_data.talks);

    const talk = talks.find((record) => record.talk_number === talk_number);
    talk._deleted = true;
    talk.updatedAt = new Date().toISOString();

    await dbVisitingSpeakersUpdate(
      { 'speaker_data.talks': talks },
      speaker.person_uid
    );
  };

  const handleSongsTalkUpdate = async (
    talk_number: number,
    songs: SongType[]
  ) => {
    const songsSelected = songs.map((record) => record.song_number);
    setSelectedSongs(songsSelected);

    const talks = structuredClone(speaker.speaker_data.talks);
    const findTalk = talks.find((record) => record.talk_number === talk_number);
    findTalk.talk_songs = songsSelected;
    findTalk.updatedAt = new Date().toISOString();

    await dbVisitingSpeakersUpdate(
      { 'speaker_data.talks': talks },
      speaker.person_uid
    );
  };

  const handleSongsTalkDelete = async (talk_number: number, song: number) => {
    setSelectedSongs((prev) => prev.filter((record) => record !== song));

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

  const handleCloseSongAdd = () => setOpenSongAdd(false);

  const handleOpenSpeakerDetails = () => setOpenSpeakerDetails(true);

  const handleCloseSpeakerDetails = () => setOpenSpeakerDetails(false);

  return {
    speakers,
    handleChangeSpeaker,
    handleDeleteSpeaker,
    selectedSpeaker,
    publicTalks,
    selectedTalks,
    handleTalksUpdate,
    handleTalksDelete,
    addedTalk,
    openSongAdd,
    handleCloseSongAdd,
    handleSongsTalkUpdate,
    selectedSongs,
    handleSongsTalkDelete,
    handleOpenSpeakerDetails,
    openSpeakerDetails,
    handleCloseSpeakerDetails,
    speakersOnRecord,
    fullnameOption,
  };
};

export default useEdit;
