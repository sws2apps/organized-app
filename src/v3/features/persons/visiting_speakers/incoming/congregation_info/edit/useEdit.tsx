import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { dbSpeakersCongregationsPut } from '@services/dexie/speakers_congregations';
import { formatDate } from '@services/dateformat';
import { speakersCongregationsState } from '@states/speakers_congregations';

const useEdit = (cong_number: string) => {
  const incomingCongregations = useRecoilValue(speakersCongregationsState);

  const congregation = incomingCongregations.find((record) => record.cong_number === cong_number);

  const [address, setAddress] = useState(congregation.cong_location.address.value);
  const [circuit, setCircuit] = useState(congregation.cong_circuit.value);
  const [coordinatorName, setCoordinatorName] = useState(congregation.coordinator.name.value);
  const [coordinatorEmail, setCoordinatorEmail] = useState(congregation.coordinator.email.value);
  const [coordinatorPhone, setCoordinatorPhone] = useState(congregation.coordinator.phone.value);
  const [talkCoordinatorName, setTalkCoordinatorName] = useState(congregation.public_talk_coordinator.name.value);
  const [talkCoordinatorEmail, setTalkCoordinatorEmail] = useState(congregation.public_talk_coordinator.email.value);
  const [talkCoordinatorPhone, setTalkCoordinatorPhone] = useState(congregation.public_talk_coordinator.phone.value);

  const handleAddressChange = async (value: string) => {
    setAddress(value);

    const congregationNew = structuredClone(congregation);
    congregationNew.cong_location.address = { value, updatedAt: new Date().toISOString() };

    await dbSpeakersCongregationsPut(congregationNew);
  };

  const handleCircuitChange = async (value: string) => {
    setCircuit(value);

    const congregationNew = structuredClone(congregation);
    congregationNew.cong_circuit = { value, updatedAt: new Date().toISOString() };

    await dbSpeakersCongregationsPut(congregationNew);
  };

  const handleMidweekWeekdayChange = async (value: number) => {
    const congregationNew = structuredClone(congregation);
    congregationNew.midweek_meeting.weekday = { value, updatedAt: new Date().toISOString() };

    await dbSpeakersCongregationsPut(congregationNew);
  };

  const handleMidweekTimeChange = async (value: Date) => {
    const congregationNew = structuredClone(congregation);
    congregationNew.midweek_meeting.time = { value: formatDate(value, 'HH:MM'), updatedAt: new Date().toISOString() };

    await dbSpeakersCongregationsPut(congregationNew);
  };

  const handleWeekendWeekdayChange = async (value: number) => {
    const congregationNew = structuredClone(congregation);
    congregationNew.weekend_meeting.weekday = { value, updatedAt: new Date().toISOString() };

    await dbSpeakersCongregationsPut(congregationNew);
  };

  const handleWeekendTimeChange = async (value: Date) => {
    const congregationNew = structuredClone(congregation);
    congregationNew.weekend_meeting.time = { value: formatDate(value, 'HH:MM'), updatedAt: new Date().toISOString() };

    await dbSpeakersCongregationsPut(congregationNew);
  };

  const handleCoordinatorNameChange = async (value: string) => {
    setCoordinatorName(value);

    const congregationNew = structuredClone(congregation);
    congregationNew.coordinator.name = { value, updatedAt: new Date().toISOString() };

    await dbSpeakersCongregationsPut(congregationNew);
  };

  const handleCoordinatorEmailChange = async (value: string) => {
    setCoordinatorEmail(value);

    const congregationNew = structuredClone(congregation);
    congregationNew.coordinator.email = { value, updatedAt: new Date().toISOString() };

    await dbSpeakersCongregationsPut(congregationNew);
  };

  const handleCoordinatorPhoneChange = async (value: string) => {
    setCoordinatorPhone(value);

    const congregationNew = structuredClone(congregation);
    congregationNew.coordinator.phone = { value, updatedAt: new Date().toISOString() };

    await dbSpeakersCongregationsPut(congregationNew);
  };

  const handleTalkCoordinatorNameChange = async (value: string) => {
    setTalkCoordinatorName(value);

    const congregationNew = structuredClone(congregation);
    congregationNew.public_talk_coordinator.name = { value, updatedAt: new Date().toISOString() };

    await dbSpeakersCongregationsPut(congregationNew);
  };

  const handleTalkCoordinatorEmailChange = async (value: string) => {
    setTalkCoordinatorEmail(value);

    const congregationNew = structuredClone(congregation);
    congregationNew.public_talk_coordinator.email = { value, updatedAt: new Date().toISOString() };

    await dbSpeakersCongregationsPut(congregationNew);
  };

  const handleTalkCoordinatorPhoneChange = async (value: string) => {
    setTalkCoordinatorPhone(value);

    const congregationNew = structuredClone(congregation);
    congregationNew.public_talk_coordinator.phone = { value, updatedAt: new Date().toISOString() };

    await dbSpeakersCongregationsPut(congregationNew);
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
  };
};

export default useEdit;
