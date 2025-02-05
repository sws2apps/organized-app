import { formatDate } from 'date-fns';

const useHourglassImport = () => {
  const migrateHourglassPersons = (HOURGLASS_DATA) => {
    const ALL_PUBLISHERS = structuredClone(HOURGLASS_DATA.publishers);

    if (HOURGLASS_DATA.notPublishers) {
      ALL_PUBLISHERS.push(...HOURGLASS_DATA.notPublishers);
    }

    return ALL_PUBLISHERS.map((record) => {
      let phone = record.cellphone === null ? '' : record.cellphone;
      phone =
        record.homephone === null ? phone : `${phone}; ${record.homephone}`;
      phone =
        record.otherphone === null ? phone : `${phone}; ${record.otherphone}`;

      const isUnbaptized = record.status === 'Unbaptized Publisher';
      const isAPContinuous = record.status === 'Continuous Auxiliary Pioneer';
      const isFR = record.status === 'Regular Pioneer';
      const isFS = record.status === 'Special Pioneer';
      const isMidweekStudent = record.status === 'StudentOnly';
      const isBaptized =
        record.status === 'Baptized Publisher' ||
        isAPContinuous ||
        isFR ||
        isFS;

      const assignments = [];

      const isBibleReading = HOURGLASS_DATA.privileges?.reading.includes(
        record.id
      );
      const isInitialCall = HOURGLASS_DATA.privileges?.initcall.includes(
        record.id
      );
      const isReturnVisit = HOURGLASS_DATA.privileges?.rv.includes(record.id);
      const isBibleStudy = HOURGLASS_DATA.privileges?.study.includes(record.id);
      const isTalk = HOURGLASS_DATA.privileges?.stutalk.includes(record.id);
      const isDiscussion = HOURGLASS_DATA.privileges?.fm_discussion.includes(
        record.id
      );
      const isAuxChairman = HOURGLASS_DATA.privileges?.aux_chairman.includes(
        record.id
      );
      const isCBSConductor = HOURGLASS_DATA.privileges?.cbs.includes(record.id);
      const isCBSReader = HOURGLASS_DATA.privileges?.cbs_reader.includes(
        record.id
      );
      const isChairmanMM = HOURGLASS_DATA.privileges?.mm_chairman.includes(
        record.id
      );
      const isPrayer = HOURGLASS_DATA.privileges?.prayer.includes(record.id);
      const isGems = HOURGLASS_DATA.privileges?.dfg.includes(record.id);
      const isLivingPart = HOURGLASS_DATA.privileges?.lac.includes(record.id);
      const isSpeaker = HOURGLASS_DATA.privileges?.pt.includes(record.id);
      const isTreasures = HOURGLASS_DATA.privileges?.treasures.includes(
        record.id
      );
      const isChairmanWM = HOURGLASS_DATA.privileges?.wm_chairman.includes(
        record.id
      );
      const isWTConductor = HOURGLASS_DATA.privileges?.wt_conductor.includes(
        record.id
      );
      const isWTReader = HOURGLASS_DATA.privileges?.wm_reader.includes(
        record.id
      );

      if (isBibleReading) assignments.push(100);
      if (isInitialCall) assignments.push(123);
      if (isReturnVisit) assignments.push(124);
      if (isBibleStudy) assignments.push(125, 126);
      if (isTalk) assignments.push(104);
      if (isDiscussion) assignments.push(127);
      if (isAuxChairman) assignments.push(128);
      if (isCBSConductor) assignments.push(115);
      if (isCBSReader) assignments.push(116);
      if (isChairmanMM) assignments.push(110);
      if (isPrayer) assignments.push(111, 119);
      if (isGems) assignments.push(113);
      if (isLivingPart) assignments.push(114);
      if (isSpeaker) assignments.push(120);
      if (isTreasures) assignments.push(112);
      if (isChairmanWM) assignments.push(118);
      if (isWTConductor) assignments.push(130);
      if (isWTReader) assignments.push(122);

      const privileges = [];
      const isElder = record.appt === 'Elder';
      const isMS = record.appt === 'MS';

      if (isElder) privileges.push('elder');
      if (isMS) privileges.push('ms');

      const enrollments = [];

      const pubReports = HOURGLASS_DATA.reports
        .filter((report) => report.user.id === record.id)
        .sort((a, b) => {
          const reportMonthA = `${a.year}/${String(a.month).padStart(2, '0')}`;
          const reportMonthB = `${b.year}/${String(b.month).padStart(2, '0')}`;

          return reportMonthA.localeCompare(reportMonthB);
        });

      let lockStatus = false;
      let startDate = '';
      let endDate = '';
      let enrollment = '';

      for (let i = 0; i < pubReports.length - 1; i++) {
        const report = pubReports.at(i);

        if (
          report.pioneer === 'Auxiliary' ||
          report.pioneer === 'Regular' ||
          report.pioneer === 'Special'
        ) {
          if (!lockStatus) {
            lockStatus = true;
            enrollment =
              report.pioneer === 'Special'
                ? 'SP'
                : report.pioneer === 'Regular'
                  ? 'FR'
                  : 'AP';
            startDate = formatDate(
              new Date(report.year, report.month - 1, 1),
              'yyyy/MM/dd'
            );
          }
        }

        if (report.pioneer === null) {
          if (lockStatus) {
            endDate = formatDate(
              new Date(report.year, report.month - 1, 0),
              'yyyy/MM/dd'
            );

            enrollments.push({
              id: crypto.randomUUID(),
              enrollment: enrollment,
              updatedAt: new Date().toISOString(),
              _deleted: false,
              start_date: startDate,
              end_date: endDate,
            });
          }

          lockStatus = false;
          enrollment = '';
          startDate = '';
          endDate = '';
        }
      }

      if (lockStatus) {
        enrollments.push({
          id: crypto.randomUUID(),
          enrollment: enrollment,
          updatedAt: new Date().toISOString(),
          _deleted: false,
          start_date: startDate,
          end_date: null,
        });
      }

      const initialReport = pubReports.at(0);

      const firstreport = initialReport
        ? `${initialReport.year}/${String(initialReport.month).padStart(2, '0')}/01`
        : null;

      const hasCredits = pubReports.some((rep) => rep.credithours > 0);
      if (hasCredits) assignments.push(300);

      return {
        _deleted: { value: false, updatedAt: new Date().toISOString() },
        person_uid: record.uuid || crypto.randomUUID(),
        person_data: {
          disqualified: { value: false, updatedAt: new Date().toISOString() },
          female: {
            value: record.sex === 'Female',
            updatedAt: new Date().toISOString(),
          },
          male: {
            value: record.sex === 'Male',
            updatedAt: new Date().toISOString(),
          },
          archived: { value: false, updatedAt: new Date().toISOString() },
          person_firstname: {
            value: record.firstname,
            updatedAt: new Date().toISOString(),
          },
          person_lastname: {
            value: record.lastname,
            updatedAt: new Date().toISOString(),
          },
          person_display_name: {
            value: '',
            updatedAt: new Date().toISOString(),
          },
          birth_date: {
            value:
              record.birth === null
                ? null
                : new Date(record.birth).toISOString(),
            updatedAt: new Date().toISOString(),
          },
          address: {
            value:
              record.address_id === null
                ? null
                : HOURGLASS_DATA.addresses.find(
                    (a) => a.id === record.address_id
                  ).line1,
            updatedAt: new Date().toISOString(),
          },
          email: {
            value: record.email === null ? '' : record.email,
            updatedAt: new Date().toISOString(),
          },
          phone: { value: phone, updatedAt: new Date().toISOString() },
          publisher_baptized: {
            active: { value: isBaptized, updatedAt: new Date().toISOString() },
            baptism_date: {
              value: record.baptism
                ? formatDate(new Date(record.baptism), 'yyyy/MM/dd')
                : null,
              updatedAt: new Date().toISOString(),
            },
            other_sheep: {
              value: !record.anointed,
              updatedAt: new Date().toISOString(),
            },
            anointed: {
              value: record.anointed,
              updatedAt: new Date().toISOString(),
            },
            history:
              firstreport && isBaptized
                ? [
                    {
                      id: crypto.randomUUID(),
                      _deleted: false,
                      updatedAt: new Date().toISOString(),
                      start_date: firstreport,
                      end_date: null,
                    },
                  ]
                : [],
          },
          publisher_unbaptized: {
            active: {
              value: isUnbaptized,
              updatedAt: new Date().toISOString(),
            },
            history:
              firstreport && isUnbaptized
                ? [
                    {
                      id: crypto.randomUUID(),
                      _deleted: false,
                      updatedAt: new Date().toISOString(),
                      start_date: firstreport,
                      end_date: null,
                    },
                  ]
                : [],
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
                    start_date: formatDate(new Date(), 'yyyy/MM/dd'),
                    end_date: null,
                  },
                ]
              : [],
          },
          timeAway: [],
          assignments: assignments.map((code) => {
            return {
              code: code,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            };
          }),
          privileges: privileges.map((privilege) => {
            return {
              id: crypto.randomUUID(),
              privilege: privilege,
              updatedAt: new Date().toISOString(),
              _deleted: false,
              start_date: firstreport,
              end_date: null,
            };
          }),
          enrollments,
          emergency_contacts:
            record.emergencycontacts?.map((contact) => {
              let emergencyContact =
                contact.email === null ? '' : contact.email;
              emergencyContact =
                contact.cellphone === null
                  ? emergencyContact
                  : `${emergencyContact}; ${contact.cellphone}`;
              emergencyContact =
                contact.homephone === null
                  ? emergencyContact
                  : `${emergencyContact}; ${contact.homephone}`;
              emergencyContact =
                contact.otherphone === null
                  ? emergencyContact
                  : `${emergencyContact}; ${contact.otherphone}`;

              return {
                id: crypto.randomUUID(),
                updatedAt: new Date().toISOString(),
                _deleted: false,
                name: contact.name,
                contact: emergencyContact,
              };
            }) || [],
          categories: ['main'],
          first_report: {
            value: firstreport,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  };

  const migrateHourglassAttendance = (HOURGLASS_DATA) => {
    return HOURGLASS_DATA.attendance.attendance.map((attendance) => {
      return {
        _deleted: { value: false, updatedAt: new Date().toISOString() },
        month_date: attendance.month.replace('-', '/'),
        week_1: {
          midweek: [
            {
              type: 'main',
              present: attendance.mw1 || undefined,
              updatedAt: new Date().toISOString(),
            },
          ],
          weekend: [
            {
              type: 'main',
              present: attendance.we1 || undefined,
              updatedAt: new Date().toISOString(),
            },
          ],
        },
        week_2: {
          midweek: [
            {
              type: 'main',
              present: attendance.mw2 || undefined,
              updatedAt: new Date().toISOString(),
            },
          ],
          weekend: [
            {
              type: 'main',
              present: attendance.we2 || undefined,
              updatedAt: new Date().toISOString(),
            },
          ],
        },
        week_3: {
          midweek: [
            {
              type: 'main',
              present: attendance.mw3 || undefined,
              updatedAt: new Date().toISOString(),
            },
          ],
          weekend: [
            {
              type: 'main',
              present: attendance.we3 || undefined,
              updatedAt: new Date().toISOString(),
            },
          ],
        },
        week_4: {
          midweek: [
            {
              type: 'main',
              present: attendance.mw4 || undefined,
              updatedAt: new Date().toISOString(),
            },
          ],
          weekend: [
            {
              type: 'main',
              present: attendance.we4 || undefined,
              updatedAt: new Date().toISOString(),
            },
          ],
        },
        week_5: {
          midweek: [
            {
              type: 'main',
              present: attendance.mw5 || undefined,
              updatedAt: new Date().toISOString(),
            },
          ],
          weekend: [
            {
              type: 'main',
              present: attendance.we5 || undefined,
              updatedAt: new Date().toISOString(),
            },
          ],
        },
      };
    });
  };

  const migrateFieldServiceGroups = (HOURGLASS_DATA) => {
    return HOURGLASS_DATA.fsGroups.map((group) => {
      const members = [];

      const overseer = HOURGLASS_DATA.publishers.find(
        (record) =>
          record.group_id === group.id && record.id === group.overseer_id
      );
      const assistant = HOURGLASS_DATA.publishers.find(
        (record) =>
          record.group_id === group.id && record.id === group.assistant_id
      );

      if (overseer) {
        members.push({
          isAssistant: false,
          isOverseer: true,
          person_uid: overseer.uuid,
          sort_index: 0,
        });
      }

      if (assistant) {
        members.push({
          isAssistant: true,
          isOverseer: false,
          person_uid: assistant.uuid,
          sort_index: 1,
        });
      }

      const otherPublishers = HOURGLASS_DATA.publishers
        .filter(
          (record) =>
            record.group_id === group.id &&
            members.some((pub) => pub.person_uid === record.uuid) === false
        )
        .map((pub) => {
          return {
            isAssistant: false,
            isOverseer: false,
            person_uid: pub.uuid,
          };
        });

      members.push(...otherPublishers);

      return {
        group_id: crypto.randomUUID(),
        group_data: {
          _deleted: false,
          updatedAt: new Date().toISOString(),
          name: '',
          sort_index: HOURGLASS_DATA.fsGroups.findIndex(
            (record) => record.id === group.id
          ),
          members: members.map((pub) => {
            const sort_index = pub.sort_index;

            if (sort_index) return pub;

            const start_sort = !overseer || !assistant ? 2 : 0;

            return {
              ...pub,
              sort_index:
                members.findIndex(
                  (record) => record.person_uid === pub.person_uid
                ) + start_sort,
            };
          }),
        },
      };
    });
  };

  const migrateBranchFieldServiceReports = (HOURGLASS_DATA) => {
    return HOURGLASS_DATA.monthlyTotals.map((report) => {
      return {
        report_date: report.month.replace('-', '/'),
        report_data: {
          _deleted: false,
          updatedAt: new Date().toISOString(),
          submitted: report.pub.createdAt === null ? false : true,
          publishers_active: report.pub.active,
          weekend_meeting_average: HOURGLASS_DATA.attendance.attendance.find(
            (record) => record.month === report.month
          ).weAvg,
          publishers: {
            report_count: report.pub.count,
            bible_studies: report.pub.studies,
          },
          APs: {
            report_count: report.aux.count,
            hours: report.aux.hours,
            bible_studies: report.aux.studies,
          },
          FRs: {
            report_count: report.reg.count,
            hours: report.reg.hours,
            bible_studies: report.reg.studies,
          },
        },
      };
    });
  };

  const migrateCongFieldServiceReports = (HOURGLASS_DATA) => {
    return HOURGLASS_DATA.reports.map((report) => {
      const activePubs = HOURGLASS_DATA.publishers;
      const inactivePubs = HOURGLASS_DATA.notPublishers || [];

      const publishers = [...activePubs, ...inactivePubs];

      const reportMonth = `${report.year}/${String(report.month).padStart(2, '0')}`;
      const submittedMonth = report.submitted_month.replace('-', '/');

      return {
        report_id: crypto.randomUUID(),
        report_data: {
          _deleted: false,
          updatedAt: new Date().toISOString(),
          report_date: reportMonth,
          person_uid: publishers.find((pub) => pub.id === report.user.id).uuid,
          shared_ministry:
            +report.minutes_as_hours > 0 ||
            report.credithours > 0 ||
            report.studies > 0,
          hours: {
            field_service: Math.round(report.minutes_as_hours),
            credit: { value: 0, approved: report.credithours },
          },
          bible_studies: report.studies,
          comments: report.remarks === null ? '' : report.remarks,
          late: {
            value: reportMonth !== submittedMonth,
            submitted: submittedMonth,
          },
          status: 'confirmed',
        },
      };
    });
  };

  return {
    migrateHourglassPersons,
    migrateHourglassAttendance,
    migrateFieldServiceGroups,
    migrateBranchFieldServiceReports,
    migrateCongFieldServiceReports,
  };
};

export default useHourglassImport;
