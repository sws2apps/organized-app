import { format } from 'date-fns';

import appDb from '../../db';

const useAttendanceMigrate = () => {
  const handleMigrateAttendances = async () => {
    const oldAttendances = await appDb.meetingAttendance.toArray();

    const attendances = oldAttendances.map((record) => {
      const midweek1 = record.midweek_meeting.find((meet) => meet.index === 1);
      const midweek2 = record.midweek_meeting.find((meet) => meet.index === 2);
      const midweek3 = record.midweek_meeting.find((meet) => meet.index === 3);
      const midweek4 = record.midweek_meeting.find((meet) => meet.index === 4);
      const midweek5 = record.midweek_meeting.find((meet) => meet.index === 5);

      const weekend1 = record.weekend_meeting.find((meet) => meet.index === 1);
      const weekend2 = record.weekend_meeting.find((meet) => meet.index === 2);
      const weekend3 = record.weekend_meeting.find((meet) => meet.index === 3);
      const weekend4 = record.weekend_meeting.find((meet) => meet.index === 4);
      const weekend5 = record.weekend_meeting.find((meet) => meet.index === 5);

      return {
        month_date: format(new Date(record.month_value), 'yyyy/MM'),
        week_1: {
          midweek: [
            {
              present: midweek1?.count ? +midweek1.count : undefined,
              online: undefined,
              type: 'main',
              updatedAt: midweek1?.count ? new Date().toISOString() : '',
            },
          ],
          weekend: [
            {
              present: weekend1?.count ? +weekend1.count : undefined,
              online: undefined,
              type: 'main',
              updatedAt: weekend1?.count ? new Date().toISOString() : '',
            },
          ],
        },
        week_2: {
          midweek: [
            {
              present: midweek2?.count ? +midweek2.count : undefined,
              online: undefined,
              type: 'main',
              updatedAt: midweek2?.count ? new Date().toISOString() : '',
            },
          ],
          weekend: [
            {
              present: weekend2?.count ? +weekend2.count : undefined,
              online: undefined,
              type: 'main',
              updatedAt: weekend2?.count ? new Date().toISOString() : '',
            },
          ],
        },
        week_3: {
          midweek: [
            {
              present: midweek3?.count ? +midweek3.count : undefined,
              online: undefined,
              type: 'main',
              updatedAt: midweek3?.count ? new Date().toISOString() : '',
            },
          ],
          weekend: [
            {
              present: weekend3?.count ? +weekend3.count : undefined,
              online: undefined,
              type: 'main',
              updatedAt: weekend3?.count ? new Date().toISOString() : '',
            },
          ],
        },
        week_4: {
          midweek: [
            {
              present: midweek4?.count ? +midweek4.count : undefined,
              online: undefined,
              type: 'main',
              updatedAt: midweek4?.count ? new Date().toISOString() : '',
            },
          ],
          weekend: [
            {
              present: weekend4?.count ? +weekend4.count : undefined,
              online: undefined,
              type: 'main',
              updatedAt: weekend4?.count ? new Date().toISOString() : '',
            },
          ],
        },
        week_5: {
          midweek: [
            {
              present: midweek5?.count ? +midweek5.count : undefined,
              online: undefined,
              type: 'main',
              updatedAt: midweek5?.count ? new Date().toISOString() : '',
            },
          ],
          weekend: [
            {
              present: weekend5?.count ? +weekend5.count : undefined,
              online: undefined,
              type: 'main',
              updatedAt: weekend5?.count ? new Date().toISOString() : '',
            },
          ],
        },
      };
    });

    return attendances;
  };

  return { handleMigrateAttendances };
};

export default useAttendanceMigrate;
