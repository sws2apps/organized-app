import { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { ReactSortable } from 'react-sortablejs';
import { Badge, Typography } from '@components/index';
import {
  STATUS_LABEL,
  Territory,
  TerritoryStatus,
  TYPE_LABEL,
} from '@definition/territory';
import AssignButton from './assign_button';
import {
  CardLostBadge,
  CategoryBadges,
  CoveredBadge,
  RequestBadge,
} from './territory_badges';
import TruncatedText from './truncated_text';

const COLUMNS: TerritoryStatus[] = ['available', 'in_work', 'overdue'];

const DROPPABLE: TerritoryStatus[] = ['available', 'in_work'];

type BoardViewProps = {
  territories: Territory[];
  onOpen: (id: string) => void;
  onOpenAssign: (id: string) => void;
  onAssign: (id: string, publisher: string) => void;
  onDecline: (id: string) => void;
  onReturn: (id: string) => void;
  onDrop: (id: string, status: TerritoryStatus) => void;
  showHouseholds?: boolean;
};

const BoardView = ({
  territories,
  onOpen,
  onOpenAssign,
  onAssign,
  onDecline,
  onReturn,
  onDrop,
  showHouseholds = true,
}: BoardViewProps) => {
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!dragging) return;

    const stop = () => setDragging(false);

    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);

    return () => {
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
    };
  }, [dragging]);

  const handleList = (status: TerritoryStatus, next: { id: string }[]) => {
    const moved = next.find((item) => {
      const current = territories.find((territory) => territory.id === item.id);

      return current && current.status !== status;
    });

    if (moved) onDrop(moved.id, status);
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          mobile: 'minmax(0, 1fr)',
          tablet688: 'repeat(2, minmax(0, 1fr))',
          laptop: 'repeat(3, minmax(0, 1fr))',
        },
        gap: '16px',
        alignItems: 'stretch',
        marginTop: '16px',
      }}
    >
      {COLUMNS.map((status) => {
        const column = territories
          .filter((territory) => territory.status === status)
          .sort((a, b) => b.daysSinceCovered - a.daysSinceCovered);

        const canDrop = DROPPABLE.includes(status);

        return (
          <Box
            key={status}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '16px',
              borderRadius: 'var(--radius-xl)',
              backgroundColor: 'var(--grey-100)',
              border: '1px solid',
              borderColor:
                dragging && canDrop ? 'var(--accent-main)' : 'var(--grey-200)',
              opacity: dragging && !canDrop ? 0.4 : 1,
              transition: 'border-color 0.2s ease, opacity 0.2s ease',
            }}
          >
            <Stack direction="row" spacing="8px" sx={{ alignItems: 'center' }}>
              <Typography
                className="body-small-semibold"
                color="var(--black)"
                sx={{ flexGrow: 1 }}
              >
                {STATUS_LABEL[status]}
              </Typography>
              <Box sx={{ width: 'fit-content' }}>
                <Badge
                  size="small"
                  filled={false}
                  color="accent"
                  text={String(column.length)}
                />
              </Box>
            </Stack>

            <Box sx={{ position: 'relative', minHeight: '72px', flexGrow: 1 }}>
              {column.length === 0 && (
                <Stack
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 'var(--radius-m)',
                    border: '1px dashed var(--accent-300)',
                    pointerEvents: 'none',
                  }}
                >
                  <Typography
                    className="label-small-regular"
                    color="var(--grey-350)"
                  >
                    {canDrop ? 'Drop here' : 'Empty'}
                  </Typography>
                </Stack>
              )}

              <ReactSortable
                list={column.map((territory) => ({ id: territory.id }))}
                setList={(next) => handleList(status, next)}
                group={{ name: 'territories', pull: true, put: canDrop }}
                animation={180}
                ghostClass="territory-card-ghost"
                onStart={() => setDragging(true)}
                onEnd={() => setDragging(false)}
                onUnchoose={() => setDragging(false)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  minHeight: '72px',
                  height: '100%',
                }}
              >
                {column.map((territory) => (
                  <Stack
                    key={territory.id}
                    direction="row"
                    spacing="10px"
                    onClick={() => onOpen(territory.id)}
                    sx={{
                      cursor: 'grab',
                      padding: '12px',
                      borderRadius: 'var(--radius-m)',
                      backgroundColor: 'var(--white)',
                      border: '1px solid var(--accent-200)',
                      transition: 'box-shadow 0.15s ease',
                      '&:hover': { boxShadow: 'var(--small-card-shadow)' },
                      '&:active': { cursor: 'grabbing' },
                      '&.territory-card-ghost': {
                        opacity: 0.4,
                        borderStyle: 'dashed',
                        borderColor: 'var(--accent-main)',
                      },
                    }}
                  >
                    <Stack spacing="4px" sx={{ minWidth: 0, flexGrow: 1 }}>
                      <TruncatedText
                        className="body-small-semibold"
                        text={`${territory.number} · ${territory.name}`}
                      />
                      <TruncatedText
                        className="label-small-regular"
                        color="var(--grey-350)"
                        text={`${territory.holder ?? TYPE_LABEL[territory.type]}${
                          showHouseholds
                            ? ` · ${territory.households} households`
                            : ''
                        }`}
                      />

                      <Stack
                        direction="row"
                        sx={{
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '4px',
                        }}
                      >
                        <CoveredBadge days={territory.daysSinceCovered} />
                        <RequestBadge territory={territory} />
                        <CardLostBadge territory={territory} />
                        <CategoryBadges territory={territory} max={1} />

                        <Box sx={{ flexGrow: 1 }} />

                        <Box sx={{ width: 'fit-content' }}>
                          <AssignButton
                            territory={territory}
                            onOpenAssign={onOpenAssign}
                            onAssign={onAssign}
                            onDecline={onDecline}
                            onReturn={onReturn}
                          />
                        </Box>
                      </Stack>
                    </Stack>
                  </Stack>
                ))}
              </ReactSortable>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default BoardView;
