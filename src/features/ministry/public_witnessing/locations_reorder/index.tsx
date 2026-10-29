import { useRef } from 'react';
import { Box, Stack } from '@mui/material';
import { ReactSortable } from 'react-sortablejs';
import { useAppTranslation } from '@hooks/index';
import IconButton from '@components/icon_button';
import { IconDragHandle, IconExpand } from '@components/icons';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Typography from '@components/typography';
import useLocationsReorder from './useLocationsReorder';
import { LocationsReorderProps } from './index.types';

const LocationsReorder = (props: LocationsReorderProps) => {
  const { t } = useAppTranslation();
  const rowRefs = useRef(new Map<string, HTMLDivElement>());

  const {
    locations,
    handleDragChange,
    handleSaveChanges,
    isSaving,
    saveError,
  } = useLocationsReorder(props);

  const moveLocation = (index: number, offset: number) => {
    const id = locations[index].id;
    const reordered = [...locations];
    [reordered[index], reordered[index + offset]] = [
      reordered[index + offset],
      reordered[index],
    ];
    handleDragChange(reordered);
    // The pressed arrow may become disabled at the boundary. Keep keyboard
    // focus on the moved row, whose accessible name includes its new position.
    requestAnimationFrame(() => rowRefs.current.get(id)?.focus());
  };

  return (
    <Dialog
      title={t('tr_PWLocationsReorder')}
      actions={
        <Stack spacing="8px" sx={{ width: '100%' }}>
          <Button
            variant="main"
            onClick={handleSaveChanges}
            disabled={isSaving}
          >
            {t('tr_save')}
          </Button>
          <Button variant="secondary" onClick={props.onClose}>
            {t('tr_cancel')}
          </Button>
        </Stack>
      }
      onClose={props.onClose}
      open={props.open}
      sx={{ padding: '24px' }}
    >
      <Box sx={{ width: '100%' }}>
        {saveError && (
          <Typography role="alert" sx={{ color: 'var(--red-dark)' }}>
            {t(saveError)}
          </Typography>
        )}
        <ReactSortable
          list={locations}
          setList={handleDragChange}
          handle=".scrollable-icon"
        >
          {locations.map((location, index) => (
            <Box
              key={location.id}
              ref={(node: HTMLDivElement | null) => {
                if (node) rowRefs.current.set(location.id, node);
                else rowRefs.current.delete(location.id);
              }}
              role="group"
              tabIndex={-1}
              aria-label={t('tr_PWLocationPosition', {
                name: location.name,
                position: index + 1,
                total: locations.length,
              })}
              sx={{
                padding: '8px',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                borderBottom: '1px solid var(--accent-200)',
                '&:focus-visible': { outline: 'var(--accent-main) auto 1px' },
              }}
            >
              <IconDragHandle
                color="var(--accent-main)"
                className="scrollable-icon"
              />
              <Typography
                sx={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}
              >
                {location.name}
              </Typography>
              <IconButton
                aria-label={t('tr_PWMoveUp', { name: location.name })}
                disabled={index === 0}
                onClick={() => moveLocation(index, -1)}
              >
                <IconExpand sx={{ transform: 'rotate(180deg)' }} />
              </IconButton>
              <IconButton
                aria-label={t('tr_PWMoveDown', { name: location.name })}
                disabled={index === locations.length - 1}
                onClick={() => moveLocation(index, 1)}
              >
                <IconExpand />
              </IconButton>
            </Box>
          ))}
        </ReactSortable>
      </Box>
    </Dialog>
  );
};

export default LocationsReorder;
