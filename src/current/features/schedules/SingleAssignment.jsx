import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SingleAssignmentHeader from './SingleAssignmentHeader';
import PersonSelect from './PersonSelect';

const styles = {
  personContainer: { display: 'flex', marginRight: '5px', alignItems: 'center' },
};
const SingleAssignment = ({
  ayf,
  header,
  person,
  assistant,
  edit,
  studentID,
  assType,
  assTypeName,
  assistantID,
  co,
  setSelectedStudent,
  currentWeek,
  loadPersonHistory,
  loadStudentAyfPicker,
  isLC,
  isElderPart,
  visitingSpeaker,
}) => {
  const { t } = useTranslation('ui');

  const getPersonStyle = () => {
    if (ayf)
      return {
        display: 'flex',
        flexDirection: 'column',
        gap: '3px',
        marginBottom: '10px',
      };
    return {};
  };

  const loadHistory = (assID, assType, assTypeName, currentStudent, stuForAssistant, assTypeNameForAssistant) => {
    const obj = {};
    obj.assID = assID;
    obj.assType = assType;
    obj.assTypeName = assTypeName;
    obj.currentStudent = currentStudent;
    obj.stuForAssistant = stuForAssistant;
    obj.assTypeNameForAssistant = assTypeNameForAssistant;
    loadStudentAyfPicker(obj);
  };

  const openPersonHistory = () => {
    if (ayf) {
      loadHistory(studentID, assType, assTypeName, person);
    }

    if (!ayf) {
      loadPersonHistory();
    }
  };

  const openHistoryAssistant = () => {
    loadHistory(assistantID, assType, t('assistant'), assistant, person, assTypeName);
  };

  return (
    <Box>
      {header && <SingleAssignmentHeader assignmentHeader={header} />}
      <Box sx={getPersonStyle()}>
        <Box sx={styles.personContainer}>
          <PersonSelect
            edit={edit}
            visitingSpeaker={visitingSpeaker}
            ayf={ayf}
            assID={studentID}
            assType={assType}
            handleSave={(value) => setSelectedStudent(value)}
            co={co}
            person={person}
            currentWeek={currentWeek}
            isLC={isLC}
            isElderPart={isElderPart}
          />
          {edit && (
            <>
              {!co && (
                <IconButton
                  sx={{ marginLeft: '3px', padding: '5px' }}
                  onClick={openPersonHistory}
                  disabled={!person || person === ''}
                >
                  <ListAltIcon sx={{ fontSize: '24px' }} />
                </IconButton>
              )}
              {co && edit && <Box sx={{ width: '36px' }}></Box>}
            </>
          )}
        </Box>
        {ayf && assType !== 104 && (
          <Box sx={styles.personContainer}>
            <PersonSelect
              edit={edit}
              ayf={ayf}
              assID={assistantID}
              assType={assType}
              handleSave={(value) => setSelectedStudent(value)}
              person={assistant}
              stuForAssistant={person}
              currentWeek={currentWeek}
            />
            {edit && (
              <>
                {person && (
                  <IconButton
                    sx={{ marginLeft: '3px', padding: '5px' }}
                    onClick={openHistoryAssistant}
                    disabled={person === ''}
                  >
                    <ListAltIcon sx={{ fontSize: '24px' }} />
                  </IconButton>
                )}
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SingleAssignment;
