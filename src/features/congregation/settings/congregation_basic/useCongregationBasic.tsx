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

  useEffect(() => {
    const currentCircuit = settings.cong_settings.cong_circuit.find(
      (record) => record.type === dataView
    );
    setCircuitNumber(currentCircuit?.value || '');

    setAddress(settings.cong_settings.cong_location.address);
  }, [settings, dataView]);

  return {
    congFullName,
    circuitNumber,
    handleCircuitChange,
    handleCircuitSave,
    address,
    handleAddressChange,
    handleAddressSave,
  };
};

export default useCongregationBasic;
