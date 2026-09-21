import { Box, Stack } from '@mui/material';
import { Typography } from '@components/index';
import { Territory } from '@definition/territory';
import { statusColor } from './helpers';

const TerritoryPicker = ({
  territories,
  selectedId,
  onSelect,
  height,
}: {
  territories: Territory[];
  selectedId?: string;
  onSelect: (id: string) => void;
  height: string;
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <Box
      sx={{
        height,
        overflowY: 'auto',
        borderRadius: 'var(--radius-l)',
        border: '1px solid var(--accent-200)',
        backgroundColor: 'var(--white)',
      }}
    >
      {territories.map((territory) => (
        <Stack
          key={territory.id}
          direction="row"
          spacing="10px"
          onClick={() => onSelect(territory.id)}
          sx={{
            alignItems: 'center',
            padding: '10px 12px',
            cursor: 'pointer',
            borderBottom: '1px solid var(--accent-200)',
            backgroundColor:
              territory.id === selectedId ? 'var(--accent-150)' : 'transparent',
            transition: 'background-color 0.15s ease',
            '&:hover': { backgroundColor: 'var(--accent-100)' },
            '&:last-of-type': { borderBottom: 'none' },
          }}
        >
          <Box
            sx={{
              width: '8px',
              height: '8px',
              flexShrink: 0,
              borderRadius: 'var(--radius-max)',
              backgroundColor: territory.boundary?.length
                ? statusColor(territory)
                : 'var(--grey-300)',
            }}
          />

          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography
              className="body-small-semibold"
              color="var(--black)"
              noWrap
            >
              {territory.number} · {territory.name}
            </Typography>
            <Typography
              className="label-small-regular"
              color="var(--grey-350)"
              noWrap
            >
              {territory.boundary?.length ? territory.city : 'Not mapped yet'}
            </Typography>
          </Box>
        </Stack>
      ))}

      {territories.length === 0 && (
        <Typography
          className="body-small-regular"
          color="var(--grey-350)"
          sx={{ padding: '12px' }}
        >
          No territories match the search.
        </Typography>
      )}
    </Box>
  </Box>
);

export default TerritoryPicker;
