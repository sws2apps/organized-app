/*
This file holds the source of the truth from the table "sched".
*/

import { atom, selector } from 'recoil';
import { AssignmentCode } from '@definition/assignment';
import { AssignmentAYFType, AssignmentCongregation, AssignmentHistoryType, SchedWeekType } from '@definition/schedules';
import { sourcesState } from './sources';
import { JWLangState } from './app';
import { getTranslation } from '@services/i18n/translation';
import { LivingAsChristiansType } from '@definition/sources';
import { userDataViewState } from './settings';
import { schedulesAddHistory } from './utils';
import { assignmentTypeLocaleState } from './assignment';

export const schedulesState = atom<SchedWeekType[]>({
	key: 'schedules',
	default: [],
});

export const isPublishOpenState = atom({
	key: 'isPublishOpen',
	default: false,
});

export const dlgAutoFillOpenState = atom({
	key: 'dlgAutoFillOpen',
	default: false,
});

export const isDeleteSchedState = atom({
	key: 'isDeleteSched',
	default: false,
});

export const dlgAssDeleteOpenState = atom({
	key: 'dlgAssDeleteOpen',
	default: false,
});

export const isAutoFillSchedState = atom({
	key: 'isAutoFillSched',
	default: false,
});

export const currentScheduleState = atom({
	key: 'currentSchedule',
	default: '',
});

export const s89DataState = atom({
	key: 's89Data',
	default: [],
});

export const S140DataState = atom({
	key: 'S140Data',
	default: [],
});

export const S140DownloadOpenState = atom({
	key: 'S140DownloadOpen',
	default: false,
});

export const selectedWeekState = atom({
	key: 'selectedWeek',
	default: '',
});

