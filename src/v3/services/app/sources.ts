import { loadEPUB } from 'jw-epub-parser';
import { promiseGetRecoil } from 'recoil-outside';
import { SourceWeekIncomingType, SourceWeekLocaleType } from '@definition/sources';
import { assignmentTypeAYFOnlyState } from '@states/assignment';
import { SchedInfoType } from '@definition/schedules';
import { dbSourcesSave } from '@services/dexie/sources';
import { dbSchedSaveInfo } from '@services/dexie/schedules';

export const sourcesImportEPUB = async (fileEPUB) => {
  const data = await loadEPUB(fileEPUB);
  await sourcesFormatAndSaveData(data);
};

export const sourcesImportJW = async (dataJw) => {
  await sourcesFormatAndSaveData(dataJw);
};

const sourcesFormatAndSaveData = async (data: SourceWeekIncomingType[]) => {
  for await (const src of data) {
    const obj = <SourceWeekLocaleType>{};

    const isMWB = Object.keys(src).includes('mwb_week_date_locale');
    const isW = Object.keys(src).includes('w_study_date_locale');

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

    await dbSourcesSave({ srcData: obj, keepOverride: true });

    // edit schedule info
    const schedObj = <SchedInfoType>{};
    schedObj.week_type = 1;
    schedObj.noMMeeting = false;
    schedObj.noWMeeting = false;
    schedObj.weekOf = src.mwb_week_date || src.w_study_date || src.week_date;

    await dbSchedSaveInfo({ scheduleInfo: schedObj, isOverride: false });
  }
};
