import { useTranslation } from 'react-i18next';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Schedules } from '../../classes/Schedules';

const PublicTalkHistory = ({ talk_number }) => {
  const { t } = useTranslation('ui');

  const history = Schedules.talkHistory.find((record) => record.talk_number === talk_number);

  const getSpeaker = (record) => {
    let speaker = record.speaker_1_dispName;
    if (record.speaker_2_dispName !== '') speaker += ` / ${record.speaker_2_dispName}`;

    return speaker;
  };

  return (
    <>
      {history && history.history.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ maxWidth: '320px', margin: '10px' }} aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ width: '100px' }}>
                  {t('week')}
                </TableCell>
                <TableCell sx={{ width: '220px' }}>{t('speaker')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.history.map((assignment) => (
                <TableRow key={assignment.weekOf} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row" align="center">
                    {assignment.weekOfFormatted}
                  </TableCell>
                  <TableCell>{getSpeaker(assignment)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default PublicTalkHistory;
