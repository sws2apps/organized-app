import { loadEPUB } from 'jw-epub-parser';
import { promiseGetRecoil } from 'recoil-outside';
import {
  ApplyMinistryType,
  CongregationBibleStudyType,
  LivingAsChristiansType,
  SourceAssignmentType,
  SourceWeekIncomingType,
  SourceWeekType,
} from '@definition/sources';
import { assignmentTypeAYFOnlyState } from '@states/assignment';
import { dbSourcesSave } from '@services/dexie/sources';
import { dbSchedCheck } from '@services/dexie/schedules';
import { AssignmentAYFOnlyType } from '@definition/assignment';
import { cookiesConsentState, JWLangState } from '@states/app';
import { getTranslation } from '@services/i18n/translation';
import { MeetingType } from '@definition/app';
import {
  sourcesJWAutoImportFrequencyState,
  sourcesJWAutoImportState,
} from '@states/settings';
import { SourceFrequency } from '@definition/settings';
import { addWeeks, getWeekDate } from '@utils/date';
import { formatDate } from '@services/dateformat';

export const sourcesImportEPUB = async (fileEPUB) => {
  const data = await loadEPUB(fileEPUB);
  await sourcesFormatAndSaveData(data);
};

export const sourcesImportJW = async (dataJw) => {
  await sourcesFormatAndSaveData(dataJw);

  const isAutoImportEnabled: boolean = await promiseGetRecoil(
    sourcesJWAutoImportState
  );
  const cookiesConsent: boolean = await promiseGetRecoil(cookiesConsentState);

  const autoImportFrequency: SourceFrequency = await promiseGetRecoil(
    sourcesJWAutoImportFrequencyState
  );

  if (cookiesConsent && isAutoImportEnabled) {
    const nextSync = addWeeks(new Date(), autoImportFrequency);

    localStorage.setItem(
      'organized_jw_import_next_sync',
      nextSync.toISOString()
    );
  }
};

