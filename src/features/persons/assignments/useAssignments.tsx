import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { AssignmentCheckListColors } from '@definition/app';
import { personCurrentDetailsState } from '@states/persons';
import { setPersonCurrentDetails } from '@services/recoil/persons';
import { AssignmentCode } from '@definition/assignment';

const useAssignments = () => {
  const { id } = useParams();
  const isAddPerson = id === undefined;

  const { t } = useAppTranslation();

  const person = useRecoilValue(personCurrentDetailsState);
  const male = person.person_data.male.value;
  const disqualified = person.person_data.disqualified.value;
  const checkedItems = person.person_data.assignments
    .filter((record) => record._deleted === false || record._deleted === null)
    .map((record) => record.code);

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
      {
        header: t('tr_ministry'),
        id: 'ministry',
        color: 'ministry' as AssignmentCheckListColors,
        items: [
          {
            code: AssignmentCode.MINISTRY_HOURS_CREDIT,
            name: t('tr_reportHoursCredit'),
          },
        ],
      },
    ];
  }, [t]);

  const handleToggleGroup = async (checked: boolean, id: string) => {
    const newPerson = structuredClone(person);

    const items = assignments.find((group) => group.id === id).items;

    if (checked) {
      const localItems = items.filter(
        (record) => record.code !== AssignmentCode.MM_AssistantOnly
      );

      for (const item of localItems) {
        if (!male) {
          if (
            item.code === AssignmentCode.MM_Discussion ||
            item.code === AssignmentCode.MM_Talk
          ) {
            continue;
          }
        }

        const current = newPerson.person_data.assignments.find(
          (record) => record.code === item.code
        );

        if (!current) {
          newPerson.person_data.assignments.push({
            code: item.code,
            updatedAt: new Date().toISOString(),
            _deleted: false,
          });
        }

        if (current && current._deleted !== null) {
          current._deleted = null;
        }
      }
    }

    if (!checked) {
      for (const item of items) {
        if (!isAddPerson) {
          const current = newPerson.person_data.assignments.find(
            (record) => record.code === item.code
          );
          if (current && current._deleted === false) {
            current._deleted = true;
            current.updatedAt = new Date().toISOString();
          }
        }

        if (isAddPerson) {
          newPerson.person_data.assignments =
            newPerson.person_data.assignments.filter(
              (record) => record.code !== item.code
            );
        }
      }
    }

    await setPersonCurrentDetails(newPerson);
  };

  const handleToggleAssignment = async (
    checked: boolean,
    code: AssignmentCode
  ) => {
    const newPerson = structuredClone(person);

    if (checked) {
      const current = newPerson.person_data.assignments.find(
        (record) => record.code === code
      );
      if (!current) {
        newPerson.person_data.assignments.push({
          code: code,
          updatedAt: new Date().toISOString(),
          _deleted: false,
        });
      }

      if (current && current._deleted) {
        current._deleted = false;
      }

      if (code === AssignmentCode.WM_Speaker) {
        const symposium = newPerson.person_data.assignments.find(
          (record) =>
            record.code === AssignmentCode.WM_SpeakerSymposium &&
            !record._deleted
        );

        if (symposium) {
          symposium.updatedAt = new Date().toISOString();
          symposium._deleted = true;
        }
      }

      if (code === AssignmentCode.WM_SpeakerSymposium) {
        const speaker = newPerson.person_data.assignments.find(
          (record) =>
            record.code === AssignmentCode.WM_Speaker && !record._deleted
        );

        if (speaker) {
          speaker.updatedAt = new Date().toISOString();
          speaker._deleted = true;
        }
      }
    }

    if (!checked) {
      if (!isAddPerson) {
        const current = newPerson.person_data.assignments.find(
          (record) => record.code === code
        );
        if (current && current._deleted === false) {
          current._deleted = true;
          current.updatedAt = new Date().toISOString();
        }
      }

      if (isAddPerson) {
        newPerson.person_data.assignments =
          newPerson.person_data.assignments.filter(
            (record) => record.code !== code
          );
      }
    }

    await setPersonCurrentDetails(newPerson);
  };

  return {
    assignments,
    checkedItems,
    handleToggleAssignment,
    handleToggleGroup,
    male,
    disqualified,
  };
};

export default useAssignments;
