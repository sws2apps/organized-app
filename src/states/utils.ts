/*
  FOR UTILS-SPECIFICS THAT WILL BE CALLED ON RECOIL STATE ONLY
*/

import { AssignmentCode } from '@definition/assignment';
import {
  AssignmentCongregation,
  AssignmentHistoryType,
  SchedWeekType,
} from '@definition/schedules';

export const schedulesAddHistory = ({
  assigned,
  code,
  result,
  schedule,
  title,
  classroom,
  desc,
  student,
  assistant,
  src,
}: {
  result: AssignmentHistoryType[];
  schedule: SchedWeekType;
  assigned: AssignmentCongregation;
  code: AssignmentCode;
  title: string;
  classroom?: string;
  desc?: string;
  student?: string;
  assistant?: string;
  src?: string;
}) => {
  if (assigned.value.length > 0) {
    const obj: AssignmentHistoryType = {
      id: crypto.randomUUID(),
      weekOf: schedule.weekOf,
      assignment: {
        dataView: assigned.type,
        code,
        person: assigned.value,
        title,
        src,
        desc,
        classroom,
        ayf: {
          student,
          assistant,
        },
      },
    };
    result.push(obj);
  }
};
