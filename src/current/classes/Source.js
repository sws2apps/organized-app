import appDb from '../../shared/indexedDb/mainDb';
import {
  checkCBSReader,
  checkLCAssignments,
  checkLCElderAssignments,
  checkAYFExplainingBeliefsAssignment,
} from '../utils/sourceMaterial';
import { AssignmentType } from './AssignmentType';
import { Schedules } from './Schedules';
import { Setting } from './Setting';
import { Sources } from './Sources';

export class SourceClass {
  constructor(weekOf) {
    this.weekOf = weekOf;
    this.mwb_week_date_locale = {};
    this.mwb_weekly_bible_reading = {};
    this.mwb_song_first = '';
    this.mwb_tgw_talk = {};
    this.mwb_tgw_bread = {};
    this.mwb_ayf_count = 0;
    this.mwb_ayf_part1_type = {};
    this.mwb_ayf_part1_time = '';
    this.mwb_ayf_part1 = {};
    this.mwb_ayf_part2_type = {};
    this.mwb_ayf_part2_time = '';
    this.mwb_ayf_part2 = {};
    this.mwb_ayf_part3_type = {};
    this.mwb_ayf_part3_time = '';
    this.mwb_ayf_part3 = {};
    this.mwb_ayf_part4_type = {};
    this.mwb_ayf_part4_time = '';
    this.mwb_ayf_part4 = {};
    this.mwb_song_middle = '';
    this.mwb_lc_count = 0;
    this.mwb_lc_count_override = 0;
    this.mwb_lc_part1_time = '';
    this.mwb_lc_part1 = {};
    this.mwb_lc_part1_content = {};
    this.mwb_lc_part1_time_override = '';
    this.mwb_lc_part1_override = {};
    this.mwb_lc_part1_content_override = {};
    this.mwb_lc_part2_time = '';
    this.mwb_lc_part2 = {};
    this.mwb_lc_part2_content = {};
    this.mwb_lc_part2_time_override = '';
    this.mwb_lc_part2_override = {};
    this.mwb_lc_part2_content_override = {};
    this.mwb_lc_cbs = {};
    this.mwb_lc_cbs_time_override = '';
    this.mwb_co_talk_title = '';
    this.mwb_song_conclude = '';
    this.mwb_song_conclude_override = '';
    this.w_study_date_locale = {};
    this.w_co_talk_title = '';
    this.w_study_title = {};
    this.w_study_opening_song = '';
    this.w_study_concluding_song = '';
    this.keepOverride = undefined;
  }
}

