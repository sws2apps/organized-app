import { promiseGetRecoil } from 'recoil-outside';
import { schedulesState } from '@states/schedules';
import { getWeekDate, getOldestWeekDate } from '@utils/date';
import { sourcesState } from '@states/sources';
import { formatDate } from '@services/dateformat';
import { appDb } from '.';
import { coordinatorRoleState, lmmoRoleState } from '@states/settings';
import { saveScheduleInfo } from './schedules';
import { assignmentTypeAYFOnlyState } from '@states/assignment';
import { sourceSchema } from '@services/dexie/schema';
import { SourceWeekIncomingType, SourceWeekLocaleType, SourceWeekType } from '@definition/sources';
import { JWLangState } from '@states/app';

export const removeSourcesOutdatedRecords = async () => {
  const oldestWeekDate = getOldestWeekDate();
  const oldDateFormat = formatDate(oldestWeekDate, 'yyyy/mm/dd');

  const schedules = await promiseGetRecoil(schedulesState);
  const oldSchedules = schedules.filter((schedule) => schedule.weekOf < oldDateFormat);
  for await (const schedule of oldSchedules) {
    await appDb.sched.delete(schedule.weekOf);
  }

  const sources = await promiseGetRecoil(sourcesState);
  const oldSources = sources.filter((source) => source.weekOf < oldDateFormat);
  for await (const source of oldSources) {
    await appDb.sources.delete(source.weekOf);
  }
};

export const sourcesHaveCurrentWeek = async () => {
  const sources = await promiseGetRecoil(sourcesState);

  const weekDate = getWeekDate();

  const fMonday = formatDate(weekDate, 'yyyy/mm/dd');
  const data = sources.find((source) => source.weekOf === fMonday);

  return data ? true : false;
};

export const sourcesAddWeekManually = async () => {
  const sources = await promiseGetRecoil(sourcesState);
  const schedules = await promiseGetRecoil(schedulesState);

  let weekDate;

  if (sources.length === 0) {
    weekDate = new Date();
  } else {
    sources.sort((a, b) => {
      return a.weekOf < b.weekOf ? 1 : -1;
    });

    const lastWeek = sources[0].weekOf;
    const day = lastWeek.split('/')[2];
    const month = lastWeek.split('/')[1];
    const year = lastWeek.split('/')[0];
    weekDate = new Date(year, month - 1, day);
    weekDate.setDate(weekDate.getDate() + 7);
  }

  const monDay = getWeekDate(weekDate);
  const fMonday = formatDate(monDay, 'yyyy/mm/dd');

  const foundSource = sources.find((source) => source.weekOf === fMonday);
  if (!foundSource) {
    await appDb.sources.put({ weekOf: fMonday });
  }

  const foundSchedule = schedules.find((schedule) => schedule.weekOf === fMonday);
  if (!foundSchedule) {
    await appDb.sched.put({ weekOf: fMonday });
  }
};

export const checkCurrentWeek = async () => {
  const isExist = await sourcesHaveCurrentWeek();

  if (!isExist) {
    await sourcesAddWeekManually();
  }
};

