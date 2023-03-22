import { useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SingleAssignment from './SingleAssignment';
import { classCountState } from '../../states/congregation';
import { useEffect, useState } from 'react';
import { checkCBSReader, checkLCAssignments } from '../../utils/sourceMaterial';

const styles = {
  studentPartWrapper1: {
    width: {
      xs: '100%',
      sm: 'calc(100% - 300px)',
    },
  },
  studentPartWrapper2: {
    width: {
      xs: '100%',
      sm: 'calc(100% - 300px)',
      sm800: 'calc(100% - 600px)',
      lg: 'calc(100% - 300px)',
    },
    flexDirection: {
      sm800: 'row',
    },
  },
  studentContainer1: {
    display: 'flex',
    justifyContent: {
      xs: 'flex-start',
      sm: 'flex-end',
    },
  },
  studentContainer2: {
    display: 'flex',
    justifyContent: {
      xs: 'flex-start',
      sm: 'flex-end',
    },
    flexDirection: {
      xs: 'column',
      xs420: 'row',
      sm: 'column',
      sm800: 'row',
      lg: 'column',
    },
    gap: '5px',
  },
};

const ScheduleRowAssignment = ({
  weekType,
  edit,
  source,
  isAssignA,
  personA,
  loadStudentPickerA,
  isAssignAssistantA,
  assistantA,
  isAssignB,
  personB,
  loadStudentPickerB,
  isAssignAssistantB,
  assistantB,
  student,
  studentPart,
  assType,
  assTypeName,
  assTime,
  ayf,
  loadStudentAyfPicker,
  studentAID,
  assistantAID,
  studentBID,
  assistantBID,
  lcPart,
  isLC,
  cbs,
  co,
}) => {
  const classCount = useRecoilValue(classCountState);

  const [isLCNoAssign, setIsLCNoAssign] = useState(false);
  const [displayPerson, setDisplayPerson] = useState(false);
  const [displayCBSReader, setDisplayCBSReader] = useState(true);

  const getContainerStyle = () => {
    if (student) {
      if (classCount === 1) return styles.studentPartWrapper1;
      return styles.studentPartWrapper2;
    }

    return styles.studentPartWrapper1;
  };

  const getPersonStyle = () => {
    if (student || cbs) {
      if (classCount === 1 && student) return styles.studentContainer1;
      return styles.studentContainer2;
    }

    return styles.studentContainer1;
  };

  useEffect(() => {
    if (isLC) {
      const noAssign = checkLCAssignments(source);
      setIsLCNoAssign(noAssign);
    }
  }, [isLC, source]);

  useEffect(() => {
    if (assType) {
      if (assType !== 105 && assType !== 106 && assType !== 107 && assType !== 117) {
        setDisplayPerson(true);
        return;
      }

      setDisplayPerson(false);
    }

    if (!assType) {
      if (isLC) {
        setDisplayPerson(!isLCNoAssign);
        return;
      }

      setDisplayPerson(true);
    }
  }, [assType, isLCNoAssign, isLC, assTypeName]);

  useEffect(() => {
    if (cbs) {
      const noAssignCBSReader = checkCBSReader(lcPart);
      setDisplayCBSReader(!noAssignCBSReader);
    }
  }, [cbs, lcPart]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '20px',
      }}
    >
      <Box sx={getContainerStyle()}>
        <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: 16 }}>
          {!assType && <>{source}</>}
          {assType && assType !== 107 && (
            <>
              {assTypeName} ({assTime} min.)
            </>
          )}
        </Typography>
        {student && <Typography variant="body1">{studentPart}</Typography>}
        {lcPart && (
          <Typography variant="body1" sx={{ fontSize: 14 }}>
            {lcPart}
          </Typography>
        )}
      </Box>
      {displayPerson && (
        <Box sx={getPersonStyle()}>
          {(edit || personA) && (
            <SingleAssignment
              ayf={ayf}
              edit={edit}
              co={co}
              isAssign={isAssignA}
              person={personA}
              loadStudentPicker={loadStudentPickerA}
              isAssignAssistant={isAssignAssistantA}
              assistant={assistantA}
              loadStudentAyfPicker={loadStudentAyfPicker}
              assType={assType}
              assTypeName={assTypeName}
              studentID={studentAID}
              assistantID={assistantAID}
            />
          )}

          {((classCount === 2 && weekType === 1 && student) || (cbs && displayCBSReader)) && (
            <>
              {(edit || personB) && (
                <SingleAssignment
                  ayf={ayf}
                  edit={edit}
                  isAssign={isAssignB}
                  person={personB}
                  loadStudentPicker={loadStudentPickerB}
                  isAssignAssistant={isAssignAssistantB}
                  assistant={assistantB}
                  loadStudentAyfPicker={loadStudentAyfPicker}
                  assType={assType}
                  assTypeName={assTypeName}
                  studentID={studentBID}
                  assistantID={assistantBID}
                />
              )}
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ScheduleRowAssignment;
