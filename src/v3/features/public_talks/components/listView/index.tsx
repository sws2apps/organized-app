import { Table, TableBody, TableContainer } from '@mui/material';
import useListView from './useListView';
import TalkRow from './TalkRow';
import TableHead from '@components/table/TableHead';

type TalksListViewType = {
  isExpandAll: boolean;
};

const TalksListView = ({ isExpandAll }: TalksListViewType) => {
  const { talksList, handleRequestSort, order, orderBy, tableColumns } = useListView();

  return (
    <TableContainer>
      <Table
        stickyHeader
        size="small"
        sx={{
          '& .MuiTableHead-root .MuiTableCell-root': {
            backgroundColor: 'var(--white)',
          },
          '& .MuiTableCell-root': {
            padding: '8px',
            boxSizing: 'content-box',
          },
        }}
      >
        <TableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} columns={tableColumns} />
        <TableBody
          sx={{
            '& .MuiTableRow-root:last-child > .MuiTableCell-root': {
              borderBottom: 'none',
            },
          }}
        >
          {talksList.map((talk) => (
            <TalkRow key={talk.talk_number} talk={talk} isExpandAll={isExpandAll} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TalksListView;
