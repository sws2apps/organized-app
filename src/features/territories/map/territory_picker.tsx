import { KeyboardEvent, useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import {
  CustomDivider,
  InfoNote,
  ScrollableTabs,
  Typography,
} from '@components/index';
import { Territory } from '@definition/territory';
import { NO_MATCHES } from '../helpers';

const TerritoryPicker = ({
  territories,
  selectedId,
  onSelect,
  height,
  editing,
}: {
  territories: Territory[];
  selectedId?: string;
  onSelect: (id: string) => void;
  height: string;
  editing: boolean;
}) => {
  // editing is mostly drawing what is missing, so it opens on that list
  const [tab, setTab] = useState(editing ? 1 : 0);

  useEffect(() => setTab(editing ? 1 : 0), [editing]);

  const added = territories.filter((territory) => territory.boundary?.length);
  const notAdded = territories.filter(
    (territory) => !territory.boundary?.length
  );

  const shown = tab === 0 ? added : notAdded;

  const handleKey = (event: KeyboardEvent, id: string) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    onSelect(id);
  };

  return (
    <Box
      sx={{
        height,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-l)',
        border: '1px solid var(--accent-200)',
        backgroundColor: 'var(--white)',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ padding: '6px 8px 0', flexShrink: 0 }}>
        <ScrollableTabs
          appearance="plain"
          layout="stretch"
          tabs={[
            { label: 'On the map', badge: added.length },
            { label: 'No borders', badge: notAdded.length },
          ]}
          value={tab}
          onChange={setTab}
        />
      </Box>
      <CustomDivider color="var(--accent-200)" />

      <Box
        sx={{ flexGrow: 1, minHeight: 0, overflowY: 'auto', padding: '8px' }}
      >
        {shown.length === 0 && (
          <InfoNote
            sx={{ padding: '8px 8px 0' }}
            message={
              territories.length === 0
                ? NO_MATCHES
                : tab === 0
                  ? 'No territory is on the map yet. Pick one under “No borders” to draw it.'
                  : 'Every territory has its borders drawn.'
            }
          />
        )}

        <Stack
          spacing="2px"
          divider={<CustomDivider color="var(--accent-200)" />}
        >
          {shown.map((territory) => (
            <Stack
              key={territory.id}
              role="button"
              tabIndex={0}
              aria-pressed={territory.id === selectedId}
              direction="row"
              spacing="10px"
              onClick={() => onSelect(territory.id)}
              onKeyDown={(event) => handleKey(event, territory.id)}
              sx={{
                alignItems: 'center',
                padding: '8px',
                cursor: 'pointer',
                borderRadius: 'var(--radius-m)',
                backgroundColor:
                  territory.id === selectedId
                    ? 'var(--accent-150)'
                    : 'transparent',
                transition: 'background-color 0.15s ease',
                '&:hover': { backgroundColor: 'var(--accent-100)' },
                '&:focus-visible': { outline: 'var(--accent-main) auto 1px' },
              }}
            >
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
                  {territory.city}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default TerritoryPicker;
