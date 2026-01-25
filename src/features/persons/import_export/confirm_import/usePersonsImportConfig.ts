import {
  PersonType,
  ALL_PRIVILEGE_TYPES,
  ALL_ENROLLMENT_TYPES,
} from '@definition/person';
import { AssignmentCode } from '@definition/assignment';
import { ASSIGNMENT_SECTIONS } from '@features/persons/assignments/assignmentStructure';
import {
  changeFirstname,
  changeLastname,
  changeBirthDate,
  changeEmailAddress,
  changePhone,
  changeAddress,
  toggleGender,
} from '@utils/person';
import { enrollmentStartDateChange } from '@utils/enrollments';
import { privilegeStartDateChange } from '@utils/privileges';
import {
  toggleMidweekMeetingStudent,
  midweekMeetingStudentStartDateChange,
  toggleUnbaptizedPublisher,
  toggleBaptizedPublisher,
  changeBaptismDate,
  toggleActive,
} from '@utils/spiritual_status';
import useAssignmentHandler from './useAssignmentHandler';
import useConvertValue from './useConvertValue';
import useEnrollmentHandler from './useEnrollmentHandler';
import usePrivilegeHandler from './usePrivilegeHandler';
import { stringAddEmergencyContacts } from '@utils/emergencyContacts';

const ASSIGNMENT_EXAMPLES: Record<string, [string, string, string, string]> = {
  // Elder/MS only assignments
  MM_Chairman: ['', 'yes', '', ''],
  MM_CBSConductor: ['', 'yes', '', ''],
  WM_Chairman: ['', 'yes', '', ''],
  // Add any other specific assignments here following the pattern

  // Default for most assignments
  DEFAULT: ['yes', 'yes', '', ''],
};

const getExamplesForAssignment = (
  code: string
): readonly [string, string, string, string] => {
  return ASSIGNMENT_EXAMPLES[code] ?? ASSIGNMENT_EXAMPLES.DEFAULT;
};

