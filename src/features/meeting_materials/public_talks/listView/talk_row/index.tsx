import {
  Box,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import { IconCollapse, IconExpand } from '@components/icons';
import { TalkRowType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import { formatDate } from '@utils/date';
import useTalkRow from './useTalkRow';
import Typography from '@components/typography';

const TalkRow = ({ talk, isExpandAll }: TalkRowType) => {
  const { t } = useAppTranslation();

  const {
    collapseOpen,
    handleToggleCollapse,
    handleHistoryFocused,
    handleHistoryUnfocused,
    isHistoryFocused,
  } = useTalkRow(isExpandAll);

  return (
    <>
      <TableRow
        className="talk-list-item"
        onClick={talk.history.length > 0 ? () => handleToggleCollapse() : null}
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
        <TableCell
          component="th"
          scope="row"
          sx={{ width: '30px', minWidth: '30px' }}
        >
          <Typography className="h4">{talk.talk_number}</Typography>
        </TableCell>
        <TableCell sx={{ minWidth: '138px' }}>
          <Typography className="h4">{talk.talk_title}</Typography>
        </TableCell>
        <TableCell sx={{ width: '50px', minWidth: '50px' }}>
          <Typography className="body-small-regular">
            {talk.last_date.length > 0 &&
              formatDate(new Date(talk.last_date), t('tr_shortDateFormatAlt'))}
          </Typography>
        </TableCell>
        <TableCell sx={{ width: '205px', minWidth: '205px' }}>
          <Typography className="body-small-regular">
            {talk.last_speaker}
          </Typography>
        </TableCell>
        <TableCell sx={{ width: '25px', minWidth: '25px' }}>
          {talk.history.slice(1).length > 0 && (
            <Box
              className="row-btn"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {!collapseOpen && <IconExpand color="var(--black)" />}
              {collapseOpen && <IconCollapse color="var(--black)" />}
            </Box>
          )}
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
        <TableCell style={{ padding: 0 }} colSpan={5}>
          <Collapse
            in={talk.history.slice(1).length > 0 && collapseOpen}
            timeout="auto"
            unmountOnExit
          >
            <Table
              size="small"
              sx={{
                marginBottom: '16px',
                '& .MuiTableCell-root': {
                  boxSizing: 'content-box',
                },
                '& .MuiTableRow-root > .MuiTableCell-root': {
                  border: 'none',
                },
              }}
            >
              <TableBody>
                {talk.history.slice(1).map((history) => (
                  <TableRow
                    key={history.date}
                    sx={{
                      minHeight: 'fit-content',
                      '& .MuiTypography-root': {
                        color: 'var(--grey-350)',
                      },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        minWidth: '46px',
                        width: '46px',
                        padding: '0 !important',
                      }}
                    />
                    <TableCell
                      sx={{ minWidth: '138px', padding: '0 !important' }}
                    />
                    <TableCell
                      sx={{
                        width: '58px',
                        minWidth: '58px',
                        padding: '0 8px !important',
                      }}
                    >
                      <Typography className="body-small-regular">
                        {formatDate(
                          new Date(history.date),
                          t('tr_shortDateFormatAlt')
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        width: '206px',
                        minWidth: '206px',
                        padding: '0 8px !important',
                      }}
                    >
                      <Typography className="body-small-regular">
                        {history.person}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        width: '41px',
                        minWidth: '41px',
                        padding: '0 !important',
                      }}
                    />
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
