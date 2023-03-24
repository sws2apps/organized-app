import appDb from '../indexedDb/mainDb';
import { checkCBSReader, checkLCAssignments } from '../utils/sourceMaterial';
import { AssignmentType } from './AssignmentType';
import { Schedules } from './Schedules';
import { Setting } from './Setting';
import { Sources } from './Sources';

export class SourceClass {
  constructor(weekOf) {
    this.weekOf = weekOf;
    this.weekDate_src = {};
    this.weeklyBibleReading_src = {};
    this.songFirst_src = '';
    this.tgwTalk_src = {};
    this.bibleReading_src = {};
    this.bibleReading_study = '';
    this.ayfCount = 0;
    this.ass1_type = {};
    this.ass1_study = '';
    this.ass1_time = '';
    this.ass1_src = {};
    this.ass2_type = {};
    this.ass2_study = '';
    this.ass2_time = '';
    this.ass2_src = {};
    this.ass3_type = {};
    this.ass3_study = '';
    this.ass3_time = '';
    this.ass3_src = {};
    this.ass4_type = {};
    this.ass4_study = '';
    this.ass4_time = '';
    this.ass4_src = {};
    this.songMiddle_src = '';
    this.lcCount = 0;
    this.lcCount_override = 0;
    this.lcPart1_time = '';
    this.lcPart1_src = {};
    this.lcPart1_content = {};
    this.lcPart1_time_override = '';
    this.lcPart1_src_override = {};
    this.lcPart1_content_override = {};
    this.lcPart2_time = '';
    this.lcPart2_src = {};
    this.lcPart2_content = {};
    this.lcPart2_time_override = '';
    this.lcPart2_src_override = {};
    this.lcPart2_content_override = {};
    this.cbs_src = {};
    this.cbs_time_override = '';
    this.co_talk_title = '';
    this.songConclude_src = '';
    this.songConclude_src_override = '';
    this.keepOverride = undefined;
  }
}

SourceClass.prototype.loadDetails = async function () {
  const appData = await appDb.src.get({ weekOf: this.weekOf });
  if (!appData) return;

  this.weekDate_src = appData.weekDate_src || {};
  this.weeklyBibleReading_src = appData.weeklyBibleReading_src || {};
  this.songFirst_src = appData.songFirst_src || '';
  this.tgwTalk_src = appData.tgwTalk_src || {};
  this.bibleReading_src = appData.bibleReading_src || {};
  this.bibleReading_study = appData.bibleReading_study || '';
  this.ayfCount = appData.ayfCount || 0;
  this.ass1_type = appData.ass1_type || {};
  this.ass1_time = appData.ass1_time;
  this.ass1_study = appData.ass1_study;
  this.ass1_src = appData.ass1_src || {};
  this.ass2_type = appData.ass2_type || {};
  this.ass2_time = appData.ass2_time;
  this.ass2_study = appData.ass2_study;
  this.ass2_src = appData.ass2_src || {};
  this.ass3_type = appData.ass3_type || {};
  this.ass3_time = appData.ass3_time;
  this.ass3_study = appData.ass3_study;
  this.ass3_src = appData.ass3_src || {};
  this.ass4_type = appData.ass4_type || {};
  this.ass4_time = appData.ass4_time;
  this.ass4_study = appData.ass4_study;
  this.ass4_src = appData.ass4_src || {};
  this.songMiddle_src = appData.songMiddle_src || '';
  this.lcCount = appData.lcCount || 0;
  this.lcCount_override = appData.lcCount_override || 0;
  this.lcPart1_time = appData.lcPart1_time;
  this.lcPart1_src = appData.lcPart1_src || {};
  this.lcPart1_content = appData.lcPart1_content || {};
  this.lcPart1_time_override = appData.lcPart1_time_override || 0;
  this.lcPart1_src_override = appData.lcPart1_src_override || {};
  this.lcPart1_content_override = appData.lcPart1_content_override || {};
  this.lcPart2_time = appData.lcPart2_time;
  this.lcPart2_src = appData.lcPart2_src || {};
  this.lcPart2_content = appData.lcPart2_content || {};
  this.lcPart2_time_override = appData.lcPart2_time_override || '';
  this.lcPart2_src_override = appData.lcPart2_src_override || {};
  this.lcPart2_content_override = appData.lcPart2_content_override || {};
  this.cbs_src = appData.cbs_src || {};
  this.cbs_time_override = appData.cbs_time_override;
  this.songConclude_src = appData.songConclude_src || '';
  this.songConclude_src_override = appData.songConclude_src_override || '';
  this.co_talk_title = appData.co_talk_title || '';
};

