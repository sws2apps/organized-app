import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  congFullnameState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useCongregationBasic = () => {
  const timer = useRef<NodeJS.Timeout>();

  const congFullName = useRecoilValue(congFullnameState);
  const settings = useRecoilValue(settingsState);
  const dataView = useRecoilValue(userDataViewState);

  const [circuitNumber, setCircuitNumber] = useState('');
  const [address, setAddress] = useState('');
  const [hour24, setHour24] = useState(false);

  const handleCircuitChange = (value: string) => setCircuitNumber(value);

  const handleCircuitSave = () => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(handleCircuitSaveDb, 1000);
  };

  const handleCircuitSaveDb = async () => {
    const circuitRecords = structuredClone(settings.cong_settings.cong_circuit);

    const currentCircuit = circuitRecords.find(
      (record) => record.type === dataView
    );
    currentCircuit.value = circuitNumber;
    currentCircuit.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.cong_circuit': circuitRecords,
    });
  };

  const handleAddressChange = (value: string) => setAddress(value);

  const handleAddressSave = () => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(handleAddressSaveDb, 1000);
  };

  const handleAddressSaveDb = async () => {
    const congLocation = structuredClone(settings.cong_settings.cong_location);
    congLocation.address = address;
    congLocation.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.cong_location': congLocation,
    });
  };

  const handleHour24Toggle = async () => {
    const hourFormat = structuredClone(
      settings.cong_settings.format_24h_enabled
    );
    const current = hourFormat.find((record) => record.type === dataView);

    current.value = !hour24;
    current.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.format_24h_enabled': hourFormat,
    });
  };

  useEffect(() => {
    const currentCircuit = settings.cong_settings.cong_circuit.find(
      (record) => record.type === dataView
    );
    setCircuitNumber(currentCircuit?.value || '');

    setAddress(settings.cong_settings.cong_location.address);

    const hourFormat = settings.cong_settings.format_24h_enabled.find(
      (record) => record.type === dataView
    );
    setHour24(hourFormat?.value ?? false);
  }, [settings, dataView]);

  return {
    congFullName,
    circuitNumber,
    handleCircuitChange,
    handleCircuitSave,
    address,
    handleAddressChange,
    handleAddressSave,
    handleHour24Toggle,
    hour24,
  };
};

export default useCongregationBasic;
