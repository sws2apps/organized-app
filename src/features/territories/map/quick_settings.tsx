import { MenuItem, Stack } from '@mui/material';
import { Select, Typography } from '@components/index';
import SwitchWithLabel from '@components/switch_with_label';
import QuickSettings from '@features/quick_settings';
import { MAP_PROVIDERS, MapProviderKey } from './constants';
import { TerritoriesMapState } from './useTerritoriesMap';

const MapQuickSettings = ({
  map,
  open,
  onClose,
}: {
  map: TerritoriesMapState;
  open: boolean;
  onClose: VoidFunction;
}) => (
  <QuickSettings title="Coverage map" open={open} onClose={onClose}>
    <Stack spacing="16px" sx={{ width: '100%' }}>
      <Select
        label="Map provider"
        value={map.provider}
        onChange={(event) =>
          map.setProvider(event.target.value as MapProviderKey)
        }
      >
        {Object.entries(MAP_PROVIDERS).map(([key, value]) => (
          <MenuItem key={key} value={key}>
            <Typography className="body-regular">{value.name}</Typography>
          </MenuItem>
        ))}
      </Select>

      <SwitchWithLabel
        label="House numbers"
        helper="Show house numbers when zoomed in close"
        checked={map.houseNumbers}
        onChange={map.setHouseNumbers}
      />

      <SwitchWithLabel
        label="Places"
        helper="Show shops, schools and other points of interest"
        checked={map.places}
        onChange={map.setPlaces}
      />

      <SwitchWithLabel
        label="Territory numbers"
        helper="Show the number in the middle of every territory"
        checked={map.showNumbers}
        onChange={map.setShowNumbers}
      />

      <SwitchWithLabel
        label="Households count"
        helper="Show the households under the number"
        checked={map.showHouseholds}
        onChange={map.setShowHouseholds}
      />
    </Stack>
  </QuickSettings>
);

export default MapQuickSettings;
