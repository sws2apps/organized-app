import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { dbSpeakersCongregationsUpdate } from '@services/dexie/speakers_congregations';
import { formatDate } from '@services/dateformat';
import { speakersCongregationsState } from '@states/speakers_congregations';

const useEdit = (cong_number: string) => {
  const incomingCongregations = useRecoilValue(speakersCongregationsState);

  const congregation = incomingCongregations.find(
    (record) => record.cong_data.cong_number.value === cong_number
  );

  const [address, setAddress] = useState(
    congregation.cong_data.cong_location.address.value
  );
  const [circuit, setCircuit] = useState(
    congregation.cong_data.cong_circuit.value
  );
  const [coordinatorName, setCoordinatorName] = useState(
    congregation.cong_data.coordinator.name.value
  );
  const [coordinatorEmail, setCoordinatorEmail] = useState(
    congregation.cong_data.coordinator.email.value
  );
  const [coordinatorPhone, setCoordinatorPhone] = useState(
    congregation.cong_data.coordinator.phone.value
  );
  const [talkCoordinatorName, setTalkCoordinatorName] = useState(
    congregation.cong_data.public_talk_coordinator.name.value
  );
  const [talkCoordinatorEmail, setTalkCoordinatorEmail] = useState(
    congregation.cong_data.public_talk_coordinator.email.value
  );
  const [talkCoordinatorPhone, setTalkCoordinatorPhone] = useState(
    congregation.cong_data.public_talk_coordinator.phone.value
  );
  const [name, setName] = useState(congregation.cong_data.cong_name.value);
  const [number, setNumber] = useState(
    congregation.cong_data.cong_number.value
  );

  const handleNameChange = async (value: string) => {
    setName(value);

    await dbSpeakersCongregationsUpdate(
      { 'cong_data.cong_name': { value, updatedAt: new Date().toISOString() } },
      congregation.id
    );
  };

  const handleNumberChange = async (value: string) => {
    setNumber(value);

    await dbSpeakersCongregationsUpdate(
      {
        'cong_data.cong_number': { value, updatedAt: new Date().toISOString() },
      },
      congregation.id
    );
  };

  const handleAddressChange = async (value: string) => {
    setAddress(value);

    await dbSpeakersCongregationsUpdate(
      {
        'cong_data.cong_location.address': {
          value,
          updatedAt: new Date().toISOString(),
        },
      },
      congregation.id
    );
  };

  const handleCircuitChange = async (value: string) => {
    setCircuit(value);

    await dbSpeakersCongregationsUpdate(
      {
        'cong_data.cong_circuit': {
          value,
          updatedAt: new Date().toISOString(),
        },
      },
      congregation.id
    );
  };

  const handleMidweekWeekdayChange = async (value: number) => {
    await dbSpeakersCongregationsUpdate(
      {
        'cong_data.midweek_meeting.weekday': {
          value,
          updatedAt: new Date().toISOString(),
        },
      },
      congregation.id
    );
  };

  const handleMidweekTimeChange = async (value: Date) => {
    await dbSpeakersCongregationsUpdate(
      {
        'cong_data.midweek_meeting.time': {
          value: formatDate(value, 'HH:mm'),
          updatedAt: new Date().toISOString(),
        },
      },
      congregation.id
    );
  };

  const handleWeekendWeekdayChange = async (value: number) => {
    await dbSpeakersCongregationsUpdate(
      {
        'cong_data.weekend_meeting.weekday': {
          value,
          updatedAt: new Date().toISOString(),
        },
      },
      congregation.id
    );
  };

  const handleWeekendTimeChange = async (value: Date) => {
    await dbSpeakersCongregationsUpdate(
      {
        'cong_data.weekend_meeting.time': {
          value: formatDate(value, 'HH:mm'),
          updatedAt: new Date().toISOString(),
        },
      },
      congregation.id
    );
  };

  const handleCoordinatorNameChange = async (value: string) => {
    setCoordinatorName(value);

    await dbSpeakersCongregationsUpdate(
      {
        'cong_data.coordinator.name': {
          value,
          updatedAt: new Date().toISOString(),
        },
      },
      congregation.id
    );
  };

  const handleCoordinatorEmailChange = async (value: string) => {
    setCoordinatorEmail(value);

    await dbSpeakersCongregationsUpdate(
      {
        'cong_data.coordinator.email': {
          value,
          updatedAt: new Date().toISOString(),
        },
      },
      congregation.id
    );
  };

  const handleCoordinatorPhoneChange = async (value: string) => {
    setCoordinatorPhone(value);

    await dbSpeakersCongregationsUpdate(
      {
        'cong_data.coordinator.phone': {
          value,
          updatedAt: new Date().toISOString(),
        },
      },
      congregation.id
    );
  };

  const handleTalkCoordinatorNameChange = async (value: string) => {
    setTalkCoordinatorName(value);

    await dbSpeakersCongregationsUpdate(
      {
        'cong_data.public_talk_coordinator.name': {
          value,
          updatedAt: new Date().toISOString(),
        },
      },
      congregation.id
    );
  };

  const handleTalkCoordinatorEmailChange = async (value: string) => {
    setTalkCoordinatorEmail(value);

    await dbSpeakersCongregationsUpdate(
      {
        'cong_data.public_talk_coordinator.email': {
          value,
          updatedAt: new Date().toISOString(),
        },
      },
      congregation.id
    );
  };

  const handleTalkCoordinatorPhoneChange = async (value: string) => {
    setTalkCoordinatorPhone(value);

    await dbSpeakersCongregationsUpdate(
      {
        'cong_data.public_talk_coordinator.phone': {
          value,
          updatedAt: new Date().toISOString(),
        },
      },
      congregation.id
    );
  };

  return {
    handleMidweekWeekdayChange,
    handleMidweekTimeChange,
    handleAddressChange,
    congregation,
    address,
    circuit,
    handleCircuitChange,
    handleWeekendWeekdayChange,
    handleWeekendTimeChange,
    coordinatorName,
    coordinatorEmail,
    coordinatorPhone,
    handleCoordinatorNameChange,
    handleCoordinatorEmailChange,
    handleCoordinatorPhoneChange,
    talkCoordinatorName,
    talkCoordinatorEmail,
    talkCoordinatorPhone,
    handleTalkCoordinatorNameChange,
    handleTalkCoordinatorEmailChange,
    handleTalkCoordinatorPhoneChange,
    name,
    handleNameChange,
    number,
    handleNumberChange,
    cong_synced: congregation.cong_data.cong_id.length > 0,
  };
};

export default useEdit;