SourceClass.prototype.save = async function (srcData, localOverride) {
  let { source_lang } = Setting;
  source_lang = source_lang.toUpperCase();

  this.weekDate_src[source_lang] = srcData.weekDate_src;
  this.weeklyBibleReading_src[source_lang] = srcData.weeklyBibleReading_src;
  this.songFirst_src = srcData.songFirst_src;
  this.tgwTalk_src[source_lang] = srcData.tgwTalk_src;
  this.bibleReading_src[source_lang] = srcData.bibleReading_src;
  this.bibleReading_study = srcData.bibleReading_study;
  this.ayfCount = srcData.ayfCount;
  this.ass1_type[source_lang] = srcData.ass1_type;
  this.ass1_time = srcData.ass1_time;
  this.ass1_study = srcData.ass1_study;
  this.ass1_src[source_lang] = srcData.ass1_src;
  this.ass2_type[source_lang] = srcData.ass2_type;
  this.ass2_time = srcData.ass2_time;
  this.ass2_study = srcData.ass2_study;
  this.ass2_src[source_lang] = srcData.ass2_src;
  this.ass3_type[source_lang] = srcData.ass3_type;
  this.ass3_time = srcData.ass3_time;
  this.ass3_study = srcData.ass3_study;
  this.ass3_src[source_lang] = srcData.ass3_src;
  this.ass4_type[source_lang] = srcData.ass4_type;
  this.ass4_time = srcData.ass4_time;
  this.ass4_study = srcData.ass4_study;
  this.ass4_src[source_lang] = srcData.ass4_src;
  this.songMiddle_src = srcData.songMiddle_src;
  this.lcCount = srcData.lcCount;
  this.lcCount_override = localOverride ? this.lcCount_override : srcData.lcCount_override;
  this.lcPart1_time = srcData.lcPart1_time;
  this.lcPart1_time_override = localOverride ? this.lcPart1_time_override : srcData.lcPart1_time_override;
  this.lcPart1_src[source_lang] = srcData.lcPart1_src;
  this.lcPart1_src_override[source_lang] = localOverride
    ? this.lcPart1_src_override[source_lang]
    : srcData.lcPart1_src_override;
  this.lcPart1_content[source_lang] = srcData.lcPart1_content;
  this.lcPart1_content_override[source_lang] = localOverride
    ? this.lcPart1_content_override[source_lang]
    : srcData.lcPart1_content_override;
  this.lcPart2_time = srcData.lcPart2_time;
  this.lcPart2_time_override = localOverride ? this.lcPart2_time_override : srcData.lcPart2_time_override;
  this.lcPart2_src[source_lang] = srcData.lcPart2_src;
  this.lcPart2_src_override[source_lang] = localOverride
    ? this.lcPart2_src_override[source_lang]
    : srcData.lcPart2_src_override;
  this.lcPart2_content[source_lang] = srcData.lcPart2_content;
  this.lcPart2_content_override[source_lang] = localOverride
    ? this.lcPart2_content_override[source_lang]
    : srcData.lcPart2_content_override;
  this.cbs_src[source_lang] = srcData.cbs_src;
  this.cbs_time_override = localOverride ? this.cbs_time_override : srcData.cbs_time_override;
  this.songConclude_src = srcData.songConclude_src;
  this.songConclude_src_override = srcData.songConclude_src_override;
  this.co_talk_title = srcData.co_talk_title;
  this.keepOverride = localOverride ? this.keepOverride : new Date().toISOString();

  await appDb.src.put(this, this.weekOf);
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
    obj.weekDate_src = this.weekDate_src[lang] || '';
    obj.weeklyBibleReading_src = this.weeklyBibleReading_src[lang] || '';
    obj.songFirst_src = this.songFirst_src;
    obj.tgwTalk_src = this.tgwTalk_src[lang] || '';
    obj.bibleReading_src = this.bibleReading_src[lang] || '';
    obj.bibleReading_study = this.bibleReading_study;
    obj.ayfCount = this.ayfCount;

    obj.ass1_type = '';
    if (typeof this.ass1_type === 'object') {
      if (this.ass1_type[lang] && this.ass1_type[lang] !== '') obj.ass1_type = +this.ass1_type[lang];
    }
    if (this.ass1_type && typeof this.ass1_type !== 'object') {
      obj.ass1_type = +this.ass1_type;
    }

    indexType = assTypeList.findIndex((type) => type.value === obj.ass1_type);
    obj.ass1_type_name = indexType >= 0 ? assTypeList[indexType].label : '';
    obj.ass1_time = this.ass1_time || '';
    obj.ass1_study = this.ass1_study || '';
    obj.ass1_src = this.ass1_src[lang] || '';

    obj.ass2_type = '';
    if (typeof this.ass2_type === 'object') {
      if (this.ass2_type[lang] && this.ass2_type[lang] !== '') obj.ass2_type = +this.ass2_type[lang];
    }
    if (this.ass2_type && typeof this.ass2_type !== 'object') {
      obj.ass2_type = +this.ass2_type;
    }

    indexType = assTypeList.findIndex((type) => type.value === obj.ass2_type);
    obj.ass2_type_name = indexType >= 0 ? assTypeList[indexType].label : '';

    obj.ass2_time = this.ass2_time || '';
    obj.ass2_study = this.ass2_study || '';
    obj.ass2_src = this.ass2_src[lang] || '';

    obj.ass3_type = '';
    if (typeof this.ass3_type === 'object') {
      if (this.ass3_type[lang] && this.ass3_type[lang] !== '') obj.ass3_type = +this.ass3_type[lang];
    }
    if (this.ass3_type && typeof this.ass3_type !== 'object') {
      obj.ass3_type = +this.ass3_type;
    }

    indexType = assTypeList.findIndex((type) => type.value === obj.ass3_type);
    obj.ass3_type_name = indexType >= 0 ? assTypeList[indexType].label : '';

    obj.ass3_time = this.ass3_time || '';
    obj.ass3_study = this.ass3_study || '';
    obj.ass3_src = this.ass3_src[lang] || '';

    obj.ass4_type = '';
    if (typeof this.ass4_type === 'object') {
      if (this.ass4_type[lang] && this.ass4_type[lang] !== '') obj.ass4_type = +this.ass4_type[lang];
    }
    if (this.ass4_type && typeof this.ass4_type !== 'object') {
      obj.ass4_type = +this.ass4_type;
    }

    indexType = assTypeList.findIndex((type) => type.value === obj.ass4_type);
    obj.ass4_type_name = indexType >= 0 ? assTypeList[indexType].label : '';

    obj.ass4_time = this.ass4_time ? (typeof this.ass4_time === 'object' ? '' : this.ass4_time) : '';
    obj.ass4_study = this.ass4_study || '';
    obj.ass4_src = this.ass4_src[lang] || '';

    obj.songMiddle_src = this.songMiddle_src;
    obj.lcCount = this.lcCount;
    obj.lcCount_override = this.lcCount_override;
    obj.lcPart1_time = this.lcPart1_time || '';
    obj.lcPart1_time_override = this.lcPart1_time_override || '';
    obj.lcPart1_src = this.lcPart1_src[lang] || '';
    obj.lcPart1_src_override = this.lcPart1_src_override[lang] || '';
    obj.lcPart1_content = this.lcPart1_content[lang] || '';
    obj.lcPart1_content_override = this.lcPart1_content_override[lang] || '';
    obj.lcPart2_time = this.lcPart2_time || '';
    obj.lcPart2_time_override = this.lcPart2_time_override || '';
    obj.lcPart2_src = this.lcPart2_src[lang] || '';
    obj.lcPart2_src_override = this.lcPart2_src_override[lang] || '';
    obj.lcPart2_content = this.lcPart2_content[lang] || '';
    obj.lcPart2_content_override = this.lcPart2_content_override[lang] || '';
    obj.cbs_src = this.cbs_src[lang] || '';
    obj.cbs_time_override = this.cbs_time_override || '';
    obj.songConclude_src = this.songConclude_src || '';
    obj.songConclude_src_override = this.songConclude_src_override || '';
    obj.co_talk_title = this.co_talk_title || '';
    return obj;
  } catch (err) {
    throw new Error(err);
  }
};

