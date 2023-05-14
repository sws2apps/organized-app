import { atom, selector } from 'recoil';

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

export const meetingTimeState = atom({
  key: 'meetingTime',
  default: new Date(Date.now()),
});

export const usernameState = atom({
  key: 'username',
  default: '',
});

export const congInfoFormattedState = selector({
  key: 'congInforFormattedState',
  get: ({ get }) => {
    const congName = get(congNameState);
    const congNumber = get(congNumberState);

    let formatted = '';
    if (congName !== '' && congNumber !== '') {
      formatted = `${congName} (${congNumber})`;
    }

    return formatted;
  },
});

export const congAccountConnectedState = atom({
  key: 'congAccountConnected',
  default: false,
});

export const isAdminCongState = atom({
  key: 'isAdminCong',
  default: false,
});

export const isUpdateForVerificationState = atom({
  key: 'isUpdateForVerification',
  default: false,
});

export const userMembersDelegateState = atom({
  key: 'userMembersDelegate',
  default: [],
});

export const isProcessingBackupState = atom({
  key: 'isProcessingBackup',
  default: true,
});

export const openingPrayerAutoAssignState = atom({
  key: 'openingPrayerAutoAssign',
  default: false,
});

export const congRoleState = atom({
  key: 'congRole',
  default: [],
});
