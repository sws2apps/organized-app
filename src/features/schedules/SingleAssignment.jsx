import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import SingleAssignmentHeader from './SingleAssignmentHeader';
import SingleAssignmentPerson from './SingleAssignmentPerson';

const styles = {
  personContainer: { display: 'flex', marginRight: '5px', alignItems: 'center' },
};
const SingleAssignment = ({
  ayf,
  header,
  isAssign,
  person,
  loadStudentPicker,
  isAssignAssistant,
  assistant,
  edit,
  loadStudentAyfPicker,
  studentID,
  assType,
  assTypeName,
  assistantID,
  co,
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

  const loadStuPicker = (assID, assType, assTypeName, currentStudent, stuForAssistant, assTypeNameForAssistant) => {
    const obj = {};
    obj.assID = assID;
    obj.assType = assType;
    obj.assTypeName = assTypeName;
    obj.currentStudent = currentStudent;
    obj.stuForAssistant = stuForAssistant;
    obj.assTypeNameForAssistant = assTypeNameForAssistant;
    loadStudentAyfPicker(obj);
  };

  const openPickerStudent = () => {
    if (ayf) {
      loadStuPicker(studentID, assType, assTypeName, person);
    }

    if (!ayf) {
      loadStudentPicker();
    }
  };

  const openPickerAssistant = () => {
    loadStuPicker(assistantID, assType, t('assistant'), assistant, person, assTypeName);
  };

  return (
    <Box>
      {header && <SingleAssignmentHeader assignmentHeader={header} />}
      <Box sx={getPersonStyle()}>
        <Box sx={styles.personContainer}>
          <SingleAssignmentPerson person={person} />
          {edit && (
            <>
              {isAssign && <CircularProgress color="secondary" size={26} disableShrink={true} />}
              {!co && !isAssign && (
                <IconButton sx={{ padding: '1px' }} onClick={openPickerStudent}>
                  <EditIcon sx={{ fontSize: '24px' }} />
                </IconButton>
              )}
              {co && <Box sx={{ width: '26px' }}></Box>}
            </>
          )}
        </Box>
        {ayf && assType !== 104 && (
          <Box sx={styles.personContainer}>
            <SingleAssignmentPerson person={assistant} />
            {edit && (
              <>
                {isAssignAssistant && <CircularProgress color="secondary" size={26} disableShrink={true} />}
                {person && !isAssignAssistant && (
                  <IconButton sx={{ padding: '1px' }} onClick={openPickerAssistant}>
                    <EditIcon sx={{ fontSize: '24px' }} />
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
