// services/app/assignments_schedule_export.ts
import { ASSIGNMENT_PATH } from '@constants/index';
import { ASSIGNMENT_DEFAULTS } from '@constants/index';
import { SchedWeekType } from '@definition/schedules';
import { PersonType } from '@definition/person';
import { SourceWeekType, ApplyMinistryType } from '@definition/sources';
import { AssignmentCongregation } from '@definition/schedules';

export function getPropertyByPath<T = unknown>(
  obj: unknown,
  path: string
): T | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return path.split('.').reduce((acc: any, part) => acc && acc[part], obj) as T;
}

const getPersonName = (uid: string, persons: PersonType[]): string => {
  if (!uid) return '';
  const person = persons.find((p) => p.person_uid === uid);
  if (!person) return 'Unbekannt';
  return `${person.person_data.person_firstname.value} ${person.person_data.person_lastname.value}`;
};

const getSourceTitle = (key: string, source: SourceWeekType): string => {
  if (!source) return '';
  const mm = source.midweek_meeting;

  if (key.includes('TGWTalk')) return mm.tgw_talk.src['X'];
  if (key.includes('TGWGems')) return mm.tgw_gems.title['X'];
  if (key.includes('TGWBibleReading')) return mm.tgw_bible_reading.title['X'];

  if (key.includes('LCPart1')) return mm.lc_part1.title['X'];
  if (key.includes('LCPart2')) return mm.lc_part2.title['X'];
  if (key.includes('LCPart3')) return mm.lc_part3.title[0]?.value;
  if (key.includes('CBS'))
    return mm.lc_cbs.title[0]?.value || 'Versammlungsbibelstudium';

  const ayfMatch = key.match(/AYFPart(\d+)/);
  if (ayfMatch) {
    const idx = ayfMatch[1];
    const partKey = `ayf_part${idx}` as keyof typeof mm;
    const part = mm[partKey] as ApplyMinistryType;
    return part?.src['X'] || part?.title['X'] || '';
  }
  return '';
};

export const exportScheduleToCSV = (
  weeksList: SchedWeekType[],
  sources: SourceWeekType[],
  persons: PersonType[]
): string => {
  const headers = [
    'Dataview',
    'Date',
    'Code',
    'Key',
    'Description',
    'Room',
    'Name(s)',
  ];
  const rows: string[] = [headers.join(';')];

  const assignmentKeys = Object.keys(ASSIGNMENT_PATH).filter(
    (key) => !key.includes('_Assistant_')
  );

  weeksList.forEach((schedule) => {
    const source = sources.find((s) => s.weekOf === schedule.weekOf);

    assignmentKeys.forEach((key) => {
      const path = ASSIGNMENT_PATH[key as keyof typeof ASSIGNMENT_PATH];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rawData = getPropertyByPath<any>(schedule, path);

      if (!rawData) return;

      const assignmentData = (
        Array.isArray(rawData) ? rawData : [rawData]
      ) as AssignmentCongregation[];

      let code = 0;

      if (ASSIGNMENT_DEFAULTS[key]) {
        code = ASSIGNMENT_DEFAULTS[key].code;
      }

      if (key.includes('AYFPart') && source) {
        const match = key.match(/AYFPart(\d+)/);
        if (match) {
          const idx = match[1];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const part = (source.midweek_meeting as any)[`ayf_part${idx}`];

          if (part && part.type) {
            const typeVal = part.type['X'] || Object.values(part.type)[0];
            if (typeVal) code = Number(typeVal);
          }
        }
      }
      const sourceTitle = source ? getSourceTitle(key, source) : '';

      let classroom = '1';
      if (key.includes('_B') || path.includes('aux_class_1')) classroom = '2';
      if (path.includes('aux_class_2')) classroom = '3';

      const isStudentKey = key.includes('_Student_');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let assistantData: any[] = [];

      if (isStudentKey) {
        const assistantPath = path.replace('.student', '.assistant');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawAssistantData = getPropertyByPath<any>(
          schedule,
          assistantPath
        );
        if (rawAssistantData) {
          assistantData = Array.isArray(rawAssistantData)
            ? rawAssistantData
            : [rawAssistantData];
        }
      }

      assignmentData.forEach((entry: AssignmentCongregation) => {
        if (!entry.value) return;

        let nameString = getPersonName(entry.value, persons);

        if (isStudentKey) {
          const partnerEntry = assistantData.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (a: any) => a.type === entry.type
          );

          if (partnerEntry && partnerEntry.value) {
            const partnerName = getPersonName(partnerEntry.value, persons);
            nameString = `${nameString} / ${partnerName}`;
          }
        }

        const row = [
          entry.type,
          schedule.weekOf,
          code,
          key,
          `"${sourceTitle}"`,
          classroom,
          `"${nameString}"`,
        ];
        rows.push(row.join(';'));
      });
    });
  });

  return rows.join('\n');
};
