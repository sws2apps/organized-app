import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { AssignmentCheckListColors } from '@definition/app';
import { personCurrentDetailsState } from '@states/persons';
import { setPersonCurrentDetails } from '@services/states/persons';
import { AssignmentCode } from '@definition/assignment';
import {
  midweekMeetingAuxClassQualificationsState,
  midweekMeetingClassCountState,
  userDataViewState,
} from '@states/settings';
import { languageGroupsState } from '@states/field_service_groups';
import { CLASSROOM_QUALIFICATIONS_ASSIGNMENT } from '@constants/index';

const useAssignments = () => {
  const { t } = useAppTranslation();

  const person = useAtomValue(personCurrentDetailsState);
  const dataView = useAtomValue(userDataViewState);
  const languageGroups = useAtomValue(languageGroupsState);
  const classCount = useAtomValue(midweekMeetingClassCountState);
  const auxClassQualifications = useAtomValue(
    midweekMeetingAuxClassQualificationsState
  );

  const male = person.person_data.male.value;
  const disqualified = person.person_data.disqualified.value;

  const duplicateAssignmentsGroup = useMemo(() => {
    return ['ministry'];
  }, []);

  const duplicateAssignmentsCode = useMemo(() => {
    return [AssignmentCode.MINISTRY_HOURS_CREDIT];
  }, []);

  const checkedItems = useMemo(() => {
    return (
      person.person_data.assignments.find((a) => a.type === dataView)?.values ??
      []
    );
  }, [person, dataView]);

  const classrooms = useMemo(() => {
    return [
      { id: '1', label: t('tr_mainHall') },
      { id: '2', label: t('tr_auxClass1') },
    ];
  }, [t]);

  const handleClassroomsChange = (
    code: AssignmentCode,
    selected: string[]
  ) => {
    const newPerson = structuredClone(person);

    let personAssignments = newPerson.person_data.assignments.find(
      (a) => a.type === dataView
    );

    if (!personAssignments) {
      personAssignments = { type: dataView, values: [], updatedAt: '' };
      newPerson.person_data.assignments.push(personAssignments);
    }

    const qualifications = (
      personAssignments.classroom_qualifications ?? []
    ).filter((record) => record.code !== code);

    const isAllClassrooms = classrooms.every((classroom) =>
      selected.includes(classroom.id)
    );

    if (!isAllClassrooms) {
      qualifications.push({ code, classrooms: selected });
    }

    personAssignments.classroom_qualifications = qualifications;
    personAssignments.updatedAt = new Date().toISOString();

    setPersonCurrentDetails(newPerson);
  };

  const getSelectedClassrooms = (code: AssignmentCode) => {
    const selected = person.person_data.assignments
      .find((a) => a.type === dataView)
      ?.classroom_qualifications?.find(
        (record) => record.code === code
      )?.classrooms;

    if (!selected || selected.length === 0) {
      return classrooms.map((classroom) => classroom.id);
    }

    return selected;
  };

  const classroomQualifications =
    auxClassQualifications && classCount === 2
      ? {
          codes: CLASSROOM_QUALIFICATIONS_ASSIGNMENT,
          classrooms,
          getSelected: getSelectedClassrooms,
          onChange: handleClassroomsChange,
        }
      : undefined;

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

  const assignmentLookup = useMemo(() => {
    const lookup: Record<string, string> = {};

    for (const section of assignments) {
      const codeHeader = section.header;
      for (const item of section.items) {
        let codeName: string;

        if (typeof item.code === 'string') {
          codeName = item.code;
        } else {
          codeName = AssignmentCode[item.code] ?? String(item.code);
        }

        lookup[codeName] = codeHeader + '.' + item.name;
      }
    }

    return lookup;
  }, [assignments]);

  const getAssignmentName = (code: string): string => {
    return assignmentLookup[code] ?? code;
  };

  const handleToggleGroup = async (checked: boolean, id: string) => {
    const newPerson = structuredClone(person);

    const items = assignments.find((group) => group.id === id).items;

    if (checked) {
      const views: string[] = [];

      if (duplicateAssignmentsGroup.includes(id)) {
        views.push('main', ...languageGroups.map((group) => group.group_id));
      } else {
        views.push(dataView);
      }

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

        for (const view of views) {
          const personAssignments = newPerson.person_data.assignments.find(
            (a) => a.type === view
          );

          const currentItems = personAssignments?.values ?? [];
          const newItems = Array.from(new Set([...currentItems, item.code]));

          if (personAssignments) {
            personAssignments.values = newItems;
            personAssignments.updatedAt = new Date().toISOString();
          }

          if (!personAssignments) {
            newPerson.person_data.assignments.push({
              type: view,
              values: newItems,
              updatedAt: new Date().toISOString(),
            });
          }
        }
      }
    }

    if (!checked) {
      for (const item of items) {
        if (duplicateAssignmentsGroup.includes(id)) {
          newPerson.person_data.assignments.forEach((assignments) => {
            assignments.updatedAt = new Date().toISOString();
            assignments.values = assignments.values.filter(
              (c) => c !== item.code
            );
          });
        } else {
          const personAssignments = newPerson.person_data.assignments.find(
            (a) => a.type === dataView
          );

          personAssignments.updatedAt = new Date().toISOString();
          personAssignments.values = personAssignments.values.filter(
            (c) => c !== item.code
          );

          if (personAssignments.classroom_qualifications) {
            personAssignments.classroom_qualifications =
              personAssignments.classroom_qualifications.filter(
                (record) => record.code !== item.code
              );
          }
        }
      }
    }

    setPersonCurrentDetails(newPerson);
  };

  const handleToggleAssignment = async (
    checked: boolean,
    code: AssignmentCode
  ) => {
    const newPerson = structuredClone(person);

    if (checked) {
      const views: string[] = [];

      if (duplicateAssignmentsCode.includes(code)) {
        views.push('main', ...languageGroups.map((group) => group.group_id));
      } else {
        views.push(dataView);
      }

      for (const view of views) {
        const personAssignments = newPerson.person_data.assignments.find(
          (a) => a.type === view
        );

        const currentItems = personAssignments?.values ?? [];
        const hasCurrent = currentItems.includes(code);

        if (!hasCurrent) {
          if (personAssignments) {
            personAssignments.values.push(code);
            personAssignments.updatedAt = new Date().toISOString();
          }

          if (!personAssignments) {
            newPerson.person_data.assignments.push({
              type: view,
              values: [code],
              updatedAt: new Date().toISOString(),
            });
          }
        }

        if (code === AssignmentCode.WM_Speaker) {
          const symposium = currentItems.includes(
            AssignmentCode.WM_SpeakerSymposium
          );

          if (symposium) {
            personAssignments.updatedAt = new Date().toISOString();
            personAssignments.values = personAssignments.values.filter(
              (c) => c !== AssignmentCode.WM_SpeakerSymposium
            );
          }
        }

        if (code === AssignmentCode.WM_SpeakerSymposium) {
          const speaker = currentItems.includes(AssignmentCode.WM_Speaker);

          if (speaker) {
            personAssignments.updatedAt = new Date().toISOString();
            personAssignments.values = personAssignments.values.filter(
              (c) => c !== AssignmentCode.WM_Speaker
            );
          }
        }
      }
    }

    if (!checked) {
      if (duplicateAssignmentsCode.includes(code)) {
        newPerson.person_data.assignments.forEach((assignments) => {
          assignments.updatedAt = new Date().toISOString();
          assignments.values = assignments.values.filter((c) => c !== code);
        });
      } else {
        const personAssignments = newPerson.person_data.assignments.find(
          (a) => a.type === dataView
        );

        personAssignments.updatedAt = new Date().toISOString();
        personAssignments.values = personAssignments.values.filter(
          (c) => c !== code
        );

        if (personAssignments.classroom_qualifications) {
          personAssignments.classroom_qualifications =
            personAssignments.classroom_qualifications.filter(
              (record) => record.code !== code
            );
        }
      }
    }

    setPersonCurrentDetails(newPerson);
  };

  return {
    assignments,
    checkedItems,
    classroomQualifications,
    handleToggleAssignment,
    handleToggleGroup,
    male,
    disqualified,
    getAssignmentName,
  };
};

export default useAssignments;
