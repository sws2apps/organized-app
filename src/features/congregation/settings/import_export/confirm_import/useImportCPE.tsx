import { PersonType } from '@definition/person';
import { BackupCPEType } from '@definition/backup';
import { formatDate } from '@services/dateformat';
import { FieldServiceGroupType } from '@definition/field_service_groups';
import {
  scheduleSchema,
  sourceSchema,
  speakersCongregationSchema,
  vistingSpeakerSchema,
} from '@services/dexie/schema';
import { SpeakersCongregationsType } from '@definition/speakers_congregations';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import { BranchFieldServiceReportType } from '@definition/branch_field_service_reports';
import { MeetingAttendanceType } from '@definition/meeting_attendance';
import { LANGUAGE_LIST } from '@constants/index';
import { SourceWeekType } from '@definition/sources';
import { SchedWeekType } from '@definition/schedules';

const isMondayDate = (date) => {
  const inputDate = new Date(date);
  const dayOfWeek = inputDate.getDay();

  return dayOfWeek === 1;
};

const useImportCPE = () => {
  const migratePersons = (oldPersons: BackupCPEType['persons']) => {
    const newPersons: PersonType[] = [];

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
            .sort((a, b) => a.startDate.localeCompare(b.startDate))
            .map((record) => {
              return {
                id: record.statusId,
                _deleted: false,
                updatedAt: new Date().toISOString(),
                start_date: formatDate(
                  new Date(record.startDate),
                  'yyyy/MM/dd'
                ),
                end_date: record.endDate
                  ? formatDate(new Date(record.endDate), 'yyyy/MM/dd')
                  : null,
              };
            });

          if (records.length > 0) {
            const firstRecord = records.at(0);
            firstRecord.start_date = formatDate(
              new Date(firstReport),
              'yyyy/MM/dd'
            );
          }

          if (isActive && records.length === 0) {
            records.push({
              id: crypto.randomUUID(),
              _deleted: false,
              updatedAt: new Date().toISOString(),
              start_date: formatDate(new Date(firstReport), 'yyyy/MM/dd'),
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
        const splitDate = formatDate(baptism, 'yyyy/MM/01');

        const baptismYear = baptism.getFullYear();
        const baptismMonth = baptism.getMonth();

        const prevDate = new Date(baptismYear, baptismMonth, 0);

        const splitDateObj = new Date(splitDate);

        validStatus.forEach((dateRange) => {
          const startDate = new Date(dateRange.start_date);
          const endDate = dateRange.end_date
            ? new Date(dateRange.end_date)
            : splitDateObj;

          if (splitDateObj > startDate && splitDateObj <= endDate) {
            unbaptizedStatus.push({
              start_date: dateRange.start_date,
              end_date: formatDate(prevDate, 'yyyy/MM/dd'),
            });
            baptizedStatus.push({
              start_date: splitDate,
              end_date: dateRange.end_date,
            });
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
                start_date: formatDate(
                  new Date(record.startDate),
                  'yyyy/MM/dd'
                ),
                end_date: record.endDate
                  ? formatDate(new Date(record.endDate), 'yyyy/MM/dd')
                  : null,
              };
            })
            .sort((a, b) => a.start_date.localeCompare(b.start_date))
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
                start_date: formatDate(
                  new Date(record.startDate),
                  'yyyy/MM/dd'
                ),
                end_date: record.endDate
                  ? formatDate(new Date(record.endDate), 'yyyy/MM/dd')
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
          first_report: {
            value: firstReport,
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

      newPersons.push(newPerson as PersonType);
    }

    return newPersons;
  };

  const migrateServiceGroups = (
    oldLists: BackupCPEType['fieldServiceGroup']
  ) => {
    const currentList = oldLists.find(
      (record) => record.isCurrent && !record.deleted
    );

    if (!currentList) return [];

    const groups: FieldServiceGroupType[] = [];

    let index = 0;
    for (const group of currentList.groups) {
      const sortedPersons = group.persons.sort((a, b) => {
        if (a.isOverseer === b.isOverseer) {
          return Number(b.isAssistant) - Number(a.isAssistant);
        }

        return Number(b.isOverseer) - Number(a.isOverseer);
      });

      groups.push({
        group_id: group.group_uid,
        group_data: {
          _deleted: false,
          updatedAt: new Date().toISOString(),
          name: '',
          sort_index: index,
          members: sortedPersons.map((person, sort_index) => {
            return { ...person, sort_index };
          }),
        },
      });

      index++;
    }

    return groups;
  };

  const migrateSpeakers = (
    oldCongregations: BackupCPEType['visiting_speakers']
  ) => {
    oldCongregations = oldCongregations.filter(
      (record) => !record.is_deleted && record.is_local
    );

    const congregations: SpeakersCongregationsType[] = [];
    const speakers: VisitingSpeakerType[] = [];

    for (const congregation of oldCongregations) {
      const objCong = structuredClone(speakersCongregationSchema);

      objCong.id = crypto.randomUUID();

      objCong.cong_data.cong_number = {
        value: String(congregation.cong_number),
        updatedAt: new Date().toISOString(),
      };

      objCong.cong_data.cong_name = {
        value: congregation.cong_name,
        updatedAt: new Date().toISOString(),
      };

      objCong.cong_data.request_status = 'approved';

      congregations.push(objCong);

      for (const speaker of congregation.cong_speakers) {
        const objSpeaker = structuredClone(vistingSpeakerSchema);

        const names = speaker.person_name.split(' ');
        const lastname = names.shift();
        const firstname = names.join(' ');

        objSpeaker.person_uid = speaker.person_uid;
        objSpeaker.speaker_data.cong_id = objCong.id;
        objSpeaker.speaker_data.person_firstname = {
          value: firstname,
          updatedAt: new Date().toISOString(),
        };
        objSpeaker.speaker_data.person_lastname = {
          value: lastname,
          updatedAt: new Date().toISOString(),
        };
        objSpeaker.speaker_data.person_display_name = {
          value: speaker.person_displayName,
          updatedAt: new Date().toISOString(),
        };
        objSpeaker.speaker_data.person_email = {
          value: speaker.email,
          updatedAt: new Date().toISOString(),
        };
        objSpeaker.speaker_data.person_phone = {
          value: speaker.phone,
          updatedAt: new Date().toISOString(),
        };
        objSpeaker.speaker_data.elder = {
          value: speaker.is_elder,
          updatedAt: new Date().toISOString(),
        };
        objSpeaker.speaker_data.ministerial_servant = {
          value: speaker.is_ms,
          updatedAt: new Date().toISOString(),
        };
        objSpeaker.speaker_data.talks = speaker.talks.map((talk) => {
          return {
            _deleted: false,
            updatedAt: new Date().toISOString(),
            talk_number: talk,
            talk_songs: [],
          };
        });

        speakers.push(objSpeaker);
      }
    }

    return { congregations, speakers };
  };

  const migrateCongReports = (
    oldReports: BackupCPEType['fieldServiceReports']
  ) => {
    const reports: CongFieldServiceReportType[] = [];

    for (const report of oldReports) {
      for (const record of report.months) {
        const shared =
          +record.bibleStudies > 0 ||
          +record.hourCredit > 0 ||
          +record.hours > 0 ||
          +record.minutes > 0 ||
          +record.placements > 0 ||
          +record.returnVisits > 0 ||
          +record.videos > 0;

        reports.push({
          report_id: record.uid,
          report_data: {
            _deleted: false,
            updatedAt: new Date().toISOString(),
            report_date: formatDate(new Date(record.month_value), 'yyyy/MM'),
            person_uid: report.person_uid,
            shared_ministry: shared,
            hours: {
              field_service: +record.hours,
              credit: { value: 0, approved: +record.hourCredit },
            },
            bible_studies: +record.bibleStudies,
            comments: record.comments,
            late: { value: false, submitted: '' },
            status: 'confirmed',
          },
        });
      }
    }

    return reports;
  };

  const migrateBranchReports = (oldReports: BackupCPEType['branchReports']) => {
    const reports: BranchFieldServiceReportType[] = oldReports.map((record) => {
      return {
        report_date: formatDate(new Date(record.month), 'yyyy/MM'),
        report_data: {
          _deleted: false,
          updatedAt: new Date().toISOString(),
          publishers_active: record.details.activePublishers,
          weekend_meeting_average: record.details.weekendMeetingAttendanceAvg,
          submitted: record.details.isSubmitted,
          publishers: {
            report_count: record.details.publishersReports,
            bible_studies: record.details.totalBibleStudies,
          },
          APs: {
            report_count: record.details.auxPioneersReports,
            hours: record.details.auxPioneersHours,
            bible_studies: record.details.auxPioneersBibleStudies,
          },
          FRs: {
            report_count: record.details.FRReports,
            hours: record.details.FRHours,
            bible_studies: record.details.FRBibleStudies,
          },
        },
      };
    });

    return reports;
  };

  const migrateAttendances = (
    oldAttendances: BackupCPEType['meetingAttendance']
  ) => {
    const attendances: MeetingAttendanceType[] = oldAttendances.map(
      (record) => {
        const midweek1 = record.midweek_meeting.find(
          (meet) => meet.index === 1
        );
        const midweek2 = record.midweek_meeting.find(
          (meet) => meet.index === 2
        );
        const midweek3 = record.midweek_meeting.find(
          (meet) => meet.index === 3
        );
        const midweek4 = record.midweek_meeting.find(
          (meet) => meet.index === 4
        );
        const midweek5 = record.midweek_meeting.find(
          (meet) => meet.index === 5
        );

        const weekend1 = record.weekend_meeting.find(
          (meet) => meet.index === 1
        );
        const weekend2 = record.weekend_meeting.find(
          (meet) => meet.index === 2
        );
        const weekend3 = record.weekend_meeting.find(
          (meet) => meet.index === 3
        );
        const weekend4 = record.weekend_meeting.find(
          (meet) => meet.index === 4
        );
        const weekend5 = record.weekend_meeting.find(
          (meet) => meet.index === 5
        );

        return {
          month_date: formatDate(new Date(record.month_value), 'yyyy/MM'),
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
          _deleted: { value: false, updatedAt: new Date().toISOString() },
        };
      }
    );

    return attendances;
  };

  const migrateSources = (
    oldSources: BackupCPEType['sources'],
    schedules: BackupCPEType['sched']
  ) => {
    const uiLang = localStorage.getItem('ui_lang') || 'eng';
    const lang =
      LANGUAGE_LIST.find((record) => record.threeLettersCode === uiLang)?.code || 'E';

    const sources: SourceWeekType[] = [];

    for (const record of oldSources) {
      const isMonday = isMondayDate(record.weekOf);

      if (!isMonday) continue;

      if (!record.mwb_week_date_locale) continue;

      const obj = structuredClone(sourceSchema);

      const schedule = schedules.find((s) => s.weekOf === record.weekOf);

      obj.weekOf = record.weekOf;

      obj.midweek_meeting.week_date_locale = record.mwb_week_date_locale;

      obj.midweek_meeting.weekly_bible_reading =
        record.mwb_weekly_bible_reading;

      obj.midweek_meeting.song_first = {
        [lang]: String(record.mwb_song_first),
      };

      obj.midweek_meeting.tgw_talk = {
        src: record.mwb_tgw_talk,
        time: { default: 10, override: [] },
      };

      obj.midweek_meeting.tgw_gems = {
        title: { [lang]: '' },
        time: { default: 10, override: [] },
      };

      obj.midweek_meeting.tgw_bible_reading = {
        src: record.mwb_tgw_bread,
        title: { [lang]: '' },
      };

      obj.midweek_meeting.ayf_count = { [lang]: record.mwb_ayf_count };

      obj.midweek_meeting.ayf_part1 = {
        type: record.mwb_ayf_part1_type,
        time: { [lang]: record.mwb_ayf_part1_time },
        src: record.mwb_ayf_part1,
        title: { [lang]: '' },
      };

      obj.midweek_meeting.ayf_part2 = {
        type: record.mwb_ayf_part2_type,
        time: { [lang]: record.mwb_ayf_part2_time },
        src: record.mwb_ayf_part2,
        title: { [lang]: '' },
      };

      obj.midweek_meeting.ayf_part3 = {
        type: record.mwb_ayf_part3_type,
        time: { [lang]: record.mwb_ayf_part3_time },
        src: record.mwb_ayf_part3,
        title: { [lang]: '' },
      };

      obj.midweek_meeting.ayf_part4 = {
        type: record.mwb_ayf_part4_type,
        time: { [lang]: record.mwb_ayf_part4_time },
        src: record.mwb_ayf_part4,
        title: { [lang]: '' },
      };

      obj.midweek_meeting.song_middle = {
        [lang]: String(record.mwb_song_middle),
      };

      obj.midweek_meeting.lc_count = {
        default: { [lang]: record.mwb_lc_count },
        override: [
          {
            type: 'main',
            value: record.mwb_lc_count_override,
            updatedAt: new Date().toISOString(),
          },
        ],
      };

      obj.midweek_meeting.lc_part1 = {
        time: {
          default: { [lang]: record.mwb_lc_part1_time },
          override: [
            {
              type: 'main',
              value: record.mwb_lc_part1_time_override,
              updatedAt: new Date().toISOString(),
            },
          ],
        },
        title: {
          default: record.mwb_lc_part1,
          override: [
            {
              type: 'main',
              value: record.mwb_lc_part1_override?.[lang] ?? '',
              updatedAt: new Date().toISOString(),
            },
          ],
        },
        desc: {
          default: record.mwb_lc_part1_content,
          override: [
            {
              type: 'main',
              value: record.mwb_lc_part1_content_override?.[lang] ?? '',
              updatedAt: new Date().toISOString(),
            },
          ],
        },
      };

      obj.midweek_meeting.lc_part2 = {
        time: {
          default: { [lang]: record.mwb_lc_part2_time },
          override: [
            {
              type: 'main',
              value: record.mwb_lc_part2_time_override,
              updatedAt: new Date().toISOString(),
            },
          ],
        },
        title: {
          default: record.mwb_lc_part2,
          override: [
            {
              type: 'main',
              value: record.mwb_lc_part2_override?.[lang] ?? '',
              updatedAt: new Date().toISOString(),
            },
          ],
        },
        desc: {
          default: record.mwb_lc_part2_content,
          override: [
            {
              type: 'main',
              value: record.mwb_lc_part2_content_override?.[lang] ?? '',
              updatedAt: new Date().toISOString(),
            },
          ],
        },
      };

      obj.midweek_meeting.lc_cbs = {
        title: { default: { [lang]: '' }, override: [] },
        time: {
          default: 30,
          override: [
            {
              type: 'main',
              value: +(record.mwb_lc_cbs_time_override || ''),
              updatedAt: new Date().toISOString(),
            },
          ],
        },
        src: record.mwb_lc_cbs,
      };

      obj.midweek_meeting.co_talk_title = {
        src: record.mwb_co_talk_title || '',
        updatedAt: new Date().toISOString(),
      };

      obj.midweek_meeting.song_conclude = {
        default: { [lang]: String(record.mwb_song_conclude) },
        override: [
          {
            type: 'main',
            value: String(record.mwb_song_conclude_override || ''),
            updatedAt: new Date().toISOString(),
          },
        ],
      };

      const talk = schedule.public_talk || record.w_talk_title_override || '';

      obj.weekend_meeting.public_talk = [
        {
          type: 'main',
          value: talk,
          updatedAt: new Date().toISOString(),
        },
      ];

      obj.weekend_meeting.co_talk_title.public = {
        src: record.w_co_talk_title || '',
        updatedAt: new Date().toISOString(),
      };

      obj.weekend_meeting.song_middle = {
        [lang]: String(record.w_study_opening_song),
      };

      obj.weekend_meeting.w_study = record.w_study_title;

      obj.weekend_meeting.song_conclude = {
        default: { [lang]: String(record.w_study_concluding_song) },
        override: [],
      };

      sources.push(obj);
    }

    return sources;
  };

  const migrateSchedules = (oldSchedules: BackupCPEType['sched']) => {
    const schedules: SchedWeekType[] = [];

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

  return {
    migratePersons,
    migrateServiceGroups,
    migrateSpeakers,
    migrateCongReports,
    migrateBranchReports,
    migrateAttendances,
    migrateSources,
    migrateSchedules,
  };
};

export default useImportCPE;
