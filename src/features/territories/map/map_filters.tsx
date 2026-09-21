import { MenuItem, Stack } from '@mui/material';
import {
  Checkbox,
  CustomDivider,
  SearchBar,
  Select,
  Typography,
} from '@components/index';
import IconButton from '@components/icon_button';
import Tooltip from '@components/tooltip';
import { IconPanelClose } from '@icons/index';
import { MAP_PROVIDERS, MapProviderKey, MapView } from './constants';

type MapFiltersProps = {
  search: string;
  onSearch: (value: string) => void;
  provider: MapProviderKey;
  onProviderChange: (value: MapProviderKey) => void;
  heatmap: boolean;
  onHeatmapChange: (value: boolean) => void;
  view: MapView;
  onViewChange: (value: MapView) => void;
  showNumbers: boolean;
  onShowNumbersChange: (value: boolean) => void;
  showHouseholds: boolean;
  onShowHouseholdsChange: (value: boolean) => void;
  hidePoi: boolean;
  onHidePoiChange: (value: boolean) => void;
  onCollapse: VoidFunction;
};

const MapFilters = ({
  search,
  onSearch,
  provider,
  onProviderChange,
  heatmap,
  onHeatmapChange,
  view,
  onViewChange,
  showNumbers,
  onShowNumbersChange,
  showHouseholds,
  onShowHouseholdsChange,
  hidePoi,
  onHidePoiChange,
  onCollapse,
}: MapFiltersProps) => (
  <Stack
    spacing="24px"
    sx={{
      padding: '24px 16px 16px 16px',
      borderRadius: 'var(--radius-l)',
      backgroundColor: 'var(--white)',
      border: '1px solid var(--accent-200)',
    }}
  >
    <Stack direction="row" sx={{ alignItems: 'center', gap: '16px' }}>
      <Typography className="h4" color="var(--black)" sx={{ flexGrow: 1 }}>
        Details and filters
      </Typography>

      <Tooltip title="Hide the panel">
        <IconButton onClick={onCollapse} sx={{ padding: 0, margin: 0 }}>
          <IconPanelClose color="var(--grey-400)" />
        </IconButton>
      </Tooltip>
    </Stack>

    <SearchBar
      placeholder="Search address"
      value={search}
      onSearch={onSearch}
    />

    <Stack spacing="16px">
      <Typography className="body-regular" color="var(--black)">
        Map details
      </Typography>

      <Select
        label="Map provider"
        value={provider}
        onChange={(event) =>
          onProviderChange(event.target.value as MapProviderKey)
        }
      >
        {Object.entries(MAP_PROVIDERS).map(([key, value]) => (
          <MenuItem key={key} value={key}>
            <Typography className="body-regular">{value.name}</Typography>
          </MenuItem>
        ))}
      </Select>

      <Select
        label="Heatmap"
        value={heatmap ? 'on' : 'off'}
        onChange={(event) => onHeatmapChange(event.target.value === 'on')}
      >
        <MenuItem value="off">
          <Typography className="body-regular">Off</Typography>
        </MenuItem>
        <MenuItem value="on">
          <Typography className="body-regular">Time since covered</Typography>
        </MenuItem>
      </Select>

      <Select
        label="View"
        value={view}
        onChange={(event) => onViewChange(event.target.value as MapView)}
      >
        <MenuItem value="map">
          <Typography className="body-regular">Map</Typography>
        </MenuItem>
        <MenuItem value="plain">
          <Typography className="body-regular">Map without labels</Typography>
        </MenuItem>
      </Select>
    </Stack>

    <CustomDivider color="var(--accent-200)" />

    <Stack spacing="16px">
      <Typography className="body-regular" color="var(--black)">
        Map details
      </Typography>

      <Stack spacing="8px">
        <Checkbox
          label="Territory numbers"
          checked={showNumbers}
          onChange={(_, checked) => onShowNumbersChange(checked)}
          className="body-regular"
        />
        <Checkbox
          label="Households count"
          checked={showHouseholds}
          onChange={(_, checked) => onShowHouseholdsChange(checked)}
          className="body-regular"
        />
        <Checkbox
          label="Hide stores, restaurants, etc"
          checked={hidePoi}
          onChange={(_, checked) => onHidePoiChange(checked)}
          className="body-regular"
        />
      </Stack>
    </Stack>
  </Stack>
);

export default MapFilters;
