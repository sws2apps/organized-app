import { MouseEvent, useMemo } from 'react';
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { Checkbox, InfoNote, Typography } from '@components/index';
import TableHead from '@components/table/TableHead';
import { Column } from '@components/table/index.types';
import { useBreakpoints } from '@hooks/index';
import { useAtomValue } from 'jotai';
import { shortDateFormatState } from '@states/settings';
import { dateFromDays, daysLabel } from '../helpers';
import useTableSort from '../useTableSort';
import { Territory, TYPE_LABEL } from '@definition/territory';
import AssignButton from './assign_button';
import TruncatedText from './truncated_text';
import {
  CardLostBadge,
  CategoryBadges,
  RequestBadge,
  StatusBadge,
  TypeIcon,
} from './territory_badges';

export type TerritoryTableProps = {
  territories: Territory[];
  checked: Set<string>;
  onCheck: (id: string) => void;
  onCheckMany: (ids: string[]) => void;
  onOpen: (id: string) => void;
  onOpenAssign: (id: string) => void;
  onAssign: (id: string, publisher: string) => void;
  onDecline: (id: string) => void;
  onReturn: (id: string) => void;
  showHouseholds?: boolean;
  emptyMessage?: string;
};

const rowStates = (selected: boolean) => ({
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
  backgroundColor: selected ? 'var(--accent-150)' : 'transparent',
  '&:hover': {
    backgroundColor: selected ? 'var(--accent-200)' : 'var(--accent-100)',
  },
  '&:active': {
    backgroundColor: selected ? 'var(--accent-300)' : 'var(--accent-200)',
  },
});

const STATUS_WEIGHT: Record<string, number> = {
  overdue: 0,
  in_work: 1,
  available: 2,
  lost: 3,
};

const sortValue = (territory: Territory, key: string) => {
  switch (key) {
    case 'name':
      return territory.name;
    case 'covered':
      return territory.daysSinceCovered;
    case 'assigned':
      return territory.daysOut ?? -1;
    case 'publisher':
      return territory.holder ?? '';
    case 'status':
      return STATUS_WEIGHT[territory.status];
    default:
      return territory.number;
  }
};

