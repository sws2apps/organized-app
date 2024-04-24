import { LANGUAGE_LIST } from '@constants/index';
import { AssignmentCode } from '@definition/assignment';
import { getTranslation } from '@services/i18n/translation';
import appDb from '@shared/indexedDb/appDb';

export const dbAssignmentUpdate = async () => {
  const bReadObj = {};
  const initCallObj = {};
  const rvObj = {};
  const bsObj = {};
  const talkObj = {};
  const icVideoObj = {};
  const rvVideoObj = {};
  const otherObj = {};
  const memorialObj = {};
  const memorialVideoObj = {};
  const chairmanMMObj = {};
  const prayerMMObj = {};
  const tgwTalkObj = {};
  const tgwGemsObj = {};
  const lcPartObj = {};
  const cbsConductorObj = {};
  const cbsReaderObj = {};
  const initCallVariationsObj: { [language: string]: string } = {};
  const rvVariationsObj: { [language: string]: string } = {};
  const chairmanWMObj = {};
  const prayerWMObj = {};
  const speakerObj = {};
  const speakerSymposiumObj = {};
  const wtStudyReaderObj = {};
  const wtStudyConductor = {};
  const auxClassroomMMObj = {};
  const assistantOnlyMMObj = {};

  LANGUAGE_LIST.forEach((lang) => {
    const langCode = lang.code.toUpperCase();

    bReadObj[langCode] = getTranslation({ key: 'tr_bibleReading' });
    initCallObj[langCode] = getTranslation({ key: 'tr_initialCall' });
    rvObj[langCode] = getTranslation({ key: 'tr_returnVisit' });
    bsObj[langCode] = getTranslation({ key: 'tr_bibleStudy' });
    talkObj[langCode] = getTranslation({ key: 'tr_talk' });
    otherObj[langCode] = getTranslation({ key: 'tr_otherPart' });
    icVideoObj[langCode] = getTranslation({ key: 'tr_initialCallVideo' });
    rvVideoObj[langCode] = getTranslation({ key: 'tr_returnVisitVideo' });
    memorialObj[langCode] = getTranslation({ key: 'tr_memorialInvite' });
    memorialVideoObj[langCode] = getTranslation({
      key: 'tr_memorialInviteVideo',
      language: lang.code,
    });
    chairmanMMObj[langCode] = getTranslation({
      key: 'tr_chairmanMidweekMeeting',
      language: lang.code,
    });
    prayerMMObj[langCode] = getTranslation({ key: 'tr_prayerMidweekMeeting' });
    tgwTalkObj[langCode] = getTranslation({ key: 'tr_tgwTalk' });
    tgwGemsObj[langCode] = getTranslation({ key: 'tr_tgwGems' });
    lcPartObj[langCode] = getTranslation({ key: 'tr_lcPart' });
    cbsConductorObj[langCode] = getTranslation({ key: 'tr_cbsConductor' });
    cbsReaderObj[langCode] = getTranslation({ key: 'tr_cbsReader' });
    initCallVariationsObj[langCode] = getTranslation({
      key: 'tr_initialCallVariations',
      language: lang.code,
    });
    rvVariationsObj[langCode] = getTranslation({
      key: 'tr_returnVisitVariations',
      language: lang.code,
    });
    chairmanWMObj[langCode] = getTranslation({
      key: 'tr_chairmanWeekendMeeting',
      language: lang.code,
    });
    prayerWMObj[langCode] = getTranslation({ key: 'tr_prayerWeekendMeeting' });
    speakerObj[langCode] = getTranslation({ key: 'tr_speaker' });
    speakerSymposiumObj[langCode] = getTranslation({
      key: 'tr_speakerSymposium',
      language: lang.code,
    });
    wtStudyReaderObj[langCode] = getTranslation({ key: 'tr_watchtowerStudyReader' });
    wtStudyConductor[langCode] = getTranslation({ key: 'tr_watchtowerStudyConductor' });
    auxClassroomMMObj[langCode] = getTranslation({ key: 'tr_auxClassCounselor' });
    assistantOnlyMMObj[langCode] = getTranslation({ key: 'tr_assistantOnly' });
  });

  await appDb.assignment.clear();

  await appDb.assignment.put({
    code: AssignmentCode.MM_BibleReading,
    maleOnly: true,
    assignable: true,
    type: 'tgw',
    assignment_type_name: {
      ...bReadObj,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.MM_InitialCall,
    maleOnly: false,
    assignable: true,
    type: 'ayf',
    assignment_type_name: {
      ...initCallObj,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.MM_ReturnVisit,
    maleOnly: false,
    assignable: true,
    type: 'ayf',
    assignment_type_name: {
      ...rvObj,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.MM_BibleStudy,
    maleOnly: false,
    assignable: true,
    type: 'ayf',
    assignment_type_name: {
      ...bsObj,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.MM_Talk,
    maleOnly: true,
    assignable: true,
    type: 'ayf',
    assignment_type_name: {
      ...talkObj,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.MM_InitialCallVideo,
    maleOnly: false,
    assignable: false,
    type: 'ayf',
    assignment_type_name: {
      ...icVideoObj,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.MM_ReturnVisitVideo,
    maleOnly: false,
    assignable: false,
    type: 'ayf',
    assignment_type_name: {
      ...rvVideoObj,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.MM_Other,
    maleOnly: false,
    assignable: false,
    type: 'ayf',
    assignment_type_name: {
      ...otherObj,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.MM_Memorial,
    maleOnly: false,
    linkTo: AssignmentCode.MM_InitialCall,
    assignable: false,
    type: 'ayf',
    assignment_type_name: {
      ...memorialObj,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.MM_Chairman,
    maleOnly: true,
    assignable: true,
    type: 'mm',
    assignment_type_name: {
      ...chairmanMMObj,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.MM_Prayer,
    maleOnly: true,
    assignable: true,
    type: 'mm',
    assignment_type_name: {
      ...prayerMMObj,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.MM_TGWTalk,
    maleOnly: true,
    assignable: true,
    type: 'tgw',
    assignment_type_name: {
      ...tgwTalkObj,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.MM_TGWGems,
    maleOnly: true,
    assignable: true,
    type: 'tgw',
    assignment_type_name: {
      ...tgwGemsObj,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.MM_LCPart,
    maleOnly: true,
    assignable: true,
    type: 'lc',
    assignment_type_name: {
      ...lcPartObj,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.MM_CBSConductor,
    maleOnly: true,
    assignable: true,
    type: 'lc',
    assignment_type_name: {
      ...cbsConductorObj,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.MM_CBSReader,
    maleOnly: true,
    assignable: true,
    type: 'lc',
    assignment_type_name: {
      ...cbsReaderObj,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.MM_MemorialVideo,
    maleOnly: false,
    linkTo: AssignmentCode.MM_InitialCallVideo,
    assignable: false,
    type: 'ayf',
    assignment_type_name: {
      ...memorialVideoObj,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.WM_Chairman,
    maleOnly: true,
    assignable: true,
    assignment_type_name: {
      ...chairmanWMObj,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.WM_Prayer,
    maleOnly: true,
    assignable: true,
    assignment_type_name: {
      ...prayerWMObj,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.WM_Speaker,
    maleOnly: true,
    assignable: true,
    assignment_type_name: {
      ...speakerObj,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.WM_SpeakerSymposium,
    maleOnly: true,
    assignable: true,
    assignment_type_name: {
      ...speakerSymposiumObj,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.WM_WTStudyReader,
    maleOnly: true,
    assignable: true,
    assignment_type_name: {
      ...wtStudyReaderObj,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.WM_WTStudyConductor,
    maleOnly: true,
    assignable: true,
    assignment_type_name: {
      ...wtStudyConductor,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.MM_AuxiliaryCounselor,
    maleOnly: true,
    assignable: true,
    assignment_type_name: {
      ...auxClassroomMMObj,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.MM_AssistantOnly,
    maleOnly: true,
    assignable: true,
    assignment_type_name: {
      ...assistantOnlyMMObj,
    },
  });

  // handle initial call variation (140-169)
  let codeIndice = 140;
  for (const [key, value] of Object.entries(initCallVariationsObj)) {
    if (value && value !== '0' && codeIndice < 170) {
      const variations = value.split('|');
      for await (const variation of variations) {
        await appDb.assignment.put({
          code: codeIndice,
          maleOnly: false,
          linkTo: AssignmentCode.MM_InitialCall,
          assignable: false,
          type: 'ayf',
          assignment_type_name: {
            [key]: variation,
          },
        });

        codeIndice++;
      }
    }
  }

  // handle return call variation (170-199)
  codeIndice = 170;
  for (const [key, value] of Object.entries(rvVariationsObj)) {
    if (value && value !== '0' && codeIndice < 200) {
      const variations = value.split('|');
      for await (const variation of variations) {
        await appDb.assignment.put({
          code: codeIndice,
          maleOnly: false,
          linkTo: AssignmentCode.MM_ReturnVisit,
          assignable: false,
          type: 'ayf',
          assignment_type_name: {
            [key]: variation,
          },
        });

        codeIndice++;
      }
    }
  }
};
