import { useAppTranslation } from '@hooks/index';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, ButtonBase, Stack } from '@mui/material';
import { IconChevronRight } from '@icons/index';
import {
  Badge,
  Button,
  CustomDivider,
  InfoNote,
  Typography,
} from '@components/index';
import {
  emptyListMessage,
  PublisherSort,
  sortedPublishers,
} from '@features/territories/helpers';
import TruncatedText from '@features/territories/components/truncated_text';

export const PublisherSortButton = ({
  sort,
  onChange,
}: {
  sort: PublisherSort;
  onChange: (sort: PublisherSort) => void;
}) => {
  const { t } = useAppTranslation();
  return (
    <Button
      variant="small"
      disableAutoStretch
      minHeight={32}
      onClick={() => onChange(sort === 'count' ? 'name' : 'count')}
    >
      {sort === 'count'
        ? t('tr_territorySortMostHeld')
        : t('tr_territorySortName')}
    </Button>
  );
};

const PublisherLoad = ({
  entries,
  sort,
  limit = 10,
}: {
  entries: { publisher: string; count: number }[];
  sort: PublisherSort;
  limit?: number;
}) => {
  const { t } = useAppTranslation();

  const navigate = useNavigate();

  const [shown, setShown] = useState(limit);

  if (entries.length === 0) {
    return <InfoNote message={emptyListMessage()} />;
  }

  const openTerritories = (holder: string) =>
    navigate(`/territories?tab=all&search=${encodeURIComponent(holder)}`, {
      state: { parent: 'tr_territoryTerritoryCoverageStatistics' },
    });

  return (
    <>
      <Stack
        spacing="4px"
        divider={<CustomDivider color="var(--accent-200)" />}
      >
        {sortedPublishers(entries, sort)
          .slice(0, shown)
          .map((entry, index) => (
            <Box
              key={entry.publisher}
              component={entry.count > 0 ? ButtonBase : 'div'}
              {...(entry.count > 0 && {
                onClick: () => openTerritories(entry.publisher),
                'aria-label':
                  entry.count === 1
                    ? t('tr_territoryShowTheTerritoryOf', {
                        name: entry.publisher,
                      })
                    : t('tr_territoryShowTheTerritoriesOf', {
                        n: entry.count,
                        name: entry.publisher,
                      }),
              })}
              sx={{
                display: 'flex',
                width: '100%',
                gap: '12px',
                alignItems: 'center',
                justifyContent: 'flex-start',
                textAlign: 'left',
                padding: '10px 8px',
                borderRadius: 'var(--radius-m)',
                ...(entry.count > 0 && {
                  transition: 'background-color 0.15s ease',
                  '&:hover': { backgroundColor: 'var(--accent-100)' },
                  '&.Mui-focusVisible': {
                    backgroundColor: 'var(--accent-150)',
                    outline: 'var(--accent-main) auto 1px',
                  },
                }),
              }}
            >
              <Typography
                className="label-small-regular"
                color="var(--grey-350)"
                sx={{ width: '20px', flexShrink: 0 }}
              >
                {index + 1}
              </Typography>

              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <TruncatedText
                  className="body-small-regular"
                  color="var(--grey-400)"
                  text={entry.publisher}
                />
              </Box>

              <Box sx={{ width: 'fit-content' }}>
                <Badge
                  size="small"
                  filled={false}
                  color={entry.count > 0 ? 'accent' : 'grey'}
                  text={String(entry.count)}
                />
              </Box>

              {/* kept empty on rows without territories, so the counts line up */}
              <Box sx={{ width: '20px', height: '20px', flexShrink: 0 }}>
                {entry.count > 0 && (
                  <IconChevronRight
                    color="var(--accent-dark)"
                    width={20}
                    height={20}
                  />
                )}
              </Box>
            </Box>
          ))}
      </Stack>

      {entries.length > shown && (
        <Button
          variant="small"
          disableAutoStretch
          onClick={() => setShown(shown + limit)}
          sx={{ alignSelf: 'flex-start' }}
        >
          {t('tr_territoryShowMore')}
        </Button>
      )}
    </>
  );
};

export default PublisherLoad;
