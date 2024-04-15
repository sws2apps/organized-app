import maleIcon from '../../img/student_male.svg';
import femaleIcon from '../../img/student_female.svg';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Setting } from '../../classes/Setting';
import { currentStudentState, isStudentDeleteState } from '../../states/person';

const sharedStyles = {
  root: {
    margin: '5px',
    height: '100%',
  },
  rootUnavailable: {
    margin: '5px',
    height: '100%',
  },
  chip: {
    margin: '2px',
    backgroundColor: 'black',
    color: 'white',
  },
};

const PersonCard = ({ person }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('ui');

  const setCurrentStudent = useSetRecoilState(currentStudentState);
  const setIsStudentDelete = useSetRecoilState(isStudentDeleteState);

  const lmmoRole = Setting.cong_role.includes('lmmo') || Setting.cong_role.includes('lmmo-backup');
  const secretaryRole = Setting.cong_role.includes('secretary');
  const coordinatorRole = Setting.cong_role.includes('coordinator');
  const publicTalkCoordinatorRole = Setting.cong_role.includes('public_talk_coordinator');

  const isPersonEditor = lmmoRole || secretaryRole || coordinatorRole || publicTalkCoordinatorRole;

  const handleClickOpen = () => {
    navigate(`/persons/${person.person_uid}`);
  };

  const handleDelete = (uid, name) => {
    const obj = {};
    obj.name = name;
    obj.person_uid = uid;
    setCurrentStudent(obj);
    setIsStudentDelete(true);
  };

  return (
    <Grid item sx={{ marginBottom: '5px' }} xs={12} sm={6} md={6} lg={4}>
      <Card sx={person.isDisqualified ? sharedStyles.rootUnavailable : sharedStyles.root}>
        <CardHeader
          sx={{
            padding: '5px',
            '& .MuiCardHeader-title': {
              fontSize: '16px',
              fontWeight: 'bold',
            },
            '& .MuiCardHeader-action': {
              alignSelf: 'center',
            },
          }}
          avatar={
            <Avatar
              sx={{
                height: '50px',
                width: '50px',
              }}
              alt="Student icon"
              src={person.isMale ? maleIcon : femaleIcon}
            />
          }
          action={
            <>
              <Tooltip title={t('edit')}>
                <IconButton
                  onClick={handleClickOpen}
                  color="primary"
                  sx={{ marginRight: !lmmoRole && !secretaryRole ? '10px' : null }}
                >
                  {isPersonEditor && <EditIcon />}
                  {!isPersonEditor && <VisibilityIcon />}
                </IconButton>
              </Tooltip>
              {(lmmoRole || secretaryRole) && (
                <Tooltip title={t('delete')}>
                  <IconButton
                    sx={{ marginRight: '5px' }}
                    color="error"
                    onClick={() => handleDelete(person.person_uid, person.person_name)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </>
          }
          title={person.person_name}
        />
        <CardContent
          sx={{
            padding: '2px',
            marginLeft: '60px',
            '&:last-child': {
              paddingBottom: 0,
            },
          }}
        >
          {(Setting.cong_role.includes('lmmo') || Setting.cong_role.includes('lmmo-backup')) && (
            <>
              {person.assignments.find((assignment) => assignment.code === 100) && (
                <Chip label={t('abbrBibleReading')} size="small" sx={sharedStyles.chip} />
              )}
              {person.assignments.find((assignment) => assignment.code === 101) && (
                <Chip label={t('abbrInitialCall')} size="small" sx={sharedStyles.chip} />
              )}
              {person.assignments.find((assignment) => assignment.code === 102) && (
                <Chip label={t('abbrReturnVisit')} size="small" sx={sharedStyles.chip} />
              )}
              {person.assignments.find((assignment) => assignment.code === 103) && (
                <Chip label={t('abbrBibleStudy')} size="small" sx={sharedStyles.chip} />
              )}
              {person.assignments.find((assignment) => assignment.code === 104) && (
                <Chip label={t('abbrTalk')} size="small" sx={sharedStyles.chip} />
              )}
            </>
          )}
          {Setting.cong_role.includes('secretary') && (
            <>
              {person.isPublisher() &&
                !person.isAuxiliaryPioneer() &&
                !person.isRegularPioneer() &&
                !person.isSpecialPioneer() && (
                  <>
                    <Chip label={t('abbrPublisher')} size="small" sx={sharedStyles.chip} />
                    {person.isBaptizedDate() && <Chip label={t('abbrBaptized')} size="small" sx={sharedStyles.chip} />}
                  </>
                )}
              {person.isMS() && <Chip label={t('abbrMinisterialServant')} size="small" sx={sharedStyles.chip} />}
              {person.isElder() && <Chip label={t('abbrElder')} size="small" sx={sharedStyles.chip} />}
              {person.isSpecialPioneer() && (
                <Chip label={t('abbrSpecialPioneer')} size="small" sx={sharedStyles.chip} />
              )}
              {person.isRegularPioneer() && <Chip label="FR" size="small" sx={sharedStyles.chip} />}
              {person.isAuxiliaryPioneer() && (
                <Chip label={t('abbrAuxiliaryPioneer')} size="small" sx={sharedStyles.chip} />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default PersonCard;
