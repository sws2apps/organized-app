import { useState } from 'react';
import { useParams } from 'react-router';
import { useAtomValue } from 'jotai';
import { PublicWitnessingLocationType } from '@definition/public_witnessing';
import { useBreakpoints } from '@hooks/index';
import {
  publicWitnessingLocationsState,
  publicWitnessingSelectedLocationRecordState,
} from '@states/public_witnessing';
import usePublicWitnessingPermissions from '@features/ministry/public_witnessing/usePermissions';

const usePublicWitnessing = () => {
  const { canManageLocations } = usePublicWitnessingPermissions();
  const { laptopUp } = useBreakpoints();

  const { locationId } = useParams();

  const locations = useAtomValue(publicWitnessingLocationsState);
  const selectedLocation = useAtomValue(
    publicWitnessingSelectedLocationRecordState
  );

  // On mobile a location opens as its own subpage, so the app navbar shows
  // it as the current page with the feature name underneath.
  const isSubpage = !laptopUp && Boolean(locationId);

  // the selected atom is synced from the route in an effect, so on a subpage
  // it can still hold the previous location for a render: act on the record
  // the route points at instead
  const currentLocation = isSubpage
    ? (locations.find((record) => record.location_uid === locationId) ?? null)
    : selectedLocation;

  const [formOpen, setFormOpen] = useState(false);
  // null while creating a new location
  const [formLocation, setFormLocation] =
    useState<PublicWitnessingLocationType | null>(null);
  const [reorderOpen, setReorderOpen] = useState(false);
  // captured when deletion starts, so a selection change behind the dialog
  // cannot swap the location being deleted
  const [deleteLocation, setDeleteLocation] =
    useState<PublicWitnessingLocationType | null>(null);

  const handleStartCreate = () => {
    setFormLocation(null);
    setFormOpen(true);
  };

  const handleStartEdit = () => {
    if (!currentLocation) return;
    setFormLocation(currentLocation);
    setFormOpen(true);
  };

  const handleCloseForm = () => setFormOpen(false);

  const handleStartDelete = () => {
    setFormOpen(false);
    setDeleteLocation(formLocation);
  };

  const handleCloseDelete = () => setDeleteLocation(null);

  const handleOpenReorder = () => setReorderOpen(true);
  const handleCloseReorder = () => setReorderOpen(false);

  return {
    canManageLocations,
    hasLocations: locations.length > 0,
    isSubpage,
    currentLocation,
    // Mobile opens a location as its own page: editing belongs there, and
    // adding and reordering to the list they act on.
    canEditLocation: Boolean(currentLocation) && (laptopUp || isSubpage),
    canAddLocation: !isSubpage,
    canReorderLocations: locations.length > 0 && (laptopUp || !isSubpage),
    formOpen,
    formLocation,
    reorderOpen,
    deleteLocation,
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
