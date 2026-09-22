import { MenuItem, Stack } from '@mui/material';
import { SearchBar, Select, Typography } from '@components/index';
import IconButton from '@components/icon_button';
import Tooltip from '@components/tooltip';
import { IconPanelClose } from '@icons/index';
import { COLOR_VIEWS, ColorView, HEATMAP_YEARS } from './views';

type MapFiltersProps = {
  search: string;
  onSearch: (value: string) => void;
  colorView: ColorView;
  onColorViewChange: (value: ColorView) => void;
  heatmapYear: number;
  onHeatmapYearChange: (value: number) => void;
  onCollapse: VoidFunction;
};

const MapFilters = ({
  search,
  onSearch,
  colorView,
  onColorViewChange,
  heatmapYear,
  onHeatmapYearChange,
  onCollapse,
}: MapFiltersProps) => (
  <Stack
    spacing="16px"
    sx={{
      padding: '9px 16px 16px 16px',
      borderRadius: 'var(--radius-l)',
      backgroundColor: 'var(--white)',
      border: '1px solid var(--accent-200)',
    }}
  >
    <Stack
      direction="row"
      sx={{ alignItems: 'center', gap: '16px', marginBottom: '-4px' }}
    >
      <Typography className="h4" color="var(--black)" sx={{ flexGrow: 1 }}>
        Territories
      </Typography>

      <Tooltip title="Hide the panel">
        <IconButton onClick={onCollapse} sx={{ padding: 0, margin: 0 }}>
          <IconPanelClose color="var(--accent-main)" />
        </IconButton>
      </Tooltip>
    </Stack>

    <SearchBar
      placeholder="Search territories"
      value={search}
      onSearch={onSearch}
    />

    <Stack spacing="16px">
      <Select
        label="Display"
        value={colorView}
        onChange={(event) => onColorViewChange(event.target.value as ColorView)}
      >
        {COLOR_VIEWS.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            <Typography className="body-regular">{item.label}</Typography>
          </MenuItem>
        ))}
      </Select>

      {colorView === 'heatmap' && (
        <Select
          label="Service year"
          value={String(heatmapYear)}
          onChange={(event) => onHeatmapYearChange(Number(event.target.value))}
        >
          {HEATMAP_YEARS().map((year) => (
            <MenuItem key={year} value={String(year)}>
              <Typography className="body-regular">
                {`${year} service year`}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      )}
    </Stack>
  </Stack>
);

export default MapFilters;
