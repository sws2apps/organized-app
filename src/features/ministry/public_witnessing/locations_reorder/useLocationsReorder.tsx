import { useMemo, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { PublicWitnessingLocationType } from '@definition/public_witnessing';
import {
  publicWitnessingLocationsState,
  publicWitnessingReorderLocationsState,
} from '@states/public_witnessing';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { LocationItemType, LocationsReorderProps } from './index.types';

const useLocationsReorder = ({ onClose }: LocationsReorderProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const reorderLocations = useSetAtom(publicWitnessingReorderLocationsState);

  const locationsList = useAtomValue(publicWitnessingLocationsState);

  const [locations, setLocations] = useState<LocationItemType[]>(() =>
    locationsList.map((record) => ({
      id: record.location_uid,
      name: record.location_data.name,
    }))
  );

  // Only the locations that actually moved are saved — touching the rest
  // would bump their updatedAt and push them through the next sync.
  const locations_sorted = useMemo(() => {
    const result: PublicWitnessingLocationType[] = [];

    for (const location of locationsList) {
      const findIndex = locations.findIndex(
        (record) => record.id === location.location_uid
      );

      if (findIndex < 0 || findIndex === location.location_data.sort_index)
        continue;

      const newLocation = structuredClone(location);

      newLocation.location_data.sort_index = findIndex;
      newLocation.location_data.updatedAt = new Date().toISOString();

      result.push(newLocation);
    }

    return result;
  }, [locations, locationsList]);

  const handleDragChange = (value: LocationItemType[]) => {
    setLocations(value);
  };

  const handleSaveChanges = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveError('');
    try {
      if (locations_sorted.length > 0) {
        await reorderLocations(locations_sorted);
      }

      onClose();
    } catch (error) {
      setSaveError((error as Error).message);
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode((error as Error).message),
        severity: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    locations,
    handleDragChange,
    handleSaveChanges,
    isSaving,
    saveError,
  };
};

export default useLocationsReorder;