export const saveSource = async ({
  srcData,
  localOverride,
  forPocket,
}: {
  srcData: SourceWeekLocaleType;
  localOverride: boolean;
  forPocket?: boolean;
}) => {
  const JWLang = await promiseGetRecoil(JWLangState);
  const lmmoRole = await promiseGetRecoil(lmmoRoleState);
  const coordinatorRole = await promiseGetRecoil(coordinatorRoleState);
  const sources = await promiseGetRecoil(sourcesState);

  const source_lang = JWLang.toUpperCase();
  const isUpdateMidweek = !forPocket || (forPocket && !lmmoRole);
  const isUpdateWeekend = !forPocket || (forPocket && !coordinatorRole);

  const tmpSource = sources.find((s) => s.weekOf === srcData.weekOf);
  const model = structuredClone(sourceSchema);
  const source = <SourceWeekType>{};

  if (tmpSource) {
    const old = structuredClone(tmpSource);
    Object.assign(source, model, old);
  } else {
    Object.assign(source, model, { weekOf: srcData.weekOf });
  }

  if (isUpdateMidweek) {
    source.mwb_week_date_locale[source_lang] = srcData.mwb_week_date_locale || '';
    source.mwb_weekly_bible_reading[source_lang] = srcData.mwb_weekly_bible_reading || '';
    source.mwb_song_first = srcData.mwb_song_first || '';
    source.mwb_tgw_talk[source_lang] = srcData.mwb_tgw_talk || '';
    source.mwb_tgw_bread[source_lang] = srcData.mwb_tgw_bread || '';
    source.mwb_ayf_count = srcData.mwb_ayf_count || 1;
    source.mwb_ayf_part1_type[source_lang] = srcData.mwb_ayf_part1_type || '';
    source.mwb_ayf_part1_time = srcData.mwb_ayf_part1_time || '';
    source.mwb_ayf_part1[source_lang] = srcData.mwb_ayf_part1 || '';
    source.mwb_ayf_part2_type[source_lang] = srcData.mwb_ayf_part2_type || '';
    source.mwb_ayf_part2_time = srcData.mwb_ayf_part2_time || '';
    source.mwb_ayf_part2[source_lang] = srcData.mwb_ayf_part2 || '';
    source.mwb_ayf_part3_type[source_lang] = srcData.mwb_ayf_part3_type || '';
    source.mwb_ayf_part3_time = srcData.mwb_ayf_part3_time || '';
    source.mwb_ayf_part3[source_lang] = srcData.mwb_ayf_part3 || '';
    source.mwb_ayf_part4_type[source_lang] = srcData.mwb_ayf_part4_type || '';
    source.mwb_ayf_part4_time = srcData.mwb_ayf_part4_time || '';
    source.mwb_ayf_part4[source_lang] = srcData.mwb_ayf_part4 || '';
    source.mwb_song_middle = srcData.mwb_song_middle || '';
    source.mwb_lc_count = srcData.mwb_lc_count || 1;
    source.mwb_lc_count_override = localOverride ? source.mwb_lc_count_override : srcData.mwb_lc_count_override;
    source.mwb_lc_part1_time = srcData.mwb_lc_part1_time || '';
    source.mwb_lc_part1_time_override = localOverride
      ? source.mwb_lc_part1_time_override
      : srcData.mwb_lc_part1_time_override;
    source.mwb_lc_part1[source_lang] = srcData.mwb_lc_part1 || '';
    source.mwb_lc_part1_override[source_lang] = localOverride
      ? source.mwb_lc_part1_override[source_lang]
      : srcData.mwb_lc_part1_override;
    source.mwb_lc_part1_content[source_lang] = srcData.mwb_lc_part1_content || '';
    source.mwb_lc_part1_content_override[source_lang] = localOverride
      ? source.mwb_lc_part1_content_override[source_lang]
      : srcData.mwb_lc_part1_content_override;
    source.mwb_lc_part2_time = srcData.mwb_lc_part2_time || '';
    source.mwb_lc_part2_time_override = localOverride
      ? source.mwb_lc_part2_time_override
      : srcData.mwb_lc_part2_time_override;
    source.mwb_lc_part2[source_lang] = srcData.mwb_lc_part2 || '';
    source.mwb_lc_part2_override[source_lang] = localOverride
      ? source.mwb_lc_part2_override[source_lang]
      : srcData.mwb_lc_part2_override;
    source.mwb_lc_part2_content[source_lang] = srcData.mwb_lc_part2_content || '';
    source.mwb_lc_part2_content_override[source_lang] = localOverride
      ? source.mwb_lc_part2_content_override[source_lang]
      : srcData.mwb_lc_part2_content_override;
    source.mwb_lc_cbs[source_lang] = srcData.mwb_lc_cbs || '';
    source.mwb_lc_cbs_time_override = localOverride
      ? source.mwb_lc_cbs_time_override
      : srcData.mwb_lc_cbs_time_override;
    source.mwb_song_conclude = srcData.mwb_song_conclude || '';
    source.mwb_song_conclude_override = srcData.mwb_song_conclude_override;
    source.mwb_co_talk_title = srcData.mwb_co_talk_title || '';
  }

  if (isUpdateWeekend) {
    source.w_co_talk_title = srcData.w_co_talk_title || '';
    source.w_study_date_locale[source_lang] = srcData.w_study_date_locale || '';
    source.w_study_title[source_lang] = srcData.w_study_title || '';
    source.w_study_opening_song = srcData.w_study_opening_song || '';
    source.w_study_concluding_song = srcData.w_study_concluding_song || '';
  }

  source.keepOverride = localOverride ? source.keepOverride : new Date().toISOString();

  await appDb.sources.put(source);
};