const TerritoryTable = ({
  territories,
  checked,
  onCheck,
  onCheckMany,
  onOpen,
  onOpenAssign,
  onAssign,
  onDecline,
  onReturn,
  showHouseholds = true,
  emptyMessage = 'No territories match the filters.',
}: TerritoryTableProps) => {
  const { tablet688Up, laptopUp, desktopUp } = useBreakpoints();

  const shortDateFormat = useAtomValue(shortDateFormatState);

  const {
    order,
    orderBy,
    handleRequestSort: sortBy,
  } = useTableSort('number', ['covered', 'assigned', 'households']);

  const columns = useMemo(() => {
    const result: Column[] = [
      { id: 'number', label: 'No.', sx: { width: '64px' } },
      { id: 'name', label: 'Name', sx: { minWidth: '220px' } },
    ];

    if (desktopUp) {
      result.push({
        id: 'covered',
        label: 'Last covered',
        sx: { width: '106px' },
      });
    }

    if (laptopUp) {
      result.push({
        id: 'assigned',
        label: 'Assigned',
        sx: { width: '110px' },
      });
    }

    if (desktopUp) {
      result.push({
        id: 'publisher',
        label: 'Publisher',
        sx: { width: '150px' },
      });
    }

    result.push({ id: 'status', label: 'Status', sx: { width: '108px' } });
    result.push({
      id: 'action',
      label: 'Action',
      type: 'action',
      sx: { width: '108px' },
    });

    return result;
  }, [laptopUp, desktopUp]);

  const sorted = useMemo(() => {
    const factor = order === 'asc' ? 1 : -1;

    return [...territories].sort((a, b) => {
      const left = sortValue(a, orderBy);
      const right = sortValue(b, orderBy);

      if (typeof left === 'string' && typeof right === 'string') {
        return left.localeCompare(right, undefined, { numeric: true }) * factor;
      }

      return ((left as number) - (right as number)) * factor;
    });
  }, [territories, order, orderBy]);

  const visible = sorted;

  const handleRequestSort = (event: MouseEvent<unknown>, property: string) => {
    if (property === 'action') return;

    sortBy(event, property);
  };

  const allChecked =
    visible.length > 0 &&
    visible.every((territory) => checked.has(territory.id));

  const someChecked = visible.some((territory) => checked.has(territory.id));

  if (territories.length === 0) {
    return <InfoNote message={emptyMessage} />;
  }

  if (!tablet688Up) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {visible.map((territory, index) => (
            <Stack
              key={territory.id}
              direction="row"
              spacing="12px"
              onClick={() => onOpen(territory.id)}
              sx={{
                alignItems: 'center',
                padding: '12px 4px',
                borderTop: index === 0 ? 'none' : '1px solid var(--accent-200)',
                ...rowStates(checked.has(territory.id)),
              }}
            >
              <Checkbox
                stopPropagation
                sx={{ padding: 0, margin: 0 }}
                checked={checked.has(territory.id)}
                onChange={() => onCheck(territory.id)}
              />

              <Stack spacing="4px" sx={{ flexGrow: 1, minWidth: 0 }}>
                <TruncatedText
                  className="body-small-semibold"
                  text={`${territory.number} · ${territory.name}`}
                />
                <TruncatedText
                  className="label-small-regular"
                  color="var(--grey-350)"
                  icon={<TypeIcon type={territory.type} />}
                  text={`${territory.city}${showHouseholds ? ` · ${territory.households} households` : ''} · last covered ${daysLabel(territory.daysSinceCovered)} ago`}
                  tooltip={`${TYPE_LABEL[territory.type]} · ${territory.city}`}
                />
                <Stack
                  direction="row"
                  spacing="4px"
                  sx={{ alignItems: 'center' }}
                >
                  <Box sx={{ width: 'fit-content' }}>
                    <StatusBadge status={territory.status} />
                  </Box>
                  <RequestBadge territory={territory} />
                  <CardLostBadge territory={territory} />
                  <CategoryBadges territory={territory} max={1} />
                </Stack>
              </Stack>

              <Box sx={{ flexShrink: 0 }}>
                <AssignButton
                  territory={territory}
                  onOpenAssign={onOpenAssign}
                  onAssign={onAssign}
                  onDecline={onDecline}
                  onReturn={onReturn}
                />
              </Box>
            </Stack>
          ))}
        </Box>

        <Stack direction="row" spacing="12px" sx={{ alignItems: 'center' }}>
          <Checkbox
            sx={{ padding: 0, margin: 0 }}
            checked={allChecked}
            indeterminate={someChecked && !allChecked}
            onChange={() => onCheckMany(visible.map((t) => t.id))}
            label="Select all"
            className="body-small-regular"
          />
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <TableContainer sx={{ overflowX: 'auto', maxHeight: '70vh' }}>
        <Table
          size="small"
          sx={{
            tableLayout: 'fixed',
            minWidth: { mobile: '100%', desktop: '880px' },
            '& .MuiTableCell-root': {
              padding: '10px 8px',
              borderColor: 'var(--accent-200)',
            },
            '& .MuiTableHead-root .MuiTableCell-root': {
              backgroundColor: 'var(--white)',
              position: 'sticky',
              // a hair above the container hides the row edge that would
              // otherwise show through while scrolling
              top: '-1px',
              zIndex: 2,
              borderBottom: 'none',
              boxShadow: 'inset 0 -1px 0 var(--accent-200)',
            },
            '& .MuiTableBody-root .MuiTableRow-root:last-of-type .MuiTableCell-root':
              {
                borderBottom: 'none',
              },
          }}
        >
          <TableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            columns={[
              {
                id: 'select',
                label: (
                  <Checkbox
                    stopPropagation
                    sx={{ padding: 0, margin: 0 }}
                    checked={allChecked}
                    indeterminate={someChecked && !allChecked}
                    onChange={() => onCheckMany(visible.map((t) => t.id))}
                  />
                ),
                sx: { width: '44px' },
              },
              ...columns,
            ]}
          />

          <TableBody>
            {visible.map((territory) => (
              <TableRow
                key={territory.id}
                onClick={() => onOpen(territory.id)}
                sx={rowStates(checked.has(territory.id))}
              >
                <TableCell>
                  <Checkbox
                    stopPropagation
                    sx={{ padding: 0, margin: 0 }}
                    checked={checked.has(territory.id)}
                    onChange={() => onCheck(territory.id)}
                  />
                </TableCell>

                <TableCell>
                  <Typography
                    className="body-small-semibold"
                    color="var(--black)"
                  >
                    {territory.number}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Stack spacing="4px" sx={{ minWidth: 0 }}>
                    <TruncatedText
                      className="body-small-regular"
                      text={territory.name}
                    />

                    <Stack
                      direction="row"
                      spacing="8px"
                      sx={{
                        alignItems: 'center',
                        minWidth: 0,
                        overflow: 'hidden',
                      }}
                    >
                      <TruncatedText
                        className="label-small-regular"
                        color="var(--grey-350)"
                        icon={<TypeIcon type={territory.type} />}
                        text={`${territory.city}${showHouseholds ? ` · ${territory.households} households` : ''}`}
                        tooltip={`${TYPE_LABEL[territory.type]} · ${territory.city}`}
                      />
                      <RequestBadge territory={territory} />
                      <CardLostBadge territory={territory} />
                      <CategoryBadges territory={territory} max={1} />
                    </Stack>
                  </Stack>
                </TableCell>

                {desktopUp && (
                  <TableCell>
                    <Typography
                      className="label-small-regular"
                      color={
                        territory.daysSinceCovered > 365
                          ? 'var(--red-main)'
                          : 'var(--grey-400)'
                      }
                      noWrap
                    >
                      {daysLabel(territory.daysSinceCovered)}
                    </Typography>
                  </TableCell>
                )}

                {laptopUp && (
                  <TableCell>
                    <Stack spacing="2px" sx={{ minWidth: 0 }}>
                      <Typography
                        className="label-small-regular"
                        color="var(--grey-400)"
                        noWrap
                      >
                        {dateFromDays(territory.daysOut, shortDateFormat)}
                      </Typography>

                      {territory.daysOut !== undefined && (
                        <Typography
                          className="label-small-regular"
                          color="var(--grey-350)"
                          noWrap
                        >
                          {daysLabel(territory.daysOut)}
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                )}

                {desktopUp && (
                  <TableCell>
                    {territory.holder ? (
                      <TruncatedText
                        className="label-small-regular"
                        color="var(--grey-400)"
                        text={territory.holder}
                      />
                    ) : (
                      <Typography
                        className="label-small-regular"
                        color="var(--grey-400)"
                      >
                        –
                      </Typography>
                    )}
                  </TableCell>
                )}

                <TableCell>
                  <Box sx={{ width: 'fit-content' }}>
                    <StatusBadge status={territory.status} />
                  </Box>
                </TableCell>

                <TableCell align="center">
                  <Box
                    sx={{
                      width: 'fit-content',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}
                  >
                    <AssignButton
                      territory={territory}
                      onOpenAssign={onOpenAssign}
                      onAssign={onAssign}
                      onDecline={onDecline}
                      onReturn={onReturn}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TerritoryTable;