const sourcesFormatAndSaveData = async (data: SourceWeekIncomingType[]) => {
  const source_lang = await promiseGetRecoil(JWLangState);

  for await (const src of data) {
    const obj = {} as SourceWeekType;

    const isMWB = Object.keys(src).includes('mwb_week_date_locale');
    const isW = Object.keys(src).includes('w_study_date_locale');

    obj.weekOf = src.mwb_week_date || src.w_study_date || src.week_date;

    const mondayDate = formatDate(
      getWeekDate(new Date(obj.weekOf)),
      'yyyy/MM/dd'
    );

    if (mondayDate === obj.weekOf) {
      if (isMWB) {
        let assType: number;
        const assTypeList: AssignmentAYFOnlyType[] = await promiseGetRecoil(
          assignmentTypeAYFOnlyState
        );

        obj.midweek_meeting = {} as SourceWeekType['midweek_meeting'];

        obj.midweek_meeting.week_date_locale = {
          [source_lang]: src.mwb_week_date_locale,
        };
        obj.midweek_meeting.weekly_bible_reading = {
          [source_lang]: src.mwb_weekly_bible_reading,
        };
        obj.midweek_meeting.song_first = {
          [source_lang]: src.mwb_song_first.toString(),
        };
        obj.midweek_meeting.tgw_talk = {
          src: { [source_lang]: src.mwb_tgw_talk_title },
          time: { default: 10, override: [] },
        };
        obj.midweek_meeting.tgw_gems = {
          title: { [source_lang]: src.mwb_tgw_gems_title },
          time: { default: 10, override: [] },
        };
        obj.midweek_meeting.tgw_bible_reading = {
          src: { [source_lang]: src.mwb_tgw_bread },
          title: { [source_lang]: src.mwb_tgw_bread_title },
        };

        const cnAYF = src.mwb_ayf_count;
        obj.midweek_meeting.ayf_count = { [source_lang]: src.mwb_ayf_count };

        assType =
          assTypeList.find((type) => type.label === src.mwb_ayf_part1_type)
            ?.value || 127;

        if (
          source_lang === 'TG' &&
          obj.weekOf >= '2024/01/01' &&
          assType === 102
        ) {
          assType = 124;
        }

        obj.midweek_meeting.ayf_part1 = {
          src: { [source_lang]: src.mwb_ayf_part1 },
          time: { [source_lang]: src.mwb_ayf_part1_time },
          title: { [source_lang]: src.mwb_ayf_part1_title },
          type: { [source_lang]: assType },
        };

        if (cnAYF > 1) {
          assType =
            assTypeList.find((type) => type.label === src.mwb_ayf_part2_type)
              ?.value || 127;

          if (
            source_lang === 'TG' &&
            obj.weekOf >= '2024/01/01' &&
            assType === 102
          ) {
            assType = 124;
          }

          obj.midweek_meeting.ayf_part2 = {
            src: { [source_lang]: src.mwb_ayf_part2 },
            time: { [source_lang]: src.mwb_ayf_part2_time },
            title: { [source_lang]: src.mwb_ayf_part2_title },
            type: { [source_lang]: assType },
          };
        }

        if (cnAYF > 2) {
          assType =
            assTypeList.find((type) => type.label === src.mwb_ayf_part3_type)
              ?.value || 127;

          if (
            source_lang === 'TG' &&
            obj.weekOf >= '2024/01/01' &&
            assType === 102
          ) {
            assType = 124;
          }

          obj.midweek_meeting.ayf_part3 = {
            src: { [source_lang]: src.mwb_ayf_part3 },
            time: { [source_lang]: src.mwb_ayf_part3_time },
            title: { [source_lang]: src.mwb_ayf_part3_title },
            type: { [source_lang]: assType },
          };
        }

        if (cnAYF > 3) {
          assType =
            assTypeList.find((type) => type.label === src.mwb_ayf_part4_type)
              ?.value || 127;

          if (
            source_lang === 'TG' &&
            obj.weekOf >= '2024/01/01' &&
            assType === 102
          ) {
            assType = 124;
          }

          obj.midweek_meeting.ayf_part4 = {
            src: { [source_lang]: src.mwb_ayf_part4 },
            time: { [source_lang]: src.mwb_ayf_part4_time },
            title: { [source_lang]: src.mwb_ayf_part4_title },
            type: { [source_lang]: assType },
          };
        }

        obj.midweek_meeting.song_middle = {
          [source_lang]: src.mwb_song_middle.toString(),
        };
        obj.midweek_meeting.lc_count = {
          default: { [source_lang]: src.mwb_lc_count },
          override: [],
        };
        obj.midweek_meeting.lc_part1 = {
          title: {
            default: { [source_lang]: src.mwb_lc_part1_title },
            override: [],
          },
          time: {
            default: { [source_lang]: src.mwb_lc_part1_time },
            override: [],
          },
          desc: {
            default: { [source_lang]: src.mwb_lc_part1_content },
            override: [],
          },
        };

        if (src.mwb_lc_count > 1) {
          obj.midweek_meeting.lc_part2 = {
            title: {
              default: { [source_lang]: src.mwb_lc_part2_title },
              override: [],
            },
            time: {
              default: { [source_lang]: src.mwb_lc_part2_time },
              override: [],
            },
            desc: {
              default: { [source_lang]: src.mwb_lc_part2_content },
              override: [],
            },
          };
        }

        obj.midweek_meeting.lc_cbs = {
          src: { [source_lang]: src.mwb_lc_cbs },
          time: { default: 30, override: [] },
          title: {
            default: { [source_lang]: src.mwb_lc_cbs_title },
            override: [],
          },
        };
        obj.midweek_meeting.song_conclude = {
          default: { [source_lang]: src.mwb_song_conclude.toString() },
          override: [],
        };
      }

      if (isW) {
        obj.weekend_meeting = {} as SourceWeekType['weekend_meeting'];

        obj.weekend_meeting.song_first = [];
        obj.weekend_meeting.public_talk = [];
        obj.weekend_meeting.co_talk_title = {
          public: { src: '', updatedAt: '' },
          service: { src: '', updatedAt: '' },
        };
        obj.weekend_meeting.song_middle = {
          [source_lang]: src.w_study_opening_song.toString(),
        };
        obj.weekend_meeting.w_study = { [source_lang]: src.w_study_title };
        obj.weekend_meeting.song_conclude = {
          default: { [source_lang]: src.w_study_concluding_song.toString() },
          override: [],
        };
      }

      await dbSourcesSave(obj);

      // check if record exists in sched table
      await dbSchedCheck(obj.weekOf);
    }
  }
};

export const sourcesCheckAYFExplainBeliefsAssignment = (source: string) => {
  if (source) {
    const boundary = '(?:^|\\s|$)';
    const talk = getTranslation({ key: 'tr_talk' });
    const demonstration = getTranslation({ key: 'tr_demonstration' });
    const searchKey = `${boundary}${talk}|${boundary}${demonstration}`;
    const regex = new RegExp(searchKey, 'i');
    const result = source.match(regex);

    if (result?.length > 0) {
      const isTalk = result[0].toLowerCase() === talk.toLowerCase();

      return isTalk;
    }
  }

  return false;
};

export const sourcesCheckLCElderAssignment = (source: string, desc: string) => {
  if (source) {
    let isElderPart = false;

    const elderVariations = getTranslation({
      key: 'tr_lcSourceElderVariations',
    });

    const search = `(${elderVariations})`;
    const regex = new RegExp(search.toLowerCase());
    const array = regex.exec(source.toLowerCase());
    isElderPart = Array.isArray(array);

    if (!isElderPart && desc) {
      const contentVariations = getTranslation({
        key: 'tr_lcContentElderVariations',
      });

      const search = `(${contentVariations})`;
      const regex = new RegExp(search.toLowerCase());
      const array = regex.exec(desc.toLowerCase());
      isElderPart = Array.isArray(array);
    }

    return isElderPart;
  }

  return false;
};