export const epubSaveSource = async (data: SourceWeekIncomingType[]) => {
  for await (const src of data) {
    const obj = <SourceWeekLocaleType>{};

    let isMWB = false;
    let isW = false;

    for (const [key] of Object.entries(src)) {
      if (key === 'mwb_week_date_locale') {
        isMWB = true;
      }

      if (key === 'w_study_date_locale') {
        isW = true;
      }
    }

    if (isMWB) {
      const assTypeList: { label: string; value: number }[] = await promiseGetRecoil(assignmentTypeAYFOnlyState);

      let assType: number;

      obj.weekOf = src.mwb_week_date || src.week_date;
      obj.mwb_week_date_locale = src.mwb_week_date_locale;

      // Weekly Bible Reading
      obj.mwb_weekly_bible_reading = src.mwb_weekly_bible_reading;

      // Opening Song
      obj.mwb_song_first = src.mwb_song_first;

      // TGW Talk 10 min
      obj.mwb_tgw_talk = src.mwb_tgw_talk;

      //Bible Reading Source
      obj.mwb_tgw_bread = src.mwb_tgw_bread;

      // AYF Count
      const cnAYF = src.mwb_ayf_count;
      obj.mwb_ayf_count = src.mwb_ayf_count;

      //AYF1 Assignment Type
      assType = assTypeList.find((type) => type.label === src.mwb_ayf_part1_type)?.value || 127;
      obj.mwb_ayf_part1_type = assType;

      //AYF1 Assignment Time
      obj.mwb_ayf_part1_time = src.mwb_ayf_part1_time;

      //AYF1 Assignment Source
      obj.mwb_ayf_part1 = assType === 127 ? src.mwb_ayf_part1_type : src.mwb_ayf_part1;

      obj.mwb_ayf_part2_type = '';
      obj.mwb_ayf_part2_time = '';
      obj.mwb_ayf_part2 = '';
      obj.mwb_ayf_part3_type = '';
      obj.mwb_ayf_part3_time = '';
      obj.mwb_ayf_part3 = '';
      obj.mwb_ayf_part4_type = '';
      obj.mwb_ayf_part4_time = '';
      obj.mwb_ayf_part4 = '';

      if (cnAYF > 1) {
        //AYF2 Assignment Type
        assType = assTypeList.find((type) => type.label === src.mwb_ayf_part2_type)?.value || 127;
        obj.mwb_ayf_part2_type = assType;

        //AYF2 Assignment Time
        obj.mwb_ayf_part2_time = src.mwb_ayf_part2_time;

        //AYF2 Assignment Source
        obj.mwb_ayf_part2 = assType === 127 ? src.mwb_ayf_part2_type : src.mwb_ayf_part2;
      }

      if (cnAYF > 2) {
        //AYF3 Assignment Type
        assType = assTypeList.find((type) => type.label === src.mwb_ayf_part3_type)?.value || 127;
        obj.mwb_ayf_part3_type = assType;

        //AYF3 Assignment Time
        obj.mwb_ayf_part3_time = src.mwb_ayf_part3_time;

        //AYF3 Assignment Source
        obj.mwb_ayf_part3 = assType === 127 ? src.mwb_ayf_part3_type : src.mwb_ayf_part3;
      }

      if (cnAYF > 3) {
        //AYF4 Assignment Type
        assType = assTypeList.find((type) => type.label === src.mwb_ayf_part4_type)?.value || 127;
        obj.mwb_ayf_part4_type = assType;

        //AYF4 Assignment Time
        obj.mwb_ayf_part4_time = src.mwb_ayf_part4_time;

        //AYF3 Assignment Source
        obj.mwb_ayf_part4 = assType === 127 ? src.mwb_ayf_part4_type : src.mwb_ayf_part4;
      }

      // Middle Song
      obj.mwb_song_middle = src.mwb_song_middle;

      // LC Count
      obj.mwb_lc_count = src.mwb_lc_count;

      // LC Part 1 Time
      obj.mwb_lc_part1_time = src.mwb_lc_part1_time;

      // LC Part 1 Source
      obj.mwb_lc_part1 = src.mwb_lc_part1;

      // LC Part 1 Content
      obj.mwb_lc_part1_content = src.mwb_lc_part1_content;

      obj.mwb_lc_part2 = '';
      obj.mwb_lc_part2_content = '';
      obj.mwb_lc_part2_time = '';

      // LC Part 2
      if (src.mwb_lc_count > 1) {
        // LC Part 2 Time
        obj.mwb_lc_part2_time = src.mwb_lc_part2_time;

        // LC Part 2 Source
        obj.mwb_lc_part2 = src.mwb_lc_part2;

        // LC Part 2 Content
        obj.mwb_lc_part2_content = src.mwb_lc_part2_content;
      }

      // CBS Source
      obj.mwb_lc_cbs = src.mwb_lc_cbs;

      // Concluding Song
      obj.mwb_song_conclude = src.mwb_song_conclude;
    }

    if (isW) {
      obj.weekOf = src.w_study_date || src.week_date;
      obj.w_study_date_locale = src.w_study_date_locale;
      obj.w_study_title = src.w_study_title;
      obj.w_study_opening_song = src.w_study_opening_song;
      obj.w_study_concluding_song = src.w_study_concluding_song;
    }

    await saveSource({ srcData: obj, localOverride: true });

    // edit schedule info
    const schedObj = <{ weekOf: string; week_type: number; noMMeeting: boolean; noWMeeting: boolean }>{};
    schedObj.week_type = 1;
    schedObj.noMMeeting = false;
    schedObj.noWMeeting = false;

    if (isMWB) {
      schedObj.weekOf = src.mwb_week_date || src.week_date;
    }

    if (isW) {
      schedObj.weekOf = src.w_study_date || src.week_date;
    }

    await saveScheduleInfo({ scheduleInfo: schedObj, isOverride: false });
  }
};

