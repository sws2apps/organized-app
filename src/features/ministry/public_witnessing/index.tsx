import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { useAtom, useAtomValue } from 'jotai';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import {
  publicWitnessingLocationsState,
  publicWitnessingSelectedLocationState,
} from '@states/public_witnessing';
import InfoNote from '@components/info_note';
import LocationsList from './locations_list';
import LocationDetails from './location_details';
import ShiftsCard from './shifts_card';

const PublicWitnessingContainer = () => {
  const { t } = useAppTranslation();
  const { laptopUp } = useBreakpoints();
  const navigate = useNavigate();

  // Mobile is a list → subpage flow driven by the route, so the app navbar
  // shows the location as a subpage (with a working back arrow) instead of
  // the feature stacking a second header of its own.
  const { locationId } = useParams();

  const locations = useAtomValue(publicWitnessingLocationsState);
  const [selected, setSelected] = useAtom(
    publicWitnessingSelectedLocationState
  );

  useEffect(() => {
    if (locationId) {
      setSelected(locationId);
      return;
    }

    // Keep a valid selection: pick the first location initially and whenever
    // the selected one disappears (deleted or synced away).
    const isValid = locations.some(
      (record) => record.location_uid === selected
    );
    if (!isValid) {
      setSelected(locations.at(0)?.location_uid ?? null);
    }
  }, [locationId, locations, selected, setSelected]);

  const selectedLocation = locations.find(
    (record) => record.location_uid === selected
  );

  if (locations.length === 0) {
    return <InfoNote variant="card" message={t('tr_PWLocationsEmpty')} />;
  }

  const details = selectedLocation && (
    <>
      <LocationDetails location={selectedLocation} />
      <ShiftsCard location={selectedLocation} />
    </>
  );

  if (!laptopUp) {
    if (locationId) {
      return (
        <Box
          sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {details}
        </Box>
      );
    }

    return (
      <LocationsList
        locations={locations}
        selected={null}
        onSelect={(uid) => navigate(`/public-witnessing/${uid}`)}
      />
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
      <Box
        sx={{
          width: '400px',
          flexShrink: 0,
          position: 'sticky',
          top: '70px',
        }}
      >
        <LocationsList
          locations={locations}
          selected={selected}
          onSelect={setSelected}
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {details}
      </Box>
    </Box>
  );
};

export default PublicWitnessingContainer;