export const sourcesCheckLCAssignments = (source: string) => {
  if (source) {
    const noAssigned = getTranslation({ key: 'tr_lcNoAssignedVariations' });

    const search = `(${noAssigned})`;
    const regex = new RegExp(search.toLowerCase());
    const array = regex.exec(source.toLowerCase());

    return Array.isArray(array);
  }

  return false;
};

export const sourcesPartTiming = (
  source: SourceWeekType,
  type: SourceAssignmentType,
  dataView: string,
  lang: string
) => {
  if (type === 'tgw_talk') {
    const part = source.midweek_meeting.tgw_talk;
    const timeOverride =
      part.time.override.find((record) => record.type === dataView)?.value || 0;
    const timeDefault = part.time.default as number;
    const time = timeOverride > 0 ? timeOverride : timeDefault;

    return time;
  }

  if (type === 'tgw_gems') {
    const part = source.midweek_meeting.tgw_gems;
    const timeOverride =
      part.time.override.find((record) => record.type === dataView)?.value || 0;
    const timeDefault = part.time.default as number;
    const time = timeOverride > 0 ? timeOverride : timeDefault;

    return time;
  }

  if (type === 'lc_part1') {
    const part = source.midweek_meeting.lc_part1;
    const timeOverride =
      part.time.override.find((record) => record.type === dataView)?.value || 0;
    const timeDefault = part.time.default[lang];
    const time = timeOverride > 0 ? timeOverride : timeDefault;

    return time;
  }

  if (type === 'lc_part2') {
    const part = source.midweek_meeting.lc_part2;
    const timeOverride =
      part.time.override.find((record) => record.type === dataView)?.value || 0;
    const timeDefault = part.time.default[lang];
    const time = timeOverride > 0 ? timeOverride : timeDefault;

    return time;
  }

  if (type === 'lc_part3') {
    const part = source.midweek_meeting.lc_part3;
    const time =
      part.time.find((record) => record.type === dataView)?.value || 0;

    return time;
  }

  if (type === 'lc_cbs') {
    const part = source.midweek_meeting.lc_cbs;
    const timeOverride =
      part.time.override.find((record) => record.type === dataView)?.value || 0;
    const timeDefault = part.time.default as number;
    const time = timeOverride > 0 ? timeOverride : timeDefault;

    return time;
  }

  if (type.includes('ayf_part')) {
    const part = source.midweek_meeting[type] as ApplyMinistryType;
    const time = part.time[lang];

    return time;
  }
};

export const sourcesCountLC = (
  source: SourceWeekType,
  dataView: string,
  lang: string
) => {
  const countDefault = source.midweek_meeting.lc_count.default[lang];
  const countOverride =
    source.midweek_meeting.lc_count.override.find(
      (record) => record.type === dataView
    )?.value || 0;

  const count = countOverride > 0 ? countOverride : countDefault;

  return count;
};

export const sourcesLCGetTitle = (
  lcPart: LivingAsChristiansType,
  dataView: string,
  lang: string
) => {
  const titleDefault = lcPart.title.default[lang];
  const titleOverride =
    lcPart.title.override.find((record) => record.type === dataView)?.value ||
    '';

  const title = titleOverride.length > 0 ? titleOverride : titleDefault;

  return title;
};

export const sourcesCBSGetTitle = (
  cbs: CongregationBibleStudyType,
  dataView: string,
  lang: string
) => {
  const titleDefault = cbs.title.default[lang];
  const titleOverride =
    cbs.title.override.find((record) => record.type === dataView)?.value || '';

  const title = titleOverride.length > 0 ? titleOverride : titleDefault;

  return title;
};

export const sourcesSongConclude = ({
  dataView,
  lang,
  meeting,
  source,
}: {
  meeting: MeetingType;
  source: SourceWeekType;
  dataView: string;
  lang: string;
}) => {
  let song: string;

  if (meeting === 'midweek') {
    const songDefault = source.midweek_meeting.song_conclude.default[lang];
    const songOverride =
      source.midweek_meeting.song_conclude.override.find(
        (record) => record.type === dataView
      )?.value || '';

    song = songOverride.length > 0 ? songOverride : songDefault;
  }

  if (meeting === 'weekend') {
    const songDefault = source.weekend_meeting.song_conclude.default[lang];
    const songOverride =
      source.weekend_meeting.song_conclude.override.find(
        (record) => record.type === dataView
      )?.value || '';

    song = songOverride.length > 0 ? songOverride : songDefault;
  }

  return song;
};

export const sourcesLCGet = (
  part: LivingAsChristiansType,
  dataView: string,
  lang: string
) => {
  const srcOverride = part.title.override.find(
    (record) => record.type === dataView
  );

  const srcDefault = part.title.default[lang];
  const src = srcOverride?.value.length > 0 ? srcOverride.value : srcDefault;

  const descOverride = part.desc.override.find(
    (record) => record.type === dataView
  );

  const descDefault = part.desc.default[lang];
  const desc =
    descOverride?.value.length > 0 ? descOverride.value : descDefault;

  return { src, desc };
};
