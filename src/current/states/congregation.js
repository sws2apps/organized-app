import { atom, selector } from 'recoil';
import { VisitingSpeakers } from '../classes/VisitingSpeakers';

console.log('hrere');

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

export const midweekMeetingDayState = atom({
  key: 'midweekMeetingDay',
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

export const openingPrayerMMAutoAssignState = atom({
  key: 'openingPrayerMMAutoAssign',
  default: false,
});

export const congRoleState = atom({
  key: 'congRole',
  default: [],
});

export const openingPrayerWMAutoAssignState = atom({
  key: 'openingPrayerWMAutoAssign',
  default: false,
});

export const weekendMeetingDayState = atom({
  key: 'weekendMeetingDay',
  default: 6,
});

export const congSpeakersRequestsState = atom({
  key: 'congSpeakersRequests',
  default: [],
});

export const congSpeakersRequestsStateCountState = selector({
  key: 'congSpeakersRequestsStateCount',
  get: ({ get }) => {
    const requests = get(congSpeakersRequestsState);
    return requests.length;
  },
});

export const congSpeakersRequestsStatusState = atom({
  key: 'congSpeakersRequestsStatus',
  default: [],
});

export const congSpeakersRequestsUpdateState = atom({
  key: 'congSpeakersRequestsUpdate',
  default: [],
});

export const congSpeakersRequestsUpdateCountState = selector({
  key: 'congSpeakersRequestsUpdateCount',
  get: ({ get }) => {
    const requests = get(congSpeakersRequestsUpdateState);
    return requests.length;
  },
});

export const congSpeakersRequestsDisapprovedState = selector({
  key: 'congSpeakersRequestsDisapproved',
  get: ({ get }) => {
    const requests = get(congSpeakersRequestsStatusState);
    const result = [];

    for (const request of requests) {
      if (request.request_status === 'disapproved') {
        const cong = VisitingSpeakers.getCongregation(request.cong_number);

        if (!cong.notif_dismissed) {
          result.push(request);
        }
      }
    }

    return result;
  },
});

export const midweekMeetingExactDateState = atom({
  key: 'midweekMeetingExactDate',
  default: false,
});

export const weekendMeetingSubstituteSpeakerState = atom({
  key: 'weekendMeetingSubstituteSpeaker',
  default: false,
});
