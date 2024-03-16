import { loadEPUB } from 'jw-epub-parser';
import { deleteSource, epubSaveSource, sourcesAddWeekManually } from '@services/dexie/sources';
import { displaySnackNotification } from '@services/recoil/app';
import { getTranslation } from '@services/i18n/translation';
import { promiseGetRecoil } from 'recoil-outside';
import { assignmentTypeLocaleState } from '@states/assignment';
import { sourcesState } from '@states/sources';
import { sourceSchema } from '@services/dexie/schema';
import { appLangState, monthNamesState, shortDateFormatState } from '@states/app';
import { formatDate } from '@services/dateformat';
import { SourceWeekLocaleType } from '@definition/sources';

export const addEpubDataToDb = async (fileEPUB) => {
  const data = await loadEPUB(fileEPUB);
  await epubSaveSource(data);
};

export const addJwDataToDb = async (dataJw) => {
  await epubSaveSource(dataJw);
};

export const handleWeekAddConfirm = async () => {
  await sourcesAddWeekManually();

  await displaySnackNotification({
    header: 'Organized',
    message: getTranslation({ key: 'weekAdded' }),
    severity: 'success',
  });
};

export const handleWeekDeleteConfirm = async (action) => {
  const week = action.split('-')[1];

  await deleteSource(week);

  await displaySnackNotification({
    header: 'Organized',
    message: getTranslation({ key: 'weekDeletedSuccess' }),
    severity: 'success',
  });
};

export const getSource = async (weekOf) => {
  const sources = await promiseGetRecoil(sourcesState);

  const model = structuredClone(sourceSchema);
  const source = sources.find((s) => s.weekOf === weekOf);

  const result = { ...model, ...source };
  return result;
};

export const getSourceLocal = async (weekOf) => {
  const appLang = await promiseGetRecoil(appLangState);
  const lang = appLang.toUpperCase();

  const assTypeList = await promiseGetRecoil(assignmentTypeLocaleState);
  const source = await getSource(weekOf);

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

export const getWeeksListByYear = async (varYear, userSort = 'desc') => {
  const sources = await promiseGetRecoil(sourcesState);
  const monthNames = await promiseGetRecoil(monthNamesState);

  const allSchedules = [];
  let appData = [];

  if (userSort === null) userSort = 'desc';

  appData = structuredClone(sources);

  if (userSort === 'asc') {
    appData = appData.reverse();
  }

  for (const source of appData) {
    const weekDate = source.weekOf;
    const year = weekDate.split('/')[0];

    if (year === varYear) {
      const month = weekDate.split('/')[1];

      const tempMain = month + '/' + year;
      const scheduleIndex = allSchedules.findIndex((schedule) => schedule.value === tempMain);

      if (scheduleIndex < 0) {
        const obj = <{ value: string; label: string }>{};
        obj.value = month + '/' + year;

        const monthIndex = +month - 1;
        obj.label = `${monthNames[monthIndex]} ${year}`;

        allSchedules.push(obj);
      }
    }
  }

  return allSchedules;
};

export const getYearsList = async () => {
  const sources = await promiseGetRecoil(sourcesState);

  const allYear = [];

  for (const source of sources) {
    const weekDate = source.weekOf;
    const varYear = weekDate.split('/')[0];

    const found = allYear.find((year) => year.label === varYear);

    if (!found) {
      const obj = <{ label: string; value: string }>{};
      obj.label = varYear;
      obj.value = varYear;
      allYear.push(obj);
    }
  }

  allYear.sort((a, b) => {
    return a.value < b.value ? 1 : -1;
  });

  return allYear;
};

export const getWeekListBySchedule = async (scheduleIndex) => {
  const sources = await promiseGetRecoil(sourcesState);

  const allWeeks = [];

  for (const source of sources) {
    const weekDate = source.weekOf;
    const month = weekDate.split('/')[1];
    const year = weekDate.split('/')[0];
    const tempMain = month + '/' + year;
    if (tempMain === scheduleIndex) {
      allWeeks.push(weekDate);
    }
  }

  return allWeeks.reverse();
};

export const getWeekListByScheduleLocal = async (scheduleIndex) => {
  const data = await getWeekListBySchedule(scheduleIndex);
  const shortDateFormat = await promiseGetRecoil(shortDateFormatState);

  const newData = [];
  data.forEach((week) => {
    const day = week.split('/')[2];
    const month = week.split('/')[1];
    const year = week.split('/')[0];
    const newDate = new Date(year, +month - 1, day);
    const dateFormatted = formatDate(newDate, shortDateFormat);
    newData.push({ value: week, label: dateFormatted });
  });

  newData.sort((a, b) => {
    return a.value > b.value ? 1 : -1;
  });

  return newData;
};
