import { useEffect, useState } from 'react';
import { IncomingCongregationResponseType } from '@definition/api';
import { CongregationIncomingDetailsType } from './index.types';
import { formatDate } from '@services/dateformat';
import { SpeakersCongregationsType } from '@definition/speakers_congregations';
import { dbSpeakersCongregationsPut } from '@services/dexie/speakers_congregations';

const useCongregationAdd = (onClose: VoidFunction) => {
  const [congregation, setCongregation] = useState<IncomingCongregationResponseType>(null);
  const [incomingCongregation, setIncomingCongregation] = useState<CongregationIncomingDetailsType>(null);

  const [isFindCongregation, setIsFindCongregation] = useState(true);

  const handleSelectCongregation = (value: IncomingCongregationResponseType) => {
    setCongregation(value);
  };

  const handleResetCongregation = () => setCongregation(null);

  const handleMovePrevious = () => {
    handleResetCongregation();
    setIsFindCongregation(true);
  };

  const handleMoveNext = () => {
    console.log(congregation);
    if (congregation === null) return;

    setIsFindCongregation(false);
  };

  const handleCongAddressChange = (value: string) => {
    setIncomingCongregation((prev) => {
      const obj = structuredClone(prev);
      obj.cong_location.address = value;

      return obj;
    });
  };

  const handleMidweekWeekdayChange = (value: number) => {
    setIncomingCongregation((prev) => {
      const obj = structuredClone(prev);
      obj.midweek_meeting.weekday = value;

      return obj;
    });
  };

  const handleMidweekTimeChange = (value: Date) => {
    setIncomingCongregation((prev) => {
      const obj = structuredClone(prev);
      obj.midweek_meeting.time = formatDate(value, 'HH:MM');

      return obj;
    });
  };

  const handleWeekendWeekdayChange = (value: number) => {
    setIncomingCongregation((prev) => {
      const obj = structuredClone(prev);
      obj.weekend_meeting.weekday = value;

      return obj;
    });
  };

  const handleWeekendTimeChange = (value: Date) => {
    setIncomingCongregation((prev) => {
      const obj = structuredClone(prev);
      obj.weekend_meeting.time = formatDate(value, 'HH:MM');

      return obj;
    });
  };

  const handleTalkCoordinatorNameChange = (value: string) => {
    setIncomingCongregation((prev) => {
      const obj = structuredClone(prev);
      obj.public_talk_coordinator.name = value;

      return obj;
    });
  };

  const handleTalkCoordinatorEmailChange = (value: string) => {
    setIncomingCongregation((prev) => {
      const obj = structuredClone(prev);
      obj.public_talk_coordinator.email = value;

      return obj;
    });
  };

  const handleTalkCoordinatorPhoneChange = (value: string) => {
    setIncomingCongregation((prev) => {
      const obj = structuredClone(prev);
      obj.public_talk_coordinator.phone = value;

      return obj;
    });
  };

  const handleCoordinatorNameChange = (value: string) => {
    setIncomingCongregation((prev) => {
      const obj = structuredClone(prev);
      obj.coordinator.name = value;

      return obj;
    });
  };

  const handleCoordinatorEmailChange = (value: string) => {
    setIncomingCongregation((prev) => {
      const obj = structuredClone(prev);
      obj.coordinator.email = value;

      return obj;
    });
  };

  const handleCoordinatorPhoneChange = (value: string) => {
    setIncomingCongregation((prev) => {
      const obj = structuredClone(prev);
      obj.coordinator.phone = value;

      return obj;
    });
  };

  const handleIncomingCongregationAdd = async () => {
    const data: SpeakersCongregationsType = {
      _deleted: null,
      cong_number: incomingCongregation.cong_number,
      cong_id: incomingCongregation.cong_id || '',
      cong_location: {
        ...incomingCongregation.cong_location,
        address: { value: incomingCongregation.cong_location.address, updatedAt: new Date().toISOString() },
      },
      cong_name: { value: incomingCongregation.cong_name, updatedAt: new Date().toISOString() },
      cong_circuit: { value: incomingCongregation.cong_circuit, updatedAt: new Date().toISOString() },
      coordinator: {
        email: { value: incomingCongregation.coordinator.email, updatedAt: new Date().toISOString() },
        name: { value: incomingCongregation.coordinator.name, updatedAt: new Date().toISOString() },
        phone: { value: incomingCongregation.coordinator.phone, updatedAt: new Date().toISOString() },
      },
      public_talk_coordinator: {
        email: { value: incomingCongregation.public_talk_coordinator.email, updatedAt: new Date().toISOString() },
        name: { value: incomingCongregation.public_talk_coordinator.name, updatedAt: new Date().toISOString() },
        phone: { value: incomingCongregation.public_talk_coordinator.phone, updatedAt: new Date().toISOString() },
      },
      midweek_meeting: {
        time: { value: incomingCongregation.midweek_meeting.time, updatedAt: new Date().toISOString() },
        weekday: { value: incomingCongregation.midweek_meeting.weekday, updatedAt: new Date().toISOString() },
      },
      weekend_meeting: {
        time: { value: incomingCongregation.weekend_meeting.time, updatedAt: new Date().toISOString() },
        weekday: { value: incomingCongregation.weekend_meeting.weekday, updatedAt: new Date().toISOString() },
      },
      notification_dismissed: { value: true, updatedAt: new Date().toISOString() },
      request_status: 'approved',
    };

    await dbSpeakersCongregationsPut(data);

    onClose();
  };

  useEffect(() => {
    if (congregation) {
      const addressWithoutTags = congregation.cong_location.address.replace(/<\/?[^>]+(>|$)/g, '');
      const address = addressWithoutTags.replace(/(\r\n|\n|\r)/gm, ' ');

      const obj: CongregationIncomingDetailsType = {
        ...congregation,
        coordinator: { email: '', name: '', phone: '' },
        public_talk_coordinator: { email: '', name: '', phone: '' },
        cong_location: { ...congregation.cong_location, address },
      };

      setIncomingCongregation(obj);
    }
  }, [congregation]);

  return {
    congregation: incomingCongregation,
    handleSelectCongregation,
    handleResetCongregation,
    handleMoveNext,
    handleMovePrevious,
    isFindCongregation,
    handleCongAddressChange,
    handleMidweekWeekdayChange,
    handleMidweekTimeChange,
    handleWeekendTimeChange,
    handleWeekendWeekdayChange,
    handleTalkCoordinatorNameChange,
    handleTalkCoordinatorEmailChange,
    handleTalkCoordinatorPhoneChange,
    handleCoordinatorNameChange,
    handleCoordinatorEmailChange,
    handleCoordinatorPhoneChange,
    handleIncomingCongregationAdd,
  };
};

export default useCongregationAdd;
