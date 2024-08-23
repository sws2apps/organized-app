import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { schedulesState } from '@states/schedules';
import { userDataViewState } from '@states/settings';
import { Week } from '@definition/week_type';
import { sourcesState } from '@states/sources';
import { publicTalksState } from '@states/public_talks';
import { copyToClipboard } from '@utils/common';
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation } from '@hooks/index';

const usePublicTalk = (week: string) => {
  const { t } = useAppTranslation();

  const schedules = useRecoilValue(schedulesState);
  const sources = useRecoilValue(sourcesState);
  const dataView = useRecoilValue(userDataViewState);
  const publicTalks = useRecoilValue(publicTalksState);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const source = useMemo(() => {
    return sources.find((record) => record.weekOf === week);
  }, [sources, week]);

  const weekType = useMemo(() => {
    if (!schedule) return Week.NORMAL;

    const type = schedule.midweek_meeting.week_type.find(
      (record) => record.type === dataView
    );

    return type?.value || Week.NORMAL;
  }, [schedule, dataView]);

  const talkTitle = useMemo(() => {
    if (!source) return;

    if (weekType === Week.NORMAL) {
      const talk = source.weekend_meeting.public_talk.find(
        (record) => record.type === dataView
      ).value;

      if (typeof talk === 'string') {
        return talk;
      }

      const foundTalk = publicTalks.find(
        (record) => record.talk_number === talk
      );
      return foundTalk?.talk_title;
    }

    if (weekType === Week.CO_VISIT) {
      return source.weekend_meeting.co_talk_title.public.src;
    }
  }, [source, dataView, weekType, publicTalks]);

  const showSecondSpeaker = useMemo(() => {
    if (!schedule) return false;

    const speaker2 = schedule.weekend_meeting.speaker.part_2.find(
      (record) => record.type === dataView
    );

    if (speaker2?.value.length > 0) {
      return true;
    }

    return false;
  }, [schedule, dataView]);

  const handleCopyTalk = async () => {
    await copyToClipboard(talkTitle);

    await displaySnackNotification({
      header: t('tr_textCopied'),
      message: talkTitle,
      severity: 'success',
    });
  };

  return { showSecondSpeaker, talkTitle, handleCopyTalk };
};

export default usePublicTalk;
