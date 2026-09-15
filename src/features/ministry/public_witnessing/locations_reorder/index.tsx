import { Box, Stack } from '@mui/material';
import { ReactSortable } from 'react-sortablejs';
import { useAppTranslation } from '@hooks/index';
import { IconDragHandle } from '@components/icons';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Typography from '@components/typography';
import useLocationsReorder from './useLocationsReorder';
import { LocationsReorderProps } from './index.types';

const LocationsReorder = (props: LocationsReorderProps) => {
  const { t } = useAppTranslation();

  const { locations, handleDragChange, handleSaveChanges } =
    useLocationsReorder(props);

  return (
    <Dialog onClose={props.onClose} open={props.open} sx={{ padding: '24px' }}>
      <Typography className="h2">{t('tr_PWLocationsReorder')}</Typography>

      <Box sx={{ width: '100%' }}>
        <ReactSortable
          list={locations}
          setList={handleDragChange}
          handle=".scrollable-icon"
        >
          {locations.map((location) => (
            <Box
              key={location.id}
              sx={{
                padding: '8px',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                borderBottom: '1px solid var(--accent-200)',
              }}
            >
              <IconDragHandle
                color="var(--accent-main)"
                className="scrollable-icon"
              />
              <Typography>{location.name}</Typography>
            </Box>
          ))}
        </ReactSortable>
      </Box>

      <Stack spacing="8px" width="100%">
        <Button variant="main" onClick={handleSaveChanges}>
          {t('tr_save')}
        </Button>
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_cancel')}
        </Button>
      </Stack>
    </Dialog>
  );
};

export default LocationsReorder;
