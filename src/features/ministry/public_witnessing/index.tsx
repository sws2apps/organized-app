import { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import {
  publicWitnessingLocationsState,
  publicWitnessingSelectedLocationState,
} from '@states/public_witnessing';
import SubpageNavbar from '@components/subpage_navbar';
import LocationsList from './locations_list';
import LocationDetails from './location_details';
import ShiftsCard from './shifts_card';

const PublicWitnessingContainer = () => {
  const { t } = useAppTranslation();
  const { laptopUp } = useBreakpoints();

  const locations = useAtomValue(publicWitnessingLocationsState);
  const [selected, setSelected] = useAtom(
    publicWitnessingSelectedLocationState
  );

  // Mobile is a list → subpage flow: tapping a location opens its details
  // as a subpage; the back arrow returns to the list.
  const [detailOpen, setDetailOpen] = useState(false);

  // Keep a valid selection: pick the first location initially and whenever
  // the selected one disappears (deleted or synced away).
  useEffect(() => {
    const isValid = locations.some(
      (record) => record.location_uid === selected
    );
    if (!isValid) {
      setSelected(locations.at(0)?.location_uid ?? null);
      setDetailOpen(false);
    }
  }, [locations, selected, setSelected]);

  const selectedLocation = locations.find(
    (record) => record.location_uid === selected
  );

  if (locations.length === 0) return null;

  if (!laptopUp) {
    if (detailOpen && selectedLocation) {
      return (
        <Stack spacing="16px">
          <SubpageNavbar
            title={selectedLocation.location_data.name}
            secondaryTitle={t('tr_PW')}
            onBack={() => setDetailOpen(false)}
            backLabel={t('tr_back')}
          />
          <LocationDetails location={selectedLocation} />
          <ShiftsCard location={selectedLocation} />
        </Stack>
      );
    }

    return (
      <LocationsList
        locations={locations}
        selected={null}
        onSelect={(uid) => {
          setSelected(uid);
          setDetailOpen(true);
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '24px',
      }}
    >
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

      {selectedLocation && (
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <LocationDetails location={selectedLocation} />
          <ShiftsCard location={selectedLocation} />
        </Box>
      )}
    </Box>
  );
};

export default PublicWitnessingContainer;