SourceClass.prototype.loadDetails = async function () {
  const appData = await appDb.sources.get({ weekOf: this.weekOf });
  if (!appData) return;

  this.mwb_week_date_locale = appData.mwb_week_date_locale || {};
  this.mwb_weekly_bible_reading = appData.mwb_weekly_bible_reading || {};
  this.mwb_song_first = appData.mwb_song_first || '';
  this.mwb_tgw_talk = appData.mwb_tgw_talk || {};
  this.mwb_tgw_bread = appData.mwb_tgw_bread || {};
  this.mwb_ayf_count = appData.mwb_ayf_count || 0;
  this.mwb_ayf_part1_type = appData.mwb_ayf_part1_type || {};
  this.mwb_ayf_part1_time = appData.mwb_ayf_part1_time;
  this.mwb_ayf_part1 = appData.mwb_ayf_part1 || {};
  this.mwb_ayf_part2_type = appData.mwb_ayf_part2_type || {};
  this.mwb_ayf_part2_time = appData.mwb_ayf_part2_time;
  this.mwb_ayf_part2 = appData.mwb_ayf_part2 || {};
  this.mwb_ayf_part3_type = appData.mwb_ayf_part3_type || {};
  this.mwb_ayf_part3_time = appData.mwb_ayf_part3_time;
  this.mwb_ayf_part3 = appData.mwb_ayf_part3 || {};
  this.mwb_ayf_part4_type = appData.mwb_ayf_part4_type || {};
  this.mwb_ayf_part4_time = appData.mwb_ayf_part4_time;
  this.mwb_ayf_part4 = appData.mwb_ayf_part4 || {};
  this.mwb_song_middle = appData.mwb_song_middle || '';
  this.mwb_lc_count = appData.mwb_lc_count || 0;
  this.mwb_lc_count_override = appData.mwb_lc_count_override || 0;
  this.mwb_lc_part1_time = appData.mwb_lc_part1_time;
  this.mwb_lc_part1 = appData.mwb_lc_part1 || {};
  this.mwb_lc_part1_content = appData.mwb_lc_part1_content || {};
  this.mwb_lc_part1_time_override = appData.mwb_lc_part1_time_override || 0;
  this.mwb_lc_part1_override = appData.mwb_lc_part1_override || {};
  this.mwb_lc_part1_content_override = appData.mwb_lc_part1_content_override || {};
  this.mwb_lc_part2_time = appData.mwb_lc_part2_time;
  this.mwb_lc_part2 = appData.mwb_lc_part2 || {};
  this.mwb_lc_part2_content = appData.mwb_lc_part2_content || {};
  this.mwb_lc_part2_time_override = appData.mwb_lc_part2_time_override || '';
  this.mwb_lc_part2_override = appData.mwb_lc_part2_override || {};
  this.mwb_lc_part2_content_override = appData.mwb_lc_part2_content_override || {};
  this.mwb_lc_cbs = appData.mwb_lc_cbs || {};
  this.mwb_lc_cbs_time_override = appData.mwb_lc_cbs_time_override;
  this.mwb_song_conclude = appData.mwb_song_conclude || '';
  this.mwb_song_conclude_override = appData.mwb_song_conclude_override || '';
  this.w_study_date_locale = appData.w_study_date_locale || {};
  this.w_study_title = appData.w_study_title || {};
  this.w_study_opening_song = appData.w_study_opening_song;
  this.w_study_concluding_song = appData.w_study_concluding_song;
  this.mwb_co_talk_title = appData.mwb_co_talk_title || '';
  this.w_co_talk_title = appData.w_co_talk_title || '';
};

