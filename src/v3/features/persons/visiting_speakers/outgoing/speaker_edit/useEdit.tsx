import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { personsActiveState } from '@states/persons';
import { AssignmentCode } from '@definition/assignment';
import {
  dbVisitingSpeakersLocalCongSpeakerUpdate,
  dbVistingSpeakersLocalCongSpeakerDelete,
} from '@services/dexie/visiting_speakers';
import { publicTalksState } from '@states/public_talks';
import { PublicTalkType } from '@definition/public_talks';
import { outgoingSpeakersState } from '@states/visiting_speakers';
import { VisitingSpeakerType } from '@definition/visiting_speakers';

const useEdit = (speaker: VisitingSpeakerType) => {
  const activePersons = useRecoilValue(personsActiveState);
  const publicTalks = useRecoilValue(publicTalksState);
  const outgoingSpeakers = useRecoilValue(outgoingSpeakersState);

  const [openSongAdd, setOpenSongAdd] = useState(false);
  const [addedTalk, setAddedTalk] = useState({} as PublicTalkType);
  const [selectedSongs, setSelectedSongs] = useState<number[]>([]);
  const [openSpeakerDetails, setOpenSpeakerDetails] = useState(false);

  const speakers = activePersons.filter((record) =>
    record.assignments.find(
      (assignment) => assignment._deleted === null && assignment.code === AssignmentCode.WM_Speaker
    )
  );

  const speakersOnRecord = speakers.filter((record) =>
    outgoingSpeakers.find((speaker) => speaker.person_uid === record.person_uid) ? false : true
  );

  const selectedSpeaker = speakers.find((record) => record.person_uid === speaker.person_uid)?.person_uid || '';

  const selectedTalks =
    outgoingSpeakers
      .find((record) => record.person_uid === speaker.person_uid)
      ?.talks.filter((record) => record._deleted === null)
      .map((record) => {
        const talk = publicTalks.find((item) => item.talk_number === record.talk_number);
        return talk;
      }) || [];

  const handleChangeSpeaker = async (value: string) => {
    await dbVisitingSpeakersLocalCongSpeakerUpdate({ person_uid: value }, speaker.person_uid);
  };

  const handleDeleteSpeaker = async (person_uid: string) => {
    await dbVistingSpeakersLocalCongSpeakerDelete(person_uid);
  };

  const handleTalksUpdate = async (value: PublicTalkType[]) => {
    const talks = structuredClone(speaker.talks);

    for (const selectedTalk of value) {
      const findTalk = talks.find((record) => record.talk_number === selectedTalk.talk_number);

      if (findTalk && findTalk._deleted !== null) {
        findTalk._deleted = null;
        findTalk.updatedAt = new Date().toISOString();
        setAddedTalk(selectedTalk);
        setSelectedSongs([]);
      }

      if (!findTalk) {
        talks.push({
          _deleted: null,
          talk_number: selectedTalk.talk_number,
          talk_songs: [],
          updatedAt: new Date().toISOString(),
        });
        setAddedTalk(selectedTalk);
        setSelectedSongs([]);
      }
    }

    talks.sort((a, b) => (a.talk_number > b.talk_number ? 1 : -1));

    await dbVisitingSpeakersLocalCongSpeakerUpdate({ talks }, speaker.person_uid);
    setOpenSongAdd(true);
  };

  const handleTalksDelete = async (talk_number: number) => {
    const talks = structuredClone(speaker.talks);

    const talk = talks.find((record) => record.talk_number === talk_number);
    talk._deleted = new Date().toISOString();

    await dbVisitingSpeakersLocalCongSpeakerUpdate({ talks }, speaker.person_uid);
  };

  const handleSongsTalkUpdate = async (talk_number: number, songs: number[]) => {
    setSelectedSongs(songs);

    const talks = structuredClone(speaker.talks);
    const findTalk = talks.find((record) => record.talk_number === talk_number);
    findTalk.talk_songs = songs;
    findTalk.updatedAt = new Date().toISOString();

    await dbVisitingSpeakersLocalCongSpeakerUpdate({ talks }, speaker.person_uid);
  };

  const handleSongsTalkDelete = async (talk_number: number, song: number) => {
    setSelectedSongs((prev) => prev.filter((record) => record !== song));

    const talks = structuredClone(speaker.talks);
    const findTalk = talks.find((record) => record.talk_number === talk_number);
    findTalk.talk_songs = findTalk.talk_songs.filter((record) => record !== song);
    findTalk.updatedAt = new Date().toISOString();

    await dbVisitingSpeakersLocalCongSpeakerUpdate({ talks }, speaker.person_uid);
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
  };
};

export default useEdit;
