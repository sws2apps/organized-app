import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { TalksTableViewType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useTableView from './useTableView';
import TalkRow from './talk_row';
import Typography from '@components/typography';

const TalksTableView = (props: TalksTableViewType) => {
  const { t } = useAppTranslation();

  const { talksList, yearslist } = useTableView(props);

  return (
    <TableContainer>
      <Table
        stickyHeader
        size="small"
        sx={{
          '& .MuiTableCell-root': {
            padding: '8px',
            boxSizing: 'content-box',
          },
          '& .MuiTableHead-root .MuiTableCell-root:first-of-type': {
            zIndex: 5,
          },
          '& .MuiTableHead-root .MuiTableCell-root:nth-of-type(2)': {
            zIndex: 5,
          },
          '& .MuiTableCell-root:first-of-type': {
            width: '30px',
            position: 'sticky',
            top: 0,
            left: 0,
            backgroundColor: 'var(--white)',
          },
          '& .MuiTableCell-root:nth-of-type(2)': {
            position: 'sticky',
            top: 0,
            left: 41,
            minWidth: '120px',
            backgroundColor: 'var(--white)',
          },
        }}
      >
        <TableHead
          sx={{
            zIndex: 60,
            '& .MuiTableRow-root > .MuiTableCell-root': {
              borderBottom: '1px solid var(--accent-200)',
            },
          }}
        >
          <TableRow sx={{ backgroundColor: 'var(--white)' }}>
            <TableCell>
              <Typography
                className={'body-small-regular'}
                color={'var(--grey-350)'}
              >
                {t('tr_shortNumberLabel')}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                className={'body-small-regular'}
                color={'var(--grey-350)'}
              >
                {t('tr_title')}
              </Typography>
            </TableCell>
            {yearslist.map((year) => (
              <TableCell
                key={year}
                align="center"
                sx={{
                  minWidth: '120px',
                  padding: '8px 0 !important',
                  backgroundColor: 'var(--white)',
                }}
              >
                <Typography
                  className={'h4'}
                  color={'var(--grey-350)'}
                  sx={{
                    padding: '4px',
                    ':hover': {
                      backgroundColor: 'var(--accent-150)',
                      borderRadius: 'var(--radius-s)',
                      color: 'var(--accent-dark)',
                    },
                  }}
                >
                  {year}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody
          sx={{
            '& .MuiTableRow-root > .MuiTableCell-root': {
              borderBottom: '1px solid var(--accent-200)',
            },
            '& .MuiTableRow-root:last-child > .MuiTableCell-root': {
              borderBottom: 'none',
            },
          }}
        >
          {talksList.map((talk) => (
            <TalkRow key={talk.talk_number} talk={talk} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TalksTableView;