SourceClass.prototype.save = async function (srcData, localOverride, forPocket) {
  let { source_lang } = Setting;
  source_lang = source_lang.toUpperCase();

  const lmmoRole = Setting.cong_role.includes('lmmo') || Setting.cong_role.includes('lmmo-backup');
  const coordinatorRole = Setting.cong_role.includes('coordinator');

  if (!forPocket || (forPocket && !lmmoRole)) {
    this.mwb_week_date_locale[source_lang] = srcData.mwb_week_date_locale || '';
    this.mwb_weekly_bible_reading[source_lang] = srcData.mwb_weekly_bible_reading || '';
    this.mwb_song_first = srcData.mwb_song_first || '';
    this.mwb_tgw_talk[source_lang] = srcData.mwb_tgw_talk || '';
    this.mwb_tgw_bread[source_lang] = srcData.mwb_tgw_bread || '';
    this.mwb_ayf_count = srcData.mwb_ayf_count || 1;
    if (typeof this.mwb_ayf_part1_type === 'number') this.mwb_ayf_part1_type = {};
    this.mwb_ayf_part1_type[source_lang] = srcData.mwb_ayf_part1_type || '';
    this.mwb_ayf_part1_time = srcData.mwb_ayf_part1_time || '';
    this.mwb_ayf_part1[source_lang] = srcData.mwb_ayf_part1 || '';
    if (typeof this.mwb_ayf_part2_type === 'number') this.mwb_ayf_part2_type = {};
    this.mwb_ayf_part2_type[source_lang] = srcData.mwb_ayf_part2_type || '';
    this.mwb_ayf_part2_time = srcData.mwb_ayf_part2_time || '';
    this.mwb_ayf_part2[source_lang] = srcData.mwb_ayf_part2 || '';
    if (typeof this.mwb_ayf_part3_type === 'number') this.mwb_ayf_part3_type = {};
    this.mwb_ayf_part3_type[source_lang] = srcData.mwb_ayf_part3_type || '';
    this.mwb_ayf_part3_time = srcData.mwb_ayf_part3_time || '';
    this.mwb_ayf_part3[source_lang] = srcData.mwb_ayf_part3 || '';
    if (typeof this.mwb_ayf_part4_type === 'number') this.mwb_ayf_part4_type = {};
    this.mwb_ayf_part4_type[source_lang] = srcData.mwb_ayf_part4_type || '';
    this.mwb_ayf_part4_time = srcData.mwb_ayf_part4_time || '';
    this.mwb_ayf_part4[source_lang] = srcData.mwb_ayf_part4 || '';
    this.mwb_song_middle = srcData.mwb_song_middle || '';
    this.mwb_lc_count = srcData.mwb_lc_count || 1;
    this.mwb_lc_count_override = localOverride ? this.mwb_lc_count_override : srcData.mwb_lc_count_override;
    this.mwb_lc_part1_time = srcData.mwb_lc_part1_time || '';
    this.mwb_lc_part1_time_override = localOverride
      ? this.mwb_lc_part1_time_override
      : srcData.mwb_lc_part1_time_override;
    this.mwb_lc_part1[source_lang] = srcData.mwb_lc_part1 || '';
    this.mwb_lc_part1_override[source_lang] = localOverride
      ? this.mwb_lc_part1_override[source_lang]
      : srcData.mwb_lc_part1_override;
    this.mwb_lc_part1_content[source_lang] = srcData.mwb_lc_part1_content || '';
    this.mwb_lc_part1_content_override[source_lang] = localOverride
      ? this.mwb_lc_part1_content_override[source_lang]
      : srcData.mwb_lc_part1_content_override;
    this.mwb_lc_part2_time = srcData.mwb_lc_part2_time || '';
    this.mwb_lc_part2_time_override = localOverride
      ? this.mwb_lc_part2_time_override
      : srcData.mwb_lc_part2_time_override;
    this.mwb_lc_part2[source_lang] = srcData.mwb_lc_part2 || '';
    this.mwb_lc_part2_override[source_lang] = localOverride
      ? this.mwb_lc_part2_override[source_lang]
      : srcData.mwb_lc_part2_override;
    this.mwb_lc_part2_content[source_lang] = srcData.mwb_lc_part2_content || '';
    this.mwb_lc_part2_content_override[source_lang] = localOverride
      ? this.mwb_lc_part2_content_override[source_lang]
      : srcData.mwb_lc_part2_content_override;
    this.mwb_lc_cbs[source_lang] = srcData.mwb_lc_cbs || '';
    this.mwb_lc_cbs_time_override = localOverride ? this.mwb_lc_cbs_time_override : srcData.mwb_lc_cbs_time_override;
    this.mwb_song_conclude = srcData.mwb_song_conclude || '';
    this.mwb_song_conclude_override = srcData.mwb_song_conclude_override;
    this.mwb_co_talk_title = srcData.mwb_co_talk_title || '';
  }

  if (!forPocket || (forPocket && !coordinatorRole)) {
    this.w_co_talk_title = srcData.w_co_talk_title || '';
    this.w_study_date_locale[source_lang] = srcData.w_study_date_locale || '';
    this.w_study_title[source_lang] = srcData.w_study_title || '';
    this.w_study_opening_song = srcData.w_study_opening_song || '';
    this.w_study_concluding_song = srcData.w_study_concluding_song || '';
  }

  this.keepOverride = localOverride ? this.keepOverride : new Date().toISOString();

  await appDb.sources.put(this, this.weekOf);
  const weekExist = Sources.get(this.weekOf);

  if (!weekExist) {
    await Sources.add(this.weekOf);
  }
};

