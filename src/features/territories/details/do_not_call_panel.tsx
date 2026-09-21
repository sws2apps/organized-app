import { useState } from 'react';
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { Button, InfoNote, TextField, Typography } from '@components/index';
import TableHead from '@components/table/TableHead';
import { IconAdd, IconDelete, IconEdit } from '@icons/index';
import RowAction from '../components/row_action';
import { useBreakpoints } from '@hooks/index';
import { DoNotCall, Territory } from '@definition/territory';

const today = () =>
  new Date().toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const DoNotCallPanel = ({
  territory,
  onChange,
}: {
  territory: Territory;
  onChange: (entries: DoNotCall[]) => void;
}) => {
  const { tablet600Up } = useBreakpoints();

  const [editing, setEditing] = useState<string | undefined>();
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');

  const entries = territory.doNotCalls;

  const startAdd = () => {
    setEditing('new');
    setAddress('');
    setName('');
  };

  const startEdit = (entry: DoNotCall) => {
    setEditing(entry.id);
    setAddress(entry.address);
    setName(entry.name ?? '');
  };

  const handleSave = () => {
    if (!address.trim().length) {
      setEditing(undefined);
      return;
    }

    if (editing === 'new') {
      onChange([
        ...entries,
        {
          id: `dnc-${Date.now()}`,
          address: address.trim(),
          name: name.trim() || undefined,
          date: today(),
          addedBy: 'You',
          reviewNeeded: false,
        },
      ]);
    } else {
      onChange(
        entries.map((entry) =>
          entry.id === editing
            ? {
                ...entry,
                address: address.trim(),
                name: name.trim() || undefined,
              }
            : entry
        )
      );
    }

    setEditing(undefined);
  };

  const columns = [
    { id: 'address', label: 'Address', sx: { minWidth: '180px' } },
    { id: 'name', label: 'Name', sx: { minWidth: '140px' } },
    { id: 'date', label: 'Date', sx: { width: '110px' } },
    { id: 'actions', label: '', sx: { width: '92px' } },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {entries.length === 0 && (
        <InfoNote message="No do not call addresses in this territory yet." />
      )}

      {entries.length > 0 && (
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table
            size="small"
            sx={{
              tableLayout: 'fixed',
              minWidth: '560px',
              '& .MuiTableCell-root': {
                padding: '10px 8px',
                borderColor: 'var(--accent-200)',
              },
              '& .MuiTableHead-root .MuiTableCell-root': {
                backgroundColor: 'transparent',
              },
              '& .MuiTableBody-root .MuiTableRow-root:last-of-type .MuiTableCell-root':
                {
                  borderBottom: 'none',
                },
            }}
          >
            <TableHead
              order="asc"
              orderBy="date"
              onRequestSort={() => undefined}
              columns={columns}
            />

            <TableBody>
              {entries.map((entry) => (
                <TableRow
                  key={entry.id}
                  sx={{
                    transition: 'background-color 0.15s ease',
                    '&:hover': { backgroundColor: 'var(--accent-100)' },
                  }}
                >
                  <TableCell>
                    <Typography
                      className="body-regular"
                      color="var(--black)"
                      noWrap
                    >
                      {entry.address}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      className="body-small-regular"
                      color="var(--grey-400)"
                      noWrap
                    >
                      {entry.name ?? '–'}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      className="body-small-regular"
                      color="var(--grey-400)"
                      noWrap
                    >
                      {entry.date}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Stack
                      direction="row"
                      spacing="2px"
                      sx={{ justifyContent: 'flex-end' }}
                    >
                      <RowAction title="Edit" onClick={() => startEdit(entry)}>
                        <IconEdit
                          color="var(--accent-main)"
                          width={18}
                          height={18}
                        />
                      </RowAction>

                      <RowAction
                        title="Delete"
                        color="error"
                        onClick={() =>
                          onChange(
                            entries.filter((item) => item.id !== entry.id)
                          )
                        }
                      >
                        <IconDelete
                          color="var(--red-main)"
                          width={18}
                          height={18}
                        />
                      </RowAction>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {editing && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            padding: '16px',
            borderRadius: 'var(--radius-l)',
            backgroundColor: 'var(--accent-100)',
            border: '1px solid var(--accent-200)',
          }}
        >
          <Stack
            direction={tablet600Up ? 'row' : 'column'}
            spacing="16px"
            sx={{ width: '100%', alignItems: 'center' }}
          >
            <TextField
              label="Address"
              placeholder={`Address in territory ${territory.number}`}
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />

            <TextField
              label="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />

            <Box sx={{ flexShrink: 0, width: tablet600Up ? 'auto' : '100%' }}>
              <Button
                variant="small"
                disableAutoStretch
                onClick={handleSave as never}
                sx={{ minHeight: '32px', minWidth: 'unset' }}
              >
                Save
              </Button>
            </Box>
          </Stack>
        </Box>
      )}

      <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
        <Button
          variant="small"
          disableAutoStretch
          startIcon={<IconAdd color="var(--accent-main)" />}
          onClick={
            (() => (editing ? setEditing(undefined) : startAdd())) as never
          }
          sx={{ minHeight: '32px', minWidth: 'unset' }}
        >
          {editing ? 'Cancel' : 'Add'}
        </Button>
      </Stack>
    </Box>
  );
};

export default DoNotCallPanel;
