import { scheduleSchema } from '../../../services/dexie/schema';

import appDb from '../../db';

const isMondayDate = (date) => {
  const inputDate = new Date(date);
  const dayOfWeek = inputDate.getDay();

  return dayOfWeek === 1;
};

const useSchedulesMigrate = () => {
  const handleMigrateSchedules = async () => {
    const oldSchedules = await appDb.sched.toArray();

    const schedules = [];

    for (const record of oldSchedules) {
      const isMonday = isMondayDate(record.weekOf);

      if (!isMonday) continue;

      const obj = structuredClone(scheduleSchema);

      obj.weekOf = record.weekOf;

      obj.midweek_meeting.chairman = {
        main_hall: [
          {
            type: 'main',
            value: record?.chairmanMM_A || '',
            name: '',
            updatedAt: new Date().toISOString(),
          },
        ],
        aux_class_1: {
          type: 'main',
          value: record?.chairmanMM_B || '',
          name: '',
          updatedAt: new Date().toISOString(),
        },
      };

      obj.midweek_meeting.opening_prayer = [
        {
          type: 'main',
          value: record?.opening_prayerMM || '',
          name: '',
          updatedAt: new Date().toISOString(),
        },
      ];

      obj.midweek_meeting.tgw_talk = [
        {
          type: 'main',
          value: record?.tgw_talk || '',
          name: '',
          updatedAt: new Date().toISOString(),
        },
      ];

      obj.midweek_meeting.tgw_gems = [
        {
          type: 'main',
          value: record?.tgw_gems || '',
          name: '',
          updatedAt: new Date().toISOString(),
        },
      ];

      obj.midweek_meeting.tgw_bible_reading = {
        main_hall: [
          {
            type: 'main',
            value: record?.bRead_stu_A || '',
            name: '',
            updatedAt: new Date().toISOString(),
          },
        ],
        aux_class_1: {
          type: 'main',
          value: record?.bRead_stu_B || '',
          name: '',
          updatedAt: new Date().toISOString(),
        },
        aux_class_2: {
          type: 'main',
          value: '',
          name: '',
          updatedAt: '',
        },
      };

      obj.midweek_meeting.ayf_part1 = {
        main_hall: {
          student: [
            {
              type: 'main',
              value: record?.ass1_stu_A || '',
              name: '',
              updatedAt: new Date().toISOString(),
            },
          ],
          assistant: [
            {
              type: 'main',
              value: record?.ass1_ass_A || '',
              name: '',
              updatedAt: new Date().toISOString(),
            },
          ],
        },
        aux_class_1: {
          student: {
            type: 'main',
            value: record?.ass1_stu_B || '',
            name: '',
            updatedAt: new Date().toISOString(),
          },
          assistant: {
            type: 'main',
            value: record?.ass1_ass_B || '',
            name: '',
            updatedAt: new Date().toISOString(),
          },
        },
        aux_class_2: {
          student: { type: 'main', value: '', name: '', updatedAt: '' },
          assistant: { type: 'main', value: '', name: '', updatedAt: '' },
        },
      };

      obj.midweek_meeting.ayf_part2 = {
        main_hall: {
          student: [
            {
              type: 'main',
              value: record?.ass2_stu_A || '',
              name: '',
              updatedAt: new Date().toISOString(),
            },
          ],
          assistant: [
            {
              type: 'main',
              value: record?.ass2_ass_A || '',
              name: '',
              updatedAt: new Date().toISOString(),
            },
          ],
        },
        aux_class_1: {
          student: {
            type: 'main',
            value: record?.ass2_stu_B || '',
            name: '',
            updatedAt: new Date().toISOString(),
          },
          assistant: {
            type: 'main',
            value: record?.ass2_ass_B || '',
            name: '',
            updatedAt: new Date().toISOString(),
          },
        },
        aux_class_2: {
          student: { type: 'main', value: '', name: '', updatedAt: '' },
          assistant: { type: 'main', value: '', name: '', updatedAt: '' },
        },
      };

      obj.midweek_meeting.ayf_part3 = {
        main_hall: {
          student: [
            {
              type: 'main',
              value: record?.ass3_stu_A || '',
              name: '',
              updatedAt: new Date().toISOString(),
            },
          ],
          assistant: [
            {
              type: 'main',
              value: record?.ass3_ass_A || '',
              name: '',
              updatedAt: new Date().toISOString(),
            },
          ],
        },
        aux_class_1: {
          student: {
            type: 'main',
            value: record?.ass3_stu_B || '',
            name: '',
            updatedAt: new Date().toISOString(),
          },
          assistant: {
            type: 'main',
            value: record?.ass3_ass_B || '',
            name: '',
            updatedAt: new Date().toISOString(),
          },
        },
        aux_class_2: {
          student: { type: 'main', value: '', name: '', updatedAt: '' },
          assistant: { type: 'main', value: '', name: '', updatedAt: '' },
        },
      };

      obj.midweek_meeting.ayf_part4 = {
        main_hall: {
          student: [
            {
              type: 'main',
              value: record?.ass4_stu_A || '',
              name: '',
              updatedAt: new Date().toISOString(),
            },
          ],
          assistant: [
            {
              type: 'main',
              value: record?.ass4_ass_A || '',
              name: '',
              updatedAt: new Date().toISOString(),
            },
          ],
        },
        aux_class_1: {
          student: {
            type: 'main',
            value: record?.ass4_stu_B || '',
            name: '',
            updatedAt: new Date().toISOString(),
          },
          assistant: {
            type: 'main',
            value: record?.ass4_ass_B || '',
            name: '',
            updatedAt: new Date().toISOString(),
          },
        },
        aux_class_2: {
          student: { type: 'main', value: '', name: '', updatedAt: '' },
          assistant: { type: 'main', value: '', name: '', updatedAt: '' },
        },
      };

      obj.midweek_meeting.lc_part1 = [
        {
          type: 'main',
          value: record?.lc_part1 || '',
          name: '',
          updatedAt: new Date().toISOString(),
        },
      ];

      obj.midweek_meeting.lc_part2 = [
        {
          type: 'main',
          value: record?.lc_part2 || '',
          name: '',
          updatedAt: new Date().toISOString(),
        },
      ];

      obj.midweek_meeting.lc_part3 = [
        {
          type: 'main',
          value: record?.lc_part3 || '',
          name: '',
          updatedAt: new Date().toISOString(),
        },
      ];

      obj.midweek_meeting.lc_cbs = {
        conductor: [
          {
            type: 'main',
            value: record?.cbs_conductor || '',
            name: '',
            updatedAt: new Date().toISOString(),
          },
        ],
        reader: [
          {
            type: 'main',
            value: record?.cbs_reader || '',
            name: '',
            updatedAt: new Date().toISOString(),
          },
        ],
      };

      obj.midweek_meeting.closing_prayer = [
        {
          type: 'main',
          value: record?.closing_prayerMM || '',
          name: '',
          updatedAt: new Date().toISOString(),
        },
      ];

      obj.midweek_meeting.week_type = [
        {
          type: 'main',
          value: record.week_type,
          updatedAt: new Date().toISOString(),
        },
      ];

      obj.weekend_meeting.chairman = [
        {
          type: 'main',
          value: record?.chairman_WM || '',
          name: '',
          updatedAt: new Date().toISOString(),
        },
      ];

      obj.weekend_meeting.opening_prayer = [
        {
          type: 'main',
          value: record?.opening_prayerWM || '',
          name: '',
          updatedAt: new Date().toISOString(),
        },
      ];

      obj.weekend_meeting.public_talk_type = [
        {
          type: 'main',
          value: record.is_visiting_speaker
            ? 'visitingSpeaker'
            : 'localSpeaker',
          updatedAt: new Date().toISOString(),
        },
      ];

      obj.weekend_meeting.speaker = {
        part_1: [
          {
            type: 'main',
            value: record.speaker_1 || '',
            name: '',
            updatedAt: new Date().toISOString(),
          },
        ],
        part_2: [
          {
            type: 'main',
            value: record.speaker_2 || '',
            name: '',
            updatedAt: new Date().toISOString(),
          },
        ],
        substitute: [
          {
            type: 'main',
            value: record.substitute_speaker || '',
            name: '',
            updatedAt: new Date().toISOString(),
          },
        ],
      };

      obj.weekend_meeting.wt_study = {
        conductor: [{ type: 'main', value: '', name: '', updatedAt: '' }],
        reader: [
          {
            type: 'main',
            value: record.wtstudy_reader || '',
            name: '',
            updatedAt: new Date().toISOString(),
          },
        ],
      };

      obj.weekend_meeting.week_type = [
        {
          type: 'main',
          value: record.week_type,
          updatedAt: new Date().toISOString(),
        },
      ];

      schedules.push(obj);
    }

    return schedules;
  };

  return { handleMigrateSchedules };
};

export default useSchedulesMigrate;