SourceClass.prototype.local = function () {
  try {
    const { source_lang } = Setting;
    const lang = source_lang.toUpperCase();
    const assTypeList = AssignmentType.local();

    let obj = {};
    let indexType;

    obj.weekOf = this.weekOf;
    obj.mwb_week_date_locale = this.mwb_week_date_locale[lang] || '';
    obj.mwb_weekly_bible_reading = this.mwb_weekly_bible_reading[lang] || '';
    obj.mwb_song_first = this.mwb_song_first || '';
    obj.mwb_tgw_talk = this.mwb_tgw_talk[lang] || '';
    obj.mwb_tgw_bread = this.mwb_tgw_bread[lang] || '';
    obj.mwb_ayf_count = this.mwb_ayf_count || 0;

    obj.mwb_ayf_part1_type = '';
    if (typeof this.mwb_ayf_part1_type === 'object') {
      if (this.mwb_ayf_part1_type[lang] && this.mwb_ayf_part1_type[lang] !== '')
        obj.mwb_ayf_part1_type = +this.mwb_ayf_part1_type[lang];
    }
    if (this.mwb_ayf_part1_type && typeof this.mwb_ayf_part1_type !== 'object') {
      obj.mwb_ayf_part1_type = +this.mwb_ayf_part1_type;
    }

    indexType = assTypeList.findIndex((type) => type.value === obj.mwb_ayf_part1_type);
    obj.mwb_ayf_part1_type_name = indexType >= 0 ? assTypeList[indexType].label : '';
    obj.mwb_ayf_part1_time = this.mwb_ayf_part1_time || '';
    obj.mwb_ayf_part1 = this.mwb_ayf_part1[lang] || '';

    obj.mwb_ayf_part2_type = '';
    if (typeof this.mwb_ayf_part2_type === 'object') {
      if (this.mwb_ayf_part2_type[lang] && this.mwb_ayf_part2_type[lang] !== '')
        obj.mwb_ayf_part2_type = +this.mwb_ayf_part2_type[lang];
    }
    if (this.mwb_ayf_part2_type && typeof this.mwb_ayf_part2_type !== 'object') {
      obj.mwb_ayf_part2_type = +this.mwb_ayf_part2_type;
    }

    indexType = assTypeList.findIndex((type) => type.value === obj.mwb_ayf_part2_type);
    obj.mwb_ayf_part2_type_name = indexType >= 0 ? assTypeList[indexType].label : '';

    obj.mwb_ayf_part2_time = this.mwb_ayf_part2_time || '';
    obj.mwb_ayf_part2 = this.mwb_ayf_part2[lang] || '';

    obj.mwb_ayf_part3_type = '';
    if (typeof this.mwb_ayf_part3_type === 'object') {
      if (this.mwb_ayf_part3_type[lang] && this.mwb_ayf_part3_type[lang] !== '')
        obj.mwb_ayf_part3_type = +this.mwb_ayf_part3_type[lang];
    }
    if (this.mwb_ayf_part3_type && typeof this.mwb_ayf_part3_type !== 'object') {
      obj.mwb_ayf_part3_type = +this.mwb_ayf_part3_type;
    }

    indexType = assTypeList.findIndex((type) => type.value === obj.mwb_ayf_part3_type);
    obj.mwb_ayf_part3_type_name = indexType >= 0 ? assTypeList[indexType].label : '';

    obj.mwb_ayf_part3_time = this.mwb_ayf_part3_time || '';
    obj.mwb_ayf_part3 = this.mwb_ayf_part3[lang] || '';

    obj.mwb_ayf_part4_type = '';
    if (typeof this.mwb_ayf_part4_type === 'object') {
      if (this.mwb_ayf_part4_type[lang] && this.mwb_ayf_part4_type[lang] !== '')
        obj.mwb_ayf_part4_type = +this.mwb_ayf_part4_type[lang];
    }
    if (this.mwb_ayf_part4_type && typeof this.mwb_ayf_part4_type !== 'object') {
      obj.mwb_ayf_part4_type = +this.mwb_ayf_part4_type;
    }

    indexType = assTypeList.findIndex((type) => type.value === obj.mwb_ayf_part4_type);
    obj.mwb_ayf_part4_type_name = indexType >= 0 ? assTypeList[indexType].label : '';

    if (this.mwb_ayf_part4_time) {
      if (typeof this.mwb_ayf_part4_time === 'object') {
        obj.mwb_ayf_part4_time = '';
      } else {
        obj.mwb_ayf_part4_time = this.mwb_ayf_part4_time;
      }
    } else {
      obj.mwb_ayf_part4_time = '';
    }

    obj.mwb_ayf_part4 = this.mwb_ayf_part4[lang] || '';

    obj.mwb_song_middle = this.mwb_song_middle || '';
    obj.mwb_lc_count = this.mwb_lc_count || 0;
    obj.mwb_lc_count_override = this.mwb_lc_count_override;
    obj.mwb_lc_part1_time = this.mwb_lc_part1_time || '';
    obj.mwb_lc_part1_time_override = this.mwb_lc_part1_time_override || '';
    obj.mwb_lc_part1 = this.mwb_lc_part1[lang] || '';
    obj.mwb_lc_part1_override = this.mwb_lc_part1_override[lang] || '';
    obj.mwb_lc_part1_content = this.mwb_lc_part1_content[lang] || '';
    obj.mwb_lc_part1_content_override = this.mwb_lc_part1_content_override[lang] || '';
    obj.mwb_lc_part2_time = this.mwb_lc_part2_time || '';
    obj.mwb_lc_part2_time_override = this.mwb_lc_part2_time_override || '';
    obj.mwb_lc_part2 = this.mwb_lc_part2[lang] || '';
    obj.mwb_lc_part2_override = this.mwb_lc_part2_override[lang] || '';
    obj.mwb_lc_part2_content = this.mwb_lc_part2_content[lang] || '';
    obj.mwb_lc_part2_content_override = this.mwb_lc_part2_content_override[lang] || '';
    obj.mwb_lc_cbs = this.mwb_lc_cbs[lang] || '';
    obj.mwb_lc_cbs_time_override = this.mwb_lc_cbs_time_override || '';
    obj.mwb_song_conclude = this.mwb_song_conclude || '';
    obj.mwb_song_conclude_override = this.mwb_song_conclude_override || '';
    obj.mwb_co_talk_title = this.mwb_co_talk_title || '';
    obj.w_co_talk_title = this.w_co_talk_title || '';
    obj.w_study_date_locale = this.w_study_date_locale[lang] || '';
    obj.w_study_title = this.w_study_title[lang] || '';
    obj.w_study_opening_song = this.w_study_opening_song || '';
    obj.w_study_concluding_song = this.w_study_concluding_song || '';

    return obj;
  } catch (err) {
    throw new Error(err);
  }
};