SourceClass.prototype.countAssignmentsInfo = function () {
  let assTotal = 0;
  let assAssigned = 0;

  const classCount = Setting.class_count;

  const schedData = Schedules.get(this.weekOf);
  const sourceData = this.local();

  if (schedData.noMeeting) {
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
  assTotal = assTotal + 1;

  if (schedData.opening_prayer && schedData.opening_prayer !== '') {
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
    const assType = `ass${a}_type`;
    const assValue = sourceData[assType];

    // discussion part
    if (
      assValue === 101 ||
      assValue === 102 ||
      assValue === 103 ||
      assValue === 108 ||
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
  const noAssignLC1 = checkLCAssignments(sourceData.lcPart1_src);
  if (!noAssignLC1) {
    assTotal = assTotal + 1;
  }

  if (schedData.lc_part1 && schedData.lc_part1 !== '') {
    assAssigned = assAssigned + 1;
  }

  // LC Part 2
  let cnLC2 = false;
  if (sourceData.lcCount_override === 0 && sourceData.lcCount === 2) {
    const noAssignLC2 = checkLCAssignments(sourceData.lcPart2_src);
    cnLC2 = !noAssignLC2;
  }
  if (sourceData.lcCount_override !== 0 && sourceData.lcCount_override === 2) {
    const noAssignLC2 = checkLCAssignments(sourceData.lcPart2_src_override);
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
    const noAssignCBSReader = checkCBSReader(sourceData.cbs_src);
    if (!noAssignCBSReader) {
      assTotal = assTotal + 1;
    }

    if (schedData.cbs_reader && schedData.cbs_reader !== '') {
      assAssigned = assAssigned + 1;
    }
  }

  // Closing Prayer
  assTotal = assTotal + 1;

  if (schedData.closing_prayer && schedData.closing_prayer !== '') {
    assAssigned = assAssigned + 1;
  }

  return { total: assTotal, assigned: assAssigned };
};
