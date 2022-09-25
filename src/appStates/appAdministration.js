import { atom } from 'recoil';

export const isPocketAddState = atom({
	key: ' isAddPocketUserOpen',
	default: false,
});

export const isPocketEditState = atom({
	key: ' isPocketEdit',
	default: false,
});

export const userPocketPINState = atom({
	key: 'userPocketPIN',
	default: '',
});

export const parentPocketUserState = atom({
	key: 'parentPocketUser',
	default: undefined,
});

export const childPocketUsersState = atom({
	key: 'childPocketUsers',
	default: [],
});

export const pocketUsersState = atom({
	key: 'pocketUsers',
	default: [],
});

export const isSavingPocketUserState = atom({
	key: 'isSavingPocketUser',
	default: false,
});

export const isPocketDeleteState = atom({
	key: 'isPocketDelete',
	default: false,
});

export const currentPocketState = atom({
	key: 'currentPocket',
	default: {},
});

export const pocketEditTypeState = atom({
	key: 'pocketEditTypeState',
	default: 'update',
});