SourceClass.prototype.countAssignmentsInfo = function () {
  let assTotal = 0;
  let assAssigned = 0;

  const classCount = Setting.class_count;
  const openingPrayerAutoAssign = Setting.opening_prayer_MM_autoAssign;

  const schedData = Schedules.get(this.weekOf);
  const sourceData = this.local();

  if (schedData.noMMeeting) {
    return { total: 0, assigned: 0 };
  }

  // chairman
  assTotal = assTotal + 1;

  // chairman aux
  if (schedData.week_type === 1 && classCount > 1) {
    assTotal = assTotal + 1;
  }

  if (schedData.chairmanMM_A && schedData.chairmanMM_A !== '') {
    assAssigned = assAssigned + 1;
  }

  if (schedData.chairmanMM_B && schedData.chairmanMM_B !== '') {
    assAssigned = assAssigned + 1;
  }

  // opening prayer
  if (!openingPrayerAutoAssign) {
    assTotal = assTotal + 1;
  }

  if (!openingPrayerAutoAssign && schedData.opening_prayerMM && schedData.opening_prayerMM !== '') {
    assAssigned = assAssigned + 1;
  }

  // TGW 10 Talk
  assTotal = assTotal + 1;

  if (schedData.tgw_talk && schedData.tgw_talk !== '') {
    assAssigned = assAssigned + 1;
  }

  // TGW 10 Gems
  assTotal = assTotal + 1;

  if (schedData.tgw_gems && schedData.tgw_gems !== '') {
    assAssigned = assAssigned + 1;
  }

  // bible reading
  assTotal = assTotal + 1;

  // aux
  if (schedData.week_type === 1 && classCount > 1) {
    assTotal = assTotal + 1;
  }

  if (schedData.bRead_stu_A && schedData.bRead_stu_A !== '') {
    assAssigned = assAssigned + 1;
  }

  if (schedData.bRead_stu_B && schedData.bRead_stu_B !== '') {
    assAssigned = assAssigned + 1;
  }

  // field ministry
  for (let a = 1; a <= 4; a++) {
    const assType = `mwb_ayf_part${a}_type`;
    const assValue = sourceData[assType];

    // bro discussion part
    if (assValue === 127) {
      assTotal = assTotal + 1;
    }

    // student discussion part
    if (
      assValue === 101 ||
      assValue === 102 ||
      assValue === 103 ||
      assValue === 108 ||
      assValue === 123 ||
      assValue === 124 ||
      assValue === 125 ||
      (assValue >= 140 && assValue < 170) ||
      (assValue >= 170 && assValue < 200)
    ) {
      assTotal = assTotal + 2;

      // aux
      if (schedData.week_type === 1 && classCount > 1) {
        assTotal = assTotal + 2;
      }
    }

    // talk part
    if (assValue === 104) {
      assTotal = assTotal + 1;

      // aux
      if (schedData.week_type === 1 && classCount > 1) {
        assTotal = assTotal + 1;
      }
    }

    // explaining beliefs part
    if (assValue === 126) {
      const assSrc = `mwb_ayf_part${a}`;
      const srcValue = sourceData[assSrc];

      const isTalk = checkAYFExplainingBeliefsAssignment(srcValue);

      if (isTalk) {
        assTotal = assTotal + 1;

        // aux
        if (schedData.week_type === 1 && classCount > 1) {
          assTotal = assTotal + 1;
        }
      }

      if (!isTalk) {
        assTotal = assTotal + 2;

        // aux
        if (schedData.week_type === 1 && classCount > 1) {
          assTotal = assTotal + 2;
        }
      }
    }

    const stuFieldA = `ass${a}_stu_A`;
    const assFieldA = `ass${a}_ass_A`;
    const stuFieldB = `ass${a}_stu_B`;
    const assFieldB = `ass${a}_ass_B`;

    if (schedData[stuFieldA] && schedData[stuFieldA] !== '') {
      assAssigned = assAssigned + 1;
    }

    if (schedData[assFieldA] && schedData[assFieldA] !== '') {
      assAssigned = assAssigned + 1;
    }

    if (schedData[stuFieldB] && schedData[stuFieldB] !== '') {
      assAssigned = assAssigned + 1;
    }

    if (schedData[assFieldB] && schedData[assFieldB] !== '') {
      assAssigned = assAssigned + 1;
    }
  }

  // LC Part 1
  const noAssignLC1 = this.noAssignLC1();
  if (!noAssignLC1) {
    assTotal = assTotal + 1;
  }

  if (schedData.lc_part1 && schedData.lc_part1 !== '') {
    assAssigned = assAssigned + 1;
  }

  // LC Part 2
  let cnLC2 = false;
  const noAssignLC2 = this.noAssignLC2();
  if (sourceData.mwb_lc_count_override === 0 && sourceData.mwb_lc_count === 2) {
    cnLC2 = !noAssignLC2;
  }
  if (sourceData.mwb_lc_count_override !== 0 && sourceData.mwb_lc_count_override === 2) {
    cnLC2 = !noAssignLC2;
  }

  if (cnLC2) {
    assTotal = assTotal + 1;

    if (schedData.lc_part2 && schedData.lc_part2 !== '') {
      assAssigned = assAssigned + 1;
    }
  }

  // CBS
  if (schedData.week_type === 1) {
    // Conductor
    assTotal = assTotal + 1;

    if (schedData.cbs_conductor && schedData.cbs_conductor !== '') {
      assAssigned = assAssigned + 1;
    }

    // Reader
    const noAssignCBSReader = checkCBSReader(sourceData.mwb_lc_cbs);
    if (!noAssignCBSReader) {
      assTotal = assTotal + 1;
    }

    if (schedData.cbs_reader && schedData.cbs_reader !== '') {
      assAssigned = assAssigned + 1;
    }
  }

  // Closing Prayer
  assTotal = assTotal + 1;

  if (schedData.closing_prayerMM && schedData.closing_prayerMM !== '') {
    assAssigned = assAssigned + 1;
  }

  return { total: assTotal, assigned: assAssigned };
};

