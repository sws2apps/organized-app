import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { grey } from '@mui/material/colors';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Persons } from '../../classes/Persons';

const sharedStyles = {
  tblContainer: {
    maxHeight: '300px',
    marginBottom: '5px',
  },
  tblData: {
    padding: '6px 3px 6px 3px',
  },
  tableHeader: {
    marginTop: '20px',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: grey[200],
    borderRadius: '3px',
    padding: '3px',
    color: 'black',
  },
  tableLoader: {
    display: 'flex',
    margin: '10px auto',
  },
};

const PersonAssignmentHistory = ({ assInfo }) => {
  const { t } = useTranslation('ui');

  const [assID, setAssID] = useState('');
  const [assTypeName, setAssTypeName] = useState('');
  const [currentStudent, setCurrentStudent] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedStuID, setSelectedStuID] = useState('');
  const [stuForAssistant, setStuForAssistant] = useState('');
  const [assTypeNameForAssistant, setAssTypeNameForAssistant] = useState('');
  const [stuHistory, setStuHistory] = useState([]);
  const [assistantHistory, setAssistantHistory] = useState([]);
  const [isLoadingStuHistory, setIsLoadingStuHistory] = useState(true);
  const [isLoadingAssistantHistory, setIsLoadingAssistantHistory] = useState(true);

  useEffect(() => {
    setAssID(assInfo.assID);
    setCurrentStudent(Persons.get(assInfo.currentStudent)?.person_name || '');
    setAssTypeName(assInfo.assTypeName);
    if (assInfo.stuForAssistant !== undefined) {
      setStuForAssistant(assInfo.stuForAssistant);
    }
    if (assInfo.assTypeNameForAssistant !== undefined) {
      setAssTypeNameForAssistant(assInfo.assTypeNameForAssistant);
    }
  }, [assInfo]);

  useEffect(() => {
    if (selectedStuID !== '') {
      setIsLoadingStuHistory(true);
      const person = Persons.get(selectedStuID);
      setStuHistory(person.historyAssignments());
      setIsLoadingStuHistory(false);
    }
  }, [selectedStuID]);

  useEffect(() => {
    if (stuForAssistant !== '') {
      setIsLoadingAssistantHistory(true);
      const person = Persons.get(stuForAssistant);
      if (person) {
        const assistants = person.assistantHistory();
        setAssistantHistory(assistants);
      }

      setIsLoadingAssistantHistory(false);
    }
  }, [stuForAssistant]);

  useEffect(() => {
    setSelectedStudent('');
    if (assInfo.currentStudent !== '') {
      const tempStu = assInfo.currentStudent;
      setSelectedStuID(tempStu);

      const found = Persons.get(tempStu);
      setSelectedStudent(found?.person_displayName || '');
    }
  }, [assInfo]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography
            variant="body1"
            color="primary"
            sx={{
              fontWeight: 'bold',
            }}
          >
            {assTypeName}
            {assID === 3 ||
            assID === 5 ||
            assID === 7 ||
            assID === 9 ||
            assID === 11 ||
            assID === 13 ||
            assID === 15 ||
            assID === 17
              ? ` - ${assTypeNameForAssistant}`
              : ''}
          </Typography>
          <Typography variant="body2">{currentStudent}</Typography>
          {(assID === 3 ||
            assID === 5 ||
            assID === 7 ||
            assID === 9 ||
            assID === 11 ||
            assID === 13 ||
            assID === 15 ||
            assID === 17) && (
            <Typography variant="body2">
              {t('student')}: {Persons.get(stuForAssistant)?.person_name || ''}
            </Typography>
          )}
        </Box>
      </Box>

      {selectedStudent !== '' && selectedStuID !== '' && (
        <>
          <Typography variant="body2" sx={sharedStyles.tableHeader}>
            {t('studentHistory', { currentStudent: selectedStudent })}
          </Typography>
          {isLoadingStuHistory && (
            <CircularProgress color="secondary" size={30} disableShrink={true} sx={sharedStyles.tableLoader} />
          )}
          {!isLoadingStuHistory && (
            <>
              <TableContainer sx={sharedStyles.tblContainer}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        style={{ width: '60px' }}
                        align="center"
                        sx={{
                          '& .MuiTableCell-sizeSmall': sharedStyles.tblData,
                        }}
                      >
                        {t('date')}
                      </TableCell>
                      <TableCell
                        style={{ width: '250px' }}
                        sx={{
                          '& .MuiTableCell-sizeSmall': sharedStyles.tblData,
                        }}
                      >
                        {t('assignment')}
                      </TableCell>
                      <TableCell
                        style={{ width: '20px' }}
                        align="center"
                        sx={{
                          '& .MuiTableCell-sizeSmall': sharedStyles.tblData,
                        }}
                      >
                        {t('class')}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stuHistory.map((history) => (
                      <TableRow key={history.ID} hover role="checkbox" tabIndex={-1}>
                        <TableCell
                          align="center"
                          sx={{
                            '& .MuiTableCell-sizeSmall': sharedStyles.tblData,
                          }}
                        >
                          {history.weekOfFormatted}
                        </TableCell>
                        <TableCell
                          sx={{
                            '& .MuiTableCell-sizeSmall': sharedStyles.tblData,
                          }}
                        >
                          {history.assignmentName}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            '& .MuiTableCell-sizeSmall': sharedStyles.tblData,
                          }}
                        >
                          {history.class}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </>
      )}
      {(assID === 3 ||
        assID === 5 ||
        assID === 7 ||
        assID === 9 ||
        assID === 11 ||
        assID === 13 ||
        assID === 15 ||
        assID === 17) && (
        <>
          {stuForAssistant !== '' && (
            <>
              <Typography variant="body2" sx={sharedStyles.tableHeader}>
                {t('assistantHistory', {
                  currentStudent: Persons.get(stuForAssistant)?.person_displayName || '',
                })}
              </Typography>
              {isLoadingAssistantHistory && (
                <CircularProgress color="secondary" size={30} disableShrink={true} sx={sharedStyles.tableLoader} />
              )}
              {!isLoadingAssistantHistory && (
                <TableContainer sx={sharedStyles.tblContainer}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ width: '60px' }} align="center">
                          {t('date')}
                        </TableCell>
                        <TableCell
                          style={{ width: '250px' }}
                          sx={{
                            '& .MuiTableCell-sizeSmall': sharedStyles.tblData,
                          }}
                        >
                          {t('name')}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {assistantHistory.map((history) => (
                        <TableRow key={history.ID} hover role="checkbox" tabIndex={-1}>
                          <TableCell
                            align="center"
                            sx={{
                              '& .MuiTableCell-sizeSmall': sharedStyles.tblData,
                            }}
                          >
                            {history.weekOfFormatted}
                          </TableCell>
                          <TableCell
                            sx={{
                              '& .MuiTableCell-sizeSmall': sharedStyles.tblData,
                            }}
                          >
                            {history.assistantName}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default PersonAssignmentHistory;
