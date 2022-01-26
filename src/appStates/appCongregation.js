import { atom } from 'recoil';

export const congNameState = atom({
	key: 'congName',
	default: '',
});

export const congNumberState = atom({
	key: 'congNumber',
	default: '',
});

export const congIDState = atom({
	key: 'congID',
	default: '',
});

export const congPasswordState = atom({
	key: 'congPassword',
	default: '',
});

export const isErrorCongNameState = atom({
	key: 'isErrorCongName',
	default: false,
});

export const isErrorCongNumberState = atom({
	key: 'isErrorCongNumber',
	default: false,
});

export const meetingDayState = atom({
	key: 'meetingDay',
	default: 3,
});

export const classCountState = atom({
	key: 'classCount',
	default: 1,
});

export const liveClassState = atom({
	key: 'liveClass',
	default: false,
});
