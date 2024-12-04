import { sourceSchema } from '../../../services/dexie/schema';

import appDb from '../../db';

const isMondayDate = (date) => {
  const inputDate = new Date(date);
  const dayOfWeek = inputDate.getDay();

  return dayOfWeek === 1;
};

const useSourcesMigrate = () => {
  const handleMigrateSources = async () => {
    const lang = (localStorage.getItem('app_lang') || 'e').toUpperCase();

    const oldSources = await appDb.sources.toArray();
    const schedules = await appDb.sched.toArray();

    const sources = [];

    for (const record of oldSources) {
      const isMonday = isMondayDate(record.weekOf);

      if (!isMonday) continue;

      if (!record.mwb_week_date_locale) return;

      const obj = structuredClone(sourceSchema);

      const schedule = schedules.find((s) => s.weekOf === record.weekOf);

      obj.weekOf = record.weekOf;

      obj.midweek_meeting.week_date_locale = record.mwb_week_date_locale;

      obj.midweek_meeting.weekly_bible_reading =
        record.mwb_weekly_bible_reading;

      obj.midweek_meeting.song_first = {
        [lang]: String(record.mwb_song_first),
      };

      obj.midweek_meeting.tgw_talk = {
        src: record.mwb_tgw_talk,
        time: { default: 10, override: [] },
      };

      obj.midweek_meeting.tgw_gems = {
        src: { [lang]: '' },
        time: { default: 10, override: [] },
      };

      obj.midweek_meeting.tgw_bible_reading = {
        src: record.mwb_tgw_bread,
        title: { [lang]: '' },
      };

      obj.midweek_meeting.ayf_count = { [lang]: record.mwb_ayf_count };

      obj.midweek_meeting.ayf_part1 = {
        type: record.mwb_ayf_part1_type,
        time: { [lang]: record.mwb_ayf_part1_time },
        src: record.mwb_ayf_part1,
        title: { [lang]: '' },
      };

      obj.midweek_meeting.ayf_part2 = {
        type: record.mwb_ayf_part2_type,
        time: { [lang]: record.mwb_ayf_part2_time },
        src: record.mwb_ayf_part2,
        title: { [lang]: '' },
      };

      obj.midweek_meeting.ayf_part3 = {
        type: record.mwb_ayf_part3_type,
        time: { [lang]: record.mwb_ayf_part3_time },
        src: record.mwb_ayf_part3,
        title: { [lang]: '' },
      };

      obj.midweek_meeting.ayf_part4 = {
        type: record.mwb_ayf_part4_type,
        time: { [lang]: record.mwb_ayf_part4_time },
        src: record.mwb_ayf_part4,
        title: { [lang]: '' },
      };

      obj.midweek_meeting.song_middle = {
        [lang]: String(record.mwb_song_middle),
      };

      obj.midweek_meeting.lc_count = {
        default: { [lang]: record.mwb_lc_count },
        override: [
          {
            type: 'main',
            value: record.mwb_lc_count_override,
            updatedAt: new Date().toISOString(),
          },
        ],
      };

      obj.midweek_meeting.lc_part1 = {
        time: {
          default: { [lang]: record.mwb_lc_part1_time },
          override: [
            {
              type: 'main',
              value: record.mwb_lc_part1_time_override,
              updatedAt: new Date().toISOString(),
            },
          ],
        },
        title: {
          default: record.mwb_lc_part1,
          override: [
            {
              type: 'main',
              value: record.mwb_lc_part1_override?.[lang] ?? '',
              updatedAt: new Date().toISOString(),
            },
          ],
        },
        desc: {
          default: record.mwb_lc_part1_content,
          override: [
            {
              type: 'main',
              value: record.mwb_lc_part1_content_override?.[lang] ?? '',
              updatedAt: new Date().toISOString(),
            },
          ],
        },
      };

      obj.midweek_meeting.lc_part2 = {
        time: {
          default: { [lang]: record.mwb_lc_part2_time },
          override: [
            {
              type: 'main',
              value: record.mwb_lc_part2_time_override,
              updatedAt: new Date().toISOString(),
            },
          ],
        },
        title: {
          default: record.mwb_lc_part2,
          override: [
            {
              type: 'main',
              value: record.mwb_lc_part2_override?.[lang] ?? '',
              updatedAt: new Date().toISOString(),
            },
          ],
        },
        desc: {
          default: record.mwb_lc_part2_content,
          override: [
            {
              type: 'main',
              value: record.mwb_lc_part2_content_override?.[lang] ?? '',
              updatedAt: new Date().toISOString(),
            },
          ],
        },
      };

      obj.midweek_meeting.lc_cbs = {
        title: { default: { [lang]: '' }, override: [] },
        time: {
          default: 30,
          override: [
            {
              type: 'main',
              value: +(record.mwb_lc_cbs_time_override || ''),
              updatedAt: new Date().toISOString(),
            },
          ],
        },
        src: record.mwb_lc_cbs,
      };

      obj.midweek_meeting.co_talk_title = {
        src: record.mwb_co_talk_title || '',
        updatedAt: new Date().toISOString(),
      };

      obj.midweek_meeting.song_conclude = {
        default: { [lang]: String(record.mwb_song_conclude) },
        override: [
          {
            type: 'main',
            value: String(record.mwb_song_conclude_override || ''),
            updatedAt: new Date().toISOString(),
          },
        ],
      };

      const talk = schedule.public_talk || record.w_talk_title_override || '';

      obj.weekend_meeting.public_talk = [
        {
          type: 'main',
          value: talk,
          updatedAt: new Date().toISOString(),
        },
      ];

      obj.weekend_meeting.co_talk_title.public = {
        src: record.w_co_talk_title || '',
        updatedAt: new Date().toISOString(),
      };

      obj.weekend_meeting.song_middle = {
        [lang]: String(record.w_study_opening_song),
      };

      obj.weekend_meeting.w_study = record.w_study_title;

      obj.weekend_meeting.song_conclude = {
        default: { [lang]: String(record.w_study_concluding_song) },
        override: [],
      };

      sources.push(obj);
    }

    return sources;
  };

  return { handleMigrateSources };
};

export default useSourcesMigrate;
