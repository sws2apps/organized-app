import { promiseGetRecoil } from 'recoil-outside';
import {
  midweekMeetingClassCountState,
  midweekMeetingOpeningPrayerAutoAssign,
  userDataViewState,
} from '@states/settings';
import { sourcesState } from '@states/sources';
import { schedulesState } from '@states/schedules';
import { JWLangState } from '@states/app';
import { Week } from '@definition/week_type';
import { AssignmentCode } from '@definition/assignment';
import { ApplyMinistryType, LivingAsChristiansType } from '@definition/sources';
import { sourcesCheckAYFExplainBeliefsAssignment, sourcesCheckLCAssignments } from './sources';

export const schedulesWeekAssignmentsInfo = async (week: string, meeting: 'midweek' | 'weekend') => {
  const classCount = await promiseGetRecoil(midweekMeetingClassCountState);
  const openingPrayerAutoAssign = await promiseGetRecoil(midweekMeetingOpeningPrayerAutoAssign);
  const sources = await promiseGetRecoil(sourcesState);
  const schedules = await promiseGetRecoil(schedulesState);
  const dataView = await promiseGetRecoil(userDataViewState);
  const lang = await promiseGetRecoil(JWLangState);

  let total = 0;
  let assigned = 0;

  const source = sources.find((record) => record.weekOf === week);
  const schedule = schedules.find((record) => record.weekOf === week);

  if (meeting === 'midweek') {
    const hasNoMeeting = schedule.midweek_meeting.canceled.find((record) => record.type === dataView)?.value ?? false;
    const weekType = schedule.week_type.find((record) => record.type === dataView)?.value || Week.NORMAL;

    if (!hasNoMeeting) {
      // chairman main hall
      total = total + 1;

      let assignment = schedule.midweek_meeting.chairman.main_hall.find((record) => record.type === dataView);
      if (assignment && assignment.value.length > 0) {
        assigned = assigned + 1;
      }

      // chairman aux class
      if (weekType === Week.NORMAL && classCount > 1) {
        total = total + 1;

        assignment = schedule.midweek_meeting.chairman.aux_class_1;
        if (assignment && assignment.value.length > 0) {
          assigned = assigned + 1;
        }
      }

      // opening prayer
      if (!openingPrayerAutoAssign) {
        total = total + 1;

        assignment = schedule.midweek_meeting.opening_prayer.find((record) => record.type === dataView);
        if (assignment && assignment.value.length > 0) {
          assigned = assigned + 1;
        }
      }

      // tgw talk
      total = total + 1;

      assignment = schedule.midweek_meeting.tgw_talk.find((record) => record.type === dataView);
      if (assignment && assignment.value.length > 0) {
        assigned = assigned + 1;
      }

      // tgw gems
      total = total + 1;

      assignment = schedule.midweek_meeting.tgw_gems.find((record) => record.type === dataView);
      if (assignment && assignment.value.length > 0) {
        assigned = assigned + 1;
      }

      // tgw bible reading
      total = total + 1;

      assignment = schedule.midweek_meeting.tgw_bible_reading.main_hall.find((record) => record.type === dataView);
      if (assignment && assignment.value.length > 0) {
        assigned = assigned + 1;
      }

      // tgw bible reading aux class
      if (weekType === Week.NORMAL && classCount > 1) {
        total = total + 1;

        assignment = schedule.midweek_meeting.tgw_bible_reading.aux_class_1;
        if (assignment && assignment.value.length > 0) {
          assigned = assigned + 1;
        }
      }

      // ayf
      for (let a = 1; a <= 4; a++) {
        const type: AssignmentCode = source.midweek_meeting[`ayf_part${a}`].type[lang];

        // discussion part
        if (type === AssignmentCode.MM_Discussion) {
          total = total + 1;
        }

        // student discussion part
        if (
          type === AssignmentCode.MM_InitialCall ||
          type === AssignmentCode.MM_ReturnVisit ||
          type === AssignmentCode.MM_BibleStudy ||
          type === AssignmentCode.MM_Memorial ||
          type === AssignmentCode.MM_StartingConversation ||
          type === AssignmentCode.MM_FollowingUp ||
          type === AssignmentCode.MM_MakingDisciples ||
          (type >= 140 && type < 170) ||
          (type >= 170 && type < 200)
        ) {
          total = total + 2;

          // aux class
          if (weekType === Week.NORMAL && classCount > 1) {
            total = total + 2;
          }
        }

        // talk part
        if (type === AssignmentCode.MM_Talk) {
          total = total + 1;

          // aux class
          if (weekType === Week.NORMAL && classCount > 1) {
            total = total + 1;
          }
        }

        // explain beliefs part
        if (type === AssignmentCode.MM_ExplainingBeliefs) {
          const ayfPart: ApplyMinistryType = source.midweek_meeting[`ayf_part${a}`];
          const src = ayfPart.src[lang];

          const isTalk = sourcesCheckAYFExplainBeliefsAssignment(src);

          if (isTalk) {
            total = total + 1;

            // aux class
            if (weekType === Week.NORMAL && classCount > 1) {
              total = total + 1;
            }
          }

          if (!isTalk) {
            total = total + 2;

            // aux class
            if (weekType === Week.NORMAL && classCount > 1) {
              total = total + 2;
            }
          }
        }

        // student main hall
        assignment = schedule.midweek_meeting[`ayf_part${a}`].main_hall.student.find(
          (record) => record.type === dataView
        );
        if (assignment && assignment.value.length > 0) {
          assigned = assigned + 1;
        }

        // assistant main hall
        assignment = schedule.midweek_meeting[`ayf_part${a}`].main_hall.assistant.find(
          (record) => record.type === dataView
        );
        if (assignment && assignment.value.length > 0) {
          assigned = assigned + 1;
        }

        // student aux class
        if (weekType === Week.NORMAL && classCount > 1) {
          assignment = schedule.midweek_meeting[`ayf_part${a}`].aux_class_1.student;
          if (assignment && assignment.value.length > 0) {
            assigned = assigned + 1;
          }

          // assistant aux class
          assignment = schedule.midweek_meeting[`ayf_part${a}`].aux_class_1.assistant;
          if (assignment && assignment.value.length > 0) {
            assigned = assigned + 1;
          }
        }
      }

      // lc part
      for (let a = 1; a <= 3; a++) {
        const lcPart: LivingAsChristiansType = source.midweek_meeting[`lc_part${a}`];

        const titleOverride = lcPart.title.override.find((record) => record.type === dataView)?.value;
        const titleDefault = lcPart.title.default[lang];
        const title = titleOverride?.length > 0 ? titleOverride : titleDefault;

        if (title?.length > 0) {
          const noAssign = sourcesCheckLCAssignments(title);

          if (!noAssign) {
            total = total + 1;

            assignment = schedule.midweek_meeting[`lc_part${a}`].find((record) => record.type === dataView);
            if (assignment && assignment.value.length > 0) {
              assigned = assigned + 1;
            }
          }
        }
      }

      // lc cbs conductor
      total = total + 1;

      assignment = schedule.midweek_meeting.lc_cbs.conductor.find((record) => record.type === dataView);
      if (assignment && assignment.value.length > 0) {
        assigned = assigned + 1;
      }

      // lc cbs reader
      if (weekType === Week.NORMAL) {
        total = total + 1;

        assignment = schedule.midweek_meeting.lc_cbs.reader.find((record) => record.type === dataView);
        if (assignment && assignment.value.length > 0) {
          assigned = assigned + 1;
        }
      }

      // closing prayer
      total = total + 1;

      assignment = schedule.midweek_meeting.closing_prayer.find((record) => record.type === dataView);
      if (assignment && assignment.value.length > 0) {
        assigned = assigned + 1;
      }
    }
  }

  return { total, assigned };
};
