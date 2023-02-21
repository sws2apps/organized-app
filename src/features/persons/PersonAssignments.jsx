import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

const PersonAssignments = ({ student, assignments, setAssignments }) => {
  const { t } = useTranslation('ui');

  const [isMidweekChairman, setIsMidweekChairman] = useState(false);
  const [isMidweekPrayer, setIsMidweekPrayer] = useState(false);
  const [isTGWTalk, setIsTGWTalk] = useState(false);
  const [isTGWGems, setIsTGWGems] = useState(false);
  const [isTGWBibleReading, setIsTGWBibleReading] = useState(false);
  const [isAYFInitialCall, setIsAYFInitialCall] = useState(false);
  const [isAYFReturnVisit, setIsAYFReturnVisit] = useState(false);
  const [isAYFBibleStudy, setIsAYFBibleStudy] = useState(false);
  const [isAYFTalk, setIsAYFTalk] = useState(false);
  const [isLCPart, setIsLCPart] = useState(false);
  const [isLCCBSConductor, setIsLCCBSConductor] = useState(false);
  const [isLCCBSReader, setIsLCCBSReader] = useState(false);

  const updateLocalState = (code) => {
    if (code === 100) return setIsTGWBibleReading(false);
    if (code === 101) return setIsAYFInitialCall(false);
    if (code === 102) return setIsAYFReturnVisit(false);
    if (code === 103) return setIsAYFBibleStudy(false);
    if (code === 104) return setIsAYFTalk(false);
    if (code === 110) return setIsMidweekChairman(false);
    if (code === 111) return setIsMidweekPrayer(false);
    if (code === 112) return setIsTGWTalk(false);
    if (code === 113) return setIsTGWGems(false);
    if (code === 114) return setIsLCPart(false);
    if (code === 115) return setIsLCCBSConductor(false);
    if (code === 116) return setIsLCCBSReader(false);
  };

  const handleAssignmentsChange = (code, value) => {
    if (!value) {
      updateLocalState(code);
    }

    setAssignments((prev) => {
      let newAssignments = [...prev];
      if (value) {
        const isFound = newAssignments.find((assignment) => assignment.code === code);
        if (!isFound) newAssignments.push({ code });
      }

      if (!value) {
        const findIndex = newAssignments.findIndex((assignment) => assignment.code === code);
        if (findIndex !== -1) newAssignments.splice(findIndex, 1);
      }

      return newAssignments;
    });
  };

  useEffect(() => {
    assignments.forEach((assignment) => {
      switch (assignment.code) {
        case 100:
          setIsTGWBibleReading(true);
          break;
        case 101:
          setIsAYFInitialCall(true);
          break;
        case 102:
          setIsAYFReturnVisit(true);
          break;
        case 103:
          setIsAYFBibleStudy(true);
          break;
        case 104:
          setIsAYFTalk(true);
          break;
        case 110:
          setIsMidweekChairman(true);
          break;
        case 111:
          setIsMidweekPrayer(true);
          break;
        case 112:
          setIsTGWTalk(true);
          break;
        case 113:
          setIsTGWGems(true);
          break;
        case 114:
          setIsLCPart(true);
          break;
        case 115:
          setIsLCCBSConductor(true);
          break;
        case 116:
          setIsLCCBSReader(true);
          break;
        default:
          break;
      }
    });
  }, [assignments]);

  return (
    <Box id="assignments-container">
      <Box
        sx={{
          display: 'flex',
          gap: '15px',
          flexDirection: 'column',
        }}
      >
        <Box>
          <Typography variant="h6" className="midweerkMeeting meetingPart-override">
            {t('midweekMeeting')}
          </Typography>
          <FormGroup sx={{ width: 'fit-content' }}>
            <FormControlLabel
              control={
                <Checkbox
                  disabled={student.isFemale}
                  checked={student.isFemale ? false : isMidweekChairman}
                  onChange={(e) => handleAssignmentsChange(110, e.target.checked)}
                />
              }
              label={t('chairmanMidweekMeeting', { ns: 'source' })}
            />
            <FormControlLabel
              control={
                <Checkbox
                  disabled={student.isFemale}
                  checked={student.isFemale ? false : isMidweekPrayer}
                  onChange={(e) => handleAssignmentsChange(111, e.target.checked)}
                />
              }
              label={t('prayerMidweekMeeting', { ns: 'source' })}
            />
          </FormGroup>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '10px',
            gap: '15px',
            flexWrap: 'wrap',
            marginLeft: '10px',
          }}
        >
          <Box>
            <Typography variant="h6" className="tgwPart meetingPart-override">
              {t('treasuresPart')}
            </Typography>
            <FormGroup sx={{ width: 'fit-content' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={student.isFemale}
                    checked={student.isFemale ? false : isTGWTalk}
                    onChange={(e) => handleAssignmentsChange(112, e.target.checked)}
                  />
                }
                label={t('tgwTalk', { ns: 'source' })}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={student.isFemale}
                    checked={student.isFemale ? false : isTGWGems}
                    onChange={(e) => handleAssignmentsChange(113, e.target.checked)}
                  />
                }
                label={t('tgwGems', { ns: 'source' })}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={student.isFemale}
                    checked={student.isFemale ? false : isTGWBibleReading}
                    onChange={(e) => handleAssignmentsChange(100, e.target.checked)}
                  />
                }
                label={t('bibleReading', { ns: 'source' })}
              />
            </FormGroup>
          </Box>

          <Box>
            <Typography variant="h6" className="ayfPart meetingPart-override">
              {t('applyFieldMinistryPart')}
            </Typography>
            <FormGroup sx={{ width: 'fit-content' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAYFInitialCall}
                    onChange={(e) => handleAssignmentsChange(101, e.target.checked)}
                  />
                }
                label={t('initialCall', { ns: 'source' })}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAYFReturnVisit}
                    onChange={(e) => handleAssignmentsChange(102, e.target.checked)}
                  />
                }
                label={t('returnVisit', { ns: 'source' })}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAYFBibleStudy}
                    onChange={(e) => handleAssignmentsChange(103, e.target.checked)}
                  />
                }
                label={t('bibleStudy', { ns: 'source' })}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={student.isFemale}
                    checked={student.isFemale ? false : isAYFTalk}
                    onChange={(e) => handleAssignmentsChange(104, e.target.checked)}
                  />
                }
                label={t('talk', { ns: 'source' })}
              />
            </FormGroup>
          </Box>

          <Box>
            <Typography variant="h6" className="lcPart meetingPart-override">
              {t('livingPart')}
            </Typography>
            <FormGroup sx={{ width: 'fit-content' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={student.isFemale}
                    checked={student.isFemale ? false : isLCPart}
                    onChange={(e) => handleAssignmentsChange(114, e.target.checked)}
                  />
                }
                label={t('lcPart', { ns: 'source' })}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={student.isFemale}
                    checked={student.isFemale ? false : isLCCBSConductor}
                    onChange={(e) => handleAssignmentsChange(115, e.target.checked)}
                  />
                }
                label={t('cbsConductor', { ns: 'source' })}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={student.isFemale}
                    checked={student.isFemale ? false : isLCCBSReader}
                    onChange={(e) => handleAssignmentsChange(116, e.target.checked)}
                  />
                }
                label={t('cbsReader', { ns: 'source' })}
              />
            </FormGroup>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PersonAssignments;
