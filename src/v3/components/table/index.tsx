import { Stack, TableBody, TableContainer } from '@mui/material';
import { Column } from './index.types';
import TableHead from './TableHead';
import useSorting from '@hooks/useSorting';
import { StyledCell, StyledRow, StyledTable } from '@components/table/table.styles';
import Badge from '@components/badge';
import { IconAssign } from '@icons/index';
import Button from '@components/button';
import Typography from '@components/typography';

const columns: Column[] = [
  { id: 'id', label: '№' },
  { id: 'name', label: 'Name' },
  { id: 'covered', label: 'Covered' },
  {
    id: 'households',
    label: 'Households',
    type: 'number',
  },
];
const columns4: Column[] = [
  { id: 'id', label: '№' },
  { id: 'name', label: 'Name' },
  { id: 'covered', label: 'Covered' },
  {
    id: 'households',
    label: 'Households',
    type: 'number',
  },
  {
    id: 'action',
    label: 'Action',
    type: 'action',
  },
];

const rows = [
  { id: 'M2', name: 'Marktstraße, Gartenstraße', covered: '23.12.2020', households: 163 },
  { id: 'M5', name: 'Allerton Bridge', covered: '02.03.2019', households: 121 },
  { id: 'M4', name: 'Allerton Bridge', covered: '02.03.2019', households: 121 },
  { id: 'M1', name: 'Allerton Bridge', covered: '02.03.2019', households: 121 },
  { id: 'M9', name: 'Allerton Bridge', covered: '02.03.2019', households: 121 },
  { id: 'M8', name: 'Allerton Bridge', covered: '02.03.2019', households: 121 },
  { id: 'M6', name: 'Allerton Bridge', covered: '02.03.2019', households: 121 },
  { id: 'M3', name: 'Allerton Bridge', covered: '02.03.2019', households: 121 },
];

const columns2: Column[] = [
  { id: 'id', label: '№' },
  { id: 'publisher', label: 'Publisher' },
  { id: 'assigned', label: 'Assigned' },
  {
    id: 'returned',
    label: 'Returned',
  },
];

const rows2 = [
  {
    id: 'M2',
    name: 'Marktstraße, Gartenstraße',
    publisher: 'Mike Wallenter',
    assigned: '01.03.2024',
    returned: '19.02.2021',
  },
  {
    id: 'M21',
    name: 'Marktstraße, Gartenstraße',
    publisher: 'George Markus',
    assigned: '23.12.2020',
    returned: 'In work',
    desc: 'Only part B to cover',
  },
  {
    id: 'M3',
    name: 'Forest Glen Lane',
    publisher: 'George Markus',
    assigned: '20.03.2024',
    returned: 'In work',
  },
];

const columns3: Column[] = [
  { id: 'address', label: 'Address' },
  { id: 'name', label: 'Name' },
  { id: 'date', label: 'Date' },
];

const rows3 = [
  {
    address: 'Florianweg Str. 25',
    name: 'Family Williamson',
    date: '19.02.2021',
  },
  {
    address: 'New World Str. 9a',
    name: 'Sandero Schneidertson',
    date: '23.12.2020',
  },
];

const rows4 = [
  { id: 'M1', name: 'Marktstraße, Gartenstraße', covered: '23.12.2020', households: 163 },
  { id: 'M2', name: 'Allerton Bridge', covered: '02.03.2019', households: 121 },
  { id: 'M3', name: 'Allerton Bridge', covered: '02.03.2019', households: 121 },
  { id: 'M4', name: 'Allerton Bridge', covered: '02.03.2019', households: 121 },
  { id: 'M5', name: 'Allerton Bridge', covered: '02.03.2019', households: 121 },
  { id: 'M6', name: 'Allerton Bridge', covered: '02.03.2019', households: 121 },
  { id: 'M7', name: 'Allerton Bridge', covered: '02.03.2019', households: 121 },
  { id: 'M8', name: 'Allerton Bridge', covered: '02.03.2019', households: 121 },
];

const TestTable_1 = () => {
  const { order, orderBy, handleRequestSort, visibleRows } = useSorting({
    initialOrder: 'asc',
    initialOrderBy: 'id',
    rows: rows,
  });

  return (
    <TableContainer sx={{ maxHeight: 440 }}>
      <StyledTable>
        <TableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} columns={columns} />
        <TableBody>
          {visibleRows.map((row) => {
            return (
              <StyledRow key={row.id}>
                <StyledCell className={'body-small-semibold'} width={50}>
                  {row.id}
                </StyledCell>
                <StyledCell className={'body-small-semibold'}>{row.name}</StyledCell>
                <StyledCell width={100}>{row.covered}</StyledCell>
                <StyledCell align={'center'} width={150}>
                  {row.households}
                </StyledCell>
              </StyledRow>
            );
          })}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
};

