import { loadEPUB } from 'jw-epub-parser';
import { promiseGetRecoil, promiseSetRecoil } from 'recoil-outside';
import { dbSaveSrcData, dbGetYearList } from '../indexedDb/dbSourceMaterial';
import { assTypeAYFOnlyState, yearsListState } from '../states/sourceMaterial';

export const addEpubDataToDb = async (fileEPUB) => {
  const data = await loadEPUB(fileEPUB);
  await addDataToDb(data);
};

export const addJwDataToDb = async (dataJw) => {
  for await (const data of dataJw) {
    await addDataToDb(data);
  }
};

const addDataToDb = async (data) => {
  try {
    const assTypeList = await promiseGetRecoil(assTypeAYFOnlyState);
    for (let i = 0; i < data.weeksData.length; i++) {
      const src = data.weeksData[i];
      const cnAYF = src.ayfCount;

      const obj = {};
      let assType = '';

      obj.weekOf = src.weekDate;
      obj.weekDate_src = src.weekDateLocale;

      // Weekly Bible Reading
      obj.weeklyBibleReading_src = src.weeklyBibleReading;

      // Opening Song
      obj.songFirst_src = src.songFirst;

      // TGW Talk 10 min
      obj.tgwTalk_src = src.tgw10Talk;

      //Bible Reading Source
      obj.bibleReading_src = src.tgwBRead;
      obj.bibleReading_study = src.tgwBReadStudy;

      // AYF Count
      obj.ayfCount = src.ayfCount;

      //AYF1 Assignment Type
      assType = assTypeList.find((type) => type.label === src.ayfPart1Type).value;
      obj.ass1_type = assType;

      //AYF1 Assignment Time
      obj.ass1_time = src.ayfPart1Time;

      //AYF1 Assignment Study
      obj.ass1_study = src.ayfPart1Study;

      //AYF1 Assignment Source
      obj.ass1_src = src.ayfPart1;

      obj.ass2_type = '';
      obj.ass2_time = '';
      obj.ass2_study = '';
      obj.ass2_src = '';
      obj.ass3_type = '';
      obj.ass3_time = '';
      obj.ass3_study = '';
      obj.ass3_src = '';
      obj.ass4_type = '';
      obj.ass4_time = '';
      obj.ass4_study = '';
      obj.ass4_src = '';

      if (cnAYF > 1) {
        //AYF2 Assignment Type
        assType = assTypeList.find((type) => type.label === src.ayfPart2Type).value;
        obj.ass2_type = assType;

        //AYF2 Assignment Time
        obj.ass2_time = src.ayfPart2Time;

        //AYF2 Assignment Study
        obj.ass2_study = src.ayfPart2Study;

        //AYF2 Assignment Source
        obj.ass2_src = src.ayfPart2;
      }

      if (cnAYF > 2) {
        //AYF3 Assignment Type
        assType = assTypeList.find((type) => type.label === src.ayfPart3Type).value;
        obj.ass3_type = assType;

        //AYF3 Assignment Time
        obj.ass3_time = src.ayfPart3Time;

        //AYF3 Assignment Study
        obj.ass3_study = src.ayfPart3Study;

        //AYF3 Assignment Source
        obj.ass3_src = src.ayfPart3;
      }

      if (cnAYF > 3) {
        //AYF4 Assignment Type
        assType = assTypeList.find((type) => type.label === src.ayfPart4Type).value;
        obj.ass4_type = assType;

        //AYF4 Assignment Time
        obj.ass4_time = src.ayfPart4Time;

        //AYF4 Assignment Study
        obj.ass4_study = src.ayfPart4Study;

        //AYF3 Assignment Source
        obj.ass4_src = src.ayfPart2;
      }

      // Middle Song
      obj.songMiddle_src = src.songMiddle;

      // LC Count
      obj.lcCount = src.lcCount;

      // LC Part 1 Time
      obj.lcPart1_time = src.lcPart1Time;

      // LC Part 1 Source
      obj.lcPart1_src = src.lcPart1;

      // LC Part 1 Content
      obj.lcPart1_content = src.lcPart1Content;

      obj.lcPart2_time = '';
      obj.lcPart2_src = '';
      obj.lcPart2_content = '';

      // LC Part 2
      if (src.lcCount > 1) {
        // LC Part 2 Time
        obj.lcPart2_time = src.lcPart2Time;

        // LC Part 2 Source
        obj.lcPart2_src = src.lcPart2;

        // LC Part 2 Content
        obj.lcPart2_content = src.lcPart2Content;
      }

      // CBS Source
      obj.cbs_src = src.lcCBS;

      // Concluding Song
      obj.songConclude_src = src.songConclude;

      obj.week_type = 1;
      obj.noMeeting = false;
      obj.isOverride = false;

      await dbSaveSrcData(obj, true);
    }

    const years = await dbGetYearList();
    await promiseSetRecoil(yearsListState, years);
  } catch (err) {
    throw new Error(err);
  }
};
