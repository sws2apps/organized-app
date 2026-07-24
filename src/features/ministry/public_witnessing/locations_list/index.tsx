import { Fragment } from 'react';
import { Box, Divider } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { IconNormalPin } from '@components/icons';
import Card from '@components/card';
import SettingsTab from '@components/settings_tab';
import Typography from '@components/typography';
import { LocationsListProps } from './index.types';

const LocationsList = ({
  locations,
  selected,
  onSelect,
}: LocationsListProps) => {
  const { t } = useAppTranslation();
  const { laptopUp } = useBreakpoints();

  return (
    <Card>
      <Typography className="h3">{t('tr_locations')}</Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          // Touch devices have no hover, so the chevron the tab reveals on
          // hover would never show up.
          ...(!laptopUp && { '& .chevron-container': { opacity: 1 } }),
        }}
      >
        {locations.map((location, index) => (
          <Fragment key={location.location_uid}>
            {index > 0 && <Divider sx={{ borderColor: 'var(--accent-200)' }} />}
            <SettingsTab
              renderIcon={(color) => <IconNormalPin color={color} />}
              label={location.location_data.name}
              description={location.location_data.address}
              active={location.location_uid === selected}
              onClick={() => onSelect(location.location_uid)}
            />
          </Fragment>
        ))}
      </Box>
    </Card>
  );
};

export default LocationsList;
