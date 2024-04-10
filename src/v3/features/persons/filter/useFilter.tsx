import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { personsFiltersKeyState } from '@states/persons';
import { setPersonsFiltersKey } from '@services/recoil/persons';
import { useAppTranslation } from '@hooks/index';
import { AssignmentCheckListColors } from '@definition/app';

const useFilter = () => {
  const { t } = useAppTranslation();

  const filters = useRecoilValue(personsFiltersKeyState);

  const [isExpanded, setIsExpanded] = useState(false);

  const assignments = useMemo(() => {
    return [
      {
        header: t('tr_midweekMeeting'),
        id: 'midweekMeeting',
        color: 'midweek-meeting' as AssignmentCheckListColors,
        items: [
          { id: 'chairman_MM', name: t('tr_chairman') },
          { id: 'prayer_MM', name: t('tr_prayer') },
          { id: 'auxiliary_classroom_counselor_MM', name: t('tr_auxClassCounselor') },
        ],
      },
      {
        header: t('tr_treasuresPart'),
        id: 'treasuresPart',
        color: 'treasures-from-gods-word' as AssignmentCheckListColors,
        items: [
          { id: 'tgwTalk_MM', name: t('tr_tgwTalk') },
          { id: 'tgwGems_MM', name: t('tr_tgwGems') },
          { id: 'bibleReading_MM', name: t('tr_bibleReading') },
        ],
      },
      {
        header: t('tr_applyFieldMinistryPart'),
        id: 'applyFieldMinistryPart',
        color: 'apply-yourself-to-the-field-ministry' as AssignmentCheckListColors,
        items: [
          { id: 'startingConversation_MM', name: t('tr_startingConversation') },
          { id: 'followingUp_MM', name: t('tr_followingUp') },
          { id: 'makingDisciples_MM', name: t('tr_makingDisciples') },
          { id: 'explainingBeliefs_MM', name: t('tr_explainingBeliefs') },
          { id: 'talk_MM', name: t('tr_talk') },
          { id: 'assistantOnly_MM', name: t('tr_assistantOnly'), borderTop: true },
        ],
      },
      {
        header: t('tr_livingPart'),
        id: 'livingPart',
        color: 'living-as-christians' as AssignmentCheckListColors,
        items: [
          { id: 'lcPart_MM', name: t('tr_lcPart') },
          { id: 'cbsConductor_MM', name: t('tr_congregationBibleStudyConductor') },
          { id: 'cbsReader_MM', name: t('tr_congregationBibleStudyReader') },
        ],
      },
      {
        header: t('tr_weekendMeeting'),
        id: 'weekendMeeting',
        color: 'weekend-meeting' as AssignmentCheckListColors,
        items: [
          { id: 'chairman_WM', name: t('tr_chairman') },
          { id: 'prayer_WM', name: t('tr_prayer') },
          { id: 'speaker_WM', name: t('tr_speaker') },
          { id: 'speakerSymposium_WM', name: t('tr_speakerSymposium') },
          { id: 'wtStudyConductor_WM', name: t('tr_watchtowerStudyConductor') },
          { id: 'wtStudyReader_WM', name: t('tr_watchtowerStudyReader') },
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
        name: t('tr_pioneers'),
        items: [
          { id: 'pioneerAll', name: t('tr_allPioneers') },
          { id: 'auxiliaryPioneer', name: t('tr_APs') },
          { id: 'regularPioneer', name: t('tr_FRs') },
          { id: 'specialPionner', name: t('tr_FSs') },
          { id: 'fieldMissionary', name: t('tr_FMFs') },
        ],
      },
      {
        name: t('tr_appointedBrothers'),
        items: [
          { id: 'appointedBrotherAll', name: t('tr_allAppointedBrothers') },
          { id: 'elder', name: t('tr_elders') },
          { id: 'ministerialServant', name: t('tr_ministerialServants') },
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

  const handleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleClearFilters = async () => {
    await setPersonsFiltersKey([]);
  };

  const handleToggleGroup = async (checked: boolean, id: string) => {
    let newFiltersKey = [...filters];
    const items = assignments.find((group) => group.id === id).items;

    if (checked) {
      for (const item of items) {
        if (!newFiltersKey.includes(item.id)) {
          newFiltersKey.push(item.id);
        }
      }
    }

    if (!checked) {
      for (const item of items) {
        if (newFiltersKey.includes(item.id)) {
          newFiltersKey = newFiltersKey.filter((key) => key !== item.id);
        }
      }
    }

    await setPersonsFiltersKey(newFiltersKey);
  };

  return { isExpanded, handleExpand, filters, handleClearFilters, handleToggleGroup, assignments, filterGroups };
};

export default useFilter;
