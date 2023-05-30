import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import { Setting } from '../../classes/Setting';

const PersonAssignments = ({ person, assignments, setAssignments }) => {
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

  const lmmoRole = Setting.cong_role.includes('lmmo') || Setting.cong_role.includes('lmmo-backup');
  const secretaryRole = Setting.cong_role.includes('secretary');
  const isEditAllowed = lmmoRole || secretaryRole;

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
                  disabled={person.isFemale}
                  checked={person.isFemale ? false : isMidweekChairman}
                  onChange={lmmoRole ? (e) => handleAssignmentsChange(110, e.target.checked) : null}
                />
              }
              label={t('chairmanMidweekMeeting', { ns: 'source' })}
            />
            <FormControlLabel
              control={
                <Checkbox
                  disabled={person.isFemale}
                  checked={person.isFemale ? false : isMidweekPrayer}
                  onChange={lmmoRole ? (e) => handleAssignmentsChange(111, e.target.checked) : null}
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
                    disabled={person.isFemale}
                    checked={person.isFemale ? false : isTGWTalk}
                    onChange={lmmoRole ? (e) => handleAssignmentsChange(112, e.target.checked) : null}
                  />
                }
                label={t('tgwTalk', { ns: 'source' })}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={person.isFemale}
                    checked={person.isFemale ? false : isTGWGems}
                    onChange={lmmoRole ? (e) => handleAssignmentsChange(113, e.target.checked) : null}
                  />
                }
                label={t('tgwGems', { ns: 'source' })}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={person.isFemale}
                    checked={person.isFemale ? false : isTGWBibleReading}
                    onChange={lmmoRole ? (e) => handleAssignmentsChange(100, e.target.checked) : null}
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
                    onChange={lmmoRole ? (e) => handleAssignmentsChange(101, e.target.checked) : null}
                  />
                }
                label={t('initialCall', { ns: 'source' })}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAYFReturnVisit}
                    onChange={lmmoRole ? (e) => handleAssignmentsChange(102, e.target.checked) : null}
                  />
                }
                label={t('returnVisit', { ns: 'source' })}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAYFBibleStudy}
                    onChange={lmmoRole ? (e) => handleAssignmentsChange(103, e.target.checked) : null}
                  />
                }
                label={t('bibleStudy', { ns: 'source' })}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={person.isFemale}
                    checked={person.isFemale ? false : isAYFTalk}
                    onChange={lmmoRole ? (e) => handleAssignmentsChange(104, e.target.checked) : null}
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
                    disabled={person.isFemale}
                    checked={person.isFemale ? false : isLCPart}
                    onChange={lmmoRole ? (e) => handleAssignmentsChange(114, e.target.checked) : null}
                  />
                }
                label={t('lcPart', { ns: 'source' })}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={person.isFemale}
                    checked={person.isFemale ? false : isLCCBSConductor}
                    onChange={lmmoRole ? (e) => handleAssignmentsChange(115, e.target.checked) : null}
                  />
                }
                label={`${t('cbs', { ns: 'source' })} - ${t('cbsConductor', { ns: 'source' })}`}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={person.isFemale}
                    checked={person.isFemale ? false : isLCCBSReader}
                    onChange={lmmoRole ? (e) => handleAssignmentsChange(116, e.target.checked) : null}
                  />
                }
                label={`${t('cbs', { ns: 'source' })} - ${t('cbsReader', { ns: 'source' })}`}
              />
            </FormGroup>
          </Box>
        </Box>
      </Box>
      {isEditAllowed && !lmmoRole && (
        <Typography sx={{ fontStyle: 'italic', marginTop: '20px' }} color="#FE4119">
          {t('midweekMeetingAssignmentsNotice')}
        </Typography>
      )}
    </Box>
  );
};

export default PersonAssignments;