const TestTable_3 = () => {
  const { order, orderBy, handleRequestSort, visibleRows } = useSorting({
    initialOrder: 'asc',
    initialOrderBy: 'date',
    rows: rows3,
  });

  return (
    <TableContainer sx={{ maxHeight: 440 }}>
      <StyledTable>
        <TableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} columns={columns3} />
        <TableBody>
          {visibleRows.map((row) => {
            return (
              <StyledRow key={row.id}>
                <StyledCell className={'body-small-semibold'}>{row.address}</StyledCell>
                <StyledCell width={300}>{row.name}</StyledCell>
                <StyledCell width={200}>{row.date}</StyledCell>
              </StyledRow>
            );
          })}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
};

const TestTable_2 = () => {
  const { order, orderBy, handleRequestSort, visibleRows } = useSorting({
    initialOrder: 'asc',
    initialOrderBy: 'id',
    rows: rows2,
  });

  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() - 2);

  return (
    <TableContainer sx={{ maxHeight: 440 }}>
      <StyledTable>
        <TableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} columns={columns2} />
        <TableBody>
          {visibleRows.map((row) => {
            return (
              <StyledRow key={row.id}>
                <StyledCell className={'body-small-semibold'} width={50}>
                  {row.id}
                </StyledCell>
                <StyledCell className={'body-small-semibold'}>
                  <Stack direction={'column'} spacing={0.3}>
                    <Typography className={'body-small-semibold'}>{row.name}</Typography>
                    <Stack direction={'row'} spacing={1.3}>
                      <Badge
                        sx={{ width: 'max-content' }}
                        text={row.publisher as string}
                        color={row.returned === 'In work' ? 'accent' : 'grey'}
                        size="small"
                        filled={false}
                      />
                      {currentDate >
                      new Date(Date.parse(row.assigned.toString().replace(/(\d{2}).(\d{2}).(\d{4})/, '$3-$2-$1'))) ? (
                        <Badge
                          sx={{ width: 'max-content' }}
                          text={'Overdue: 2 month'}
                          color={'orange'}
                          size="small"
                          filled={false}
                        />
                      ) : null}
                    </Stack>
                    <Typography className={'label-small-regular'} color={'var(--grey-350)'}>
                      {row.desc}
                    </Typography>
                  </Stack>
                </StyledCell>
                <StyledCell width={150}>{row.assigned}</StyledCell>
                <StyledCell
                  width={150}
                  className={row.returned === 'In work' && 'body-small-semibold'}
                  sx={{ color: row.returned === 'In work' ? 'var(--accent-dark)' : 'var(--black)' }}
                >
                  {row.returned}
                </StyledCell>
              </StyledRow>
            );
          })}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
};

const TestTable_4 = () => {
  const { order, orderBy, handleRequestSort, visibleRows } = useSorting({
    initialOrder: 'asc',
    initialOrderBy: 'id',
    rows: rows4,
  });

  return (
    <TableContainer sx={{ maxHeight: 300 }}>
      <StyledTable>
        <TableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} columns={columns4} />
        <TableBody>
          {visibleRows.map((row) => {
            return (
              <StyledRow key={row.id}>
                <StyledCell width={50} className={'body-small-semibold'}>
                  {row.id}
                </StyledCell>
                <StyledCell className={'body-small-semibold'}>{row.name}</StyledCell>
                <StyledCell width={150}>{row.covered}</StyledCell>
                <StyledCell width={100} align={'center'}>
                  {row.households}
                </StyledCell>
                <StyledCell width={100} align={'center'}>
                  <Button
                    variant="secondary"
                    startIcon={<IconAssign />}
                    sx={{ minHeight: '32px', height: '32px', textTransform: 'inherit !important' }}
                  >
                    Request
                  </Button>
                </StyledCell>
              </StyledRow>
            );
          })}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
};

const CPETable = () => {
  return (
    <Stack spacing={4} mb={5}>
      <TestTable_1 />
      <TestTable_2 />
      <TestTable_3 />
      <TestTable_4 />
    </Stack>
  );
};

export default CPETable;
