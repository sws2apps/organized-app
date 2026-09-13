import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { IconAdd, IconEdit, IconReorder } from '@components/icons';
import PageTitle from '@components/page_title';
import NavBarButton from '@components/nav_bar_button';
import PublicWitnessingContainer from '@features/ministry/public_witnessing';
import LocationForm from '@features/ministry/public_witnessing/location_form';
import LocationDelete from '@features/ministry/public_witnessing/location_delete';
import LocationsReorder from '@features/ministry/public_witnessing/locations_reorder';
import usePublicWitnessing from './usePublicWitnessing';

const PublicWitnessing = () => {
  const { t } = useAppTranslation();

  const {
    canManageLocations,
    canAddLocation,
    canEditLocation,
    canReorderLocations,
    isSubpage,
    currentLocation,
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
  } = usePublicWitnessing();

  // An empty set still renders the mobile action bar, so the buttons are only
  // built when at least one of them applies.
  const hasActions =
    canManageLocations &&
    (canReorderLocations || canEditLocation || canAddLocation);

  const actionButtons = hasActions ? (
    <>
      {canReorderLocations && (
        <NavBarButton
          text={t('tr_reorderGroups')}
          icon={<IconReorder />}
          onClick={handleOpenReorder}
        />
      )}
      {canEditLocation && (
        <NavBarButton
          text={t('tr_edit')}
          icon={<IconEdit />}
          onClick={handleStartEdit}
        />
      )}
      {canAddLocation && (
        <NavBarButton
          main
          text={t('tr_add')}
          icon={<IconAdd />}
          onClick={handleStartCreate}
        />
      )}
    </>
  ) : undefined;

  return (
    <Stack spacing="16px">
      <PageTitle
        title={
          isSubpage ? (currentLocation?.location_data.name ?? '') : t('tr_PW')
        }
        secondaryTitle={isSubpage ? t('tr_PW') : undefined}
        buttons={actionButtons}
      />

      {formOpen && (
        <LocationForm
          // remount per location so the form never keeps another one's state
          key={formLocation?.location_uid ?? 'new'}
          open={formOpen}
          onClose={handleCloseForm}
          location={formLocation}
          onDelete={formLocation ? handleStartDelete : undefined}
        />
      )}
      {deleteLocation && (
        <LocationDelete
          open
          onClose={handleCloseDelete}
          location={deleteLocation}
        />
      )}
      {reorderOpen && (
        <LocationsReorder open={reorderOpen} onClose={handleCloseReorder} />
      )}

      <PublicWitnessingContainer />
    </Stack>
  );
};

export default PublicWitnessing;
