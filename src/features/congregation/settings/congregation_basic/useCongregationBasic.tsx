import { useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  circuitNumberState,
  congAddressState,
  congFullnameState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useCongregationBasic = () => {
  const timer = useRef<NodeJS.Timeout>();

  const congFullName = useAtomValue(congFullnameState);
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const circuitInitial = useAtomValue(circuitNumberState);
  const addressInitial = useAtomValue(congAddressState);

  const [circuitNumber, setCircuitNumber] = useState(circuitInitial);
  const [address, setAddress] = useState(addressInitial);

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
    setCircuitNumber(circuitInitial);
    setAddress(addressInitial);
  }, [addressInitial, circuitInitial]);

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
