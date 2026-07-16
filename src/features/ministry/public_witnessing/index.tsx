import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { useBreakpoints } from '@hooks/index';
import {
  publicWitnessingLocationsState,
  publicWitnessingSelectedLocationState,
} from '@states/public_witnessing';
import LocationsList from './locations_list';
import LocationDetails from './location_details';

const PublicWitnessingContainer = () => {
  const { laptopUp } = useBreakpoints();

  const locations = useAtomValue(publicWitnessingLocationsState);
  const [selected, setSelected] = useAtom(
    publicWitnessingSelectedLocationState
  );

  // Keep a valid selection: pick the first location initially and whenever
  // the selected one disappears (deleted or synced away).
  useEffect(() => {
    const isValid = locations.some((record) => record.location_uid === selected);
    if (!isValid) {
      setSelected(locations.at(0)?.location_uid ?? null);
    }
  }, [locations, selected, setSelected]);

  const selectedLocation = locations.find(
    (record) => record.location_uid === selected
  );

  if (locations.length === 0) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: laptopUp ? 'row' : 'column',
        alignItems: 'flex-start',
        gap: laptopUp ? '24px' : '16px',
      }}
    >
      <Box
        sx={{
          width: laptopUp ? '400px' : '100%',
          flexShrink: 0,
          position: laptopUp ? 'sticky' : 'static',
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
            width: laptopUp ? 'auto' : '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <LocationDetails location={selectedLocation} />
        </Box>
      )}
    </Box>
  );
};

export default PublicWitnessingContainer;
