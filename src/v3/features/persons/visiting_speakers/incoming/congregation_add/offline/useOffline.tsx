import { useRecoilValue } from 'recoil';
import { isOnlineState } from '@states/app';
import { congNumberState, countryCodeState } from '@states/settings';
import { CongregationResponseType, IncomingCongregationResponseType } from '@definition/api';
import { removeSecondsFromTime } from '@utils/dev';

const useOffline = (onCongregationChange: (value: IncomingCongregationResponseType) => void) => {
  const isOnline = useRecoilValue(isOnlineState);
  const countryCode = useRecoilValue(countryCodeState);
  const congNumber = useRecoilValue(congNumberState);

  const handleSelectCongregation = (value: CongregationResponseType) => {
    if (value === null) {
      onCongregationChange(null);
      return;
    }

    const obj: IncomingCongregationResponseType = {
      cong_circuit: value.circuit,
      cong_location: { address: value.address, ...value.location },
      cong_name: value.congName,
      cong_number: value.congNumber,
      country_code: countryCode,
      midweek_meeting: {
        weekday: value.midweekMeetingTime.weekday,
        time: removeSecondsFromTime(value.midweekMeetingTime.time),
      },
      weekend_meeting: {
        weekday: value.weekendMeetingTime.weekday,
        time: removeSecondsFromTime(value.weekendMeetingTime.time),
      },
    };

    onCongregationChange(obj);
  };

  return { isOnline, countryCode, handleSelectCongregation, congNumber };
};

export default useOffline;
