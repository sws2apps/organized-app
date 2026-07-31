import { useEffect } from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@mui/system';
import { useNavigate, useParams } from 'react-router';
import { useAtom, useAtomValue } from 'jotai';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import {
  publicWitnessingLocationsState,
  publicWitnessingSelectedLocationRecordState,
  publicWitnessingSelectedLocationState,
} from '@states/public_witnessing';
import InfoNote from '@components/info_note';
import LocationsList from './locations_list';
import LocationDetails from './location_details';
import ShiftsCard from './shifts_card';

const pushIn = keyframes({
  from: { opacity: 0, transform: 'translateX(24px)' },
  to: { opacity: 1, transform: 'translateX(0)' },
});

const popIn = keyframes({
  from: { opacity: 0, transform: 'translateX(-24px)' },
  to: { opacity: 1, transform: 'translateX(0)' },
});

const PublicWitnessingContainer = () => {
  const { t } = useAppTranslation();
  const { laptopUp, desktopLargeUp } = useBreakpoints();
  const navigate = useNavigate();

  const { locationId } = useParams();

  const locations = useAtomValue(publicWitnessingLocationsState);
  const selectedLocation = useAtomValue(
    publicWitnessingSelectedLocationRecordState
  );
  const [selected, setSelected] = useAtom(
    publicWitnessingSelectedLocationState
  );

  useEffect(() => {
    if (locationId) {
      // A stale link — a location deleted here or on another device — would
      // otherwise open an empty subpage.
      const exists = locations.some(
        (record) => record.location_uid === locationId
      );

      if (!exists) {
        navigate('/public-witnessing', { replace: true });
        return;
      }

      setSelected(locationId);

      if (laptopUp) navigate('/public-witnessing', { replace: true });

      return;
    }

    const isValid = locations.some(
      (record) => record.location_uid === selected
    );
    if (!isValid) {
      setSelected(locations.at(0)?.location_uid ?? null);
    }
  }, [locationId, locations, selected, setSelected, laptopUp, navigate]);

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
    return (
      <Box
        key={locationId ?? 'locations'}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          animation: `${locationId ? pushIn : popIn} 0.24s cubic-bezier(0.22, 1, 0.36, 1)`,
          '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
        }}
      >
        {locationId ? (
          details
        ) : (
          <LocationsList
            locations={locations}
            selected={null}
            onSelect={(uid) => navigate(`/public-witnessing/${uid}`)}
          />
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
      <Box
        sx={{
          width: desktopLargeUp ? '400px' : '320px',
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
