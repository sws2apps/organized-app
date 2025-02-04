import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { isOnlineState } from '@states/app';
import { congNumberState } from '@states/settings';
import {
  CongregationResponseType,
  IncomingCongregationResponseType,
} from '@definition/api';
import { removeSecondsFromTime } from '@utils/date';
import { CountryType } from '@components/country_selector/index.types';
import { isDemo } from '@constants/index';

const useOffline = (
  onCongregationChange: (value: IncomingCongregationResponseType) => void
) => {
  const isOnline = useRecoilValue(isOnlineState);
  const congNumber = useRecoilValue(congNumberState);

  const [congNameTmp, setCongNameTmp] = useState('');
  const [congNumberTmp, setCongNumberTmp] = useState('');
  const [congCircuitTmp, setCongCircuitTmp] = useState('');
  const [country, setCountry] = useState<CountryType>(null);
  const [overrideOnline, setOverrideOnline] = useState(false);

  const showOnlineInput = !isDemo && isOnline && !overrideOnline;

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
      country_code: country.code,
      midweek_meeting: {
        weekday: { value: value.midweekMeetingTime.weekday },
        time: { value: removeSecondsFromTime(value.midweekMeetingTime.time) },
      },
      weekend_meeting: {
        weekday: { value: value.weekendMeetingTime.weekday },
        time: { value: removeSecondsFromTime(value.weekendMeetingTime.time) },
      },
    };

    onCongregationChange(obj);
  };

  const handleCongNameChange = (value: string) => setCongNameTmp(value);

  const handleCongNumberChange = (value: string) => setCongNumberTmp(value);

  const handleCongCircuitChange = (value: string) => setCongCircuitTmp(value);

  const handleCountryChange = (value: CountryType) => setCountry(value);

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
          country_code: '',
          cong_circuit: congCircuitTmp,
          cong_location: { address: '', lat: 0, lng: 0 },
          midweek_meeting: { weekday: { value: 2 }, time: { value: '18:00' } },
          weekend_meeting: { weekday: { value: 7 }, time: { value: '9:00' } },
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
    country: country,
    handleSelectCongregation,
    congNumber,
    handleCongNameChange,
    handleCongNumberChange,
    handleCongCircuitChange,
    congNameTmp,
    congNumberTmp,
    congCircuitTmp,
    handleCountryChange,
    handleCongSearchOverride,
    showOnlineInput,
  };
};

export default useOffline;
