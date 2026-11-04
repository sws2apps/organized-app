import { useAppTranslation } from '@hooks/index';
import { MenuItem, Stack } from '@mui/material';
import { Select, Typography } from '@components/index';
import IconButton from '@components/icon_button';
import Tooltip from '@components/tooltip';
import { IconPanelClose } from '@icons/index';
import {
  Bucket,
  COLOR_VIEWS,
  ColorView,
  HEATMAP_PERIODS,
} from '@features/territories/map/views';
import MapLegend from '@features/territories/map/map_legend';

type MapFiltersProps = {
  colorView: ColorView;
  onColorViewChange: (value: ColorView) => void;
  heatmapPeriod: string;
  onHeatmapPeriodChange: (value: string) => void;
  legend: Bucket[];
  onCollapse: VoidFunction;
};

const MapFilters = ({
  colorView,
  onColorViewChange,
  heatmapPeriod,
  onHeatmapPeriodChange,
  legend,
  onCollapse,
}: MapFiltersProps) => {
  const { t } = useAppTranslation();
  return (
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
          {t('tr_territories')}
        </Typography>

        <Tooltip title={t('tr_territoryHideThePanel')} delaySpeed="slow">
          {/* the same box as the button that opens the panel again */}
          <IconButton
            onClick={onCollapse}
            sx={{
              padding: '6px',
              margin: '-6px',
              borderRadius: 'var(--radius-m)',
              '&:hover': { backgroundColor: 'var(--accent-150)' },
            }}
          >
            <IconPanelClose color="var(--accent-main)" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Stack spacing="16px">
        <Select
          label={t('tr_display')}
          value={colorView}
          onChange={(event) =>
            onColorViewChange(event.target.value as ColorView)
          }
          renderValue={(value) =>
            t(COLOR_VIEWS.find((item) => item.id === value)?.label ?? '')
          }
        >
          {COLOR_VIEWS.map((item) => (
            <MenuItem
              key={item.id}
              value={item.id}
              // all five fit the menu's height without scrolling
              sx={{ paddingBlock: '3px', minHeight: 0 }}
            >
              <Stack>
                <Typography className="body-regular">
                  {t(item.label)}
                </Typography>
                <Typography
                  className="label-small-regular"
                  color="var(--grey-350)"
                >
                  {t(item.description)}
                </Typography>
              </Stack>
            </MenuItem>
          ))}
        </Select>

        {colorView === 'heatmap' && (
          <Select
            label={t('tr_period')}
            value={heatmapPeriod}
            onChange={(event) =>
              onHeatmapPeriodChange(String(event.target.value))
            }
          >
            {HEATMAP_PERIODS().map((period) => (
              <MenuItem key={period.id} value={period.id}>
                <Typography className="body-regular">{period.label}</Typography>
              </MenuItem>
            ))}
          </Select>
        )}

        {legend.length > 0 && <MapLegend items={legend} />}
      </Stack>
    </Stack>
  );
};

export default MapFilters;
