import { useEffect, useMemo, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { publicTalksLocaleState } from '@states/public_talks';
import { sourcesState } from '@states/sources';
import { userDataViewState } from '@states/settings';
import { dbSourcesUpdate } from '@services/dexie/sources';
import {
  incomingSpeakersState,
  myCongSpeakersState,
} from '@states/visiting_speakers';
import { PublicTalkOptionType } from './index.types';
import {
  outgoingSongSelectorOpenState,
  schedulesState,
  weekendSongSelectorOpenState,
} from '@states/schedules';
import { dbSchedUpdate } from '@services/dexie/schedules';

const usePublicTalkSelector = (week: string, schedule_id?: string) => {
  const setLocalSongSelectorOpen = useSetAtom(weekendSongSelectorOpenState);

  const setOutgoingSongSelectorOpen = useSetAtom(outgoingSongSelectorOpenState);

  const talksData = useAtomValue(publicTalksLocaleState);
  const sources = useAtomValue(sourcesState);
  const dataView = useAtomValue(userDataViewState);
  const incomingSpeakers = useAtomValue(incomingSpeakersState);
  const localSpeakers = useAtomValue(myCongSpeakersState);
  const schedules = useAtomValue(schedulesState);

  const [selectedTalk, setSelectedTalk] = useState<PublicTalkOptionType>(null);
  const [openCatalog, setOpenCatalog] = useState(false);

  const source = sources.find((record) => record.weekOf === week);
  const schedule = schedules.find((record) => record.weekOf === week);

  const talks = useMemo(() => {
    const data: PublicTalkOptionType[] = [];

    if (!schedule) return data;

    if (!schedule_id) {
      // get assigned speaker
      const talkType =
        schedule.weekend_meeting.public_talk_type.find(
          (record) => record.type === dataView
        )?.value || 'localSpeaker';

      const speaker =
        schedule.weekend_meeting.speaker.part_1.find(
          (record) => record.type === dataView
        )?.value || '';

      const speakers =
        talkType === 'localSpeaker' ? localSpeakers : incomingSpeakers;

      for (const talk of talksData) {
        const cnSpeakers = speakers.filter((record) =>
          record.speaker_data.talks.find(
            (item) => item.talk_number === talk.talk_number
          )
        );

        if (talkType !== 'visitingSpeaker') {
          data.push({ ...talk, speakers: cnSpeakers.length });
        }

        if (talkType === 'visitingSpeaker') {
          const visitingSpeaker = speakers.find(
            (item) =>
              item._deleted.value === false && item.person_uid === speaker
          );
          const talkFound = visitingSpeaker?.speaker_data.talks.find(
            (item) => item.talk_number === talk.talk_number
          );

          if (speaker.length === 0 || !visitingSpeaker || talkFound) {
            data.push({ ...talk, speakers: cnSpeakers.length });
          }
        }
      }
    }

    if (schedule_id) {
      const outgoingSchedule = schedule.weekend_meeting.outgoing_talks.find(
        (record) => record.id === schedule_id
      );

      const speaker = outgoingSchedule.value;

      for (const talk of talksData) {
        const cnSpeakers = localSpeakers.filter((record) =>
          record.speaker_data.talks.find(
            (item) => item.talk_number === talk.talk_number
          )
        );

        const visitingSpeaker = localSpeakers.find(
          (item) => item._deleted.value === false && item.person_uid === speaker
        );
        const talkFound = visitingSpeaker?.speaker_data.talks.find(
          (item) => item.talk_number === talk.talk_number
        );

        if (speaker.length === 0 || talkFound) {
          data.push({ ...talk, speakers: cnSpeakers.length });
        }
      }
    }

    return data;
  }, [
    talksData,
    localSpeakers,
    schedule,
    dataView,
    incomingSpeakers,
    schedule_id,
  ]);

  const handleOpenCatalog = () => setOpenCatalog(true);

  const handleCloseCatalog = () => setOpenCatalog(false);

  const handleTalkChange = async (talk: PublicTalkOptionType) => {
    const value = talk?.talk_number;

    if (!schedule_id) {
      const talkData = structuredClone(source.weekend_meeting.public_talk);

      let data = talkData.find((record) => record.type === dataView);

      if (!data) {
        talkData.push({ type: dataView, updatedAt: '', value: '' });

        data = talkData.find((record) => record.type === dataView);
      }

      data.updatedAt = new Date().toISOString();
      data.value = value;

      await dbSourcesUpdate(week, {
        'weekend_meeting.public_talk': talkData,
      });

      setLocalSongSelectorOpen(true);
    }

    if (schedule_id) {
      const outgoingTalks = structuredClone(
        schedule.weekend_meeting.outgoing_talks
      );

      const outgoingSchedule = outgoingTalks.find(
        (record) => record.id === schedule_id
      );

      outgoingSchedule.updatedAt = new Date().toISOString();
      outgoingSchedule.public_talk = value;

      await dbSchedUpdate(week, {
        'weekend_meeting.outgoing_talks': outgoingTalks,
      });

      setOutgoingSongSelectorOpen(true);
    }
  };

  useEffect(() => {
    setSelectedTalk(null);

    if (source && !schedule_id) {
      const talk = source.weekend_meeting.public_talk.find(
        (record) => record.type === dataView
      )?.value as number;

      if (talk) {
        const selectedTalk = talks.find(
          (record) => record.talk_number === talk
        );
        setSelectedTalk(selectedTalk);
      }
    }

    if (schedule_id) {
      const outgoingSchedule = schedule.weekend_meeting.outgoing_talks.find(
        (record) => record.id === schedule_id
      );

      if (outgoingSchedule?.public_talk) {
        const selectedTalk = talks.find(
          (record) => record.talk_number === outgoingSchedule.public_talk
        );
        setSelectedTalk(selectedTalk);
      }
    }
  }, [source, dataView, talks, schedule, schedule_id]);

  return {
    talks,
    selectedTalk,
    handleTalkChange,
    openCatalog,
    handleOpenCatalog,
    handleCloseCatalog,
  };
};

export default usePublicTalkSelector;
