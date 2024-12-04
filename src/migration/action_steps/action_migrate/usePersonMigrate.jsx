import { format } from 'date-fns';

import appDb from '../../db';

const usePersonMigrate = () => {
  const migratePersons = async () => {
    const oldPersons = await appDb.persons.toArray();
    const newPersons = [];

    for (const oldPerson of oldPersons) {
      const names = oldPerson.person_name.split(' ');
      const lastname = names.shift();
      const firstname = names.join(' ');

      const firstReport = oldPerson.firstMonthReport
        ? new Date(oldPerson.firstMonthReport).toISOString()
        : null;

      const baptismDate = oldPerson.immersedDate
        ? new Date(oldPerson.immersedDate).toISOString()
        : null;

      const validStatus = [];

      if (firstReport) {
        if (oldPerson.spiritualStatus) {
          const isActive = oldPerson.spiritualStatus.some(
            (record) => record.endDate === null
          );

          const records = oldPerson.spiritualStatus
            .filter(
              (record) =>
                record.startDate &&
                new Date(record.startDate).toISOString() >= firstReport
            )
            .sort(
              (a, b) =>
                new Date(a.startDate).toISOString() <
                new Date(b.startDate).toISOString()
            )
            .map((record) => {
              return {
                id: record.statusId,
                _deleted: false,
                updatedAt: new Date().toISOString(),
                start_date: format(record.startDate, 'yyyy/MM/dd'),
                end_date: record.endDate
                  ? format(record.endDate, 'yyyy/MM/dd')
                  : null,
              };
            });

          if (records.length > 0) {
            const firstRecord = records.at(0);
            firstRecord.start_date = format(
              new Date(firstReport),
              'yyyy/MM/dd'
            );
          }

          if (isActive && records.length === 0) {
            records.push({
              id: crypto.randomUUID(),
              _deleted: false,
              updatedAt: new Date().toISOString(),
              start_date: format(new Date(firstReport), 'yyyy/MM/dd'),
              end_date: null,
            });
          }

          validStatus.push(...records);
        }
      }

      const unbaptizedStatus = [];
      const baptizedStatus = [];

      if (!baptismDate) {
        unbaptizedStatus.push(...validStatus);
      }

      if (baptismDate && baptismDate <= firstReport) {
        baptizedStatus.push(...validStatus);
      }

      if (baptismDate && baptismDate > firstReport) {
        const baptism = new Date(baptismDate);
        const splitDate = format(baptism, 'yyyy/MM/01');

        const baptismYear = baptism.getFullYear();
        const baptismMonth = baptism.getMonth();

        const prevDate = new Date(baptismYear, baptismMonth, 0);

        const splitDateObj = new Date(splitDate);

        validStatus.forEach((dateRange) => {
          const startDate = new Date(dateRange.start);
          const endDate = dateRange.end
            ? new Date(dateRange.end)
            : splitDateObj;

          if (splitDateObj > startDate && splitDateObj <= endDate) {
            unbaptizedStatus.push({
              start: dateRange.start,
              end: format(prevDate, 'yyyy/MM/dd'),
            });
            baptizedStatus.push({ start: splitDate, end: dateRange.end });
          } else if (startDate >= splitDateObj) {
            baptizedStatus.push(dateRange);
          } else {
            unbaptizedStatus.push(dateRange);
          }
        });
      }

      const isMidweekStudent =
        unbaptizedStatus.length === 0 && baptizedStatus.length === 0;

      const assignments = oldPerson.assignments.map((assignment) => {
        return {
          code: assignment.code,
          updatedAt: new Date().toISOString(),
          _deleted: false,
        };
      });

      const privileges = oldPerson.spiritualStatus
        ? oldPerson.spiritualStatus
            .filter(
              (record) =>
                record.startDate &&
                (record.status === 'elder' || record.status === 'ms')
            )
            .map((record) => {
              return {
                id: record.statusId,
                _deleted: false,
                updatedAt: new Date().toISOString(),
                privilege: record.status,
                start_date: format(new Date(record.startDate), 'yyyy/MM/dd'),
                end_date: record.endDate
                  ? format(new Date(record.endDate), 'yyyy/MM/dd')
                  : null,
              };
            })
            .sort((a, b) => a.start_date < b.start_date)
        : [];

      const enrollments = oldPerson.otherService
        ? oldPerson.otherService
            .filter((record) => record.startDate)
            .map((record) => {
              const enrollment =
                record.service === 'specialPioneer'
                  ? 'FS'
                  : record.service === 'regularPioneer'
                    ? 'FR'
                    : 'AP';

              return {
                id: record.serviceId,
                _deleted: false,
                updatedAt: new Date().toISOString(),
                enrollment: enrollment,
                start_date: format(new Date(record.startDate), 'yyyy/MM/dd'),
                end_date: record.endDate
                  ? format(new Date(record.endDate), 'yyyy/MM/dd')
                  : null,
              };
            })
        : [];

      const newPerson = {
        _deleted: { value: false, updatedAt: '' },
        person_uid: oldPerson.person_uid,
        person_data: {
          disqualified: {
            value: oldPerson.isDisqualified,
            updatedAt: new Date().toISOString(),
          },
          female: {
            value: oldPerson.isFemale,
            updatedAt: new Date().toISOString(),
          },
          male: {
            value: oldPerson.isMale,
            updatedAt: new Date().toISOString(),
          },
          archived: {
            value: false,
            updatedAt: new Date().toISOString(),
          },
          person_firstname: {
            value: firstname,
            updatedAt: new Date().toISOString(),
          },
          person_lastname: {
            value: lastname,
            updatedAt: new Date().toISOString(),
          },
          person_display_name: {
            value: oldPerson.person_displayName,
            updatedAt: new Date().toISOString(),
          },
          birth_date: {
            value: oldPerson.birthDate
              ? new Date(oldPerson.birthDate).toISOString()
              : null,
            updatedAt: new Date().toISOString(),
          },
          address: {
            value: oldPerson.address,
            updatedAt: new Date().toISOString(),
          },
          email: {
            value: oldPerson.email,
            updatedAt: new Date().toISOString(),
          },
          phone: {
            value: oldPerson.phone,
            updatedAt: new Date().toISOString(),
          },
          publisher_baptized: {
            active: {
              value: oldPerson.isBaptized,
              updatedAt: new Date().toISOString(),
            },
            baptism_date: {
              value: baptismDate ? new Date(baptismDate).toISOString() : null,
              updatedAt: new Date().toISOString(),
            },
            other_sheep: {
              value: oldPerson.isOtherSheep,
              updatedAt: new Date().toISOString(),
            },
            anointed: {
              value: oldPerson.isAnointed,
              updatedAt: new Date().toISOString(),
            },
            history: baptizedStatus,
          },
          publisher_unbaptized: {
            active: {
              value: !isMidweekStudent && !oldPerson.isBaptized,
              updatedAt: new Date().toISOString(),
            },
            history: unbaptizedStatus,
          },
          midweek_meeting_student: {
            active: {
              value: isMidweekStudent,
              updatedAt: new Date().toISOString(),
            },
            history: isMidweekStudent
              ? [
                  {
                    id: crypto.randomUUID(),
                    _deleted: false,
                    updatedAt: new Date().toISOString(),
                    start_date: '2023/09/01',
                    end_date: null,
                  },
                ]
              : [],
          },
          timeAway: [],
          assignments,
          privileges,
          enrollments,
          emergency_contacts: [],
          categories: ['main'],
        },
      };

      newPersons.push(newPerson);
    }

    return newPersons;
  };

  return { migratePersons };
};

export default usePersonMigrate;
