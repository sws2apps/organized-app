import { LANGUAGE_LIST } from '@constants/index';
import { AssignmentCode } from '@definition/assignment';
import { getTranslation } from '@services/i18n/translation';
import appDb from '@db/appDb';

export const dbAssignmentUpdate = async () => {
  const bReadObj: { [language: string]: string } = {};
  const initCallObj: { [language: string]: string } = {};
  const rvObj: { [language: string]: string } = {};
  const bsObj: { [language: string]: string } = {};
  const talkObj: { [language: string]: string } = {};
  const icVideoObj: { [language: string]: string } = {};
  const rvVideoObj: { [language: string]: string } = {};
  const otherObj: { [language: string]: string } = {};
  const memorialObj: { [language: string]: string } = {};
  const memorialVideoObj: { [language: string]: string } = {};
  const chairmanMMObj: { [language: string]: string } = {};
  const prayerMMObj: { [language: string]: string } = {};
  const tgwTalkObj: { [language: string]: string } = {};
  const tgwGemsObj: { [language: string]: string } = {};
  const lcPartObj: { [language: string]: string } = {};
  const cbsConductorObj: { [language: string]: string } = {};
  const cbsReaderObj: { [language: string]: string } = {};
  const initCallVariationsObj: { [language: string]: string } = {};
  const rvVariationsObj: { [language: string]: string } = {};
  const chairmanWMObj: { [language: string]: string } = {};
  const prayerWMObj: { [language: string]: string } = {};
  const speakerObj: { [language: string]: string } = {};
  const speakerSymposiumObj: { [language: string]: string } = {};
  const wtStudyReaderObj: { [language: string]: string } = {};
  const wtStudyConductor: { [language: string]: string } = {};
  const auxClassroomMMObj: { [language: string]: string } = {};
  const assistantOnlyMMObj: { [language: string]: string } = {};
  const startingConversationObj: { [language: string]: string } = {};
  const followingUpObj: { [language: string]: string } = {};
  const makingDisciplesObj: { [language: string]: string } = {};
  const explainingBeliefsObj: { [language: string]: string } = {};
  const dicussionObj: { [language: string]: string } = {};

  const appLang = localStorage.getItem('ui_lang') || 'en';
  const langCode =
    LANGUAGE_LIST.find((record) => record.locale === appLang)?.code || 'E';

  const languages = [{ locale: appLang, code: langCode }];

  if (!languages.some((r) => r.locale === 'en'))
    languages.push({ locale: 'en', code: 'E' });

  for (const lang of languages) {
    const langCode = lang.code.toUpperCase();

    bReadObj[langCode] = getTranslation({
      key: 'tr_bibleReading',
      language: lang.locale,
    });
    initCallObj[langCode] = getTranslation({
      key: 'tr_initialCall',
      language: lang.locale,
    });
    rvObj[langCode] = getTranslation({
      key: 'tr_returnVisit',
      language: lang.locale,
    });
    bsObj[langCode] = getTranslation({
      key: 'tr_bibleStudy',
      language: lang.locale,
    });
    talkObj[langCode] = getTranslation({
      key: 'tr_talk',
      language: lang.locale,
    });
    otherObj[langCode] = getTranslation({
      key: 'tr_otherPart',
      language: lang.locale,
    });
    icVideoObj[langCode] = getTranslation({
      key: 'tr_initialCallVideo',
      language: lang.locale,
    });
    rvVideoObj[langCode] = getTranslation({
      key: 'tr_returnVisitVideo',
      language: lang.locale,
    });
    memorialObj[langCode] = getTranslation({
      key: 'tr_memorialInvite',
      language: lang.locale,
    });
    memorialVideoObj[langCode] = getTranslation({
      key: 'tr_memorialInviteVideo',
      language: lang.locale,
    });
    chairmanMMObj[langCode] = getTranslation({
      key: 'tr_chairmanMidweekMeeting',
      language: lang.locale,
    });
    prayerMMObj[langCode] = getTranslation({
      key: 'tr_prayerMidweekMeeting',
      language: lang.locale,
    });
    tgwTalkObj[langCode] = getTranslation({
      key: 'tr_tgwTalk',
      language: lang.locale,
    });
    tgwGemsObj[langCode] = getTranslation({
      key: 'tr_tgwGems',
      language: lang.locale,
    });
    lcPartObj[langCode] = getTranslation({
      key: 'tr_lcPart',
      language: lang.locale,
    });
    cbsConductorObj[langCode] = getTranslation({
      key: 'tr_cbsConductor',
      language: lang.locale,
    });
    cbsReaderObj[langCode] = getTranslation({
      key: 'tr_cbsReader',
      language: lang.locale,
    });
    initCallVariationsObj[langCode] = getTranslation({
      key: 'tr_initialCallVariations',
      language: lang.locale,
    });
    rvVariationsObj[langCode] = getTranslation({
      key: 'tr_returnVisitVariations',
      language: lang.locale,
    });
    chairmanWMObj[langCode] = getTranslation({
      key: 'tr_chairmanWeekendMeeting',
      language: lang.locale,
    });
    prayerWMObj[langCode] = getTranslation({
      key: 'tr_prayerWeekendMeeting',
      language: lang.locale,
    });
    speakerObj[langCode] = getTranslation({
      key: 'tr_speaker',
      language: lang.locale,
    });
    speakerSymposiumObj[langCode] = getTranslation({
      key: 'tr_speakerSymposium',
      language: lang.locale,
    });
    wtStudyReaderObj[langCode] = getTranslation({
      key: 'tr_watchtowerStudyReader',
      language: lang.locale,
    });
    wtStudyConductor[langCode] = getTranslation({
      key: 'tr_watchtowerStudyConductor',
      language: lang.locale,
    });
    auxClassroomMMObj[langCode] = getTranslation({
      key: 'tr_auxClassCounselor',
      language: lang.locale,
    });
    assistantOnlyMMObj[langCode] = getTranslation({ key: 'tr_assistantOnly' });
    startingConversationObj[langCode] = getTranslation({
      key: 'tr_startingConversation',
      language: lang.locale,
    });
    followingUpObj[langCode] = getTranslation({
      key: 'tr_followingUp',
      language: lang.locale,
    });
    makingDisciplesObj[langCode] = getTranslation({
      key: 'tr_makingDisciples',
      language: lang.locale,
    });
    explainingBeliefsObj[langCode] = getTranslation({
      key: 'tr_explainingBeliefs',
      language: lang.locale,
    });
    dicussionObj[langCode] = getTranslation({
      key: 'tr_discussion',
      language: lang.locale,
    });
  }

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
    type: 'ayf',
    assignment_type_name: {
      ...assistantOnlyMMObj,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.MM_StartingConversation,
    maleOnly: false,
    assignable: true,
    type: 'ayf',
    assignment_type_name: {
      ...startingConversationObj,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.MM_FollowingUp,
    maleOnly: false,
    assignable: true,
    type: 'ayf',
    assignment_type_name: {
      ...followingUpObj,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.MM_MakingDisciples,
    maleOnly: false,
    assignable: true,
    type: 'ayf',
    assignment_type_name: {
      ...makingDisciplesObj,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.MM_ExplainingBeliefs,
    maleOnly: false,
    assignable: true,
    type: 'ayf',
    assignment_type_name: {
      ...explainingBeliefsObj,
    },
  });

  await appDb.assignment.put({
    code: AssignmentCode.MM_Discussion,
    maleOnly: false,
    assignable: true,
    type: 'ayf',
    assignment_type_name: {
      ...dicussionObj,
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
