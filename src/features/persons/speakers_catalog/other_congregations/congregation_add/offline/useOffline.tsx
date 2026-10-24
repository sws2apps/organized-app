import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { isOnlineState } from '@states/app';
import {
  CongregationResponseType,
  CountryResponseType,
  IncomingCongregationResponseType,
} from '@definition/api';
import { removeSecondsFromTime } from '@utils/date';
import { isTest } from '@constants/index';
import { congNameState } from '@states/settings';

const useOffline = (
  onCongregationChange: (value: IncomingCongregationResponseType) => void
) => {
  const isOnline = useAtomValue(isOnlineState);
  const congName = useAtomValue(congNameState);

  const [congNameTmp, setCongNameTmp] = useState('');
  const [congNumberTmp, setCongNumberTmp] = useState('');
  const [congCircuitTmp, setCongCircuitTmp] = useState('');
  const [country, setCountry] = useState<CountryResponseType>(null);
  const [overrideOnline, setOverrideOnline] = useState(false);

  const showOnlineInput = !isTest && isOnline && !overrideOnline;

  const handleWeekday = (value: number) => {
    if (value === 0) return 6;

    return value - 1;
  };

  const handleSelectCongregation = (value: CongregationResponseType) => {
    if (value === null) {
      onCongregationChange(null);
      return;
    }

    const obj: IncomingCongregationResponseType = {
      cong_circuit: value.circuit,
      cong_location: { address: value.address, ...value.location },
      cong_name: value.congName,
      cong_number: value.congNumber || '',
      cong_id: '',
      country_code: country?.countryCode,
      midweek_meeting: {
        weekday: { value: handleWeekday(value.midweekMeetingTime.weekday) },
        time: { value: removeSecondsFromTime(value.midweekMeetingTime.time) },
      },
      weekend_meeting: {
        weekday: { value: handleWeekday(value.weekendMeetingTime.weekday) },
        time: { value: removeSecondsFromTime(value.weekendMeetingTime.time) },
      },
    };

    onCongregationChange(obj);
  };

  const handleCongNameChange = (value: string) => setCongNameTmp(value);

  const handleCongNumberChange = (value: string) => setCongNumberTmp(value);

  const handleCongCircuitChange = (value: string) => setCongCircuitTmp(value);

  const handleCountryChange = (value: CountryResponseType) => setCountry(value);

  const handleCongSearchOverride = (value: string) => {
    setCongNameTmp(value);
    setOverrideOnline(true);
  };

  useEffect(() => {
    if (!showOnlineInput) {
      if (
        congNameTmp.length > 0 &&
        congNumberTmp.length > 0 &&
        congCircuitTmp.length > 0
      ) {
        const dataCong: IncomingCongregationResponseType = {
          cong_name: congNameTmp,
          cong_number: congNumberTmp,
          cong_id: '',
          country_code: '',
          cong_circuit: congCircuitTmp,
          cong_location: { address: '', lat: 0, lng: 0 },
          midweek_meeting: { weekday: { value: 2 }, time: { value: '18:00' } },
          weekend_meeting: { weekday: { value: 6 }, time: { value: '9:00' } },
        };

        onCongregationChange(dataCong);
      } else {
        onCongregationChange(null);
      }
    }
  }, [
    congNameTmp,
    congNumberTmp,
    congCircuitTmp,
    onCongregationChange,
    showOnlineInput,
  ]);

  return {
    country,
    handleSelectCongregation,
    handleCongNameChange,
    handleCongNumberChange,
    handleCongCircuitChange,
    congNameTmp,
    congNumberTmp,
    congCircuitTmp,
    handleCountryChange,
    handleCongSearchOverride,
    showOnlineInput,
    congName,
  };
};

export default useOffline;
