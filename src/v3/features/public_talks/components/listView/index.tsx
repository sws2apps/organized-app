import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import useListView from './useListView';
import TalkRow from './TalkRow';

type TalksListViewType = {
  isExpandAll: boolean;
  txtSearch: string;
};

const TalksListView = ({ isExpandAll, txtSearch }: TalksListViewType) => {
  const { t } = useAppTranslation();

  const { talksList } = useListView(txtSearch);

  return (
    <>
      <TableContainer>
        <Table
          size="small"
          sx={{
            '& .MuiTableCell-root': {
              padding: '8px',
              boxSizing: 'content-box',
            },
          }}
        >
          <TableHead sx={{ height: '38px' }}>
            <TableRow
              sx={{
                '& .MuiTypography-root': {
                  color: 'var(--grey-350)',
                },
              }}
            >
              <TableCell align="left" sx={{ width: '30px' }}>
                <Typography className="body-small-regular">{t('tr_shortNumberLabel')}</Typography>
              </TableCell>
              <TableCell align="left" sx={{ minWidth: '120px' }}>
                <Typography className="body-small-regular">{t('tr_title')}</Typography>
              </TableCell>
              <TableCell align="left" sx={{ width: '60px' }}>
                <Typography className="body-small-regular">{t('tr_date')}</Typography>
              </TableCell>
              <TableCell align="left" sx={{ width: '188px' }}>
                <Typography className="body-small-regular">{t('tr_speaker')}</Typography>
              </TableCell>
              <TableCell sx={{ width: '24px' }} />
            </TableRow>
          </TableHead>
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
    </>
  );
};

export default TalksListView;