const usePersonsImportConfig = () => {
  const { convertValue } = useConvertValue();
  const { makePrivilegeHandler } = usePrivilegeHandler();
  const { makeAssignmentHandler } = useAssignmentHandler();
  const { makeEnrollmentHandler } = useEnrollmentHandler();

  interface PersonFieldMeta {
    key: string;
    label: string;
    group: string;
    groupLabel: string;
    handler: (p: PersonType, v: string) => void;
    examples: readonly [string, string, string, string];
    showCheckbox?: boolean;
  }

  const STATIC_PERSON_FIELDS: PersonFieldMeta[] = [
    {
      key: 'personalInfo.firstname',
      label: 'tr_firstname',
      group: 'personalInfo',
      groupLabel: 'tr_personalInfo',
      examples: ['Mike', 'Andry', 'Luana', 'Ava'],
      handler: (p, v) => changeFirstname(p, v),
    },
    {
      key: 'personalInfo.lastname',
      label: 'tr_lastname',
      group: 'personalInfo',
      groupLabel: 'tr_personalInfo',
      examples: ['Brown', 'Rasolofoson', 'Silva', 'Williams'],
      handler: (p, v) => changeLastname(p, v),
    },
    {
      key: 'personalInfo.gender',
      label: 'tr_gender',
      group: 'personalInfo',
      groupLabel: 'tr_personalInfo',
      examples: ['male', 'male', 'female', 'female'],
      handler: (p, v) => toggleGender(p, convertValue(v, 'gender')),
    },
    {
      key: 'personalInfo.dateOfBirth',
      label: 'tr_dateOfBirth',
      group: 'personalInfo',
      groupLabel: 'tr_personalInfo',
      examples: ['1985-12-30', '1988-07-04', '1996-03-22', '2000-11-10'],
      handler: (p, v) => changeBirthDate(p, convertValue(v, 'date')),
    },
    {
      key: 'field_service_group',
      label: 'tr_fieldServiceGroup',
      group: 'field_service_group',
      groupLabel: 'tr_fieldServiceGroup',
      examples: ['3', '2', '3', '1'],
      handler: (p, v) => {
        // void is used intentionally to avoid error about unused variables
        void p;
        void v;
      },
    },

    {
      key: 'contactInfo.emailAddress',
      label: 'tr_emailAddress',
      group: 'contactInfo',
      groupLabel: 'tr_contactInfo',
      examples: [
        'mike@example.com',
        'andry.rasolofoson@example.com',
        'luana.silva@example.com',
        'ava.williams@example.com',
      ],
      handler: (p, v) => changeEmailAddress(p, v),
    },
    {
      key: 'contactInfo.address',
      label: 'tr_address',
      group: 'contactInfo',
      groupLabel: 'tr_contactInfo',
      examples: [
        'New World Str. 31, 42094 Paradise City',
        '12 Kingdom Way, Antananarivo',
        '23 Kingdom Hall Lane, São Paulo',
        '7 Joy Street, Springfield',
      ],
      handler: (p, v) => changeAddress(p, v),
    },
    {
      key: 'contactInfo.phoneNumber',
      label: 'tr_phoneNumber',
      group: 'contactInfo',
      groupLabel: 'tr_contactInfo',
      examples: [
        '+1 234 567 89 00',
        '+261 32 45 678 90',
        '+55 11 91234 5678',
        '+1 202 555 0143',
      ],
      handler: (p, v) => changePhone(p, v),
    },
    {
      key: 'contactInfo.emergencyContacts',
      label: 'tr_emergencyContacts',
      group: 'contactInfo',
      groupLabel: 'tr_contactInfo',
      examples: [
        'Emily: +1 234 567 89 00; Jake: +1 234 567 89 00',
        'Mike Michaels: +1 234 567 89 00',
        'Tamara: +1 234 567 89 00; tamara@example.com',
        '',
      ],
      handler: (p, v) => stringAddEmergencyContacts(p, v),
    },
    {
      key: 'spiritualStatus.midweekMeetingStudent',
      label: 'tr_midweekMeetingStudent',
      group: 'spiritualStatus',
      groupLabel: 'tr_spiritualStatus',
      examples: ['yes', '', 'yes', ''],
      handler: (p, v) =>
        toggleMidweekMeetingStudent(p, convertValue(v, 'boolean'), true),
    },
    {
      key: 'spiritualStatus.midweekMeetingStudent.startDate',
      label: 'tr_startDate',
      group: 'spiritualStatus',
      groupLabel: 'tr_spiritualStatus',
      examples: ['2015-01-20', '2021-01-01', '2003-11-01', ''],
      handler: (p, v) =>
        midweekMeetingStudentStartDateChange(
          p,
          p.person_data.midweek_meeting_student.history[0]?.id ?? '',
          convertValue(v, 'date')
        ),
    },
    {
      key: 'spiritualStatus.baptized',
      label: 'tr_baptized',
      group: 'spiritualStatus',
      groupLabel: 'tr_spiritualStatus',
      examples: ['yes', 'yes', 'yes', ''],
      handler: (p, v) =>
        toggleBaptizedPublisher(p, convertValue(v, 'boolean'), true),
    },
    {
      key: 'spiritualStatus.baptismDate',
      label: 'tr_baptismDate',
      group: 'spiritualStatus',
      groupLabel: 'tr_spiritualStatus',
      examples: ['2005-06-15', '2010-06-15', '1995-06-15', ''],
      handler: (p, v) => changeBaptismDate(p, convertValue(v, 'date')),
    },
    {
      key: 'spiritualStatus.unbaptizedPublisher',
      label: 'tr_unbaptizedPublisher',
      group: 'spiritualStatus',
      groupLabel: 'tr_spiritualStatus',
      examples: ['', '', '', 'yes'],
      handler: (p, v) =>
        toggleUnbaptizedPublisher(p, convertValue(v, 'boolean'), true),
    },
    {
      key: 'spiritualStatus.activePublisher',
      label: 'tr_activePublisher',
      group: 'spiritualStatus',
      groupLabel: 'tr_spiritualStatus',
      examples: ['yes', 'yes', 'yes', 'yes'],
      handler: (p, v) => toggleActive(p, convertValue(v, 'boolean'), true),
    },
  ];

  const DYNAMIC_PRIVILEGE_FIELDS: PersonFieldMeta[] = ALL_PRIVILEGE_TYPES.map(
    (priv) => ({
      key: `privilege.${priv}`,
      label: `tr_${priv === 'ms' ? 'ministerialServant' : priv}`,
      group: 'privilege',
      groupLabel: 'tr_privilege',
      examples: [
        priv === 'elder' ? 'yes' : '',
        priv === 'ms' ? 'yes' : '',
        '',
        '',
      ],
      handler: makePrivilegeHandler(priv),
    })
  );

  const START_DATE_PRIVILEGE_FIELD: PersonFieldMeta[] = [
    {
      key: `privilege.start_date`,
      label: `tr_startDate`,
      group: 'privilege',
      groupLabel: 'tr_privilege',
      examples: ['2020-01-01', '2020-01-01', '', ''],
      handler: (p, v) =>
        privilegeStartDateChange(
          p,
          p.person_data.privileges[0]?.id ?? '',
          convertValue(v, 'date')
        ),
    },
  ];

  const DYNAMIC_ENROLLMENT_FIELDS: PersonFieldMeta[] = ALL_ENROLLMENT_TYPES.map(
    (enr) => ({
      key: `enrollment.${enr}`,
      label: `tr_${enr}`,
      group: 'enrollment',
      groupLabel: 'tr_enrollment',
      examples: [enr === 'AP' ? 'yes' : '', '', enr === 'FR' ? 'yes' : '', ''],
      handler: makeEnrollmentHandler(enr),
    })
  );

  const START_DATE_ENROLLMENT_FIELD: PersonFieldMeta[] = [
    {
      key: `enrollment.start_date`,
      label: `tr_startDate`,
      group: 'enrollment',
      groupLabel: 'tr_enrollment',
      examples: ['2020-01-01', '', '2020-01-01', ''],
      handler: (p, v) =>
        enrollmentStartDateChange(
          p,
          p.person_data.enrollments[0]?.id ?? '',
          convertValue(v, 'date')
        ),
    },
  ];

  const DYNAMIC_ASSIGNMENT_FIELDS: PersonFieldMeta[] =
    ASSIGNMENT_SECTIONS.flatMap((section) =>
      section.items.map((item) => ({
        key: `assignments.${AssignmentCode[item.code]}`,
        label: item.nameKey,
        group: section.id,
        groupLabel: section.headerKey,
        examples: getExamplesForAssignment(AssignmentCode[item.code]),
        handler: makeAssignmentHandler(item.code),
      }))
    );

  const PERSON_FIELD_META: PersonFieldMeta[] = [
    ...STATIC_PERSON_FIELDS,
    ...DYNAMIC_PRIVILEGE_FIELDS,
    ...START_DATE_PRIVILEGE_FIELD,
    ...DYNAMIC_ENROLLMENT_FIELDS,
    ...START_DATE_ENROLLMENT_FIELD,
    ...DYNAMIC_ASSIGNMENT_FIELDS,
  ];

  return { PERSON_FIELD_META };
};

export default usePersonsImportConfig;