export const deleteSource = async (week) => {
  const sources = await promiseGetRecoil(sourcesState);
  const schedules = await promiseGetRecoil(schedulesState);

  const isSourceExist = sources.find((source) => source.weekOf === week);
  if (isSourceExist) {
    await appDb.sources.delete(week);
  }

  const isSchedExist = schedules.find((schedule) => schedule.weekOf === week);
  if (isSchedExist) {
    await appDb.sched.delete(week);
  }
};

export const getSourceWeekLocale = async (source, lang, assTypeList) => {
  const obj = <SourceWeekLocaleType>{};
  let indexType;

  obj.weekOf = source.weekOf;
  obj.mwb_week_date_locale = source.mwb_week_date_locale[lang] || '';
  obj.mwb_weekly_bible_reading = source.mwb_weekly_bible_reading[lang] || '';
  obj.mwb_song_first = source.mwb_song_first || '';
  obj.mwb_tgw_talk = source.mwb_tgw_talk[lang] || '';
  obj.mwb_tgw_bread = source.mwb_tgw_bread[lang] || '';
  obj.mwb_ayf_count = source.mwb_ayf_count || 0;

  if (source.mwb_ayf_part1_type[lang] && source.mwb_ayf_part1_type[lang] !== '') {
    obj.mwb_ayf_part1_type = +source.mwb_ayf_part1_type[lang];
  }

  indexType = assTypeList.findIndex((type) => type.value === obj.mwb_ayf_part1_type);
  obj.mwb_ayf_part1_type_name = indexType >= 0 ? assTypeList[indexType].label : '';
  obj.mwb_ayf_part1_time = source.mwb_ayf_part1_time || '';
  obj.mwb_ayf_part1 = source.mwb_ayf_part1[lang] || '';

  if (source.mwb_ayf_part2_type[lang] && source.mwb_ayf_part2_type[lang] !== '') {
    obj.mwb_ayf_part2_type = +source.mwb_ayf_part2_type[lang];
  }

  indexType = assTypeList.findIndex((type) => type.value === obj.mwb_ayf_part2_type);
  obj.mwb_ayf_part2_type_name = indexType >= 0 ? assTypeList[indexType].label : '';

  obj.mwb_ayf_part2_time = source.mwb_ayf_part2_time || '';
  obj.mwb_ayf_part2 = source.mwb_ayf_part2[lang] || '';

  if (source.mwb_ayf_part3_type[lang] && source.mwb_ayf_part3_type[lang] !== '') {
    obj.mwb_ayf_part3_type = +source.mwb_ayf_part3_type[lang];
  }

  indexType = assTypeList.findIndex((type) => type.value === obj.mwb_ayf_part3_type);
  obj.mwb_ayf_part3_type_name = indexType >= 0 ? assTypeList[indexType].label : '';

  obj.mwb_ayf_part3_time = source.mwb_ayf_part3_time || '';
  obj.mwb_ayf_part3 = source.mwb_ayf_part3[lang] || '';

  if (source.mwb_ayf_part4_type[lang] && source.mwb_ayf_part4_type[lang] !== '') {
    obj.mwb_ayf_part4_type = +source.mwb_ayf_part4_type[lang];
  }

  indexType = assTypeList.findIndex((type) => type.value === obj.mwb_ayf_part4_type);
  obj.mwb_ayf_part4_type_name = indexType >= 0 ? assTypeList[indexType].label : '';

  if (source.mwb_ayf_part4_time) {
    if (typeof source.mwb_ayf_part4_time === 'object') {
      obj.mwb_ayf_part4_time = '';
    } else {
      obj.mwb_ayf_part4_time = source.mwb_ayf_part4_time;
    }
  } else {
    obj.mwb_ayf_part4_time = '';
  }

  obj.mwb_ayf_part4 = source.mwb_ayf_part4[lang] || '';

  obj.mwb_song_middle = source.mwb_song_middle || '';
  obj.mwb_lc_count = source.mwb_lc_count || 0;
  obj.mwb_lc_count_override = source.mwb_lc_count_override;
  obj.mwb_lc_part1_time = source.mwb_lc_part1_time || '';
  obj.mwb_lc_part1_time_override = source.mwb_lc_part1_time_override || '';
  obj.mwb_lc_part1 = source.mwb_lc_part1[lang] || '';
  obj.mwb_lc_part1_override = source.mwb_lc_part1_override[lang] || '';
  obj.mwb_lc_part1_content = source.mwb_lc_part1_content[lang] || '';
  obj.mwb_lc_part1_content_override = source.mwb_lc_part1_content_override[lang] || '';
  obj.mwb_lc_part2_time = source.mwb_lc_part2_time || '';
  obj.mwb_lc_part2_time_override = source.mwb_lc_part2_time_override || '';
  obj.mwb_lc_part2 = source.mwb_lc_part2[lang] || '';
  obj.mwb_lc_part2_override = source.mwb_lc_part2_override[lang] || '';
  obj.mwb_lc_part2_content = source.mwb_lc_part2_content[lang] || '';
  obj.mwb_lc_part2_content_override = source.mwb_lc_part2_content_override[lang] || '';
  obj.mwb_lc_cbs = source.mwb_lc_cbs[lang] || '';
  obj.mwb_lc_cbs_time_override = source.mwb_lc_cbs_time_override || '';
  obj.mwb_song_conclude = source.mwb_song_conclude || '';
  obj.mwb_song_conclude_override = source.mwb_song_conclude_override || '';
  obj.mwb_co_talk_title = source.mwb_co_talk_title || '';
  obj.w_co_talk_title = source.w_co_talk_title || '';
  obj.w_study_date_locale = source.w_study_date_locale[lang] || '';
  obj.w_study_title = source.w_study_title[lang] || '';
  obj.w_study_opening_song = source.w_study_opening_song || '';
  obj.w_study_concluding_song = source.w_study_concluding_song || '';

  return obj;
};
