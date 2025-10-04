import { useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  circuitNumberState,
  congAddressState,
  congNameState,
  congNumberState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useCongregationBasic = () => {
  const timer = useRef<NodeJS.Timeout>(undefined);

  const congName = useAtomValue(congNameState);
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const numberInitial = useAtomValue(congNumberState);
  const circuitInitial = useAtomValue(circuitNumberState);
  const addressInitial = useAtomValue(congAddressState);

  const [congNumber, setCongNumber] = useState(numberInitial);
  const [circuitNumber, setCircuitNumber] = useState(circuitInitial);
  const [address, setAddress] = useState(addressInitial);

  const handleNumberChange = (value: string) => setCongNumber(value);

  const handleNumberSaveDb = async () => {
    await dbAppSettingsUpdate({
      'cong_settings.cong_number': {
        value: congNumber,
        updatedAt: new Date().toISOString(),
      },
    });
  };

  const handleNumberSave = () => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(handleNumberSaveDb, 1000);
  };

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
    setCongNumber(numberInitial);
    setCircuitNumber(circuitInitial);
    setAddress(addressInitial);
  }, [addressInitial, circuitInitial, numberInitial]);

  return {
    congName,
    circuitNumber,
    handleCircuitChange,
    handleCircuitSave,
    address,
    handleAddressChange,
    handleAddressSave,
    handleNumberChange,
    handleNumberSave,
    congNumber,
  };
};

export default useCongregationBasic;
