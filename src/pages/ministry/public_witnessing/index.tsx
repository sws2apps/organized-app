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
    hasLocations,
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
  } = usePublicWitnessing();

  const actionButtons = canManageLocations ? (
    <>
      <NavBarButton
        text={t('tr_add')}
        icon={<IconAdd />}
        onClick={handleStartCreate}
      />
      {hasLocations && (
        <NavBarButton
          text={t('tr_reorderGroups')}
          icon={<IconReorder />}
          onClick={handleOpenReorder}
        />
      )}
      {selectedLocation && (
        <NavBarButton
          main
          text={t('tr_edit')}
          icon={<IconEdit />}
          onClick={handleStartEdit}
        />
      )}
    </>
  ) : undefined;

  return (
    <Stack spacing="16px">
      <PageTitle title={t('tr_PW')} buttons={actionButtons} />

      {formOpen && (
        <LocationForm
          open={formOpen}
          onClose={handleCloseForm}
          location={formLocation}
          onDelete={formLocation ? handleStartDelete : undefined}
        />
      )}
      {deleteOpen && selectedLocation && (
        <LocationDelete
          open={deleteOpen}
          onClose={handleCloseDelete}
          location={selectedLocation}
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
