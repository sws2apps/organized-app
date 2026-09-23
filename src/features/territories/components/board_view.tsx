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
import { clickableRow } from './table_styles';
import {
  CardLostBadge,
  CategoryBadges,
  CoveredBadge,
} from './territory_badges';
import TruncatedText from './truncated_text';
import { emptyListMessage } from '../helpers';

type Column = 'available' | 'requested' | 'in_work' | 'overdue';

const COLUMNS: Column[] = ['available', 'requested', 'in_work', 'overdue'];

const COLUMN_LABEL: Record<Column, string> = {
  available: STATUS_LABEL.available,
  requested: 'Requested',
  in_work: STATUS_LABEL.in_work,
  overdue: STATUS_LABEL.overdue,
};

// requested and overdue are derived, so cards can leave them but never land there
const DROPPABLE = new Set<Column>(['available', 'in_work']);

const columnOf = (territory: Territory): Column =>
  territory.status === 'available' && territory.requestedBy
    ? 'requested'
    : territory.status;

type BoardViewProps = {
  territories: Territory[];
  onOpen: (id: string) => void;
  onOpenAssign: (id: string) => void;
  onAssign: (id: string, publisher: string) => void;
  onDecline: (id: string) => void;
  onReturn: (id: string) => void;
  onDrop: (id: string, status: TerritoryStatus) => void;
  showHouseholds?: boolean;
  overdueMonths?: number;
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
  overdueMonths,
}: BoardViewProps) => {
  const [dragging, setDragging] = useState(false);
  const [dragFrom, setDragFrom] = useState<Column>();

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

  const handleList = (target: Column, next: { id: string }[]) => {
    const moved = next
      .map((item) => territories.find((territory) => territory.id === item.id))
      .find((territory) => territory && columnOf(territory) !== target);

    if (!moved) return;

    if (columnOf(moved) === 'requested' && moved.requestedBy) {
      if (target === 'in_work') onAssign(moved.id, moved.requestedBy);
      if (target === 'available') onDecline(moved.id);
      return;
    }

    onDrop(moved.id, target as TerritoryStatus);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        alignItems: 'stretch',
        marginTop: '16px',
        overflowX: 'auto',
        scrollSnapType: 'x mandatory',
        paddingBottom: '4px',
        marginInline: '-16px',
        paddingInline: '16px',
        scrollPaddingInline: '16px',
        '& > *': {
          flex: '1 0 260px',
          maxWidth: { mobile: '85%', tablet688: 'none' },
          scrollSnapAlign: 'start',
        },
      }}
    >
      {COLUMNS.map((status) => {
        const column = territories
          .filter((territory) => columnOf(territory) === status)
          .sort((a, b) => b.daysSinceCovered - a.daysSinceCovered);

        const canDrop = DROPPABLE.has(status);

        const accepts =
          canDrop && !(status === 'in_work' && dragFrom === 'overdue');

        let borderColor = canDrop ? 'var(--grey-200)' : 'var(--accent-300)';
        if (dragging && accepts) borderColor = 'var(--accent-main)';

        return (
          <Box
            key={status}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '16px',
              borderRadius: 'var(--radius-xl)',
              backgroundColor: canDrop ? 'var(--grey-100)' : 'transparent',
              border: canDrop ? '1px solid' : '1px dashed',
              borderColor,
              opacity: dragging && !accepts ? 0.4 : 1,
              transition: 'border-color 0.2s ease, opacity 0.2s ease',
            }}
          >
            <Stack direction="row" spacing="8px" sx={{ alignItems: 'center' }}>
              <Stack sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                  className="body-small-semibold"
                  color="var(--black)"
                >
                  {COLUMN_LABEL[status]}
                </Typography>
                {status === 'overdue' && overdueMonths && (
                  <Typography
                    className="label-small-regular"
                    color="var(--grey-350)"
                  >
                    {`Out longer than ${overdueMonths} months`}
                  </Typography>
                )}
              </Stack>
              <Badge
                size="small"
                filled={false}
                color="accent"
                text={String(column.length)}
                sx={{ width: 'fit-content' }}
              />
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
                    {canDrop ? 'Drop here' : emptyListMessage()}
                  </Typography>
                </Stack>
              )}

              <ReactSortable
                list={column.map((territory) => ({ id: territory.id }))}
                setList={(next) => handleList(status, next)}
                id={`board-${status}`}
                group={{
                  name: 'territories',
                  pull: true,
                  put: (_to, from) =>
                    canDrop &&
                    !(status === 'in_work' && from.el.id === 'board-overdue'),
                }}
                animation={180}
                // touch needs a hold first so a swipe still scrolls the board
                delay={250}
                delayOnTouchOnly
                touchStartThreshold={6}
                ghostClass="territory-card-ghost"
                onStart={() => {
                  setDragFrom(status);
                  setDragging(true);
                }}
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
                    {...clickableRow(() => onOpen(territory.id))}
                    sx={{
                      cursor: 'grab',
                      padding: '12px',
                      borderRadius: 'var(--radius-m)',
                      backgroundColor: 'var(--white)',
                      border: '1px solid var(--accent-200)',
                      transition: 'box-shadow 0.15s ease',
                      '&:hover': { boxShadow: 'var(--small-card-shadow)' },
                      '&:focus-visible': {
                        outline: '2px solid var(--accent-main)',
                        outlineOffset: '2px',
                      },
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
                        sx={{ alignItems: 'flex-end', gap: '8px' }}
                      >
                        <Stack
                          direction="row"
                          sx={{
                            alignItems: 'center',
                            gap: '4px',
                            flexGrow: 1,
                            minWidth: 0,
                            overflow: 'hidden',
                          }}
                        >
                          <CoveredBadge days={territory.daysSinceCovered} />
                          <CardLostBadge territory={territory} />
                          <CategoryBadges territory={territory} />
                        </Stack>

                        <Box sx={{ width: 'fit-content', flexShrink: 0 }}>
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
