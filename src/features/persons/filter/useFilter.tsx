import { useMemo } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { AssignmentCheckListColors } from '@definition/app';
import { AssignmentCode } from '@definition/assignment';
import { PersonsTab } from '@definition/person';
import {
  personsFilterOpenState,
  personsFiltersKeyState,
  personsTabState,
} from '@states/persons';

const useFilter = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const [filters, setPersonsFiltersKey] = useAtom(personsFiltersKeyState);

  const setActiveTab = useSetAtom(personsTabState);
  const setFilterOpen = useSetAtom(personsFilterOpenState);

  const checkedItems = filters.filter(
    (record) => typeof record === 'number'
  ) as number[];

  const assignments = useMemo(() => {
    return [
      {
        header: t('tr_midweekMeeting'),
        id: 'midweekMeeting',
        color: 'midweek-meeting' as AssignmentCheckListColors,
        items: [
          { code: AssignmentCode.MM_Chairman, name: t('tr_chairman') },
          { code: AssignmentCode.MM_Prayer, name: t('tr_prayer') },
          {
            code: AssignmentCode.MM_AuxiliaryCounselor,
            name: t('tr_auxClassCounselor'),
          },
        ],
      },
      {
        header: t('tr_treasuresPart'),
        id: 'treasuresPart',
        color: 'treasures-from-gods-word' as AssignmentCheckListColors,
        items: [
          { code: AssignmentCode.MM_TGWTalk, name: t('tr_tgwTalk') },
          { code: AssignmentCode.MM_TGWGems, name: t('tr_tgwGems') },
          { code: AssignmentCode.MM_BibleReading, name: t('tr_bibleReading') },
        ],
      },
      {
        header: t('tr_applyFieldMinistryPart'),
        id: 'applyFieldMinistryPart',
        color:
          'apply-yourself-to-the-field-ministry' as AssignmentCheckListColors,
        items: [
          { code: AssignmentCode.MM_Discussion, name: t('tr_discussion') },
          {
            code: AssignmentCode.MM_StartingConversation,
            name: t('tr_startingConversation'),
          },
          { code: AssignmentCode.MM_FollowingUp, name: t('tr_followingUp') },
          {
            code: AssignmentCode.MM_MakingDisciples,
            name: t('tr_makingDisciples'),
          },
          {
            code: AssignmentCode.MM_ExplainingBeliefs,
            name: t('tr_explainingBeliefs'),
          },
          { code: AssignmentCode.MM_Talk, name: t('tr_talk') },
          {
            code: AssignmentCode.MM_AssistantOnly,
            name: t('tr_assistantOnly'),
            borderTop: true,
          },
        ],
      },
      {
        header: t('tr_livingPart'),
        id: 'livingPart',
        color: 'living-as-christians' as AssignmentCheckListColors,
        items: [
          { code: AssignmentCode.MM_LCPart, name: t('tr_lcPart') },
          {
            code: AssignmentCode.MM_CBSConductor,
            name: t('tr_congregationBibleStudyConductor'),
          },
          {
            code: AssignmentCode.MM_CBSReader,
            name: t('tr_congregationBibleStudyReader'),
          },
        ],
      },
      {
        header: t('tr_weekendMeeting'),
        id: 'weekendMeeting',
        color: 'weekend-meeting' as AssignmentCheckListColors,
        items: [
          { code: AssignmentCode.WM_Chairman, name: t('tr_chairman') },
          { code: AssignmentCode.WM_Prayer, name: t('tr_prayer') },
          { code: AssignmentCode.WM_Speaker, name: t('tr_speaker') },
          {
            code: AssignmentCode.WM_SpeakerSymposium,
            name: t('tr_speakerSymposium'),
          },
          {
            code: AssignmentCode.WM_WTStudyConductor,
            name: t('tr_watchtowerStudyConductor'),
          },
          {
            code: AssignmentCode.WM_WTStudyReader,
            name: t('tr_watchtowerStudyReader'),
          },
        ],
      },
    ];
  }, [t]);

  const filterGroups = useMemo(() => {
    return [
      {
        name: t('tr_general'),
        items: [
          { id: 'male', name: t('tr_male') },
          { id: 'female', name: t('tr_female') },
          { id: 'anointed', name: t('tr_anointed') },
          { id: 'archived', name: t('tr_archived') },
          { id: 'familyHead', name: t('tr_familyHead') },
        ],
      },
      {
        name: t('tr_publishers'),
        items: [
          { id: 'baptized', name: t('tr_baptized') },
          { id: 'unbaptized', name: t('tr_unbaptized') },
          { id: 'active', name: t('tr_active') },
          { id: 'inactive', name: t('tr_inactive') },
        ],
      },
      {
        name: t('tr_enrollments'),
        items: [
          { id: 'pioneerAll', name: t('tr_allPioneers') },
          { id: 'AP', name: t('tr_AP') },
          { id: 'FR', name: t('tr_FR') },
          { id: 'FS', name: t('tr_FS') },
          { id: 'FMF', name: t('tr_FMF') },
        ],
      },
      {
        name: t('tr_appointedBrothers'),
        items: [
          { id: 'appointedBrotherAll', name: t('tr_allAppointedBrothers') },
          { id: 'elder', name: t('tr_elder') },
          { id: 'ministerialServant', name: t('tr_ministerialServant') },
        ],
      },
      {
        name: t('tr_studentAssignments'),
        items: [
          { id: 'midweekStudent', name: t('tr_midweekStudent') },
          { id: 'noAssignment', name: t('tr_noAssignmentsYet') },
        ],
      },
    ];
  }, [t]);

  const handleCloseFilterMobile = () => {
    setFilterOpen(false);
    window.scroll({ top: 0 });
  };

  const handleClearFilters = () => {
    setPersonsFiltersKey([]);

    setActiveTab(PersonsTab.ALL);

    if (!desktopUp) handleCloseFilterMobile();
  };

  const handleToggleGroup = (checked: boolean, id: string) => {
    let newFiltersKey = [...filters];

    const items = assignments.find((group) => group.id === id).items;

    if (checked) {
      for (const item of items) {
        if (!newFiltersKey.includes(item.code)) {
          newFiltersKey.push(item.code);
        }
      }
    }

    if (!checked) {
      for (const item of items) {
        if (newFiltersKey.includes(item.code)) {
          newFiltersKey = newFiltersKey.filter((key) => key !== item.code);
        }
      }
    }

    setPersonsFiltersKey(newFiltersKey);

    setActiveTab(PersonsTab.ALL);
  };

  const handleToggleAssignment = (checked: boolean, code: AssignmentCode) => {
    let newFiltersKey = [...filters];

    if (checked) {
      if (!newFiltersKey.includes(code)) {
        newFiltersKey.push(code);
      }
    }

    if (!checked) {
      if (newFiltersKey.includes(code)) {
        newFiltersKey = newFiltersKey.filter((activeKey) => activeKey !== code);
      }
    }

    setPersonsFiltersKey(newFiltersKey);

    setActiveTab(PersonsTab.ALL);
  };

  return {
    filters,
    handleClearFilters,
    handleToggleGroup,
    assignments,
    filterGroups,
    handleToggleAssignment,
    checkedItems,
    handleCloseFilterMobile,
  };
};

export default useFilter;
