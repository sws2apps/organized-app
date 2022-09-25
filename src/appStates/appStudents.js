import { atom } from 'recoil';

export const allStudentsState = atom({
	key: 'allStudents',
	default: [],
});

export const filteredStudentsState = atom({
	key: 'filteredStudents',
	default: [],
});

export const studentsAssignmentHistoryState = atom({
	key: 'studentsAssignmentHistory',
	default: [],
});

export const assistantsHistoryState = atom({
	key: 'assistantsHistory',
	default: [],
});

export const studentsQueryState = atom({
	key: 'studentsQuery',
	default: {},
});
