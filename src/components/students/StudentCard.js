import maleIcon from '../../img/student_male.svg';
import femaleIcon from '../../img/student_female.svg';
import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { blue, brown, green, orange, purple, red, teal } from '@mui/material/colors';
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
import { currentStudentState, isStudentEditState, isStudentDeleteState } from '../../appStates/appStudent';

const sharedStyles = {
    root: {
        backgroundColor: blue[50],
        margin: '5px',
        height: '100%',
    },
    rootUnavailable: {
        backgroundColor: red[200],
        margin: '5px',
        height: '100%',
    },
    chip: {
        margin: '2px',
    },
    chipBRead: {
        backgroundColor: orange[200],
    },
    chipIniCall: {
        backgroundColor: purple[200],
    },
    chipRV: {
        backgroundColor: teal[200],
    },
    chipBS: {
        backgroundColor: green[200],
    },
    chipTalk: {
        backgroundColor: brown[200],
    },
};

const StudentCard = ({ student }) => {
    const { t } = useTranslation();

    const setCurrentStudent = useSetRecoilState(currentStudentState);
    const setIsStudentDelete = useSetRecoilState(isStudentDeleteState);
    const setIsStudentEdit = useSetRecoilState(isStudentEditState);

    const handleClickOpen = () => {
        setCurrentStudent(student);
        setIsStudentEdit(true);
    };

    const handleDelete = (id, name) => {
        var obj = {};
        obj.name = name;
        obj.id = id;
        setCurrentStudent(obj);
        setIsStudentDelete(true);
    }

    return ( 
        <Grid item sx={{marginBottom: '5px'}} xs={12} sm={6} md={6} lg={4}>
            <Card sx={student.isUnavailable ? sharedStyles.rootUnavailable : sharedStyles.root}>
                <CardHeader
                    sx={{
                        padding: '5px',
                        '& .MuiCardHeader-title': {
                            fontSize: "16px",
                            fontWeight: "bold",
                        },
                        '& .MuiCardHeader-action': {
                            alignSelf: "center",
                        },
                    }}
                    avatar={
                        <Avatar
                            sx={{
                                height: '50px',
                                width: '50px',
                            }}
                            alt="Student icon"
                            src={student.isMale ? maleIcon : femaleIcon}
                        />
                    }
                    action={
                        <>
                            <Tooltip title={t("global.edit")}>
                                <IconButton onClick={handleClickOpen}>
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={t("global.delete")}>
                                <IconButton onClick={() => handleDelete(student.id, student.person_name)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </>
                    }
                    title={student.person_name}
                />
                <CardContent
                    sx={{
                        padding: '2px',
                        marginLeft: '60px',
                        "&:last-child": {
                            paddingBottom: 0,
                        }
                    }}
                >
                    {student.isBRead && (
                        <Chip
                            label={t("global.abbrBibleReading")}
                            size="small"
                            sx={{...sharedStyles.chip, ...sharedStyles.chipBRead}}
                        />
                    )}
                    {student.isInitialCall && (
                        <Chip
                            label={t("global.abbrInitialCall")}
                            size="small"
                            sx={{...sharedStyles.chip, ...sharedStyles.chipIniCall}}
                        />
                    )}
                    {student.isReturnVisit && (
                        <Chip
                            label={t("global.abbrReturnVisit")}
                            size="small"
                            sx={{...sharedStyles.chip, ...sharedStyles.chipRV}}
                        />
                    )}
                    {student.isBibleStudy && (
                        <Chip
                            label={t("global.abbrBibleStudy")}
                            size="small"
                            sx={{...sharedStyles.chip, ...sharedStyles.chipBS}}
                        />
                    )}
                    {student.isTalk && (
                        <Chip
                            label={t("global.abbrTalk")}
                            size="small"
                            sx={{...sharedStyles.chip, ...sharedStyles.chipTalk}}
                        />
                    )}                
                </CardContent>
            </Card>
        </Grid>
     );
}
 
export default StudentCard;