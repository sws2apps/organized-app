import { Box, Collapse, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { IconCollapse, IconExpand } from '@components/icons';
import Typography from '@components/typography';
import useTalkRow from './useTalkRow';
import { TalkRowType } from './index.types';

const TalkRow = ({ talk, isExpandAll }: TalkRowType) => {
  const { collapseOpen, handleToggleCollapse, handleHistoryFocused, handleHistoryUnfocused, isHistoryFocused } =
    useTalkRow(isExpandAll);

  return (
    <>
      <TableRow
        className="talk-list-item"
        onClick={handleToggleCollapse}
        sx={{
          cursor: 'pointer',
          height: '48px',
          '& > .MuiTableCell-root': {
            borderBottomStyle: 'none',
          },
          backgroundColor: isHistoryFocused ? 'var(--accent-150)' : 'initial',
          '& .MuiTypography-root': {
            color: isHistoryFocused ? 'var(--accent-dark)' : 'var(--black)',
          },
          '& .row-btn, & .row-btn g, & .row-btn path': {
            fill: isHistoryFocused ? 'var(--accent-dark)' : 'var(--grey-300)',
          },
          '&:hover': {
            backgroundColor: 'var(--accent-150)',
            '& .MuiTypography-root': {
              color: 'var(--accent-dark)',
            },
            '& .row-btn, & .row-btn g, & .row-btn path': {
              fill: 'var(--accent-dark)',
            },
            '& + .talk-history': {
              backgroundColor: 'var(--accent-150)',
            },
          },
        }}
      >
        <TableCell component="th" scope="row">
          <Typography className="h4">{talk.talk_number}</Typography>
        </TableCell>
        <TableCell>
          <Typography className="h4" sx={{ minWidth: '138px' }}>
            {talk.talk_title}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography className="body-small-regular">01/01/24</Typography>
        </TableCell>
        <TableCell>
          <Typography className="body-small-regular" sx={{ flexGrow: 1 }}>
            B. Jason
          </Typography>
        </TableCell>
        <TableCell>
          <Box className="row-btn" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {!collapseOpen && <IconExpand color="var(--black)" />}
            {collapseOpen && <IconCollapse color="var(--black)" />}
          </Box>
        </TableCell>
      </TableRow>
      <TableRow
        className="talk-history"
        onClick={handleToggleCollapse}
        sx={{
          marginTop: '-5px',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'var(--accent-150)',
          },
        }}
        onMouseEnter={handleHistoryFocused}
        onMouseLeave={handleHistoryUnfocused}
      >
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
            <Table
              size="small"
              sx={{
                marginBottom: '16px',
                '& .MuiTableCell-root': {
                  padding: 0,
                  boxSizing: 'content-box',
                },
                '& .MuiTableRow-root > .MuiTableCell-root': {
                  border: 'none',
                },
              }}
            >
              <TableBody>
                {[
                  { date: '12/08/22', name: 'F. Miles' },
                  { date: '06/08/20', name: 'J. Brendon' },
                ].map((history) => (
                  <TableRow
                    key={history.date}
                    sx={{
                      minHeight: 'fit-content',
                      '& .MuiTypography-root': {
                        color: 'var(--grey-350)',
                      },
                    }}
                  >
                    <TableCell sx={{ minWidth: '195px', flexGrow: 1 }} align="left" />
                    <TableCell align="left" sx={{ width: '78px' }}>
                      <Typography className="body-small-regular">{history.date}</Typography>
                    </TableCell>
                    <TableCell align="left" sx={{ width: '210px' }}>
                      <Typography className="body-small-regular">{history.name}</Typography>
                    </TableCell>
                    <TableCell sx={{ width: '16px' }} />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default TalkRow;
