import { ReactNode } from 'react';
import OfflineSettings from '@features/territories/map/offline_settings';
import { Box, MenuItem, Stack } from '@mui/material';
import { Checkbox, CustomDivider, Select, Typography } from '@components/index';
import SwitchWithLabel from '@components/switch_with_label';
import QuickSettings from '@features/quick_settings';
import { useAtom } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { territoriesShowDoNotCallMapState } from '@states/territories';
import {
  MAP_PROVIDERS,
  MapProviderKey,
} from '@features/territories/map/constants';
import { TerritoriesMapState } from '@features/territories/map/useTerritoriesMap';
import {
  LayerSwitch,
  PLACE_TYPES,
  PlaceType,
} from '@features/territories/map/basemap';

type LayerItem = { key: LayerSwitch; label: string; helper: string };

// what the background map shows, from the streets to the places on them
const DETAIL_SWITCHES: LayerItem[] = [
  {
    key: 'streetNames',
    label: 'tr_territoryStreetNames',
    helper: 'tr_territoryShowStreetNamesFromFurtherOut',
  },
  {
    key: 'houseNumbers',
    label: 'tr_territoryHouseNumbers',
    helper: 'tr_territoryShowHouseNumbersWhenZoomedInClose',
  },
  {
    key: 'buildings',
    label: 'tr_territoryBuildingOutlines',
    helper: 'tr_territoryOutlineEveryBuildingWhenZoomedIn',
  },
  {
    key: 'places',
    label: 'tr_territoryPlaces',
    helper: 'tr_territoryShowShopsSchoolsAndOtherPointsOfInterest',
  },
  {
    key: 'parking',
    label: 'tr_territoryCarParks',
    helper: 'tr_territoryMarkCarParksWithAP',
  },
];

const COLOUR_SWITCHES: LayerItem[] = [
  {
    key: 'green',
    label: 'tr_territoryGreenAreas',
    helper: 'tr_territoryTintParksWoodsAndGrassGreen',
  },
  {
    key: 'water',
    label: 'tr_territoryWater',
    helper: 'tr_territoryTintRiversLakesAndCanalsBlue',
  },
];

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <Stack spacing="16px">
    <Typography className="h4" color="var(--black)">
      {title}
    </Typography>
    {children}
  </Stack>
);

const MapQuickSettings = ({
  map,
  open,
  onClose,
}: {
  map: TerritoriesMapState;
  open: boolean;
  onClose: VoidFunction;
}) => {
  const { t } = useAppTranslation();
  const [doNotCalls, setDoNotCalls] = useAtom(territoriesShowDoNotCallMapState);

  const layer = (item: LayerItem) => (
    <Stack key={item.key} spacing="8px">
      <SwitchWithLabel
        label={t(item.label)}
        helper={t(item.helper)}
        checked={map.layers[item.key]}
        onChange={(value) => map.setLayer(item.key, value)}
      />

      {/* which kinds of places show, so bins and recycling can stay off */}
      {item.key === 'places' && map.layers.places && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            paddingLeft: '52px',
          }}
        >
          {(Object.keys(PLACE_TYPES) as PlaceType[]).map((type) => (
            <Checkbox
              key={type}
              label={t(PLACE_TYPES[type].label)}
              checked={map.layers.placeTypes.includes(type)}
              onChange={() => map.togglePlaceType(type)}
              className="body-small-regular"
            />
          ))}
        </Box>
      )}
    </Stack>
  );

  return (
    <QuickSettings
      title={t('tr_territoryCoverageMap')}
      open={open}
      onClose={onClose}
    >
      <Stack spacing="24px" sx={{ width: '100%' }}>
        <Section title={t('tr_territoryTerritoriesOnTheMap')}>
          <SwitchWithLabel
            label={t('tr_territoryTerritoryNumbers')}
            helper={t('tr_territoryShowTheNumberInTheMiddleOfEveryTerritory')}
            checked={map.showNumbers}
            onChange={map.setShowNumbers}
          />
          <SwitchWithLabel
            label={t('tr_territoryHouseholdsCount')}
            helper={t('tr_territoryShowTheHouseholdsUnderTheNumber')}
            checked={map.showHouseholds}
            onChange={map.setShowHouseholds}
          />
          <SwitchWithLabel
            label={t('tr_showDoNotCallMap')}
            helper={t('tr_showDoNotCallMapDescription')}
            checked={doNotCalls}
            onChange={setDoNotCalls}
          />
        </Section>

        {/* what the territories show above, the background map they sit on below */}
        <CustomDivider color="var(--accent-200)" />

        <Section title={t('tr_territoryMap')}>
          <Select
            label={t('tr_territoryMapProvider')}
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
          <OfflineSettings provider={map.provider} />
        </Section>

        <Section title={t('tr_territoryMapDetails')}>
          {DETAIL_SWITCHES.map(layer)}
        </Section>

        <Section title={t('tr_territoryColours')}>
          {COLOUR_SWITCHES.map(layer)}
        </Section>
      </Stack>
    </QuickSettings>
  );
};

export default MapQuickSettings;