export const assignmentsHistoryState = selector({
	key: 'assignmentsHistory',
	get: ({ get }) => {
		const result: AssignmentHistoryType[] = [];

		const schedules = get(schedulesState);
		const sources = get(sourcesState);
		const lang = get(JWLangState);
		const dataView = get(userDataViewState);
		const assignmentOptions = get(assignmentTypeLocaleState);

		for (const schedule of schedules) {
			let assigned: AssignmentCongregation[] | AssignmentCongregation;

			const source = sources.find((record) => record.weekOf === schedule.weekOf);

			// chairman main hall
			for (assigned of schedule.midweek_meeting.chairman.main_hall) {
				schedulesAddHistory({
					result,
					schedule,
					assigned,
					code: AssignmentCode.MM_Chairman,
					title: getTranslation({ key: 'tr_chairmanMidwekMeetingHistory' }),
					classroom: '1',
				});
			}

			// chairman aux class
			assigned = schedule.midweek_meeting.chairman.aux_class_1;
			schedulesAddHistory({
				result,
				schedule,
				assigned,
				code: AssignmentCode.MM_Chairman,
				title: getTranslation({ key: 'tr_auxClassroom' }),
				classroom: '2',
			});

			// opening prayer
			for (assigned of schedule.midweek_meeting.opening_prayer) {
				schedulesAddHistory({
					result,
					schedule,
					assigned,
					code: AssignmentCode.MM_Prayer,
					title: getTranslation({ key: 'tr_prayer' }),
				});
			}

			// tgw talk
			for (assigned of schedule.midweek_meeting.tgw_talk) {
				schedulesAddHistory({
					result,
					schedule,
					assigned,
					code: AssignmentCode.MM_TGWTalk,
					title: getTranslation({ key: 'tr_tgw10TalkHistory' }),
				});
			}

			// tgw gems
			for (assigned of schedule.midweek_meeting.tgw_gems) {
				schedulesAddHistory({
					result,
					schedule,
					assigned,
					code: AssignmentCode.MM_TGWGems,
					title: getTranslation({ key: 'tr_tgwGems' }),
				});
			}

			// tgw bible reading main hall
			for (assigned of schedule.midweek_meeting.tgw_bible_reading.main_hall) {
				schedulesAddHistory({
					result,
					schedule,
					assigned,
					code: AssignmentCode.MM_BibleReading,
					title: getTranslation({ key: 'tr_bibleReading' }),
					src: source.midweek_meeting.tgw_bible_reading.src[lang],
					classroom: '1',
				});
			}

			// tgw bible reading aux class
			assigned = schedule.midweek_meeting.tgw_bible_reading.aux_class_1;
			schedulesAddHistory({
				result,
				schedule,
				assigned,
				code: AssignmentCode.MM_BibleReading,
				title: getTranslation({ key: 'tr_bibleReading' }),
				src: source.midweek_meeting.tgw_bible_reading.src[lang],
				classroom: '2',
			});

			// ayf part
			for (let a = 1; a <= 4; a++) {
				const code: AssignmentCode = source.midweek_meeting[`ayf_part${a}`].type[lang];

				if (code) {
					const src = source.midweek_meeting[`ayf_part${a}`].src[lang];
					const title = assignmentOptions.find((record) => record.value === code).label;
					const ayfPart: AssignmentAYFType = schedule.midweek_meeting[`ayf_part${a}`];

					// student main hall
					for (const item of ayfPart.main_hall.student) {
						const assigned = item as AssignmentCongregation;

						schedulesAddHistory({
							result,
							schedule,
							assigned,
							code,
							title,
							src,
							classroom: '1',
							assistant: ayfPart.main_hall.assistant.find((record) => record.type === assigned.type)?.value,
						});
					}

					// assistant main hall
					for (const item of ayfPart.main_hall.assistant) {
						const assigned = item as AssignmentCongregation;

						schedulesAddHistory({
							result,
							schedule,
							assigned,
							code: AssignmentCode.MM_AssistantOnly,
							title: `${getTranslation({ key: 'tr_assistant' })} (${title})`,
							src,
							classroom: '1',
							student: ayfPart.main_hall.student.find((record) => record.type === assigned.type)?.value,
						});
					}

					// student aux class
					assigned = ayfPart.aux_class_1.student;
					schedulesAddHistory({
						result,
						schedule,
						assigned,
						code,
						title,
						src,
						classroom: '2',
						assistant: ayfPart.aux_class_1.assistant.value,
					});

					// assistant main hall
					assigned = ayfPart.aux_class_1.assistant;
					schedulesAddHistory({
						result,
						schedule,
						assigned,
						code: AssignmentCode.MM_AssistantOnly,
						title: `${getTranslation({ key: 'tr_assistant' })} (${title})`,
						src,
						classroom: '2',
						student: ayfPart.aux_class_1.student.value,
					});
				}
			}

			// lc part
			for (let a = 1; a <= 3; a++) {
				const lcPart: LivingAsChristiansType = source.midweek_meeting[`lc_part${a}`];

				const srcOverride = lcPart.title.override.find((record) => record.type === dataView)?.value;
				const srcDefault = lcPart.title.default[lang];
				const src = srcOverride?.length > 0 ? srcOverride : srcDefault;

				const descOverride = lcPart.desc.override.find((record) => record.type === dataView)?.value;
				const descDefault = lcPart.desc.default[lang];
				const desc = descOverride?.length > 0 ? descOverride : descDefault;

				if (src?.length > 0) {
					for (assigned of schedule.midweek_meeting[`lc_part${a}`]) {
						schedulesAddHistory({
							result,
							schedule,
							assigned: assigned as AssignmentCongregation,
							code: AssignmentCode.MM_LCPart,
							title: getTranslation({ key: 'tr_lcPart' }),
							src,
							desc,
						});
					}
				}
			}

			// lc cbs conductor
			for (assigned of schedule.midweek_meeting.lc_cbs.conductor) {
				schedulesAddHistory({
					result,
					schedule,
					assigned,
					code: AssignmentCode.MM_CBSConductor,
					title: getTranslation({ key: 'tr_congregationBibleStudyConductor' }),
					src: source.midweek_meeting.lc_cbs.src[lang],
				});
			}

			// lc cbs reader
			for (assigned of schedule.midweek_meeting.lc_cbs.reader) {
				schedulesAddHistory({
					result,
					schedule,
					assigned,
					code: AssignmentCode.MM_CBSReader,
					title: getTranslation({ key: 'tr_congregationBibleStudyReader' }),
					src: source.midweek_meeting.lc_cbs.src[lang],
				});
			}

			// closing prayer
			for (assigned of schedule.midweek_meeting.closing_prayer) {
				schedulesAddHistory({
					result,
					schedule,
					assigned,
					code: AssignmentCode.MM_Prayer,
					title: getTranslation({ key: 'tr_prayer' }),
				});
			}
		}

		return result.sort((a, b) => new Date(b.weekOf).toISOString().localeCompare(new Date(a.weekOf).toISOString()));
	},
});
