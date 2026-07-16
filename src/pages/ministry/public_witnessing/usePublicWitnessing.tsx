import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { PublicWitnessingLocationType } from '@definition/public_witnessing';
import {
  publicWitnessingLocationsState,
  publicWitnessingSelectedLocationState,
} from '@states/public_witnessing';
import usePublicWitnessingPermissions from '@features/ministry/public_witnessing/usePermissions';

const usePublicWitnessing = () => {
  const { canManageLocations } = usePublicWitnessingPermissions();

  const locations = useAtomValue(publicWitnessingLocationsState);
  const selected = useAtomValue(publicWitnessingSelectedLocationState);

  const selectedLocation =
    locations.find((record) => record.location_uid === selected) ?? null;

  const [formOpen, setFormOpen] = useState(false);
  // null while creating a new location
  const [formLocation, setFormLocation] =
    useState<PublicWitnessingLocationType | null>(null);
  const [reorderOpen, setReorderOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleStartCreate = () => {
    setFormLocation(null);
    setFormOpen(true);
  };

  const handleStartEdit = () => {
    if (!selectedLocation) return;
    setFormLocation(selectedLocation);
    setFormOpen(true);
  };

  const handleCloseForm = () => setFormOpen(false);

  const handleStartDelete = () => {
    setFormOpen(false);
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => setDeleteOpen(false);

  const handleOpenReorder = () => setReorderOpen(true);
  const handleCloseReorder = () => setReorderOpen(false);

  return {
    canManageLocations,
    hasLocations: locations.length > 0,
    selectedLocation,
    formOpen,
    formLocation,
    reorderOpen,
    deleteOpen,
    handleStartCreate,
    handleStartEdit,
    handleCloseForm,
    handleStartDelete,
    handleCloseDelete,
    handleOpenReorder,
    handleCloseReorder,
  };
};

export default usePublicWitnessing;
