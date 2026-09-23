import { MenuItem, Stack } from '@mui/material';
import { Select, Typography } from '@components/index';
import SwitchWithLabel from '@components/switch_with_label';
import QuickSettings from '@features/quick_settings';
import { MAP_PROVIDERS, MapProviderKey } from './constants';
import { TerritoriesMapState } from './useTerritoriesMap';
import { BasemapOptions } from './basemap';

const LAYER_SWITCHES: {
  key: keyof BasemapOptions;
  label: string;
  helper: string;
}[] = [
  {
    key: 'houseNumbers',
    label: 'House numbers',
    helper: 'Show house numbers when zoomed in close',
  },
  {
    key: 'buildings',
    label: 'Building outlines',
    helper: 'Outline every building when zoomed in',
  },
  {
    key: 'streetNames',
    label: 'Street names',
    helper: 'Show street names from further out',
  },
  {
    key: 'places',
    label: 'Places',
    helper: 'Show shops, schools and other points of interest',
  },
  { key: 'parking', label: 'Car parks', helper: 'Mark car parks with a P' },
  {
    key: 'green',
    label: 'Green areas',
    helper: 'Tint parks, woods and grass green',
  },
  {
    key: 'water',
    label: 'Water',
    helper: 'Tint rivers, lakes and canals blue',
  },
];

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

      {LAYER_SWITCHES.map((item) => (
        <SwitchWithLabel
          key={item.key}
          label={item.label}
          helper={item.helper}
          checked={map.layers[item.key]}
          onChange={(value) => map.setLayer(item.key, value)}
        />
      ))}

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
