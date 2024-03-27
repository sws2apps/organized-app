import { EnhancedTableProps } from '@components/table/index.types';
import { MouseEvent } from 'react';
import { Box, Stack, TableCell, TableHead as MUITableHead, TableRow, TableSortLabel, Typography } from '@mui/material';
import { IconDown } from '@icons/index';
import { visuallyHidden } from '@mui/utils';

const alignCenterArray = ['action', 'number'];
const TableHead = (props: EnhancedTableProps) => {
  const { order, orderBy, onRequestSort, columns } = props;
  const createSortHandler = (property: string) => (event: MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <MUITableHead>
      <TableRow>
        {columns.map((headCell) => (
          <TableCell
            style={{ backgroundColor: 'var(--accent-100)', borderColor: 'var(--accent-200)', padding: '2px 16px' }}
            key={headCell.id}
            align={alignCenterArray.includes(headCell.type) ? 'center' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              style={{ position: 'relative' }}
              IconComponent={(props) => (
                <Stack {...props} style={{ position: 'absolute', right: '-25px' }}>
                  <IconDown color={'var(--grey-350)'} width={18} height={18} />
                </Stack>
              )}
            >
              <Typography className={'body-small-regular'} color={'var(--grey-350)'}>
                {headCell.label}
              </Typography>
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </MUITableHead>
  );
};

export default TableHead;
