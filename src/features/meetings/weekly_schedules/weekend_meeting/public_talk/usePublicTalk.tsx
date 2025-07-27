import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { schedulesState } from '@states/schedules';
import { settingsState } from '@states/settings';
import { Week } from '@definition/week_type';
import { sourcesState } from '@states/sources';
import { publicTalksState } from '@states/public_talks';
import { copyToClipboard } from '@utils/common';
import { displaySnackNotification } from '@services/states/app';
import { WEEKEND_WITH_TALKS_NOCO } from '@constants/index';
import { PublicTalkProps } from './index.types';
import { PublicTalkLocaleType } from '@definition/public_talks';

const usePublicTalk = ({ week, dataView }: PublicTalkProps) => {
  const { t } = useAppTranslation();

  const schedules = useAtomValue(schedulesState);
  const sources = useAtomValue(sourcesState);
  const settings = useAtomValue(settingsState);
  const publicTalksAll = useAtomValue(publicTalksState);

  const lang = useMemo(() => {
    return (
      settings.cong_settings.source_material.language.find(
        (record) => record.type === dataView
      )?.value ?? 'E'
    );
  }, [settings, dataView]);

  const publicTalks = useMemo(() => {
    return publicTalksAll.map((talk) => {
      return {
        talk_number: talk.talk_number,
        talk_title: talk.talk_title[lang] ?? '',
      } as PublicTalkLocaleType;
    });
  }, [lang, publicTalksAll]);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const source = useMemo(() => {
    return sources.find((record) => record.weekOf === week);
  }, [sources, week]);

  const weekType = useMemo(() => {
    if (!schedule) return Week.NORMAL;

    return (
      schedule.weekend_meeting?.week_type.find(
        (record) => record.type === dataView
      )?.value ?? Week.NORMAL
    );
  }, [schedule, dataView]);

  const talkTitle = useMemo(() => {
    if (!source) return;

    if (WEEKEND_WITH_TALKS_NOCO.includes(weekType)) {
      const talk =
        source.weekend_meeting.public_talk.find(
          (record) => record.type === dataView
        )?.value ?? '';

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

    displaySnackNotification({
      header: t('tr_textCopied'),
      message: talkTitle,
      severity: 'success',
    });
  };

  return { showSecondSpeaker, talkTitle, handleCopyTalk };
};

export default usePublicTalk;