SourceClass.prototype.isElderPartLC1 = function () {
  const localSrc = this.local();

  let source = '';
  let content = '';
  if (localSrc.mwb_lc_part1_time_override) {
    source = localSrc.mwb_lc_part1_override;
    content = localSrc.mwb_lc_part1_content_override;
  }
  if (!localSrc.mwb_lc_part1_time_override) {
    source = localSrc.mwb_lc_part1;
    content = localSrc.mwb_lc_part1_content;
  }

  const isElderPart = checkLCElderAssignments(source, content);
  return isElderPart;
};

SourceClass.prototype.isElderPartLC2 = function () {
  const localSrc = this.local();

  let source = '';
  let content = '';

  if (
    localSrc.mwb_lc_count_override !== 0 &&
    localSrc.mwb_lc_count_override === 2 &&
    localSrc.mwb_lc_part2_time_override
  ) {
    source = localSrc.mwb_lc_part2_override;
    content = localSrc.mwb_lc_part2_content_override;
  }
  if (localSrc.mwb_lc_count_override === 0 && localSrc.mwb_lc_count === 2 && !localSrc.mwb_lc_part2_time_override) {
    source = localSrc.mwb_lc_part2;
    content = localSrc.mwb_lc_part2_content;
  }

  const isElderPart = checkLCElderAssignments(source, content);
  return isElderPart;
};

SourceClass.prototype.noAssignLC1 = function () {
  const localSrc = this.local();

  let src = '';
  if (localSrc.mwb_lc_part1_time_override) {
    src = localSrc.mwb_lc_part1_override;
  }
  if (!localSrc.mwb_lc_part1_time_override) {
    src = localSrc.mwb_lc_part1;
  }

  const noAssign = checkLCAssignments(src);
  return noAssign;
};

SourceClass.prototype.noAssignLC2 = function () {
  const localSrc = this.local();

  let src = '';
  if (
    localSrc.mwb_lc_count_override !== 0 &&
    localSrc.mwb_lc_count_override === 2 &&
    localSrc.mwb_lc_part2_time_override
  ) {
    src = localSrc.mwb_lc_part2_override;
  }
  if (localSrc.mwb_lc_count_override === 0 && localSrc.mwb_lc_count === 2 && !localSrc.mwb_lc_part2_time_override) {
    src = localSrc.mwb_lc_part2;
  }

  const noAssign = checkLCAssignments(src);
  return noAssign;
};
