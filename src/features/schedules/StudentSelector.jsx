import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';
import { formatDateForCompare } from '../../utils/app';
import maleIcon from '../../img/student_male.svg';
import femaleIcon from '../../img/student_female.svg';
import { Persons } from '../../classes/Persons';
import { Schedules } from '../../classes/Schedules';
import SearchBar from '../../components/SearchBar';

const sharedStyles = {
  tblContainer: {
    maxHeight: '170px',
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

const StudentSelector = (props) => {
  const { t } = useTranslation('ui');

  const { assInfo, currentWeek } = props;

  const [assID, setAssID] = useState('');
  const [assType, setAssType] = useState('');
  const [assTypeName, setAssTypeName] = useState('');
  const [currentStudent, setCurrentStudent] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedStuID, setSelectedStuID] = useState('');
  const [stuForAssistant, setStuForAssistant] = useState('');
  const [assTypeNameForAssistant, setAssTypeNameForAssistant] = useState('');
  const [pickStudents, setPickStudents] = useState([]);
  const [stuHistory, setStuHistory] = useState([]);
  const [assistantHistory, setAssistantHistory] = useState([]);
  const [assHistory, setAssHistory] = useState([]);
  const [isLoadingStudent, setIsLoadingStudent] = useState(false);
  const [isLoadingStuHistory, setIsLoadingStuHistory] = useState(true);
  const [isLoadingAssistantHistory, setIsLoadingAssistantHistory] = useState(true);
  const [isLoadingAssHistory, setIsLoadingAssHistory] = useState(true);
  const [txtSearch, setTxtSearch] = useState('');
  const [gender, setGender] = useState('male');

  const handleSelectStudent = (student) => {
    setSelectedStudent(student.person_displayName);
    setSelectedStuID(student.person_uid);
  };

  const handleAssignStudent = () => {
    const obj = {};
    obj.assID = assID;
    obj.assType = assType;
    obj.studentId = selectedStuID;
    obj.studentName = selectedStudent;
    props.setSelectedStudent(obj);
    props.setIsAssign(false);
  };

  const handleDelete = () => {
    props.deleteStudent(assID);
    props.setIsAssign(false);
  };

  const handleSearchChange = (value) => {
    setTxtSearch(value);
  };

  useEffect(() => {
    if (assInfo.isAssign) {
      setAssID(assInfo.assID);
      setAssType(assInfo.assType);
      setCurrentStudent(assInfo.currentStudent);
      setAssTypeName(assInfo.assTypeName);
      if (assInfo.stuForAssistant !== undefined) {
        setStuForAssistant(assInfo.stuForAssistant);
      }
      if (assInfo.assTypeNameForAssistant !== undefined) {
        setAssTypeNameForAssistant(assInfo.assTypeNameForAssistant);
      }
      setIsLoadingStudent(true);
    }
  }, [assInfo]);

  useEffect(() => {
    if (isLoadingStudent) {
      let students = [];
      if (
        assID === 3 ||
        assID === 5 ||
        assID === 7 ||
        assID === 9 ||
        assID === 11 ||
        assID === 13 ||
        assID === 15 ||
        assID === 17
      ) {
        students = Persons.getByAssignment('isAssistant', stuForAssistant, undefined, txtSearch);
      } else {
        students = Persons.getByAssignment(assType, undefined, gender, txtSearch);
      }

      // remove unavailable students based on time away
      let available = [];
      for (const student of students) {
        if (student.timeAway.length === 0) {
          available.push(student);
        } else {
          const timeAways = student.timeAway;

          for (const timeAway of timeAways) {
            if (timeAway.endDate === null) {
              const dateA = formatDateForCompare(currentWeek);
              const dateB = formatDateForCompare(timeAway.startDate);
              if (dateA < dateB) {
                available.push(student);
                break;
              }
            } else {
              const dateA = formatDateForCompare(currentWeek);
              const dateB = formatDateForCompare(timeAway.startDate);
              const dateC = formatDateForCompare(timeAway.endDate);

              if (dateA < dateB || (dateA > dateC)) {
                available.push(student);
                break;
              }
            }
          }
        }
      }

      setPickStudents(available);
      setIsLoadingStudent(false);

      let filteredHistory = [];
      if (
        assID === 3 ||
        assID === 5 ||
        assID === 7 ||
        assID === 9 ||
        assID === 11 ||
        assID === 13 ||
        assID === 15 ||
        assID === 17
      ) {
        filteredHistory = Schedules.history.filter((item) => item.assignmentID === 109);
      } else {
        filteredHistory = Schedules.history.filter((item) => item.assignmentID === assType);
      }
      setAssHistory(filteredHistory);
      setIsLoadingAssHistory(false);
    }
  }, [currentWeek, isLoadingStudent, assID, assType, stuForAssistant, gender, txtSearch]);

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
      const person = Persons.getByDisplayName(stuForAssistant);
      const assistants = person?.assistantHistory();
      setAssistantHistory(assistants);
      setIsLoadingAssistantHistory(false);
    }
  }, [stuForAssistant]);

  useEffect(() => {
    setSelectedStudent('');
    if (props.assInfo.currentStudent !== '') {
      const tempStu = props.assInfo.currentStudent;
      setSelectedStudent(tempStu);

      const found = Persons.getByDisplayName(tempStu);
      setSelectedStuID(found?.person_uid || '');
    }
  }, [props.assInfo]);

  useEffect(() => {
    setIsLoadingStudent(true);
  }, [gender]);

  useEffect(() => {
    let fetchTimer;

    fetchTimer = setTimeout(() => {
      setIsLoadingStudent(true);
    }, 500);

    return () => {
      if (fetchTimer) clearTimeout(fetchTimer);
    };
  }, [txtSearch]);

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
            <>
              <Typography
                variant="body2"
                sx={{
                  marginTop: '5px',
                  fontWeight: 'bold',
                }}
              >
                {assTypeNameForAssistant}
              </Typography>
              <Typography variant="body2">
                {t('student')}: {stuForAssistant}
              </Typography>
            </>
          )}
        </Box>
        {currentStudent && currentStudent !== '' && (
          <IconButton color="error" edge="start" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
      <Typography variant="body2" sx={sharedStyles.tableHeader}>
        {t('availableStudents')}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
        {props.filterEnabled && (
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="male"
            name="radio-buttons-group"
            sx={{ flexDirection: 'row', marginLeft: '15px' }}
            onChange={(e) => setGender(e.target.value)}
            value={gender}
          >
            <FormControlLabel value="male" control={<Radio />} label={t('male')} />
            <FormControlLabel value="female" control={<Radio />} label={t('female')} />
          </RadioGroup>
        )}

        <SearchBar minWidth={'20px'} txtSearch={txtSearch} onChange={handleSearchChange} noSpace />
      </Box>

      {isLoadingStudent && (
        <CircularProgress color="secondary" size={30} disableShrink={true} sx={sharedStyles.tableLoader} />
      )}
      {!isLoadingStudent && (
        <TableContainer sx={sharedStyles.tblContainer}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: '200px' }} sx={sharedStyles.tblData}>
                  {t('name')}
                </TableCell>
                <TableCell align="center" style={{ width: '150px' }} sx={sharedStyles.tblData}>
                  {t('lastAssignment')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pickStudents.map((student) => (
                <TableRow key={student.person_uid} hover role="checkbox" tabIndex={-1}>
                  <TableCell
                    onClick={(e) => handleSelectStudent(student)}
                    sx={{
                      '& .MuiTableCell-sizeSmall': sharedStyles.tblData,
                      cursor: 'pointer',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Avatar
                        sx={{
                          height: '25px',
                          width: '25px',
                        }}
                        alt="Student icon"
                        src={student.isMale ? maleIcon : femaleIcon}
                      />
                      <Typography>{student.person_displayName}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      '& .MuiTableCell-sizeSmall': sharedStyles.tblData,
                    }}
                  >
                    {student.lastAssignmentFormat}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
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
              {currentStudent !== selectedStudent && (
                <Button
                  variant="contained"
                  startIcon={<AccountCircleIcon />}
                  onClick={() => handleAssignStudent()}
                  color="success"
                >
                  {t('assign')}
                </Button>
              )}
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
                  currentStudent: stuForAssistant,
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
      <Typography variant="body2" sx={sharedStyles.tableHeader}>
        {t('assignmentHistory')}
      </Typography>
      {isLoadingAssHistory && (
        <CircularProgress color="secondary" size={30} disableShrink={true} sx={sharedStyles.tableLoader} />
      )}
      {!isLoadingAssHistory && (
        <TableContainer sx={sharedStyles.tblContainer}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: '60px' }} align="center">
                  {t('date')}
                </TableCell>
                <TableCell style={{ width: '250px' }} sx={{ '& .MuiTableCell-sizeSmall': sharedStyles.tblData }}>
                  {t('name')}
                </TableCell>
                <TableCell
                  style={{ width: '20px' }}
                  align="center"
                  sx={{ '& .MuiTableCell-sizeSmall': sharedStyles.tblData }}
                >
                  {t('class')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assHistory.map((history) => (
                <TableRow key={history.ID} hover role="checkbox" tabIndex={-1}>
                  <TableCell align="center" sx={{ '& .MuiTableCell-sizeSmall': sharedStyles.tblData }}>
                    {history.weekOfFormatted}
                  </TableCell>
                  <TableCell sx={{ '& .MuiTableCell-sizeSmall': sharedStyles.tblData }}>
                    {history.studentName}
                  </TableCell>
                  <TableCell align="center" sx={{ '& .MuiTableCell-sizeSmall': sharedStyles.tblData }}>
                    {history.class}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default StudentSelector;
