import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useTranslation } from 'react-i18next';
import { styled, alpha } from '@mui/material/styles';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArchiveIcon from '@mui/icons-material/Archive';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import ShareIcon from '@mui/icons-material/Share';
import StudentCard from "../components/students/StudentCard";
import StudentDetails from "../components/students/StudentDetails";
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { dbDeleteStudent } from "../indexedDb/dbPersons";
import { appMessageState, appSeverityState, appSnackOpenState } from "../appStates/appNotification";
import { allStudentsState, filteredStudentsState } from "../appStates/appStudents";
import { currentStudentState, isStudentAddState, isStudentDeleteState, isStudentDetailsOpenState } from "../appStates/appStudent";

const dateFormat = require("dateformat");

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.25),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.black, 0.15),
    },
    marginLeft: theme.spacing(1),
    marginBottom: '5px',
    flexGrow: 1,
    minWidth: '330px',
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(0.8, 1, 0.8, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
    },
    '&.MuiInputBase-root': {
        width: '100%',
    }
  }));

const Students = () => {
    const { t } = useTranslation();

    const [genderValue, setGenderValue] = useState("genderAll");
    const [toSearch, setToSearch] = useState("");
    const [assignment, setAssignment] = useState(5);

    const [dbStudents, setDbStudents] = useRecoilState(allStudentsState);
    const [students, setStudents] = useRecoilState(filteredStudentsState);
    const [isStudentDelete, setIsStudentDelete] = useRecoilState(isStudentDeleteState);

    const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
    const setAppSeverity = useSetRecoilState(appSeverityState);
    const setAppMessage = useSetRecoilState(appMessageState);
    const setIsStudentAdd = useSetRecoilState(isStudentAddState);
    const setCurrentStudent = useSetRecoilState(currentStudentState);

    const currentStudent = useRecoilValue(currentStudentState);
    const isStudentDetailsOpen = useRecoilValue(isStudentDetailsOpenState);

    const handleAddStudent = () => {
        setCurrentStudent({});
        setIsStudentAdd(true);
    }

    const handleClose = () => {
        setIsStudentDelete(false);
    }

    const handleFilterStudents = useCallback(async (toSearch, genderValue, assignment) => {
        let newStudents = [];
        try {
            if (toSearch === "") {
                if (genderValue === "genderAll") {
                    if (assignment === 5) {
                        newStudents = dbStudents;
                    } else if (assignment === 0) {
                        newStudents = dbStudents.filter(student => student.isBRead === true);
                    } else if (assignment === 1) {
                        newStudents = dbStudents.filter(student => student.isInitialCall === true);
                    } else if (assignment === 2) {
                        newStudents = dbStudents.filter(student => student.isReturnVisit === true);
                    } else if (assignment === 3) {
                        newStudents = dbStudents.filter(student => student.isBibleStudy === true);
                    } else if (assignment === 4) {
                        newStudents = dbStudents.filter(student => student.isTalk === true);
                    }
                } else if (genderValue === "isMale") {
                    if (assignment === 5) {
                        newStudents = dbStudents.filter(student => student.isMale === true);
                    } else if (assignment === 0) {
                        newStudents = dbStudents.filter(student => student.isMale === true && student.isBRead === true);
                    } else if (assignment === 1) {
                        newStudents = dbStudents.filter(student => student.isMale === true && student.isInitialCall === true);
                    } else if (assignment === 2) {
                        newStudents = dbStudents.filter(student => student.isMale === true && student.isReturnVisit === true);
                    } else if (assignment === 3) {
                        newStudents = dbStudents.filter(student => student.isMale === true && student.isBibleStudy === true);
                    } else if (assignment === 4) {
                        newStudents = dbStudents.filter(student => student.isMale === true && student.isTalk === true);
                    }
                } else if (genderValue === "isFemale") {
                    if (assignment === 5) {
                        newStudents = dbStudents.filter(student => student.isFemale === true);
                    } else if (assignment === 0) {
                        newStudents = dbStudents.filter(student => student.isFemale === true && student.isBRead === true);
                    } else if (assignment === 1) {
                        newStudents = dbStudents.filter(student => student.isFemale === true && student.isInitialCall === true);
                    } else if (assignment === 2) {
                        newStudents = dbStudents.filter(student => student.isFemale === true && student.isReturnVisit === true);
                    } else if (assignment === 3) {
                        newStudents = dbStudents.filter(student => student.isFemale === true && student.isBibleStudy === true);
                    } else if (assignment === 4) {
                        newStudents = dbStudents.filter(student => student.isFemale === true && student.isTalk === true);
                    }
                }
            } else {
                let regex = new RegExp(toSearch, "i");
                if (genderValue === "genderAll") {
                    if (assignment === 5) {
                        newStudents = dbStudents.filter(student => regex.test(student.person_name));
                    } else if (assignment === 0) {
                        newStudents = dbStudents.filter(student => regex.test(student.person_name) && student.isBRead === true);
                    } else if (assignment === 1) {
                        newStudents = dbStudents.filter(student => regex.test(student.person_name) && student.isInitialCall === true);
                    } else if (assignment === 2) {
                        newStudents = dbStudents.filter(student => regex.test(student.person_name) && student.isReturnVisit === true);
                    } else if (assignment === 3) {
                        newStudents = dbStudents.filter(student => regex.test(student.person_name) && student.isBibleStudy === true);
                    } else if (assignment === 4) {
                        newStudents = dbStudents.filter(student => regex.test(student.person_name) && student.isTalk === true);
                    }
                } else if (genderValue === "isMale") {
                    if (assignment === 5) {
                        newStudents = dbStudents.filter(student => regex.test(student.person_name) && student.isMale === true);
                    } else if (assignment === 0) {
                        newStudents = dbStudents.filter(student => regex.test(student.person_name) && student.isMale === true && student.isBRead === true);
                    } else if (assignment === 1) {
                        newStudents = dbStudents.filter(student => regex.test(student.person_name) && student.isMale === true && student.isInitialCall === true);
                    } else if (assignment === 2) {
                        newStudents = dbStudents.filter(student => regex.test(student.person_name) && student.isMale === true && student.isReturnVisit === true);
                    } else if (assignment === 3) {
                        newStudents = dbStudents.filter(student => regex.test(student.person_name) && student.isMale === true && student.isBibleStudy === true);
                    } else if (assignment === 4) {
                        newStudents = dbStudents.filter(student => regex.test(student.person_name) && student.isMale === true && student.isTalk === true);
                    }
                } else if (genderValue === "isFemale") {
                    if (assignment === 5) {
                        newStudents = dbStudents.filter(student => regex.test(student.person_name) && student.isFemale === true);
                    } else if (assignment === 0) {
                        newStudents = dbStudents.filter(student => regex.test(student.person_name) && student.isFemale === true && student.isBRead === true);
                    } else if (assignment === 1) {
                        newStudents = dbStudents.filter(student => regex.test(student.person_name) && student.isFemale === true && student.isInitialCall === true);
                    } else if (assignment === 2) {
                        newStudents = dbStudents.filter(student => regex.test(student.person_name) && student.isFemale === true && student.isReturnVisit === true);
                    } else if (assignment === 3) {
                        newStudents = dbStudents.filter(student => regex.test(student.person_name) && student.isFemale === true && student.isBibleStudy === true);
                    } else if (assignment === 4) {
                        newStudents = dbStudents.filter(student => regex.test(student.person_name) && student.isFemale === true && student.isTalk === true);
                    }
                }
            }
        } catch {
            setAppSeverity("warning");
            setAppMessage(t("students.searchError"));
            setAppSnackOpen(true);
            setToSearch('');
        }

        setStudents(newStudents);  
    }, [dbStudents, setToSearch, setAppMessage, setAppSeverity, setAppSnackOpen, setStudents, t])

    const handleSearchStudent = (varText) => {
        setToSearch(varText);
    }

    const handleDelete = async () => {
        const varID = currentStudent.id;
        await dbDeleteStudent(varID);
        let newPersons = students.filter(student => student.id !== varID);
        let dbNewPersons = dbStudents.filter(student => student.id !== varID);
        setIsStudentDelete(false);
        setStudents(newPersons);
        setDbStudents(dbNewPersons);

        setAppSnackOpen(true);
        setAppSeverity("success");
        setAppMessage(t("students.deleteSucess"));
    }

    const handleChangeGender = async (e) => {
        setGenderValue(e.target.value);
    }

    const handleChangeAssignment = async (e) => {
        setAssignment(e.target.value);
    }

    const handleExportListForApps = async () => {
        
    }

    const exportList = async () => {
        let data = [];
        let sheet = {};
        sheet.sheet = t("students.list");
        sheet.columns = [
            {label: t("global.name"), value: 'person_name'},
            {label: t("global.displayName"), value: 'person_displayName'},
            {label: t("global.gender"), value: 'gender'},
            {label: t("global.bibleReading"), value: 'isBRead'},
            {label: t("global.initialCall"), value: 'isInitialCall'},
            {label: t("global.returnVisit"), value: 'isReturnVisit'},
            {label: t("global.bibleStudy"), value: 'isBibleStudy'},
            {label: t("global.talk"), value: 'isTalk'},
            {label: t("global.isUnavailable"), value: 'isUnavailable'},
            {label: t("global.lastAssignment"), value: 'lastAssignment'},
            {label: t("global.lastBibleReading"), value: 'lastBRead'},
            {label: t("global.lastInitialCall"), value: 'lastInitialCall'},
            {label: t("global.lastReturnVisit"), value: 'lastReturnVisit'},
            {label: t("global.lastBibleStudy"), value: 'lastBibleStudy'},
            {label: t("global.lastTalk"), value: 'lastTalk'},
        ];
        sheet.content = [];

        for(let i=0; i < students.length; i++) {
            const dateF = t("global.shortDateFormat");

            let studentData = {};
            const item = students[i];
            studentData.person_name = item.person_name;
            studentData.person_displayName = item.person_displayName;
            if (item.isMale) {
                studentData.gender = t("students.male");
            };
            if (item.isFemale) {
                studentData.gender = t("students.female");
            };
            studentData.isBRead = item.isBRead ? t("global.yes") : '';
            studentData.isInitialCall = item.isInitialCall ? t("global.yes") : '';
            studentData.isReturnVisit = item.isReturnVisit ? t("global.yes") : '';
            studentData.isBibleStudy = item.isBibleStudy ? t("global.yes") : '';
            studentData.isTalk = item.isTalk ? t("global.yes") : '';
            studentData.isUnavailable = item.isUnavailable ? t("global.yes") : '';
            if (item.lastAssignment !== undefined && item.lastAssignment) {
                studentData.lastAssignment = dateFormat(item.lastAssignment, t("global.yes"));
            }
            if (item.lastBRead !== undefined && item.lastBRead) {
                studentData.lastBRead = dateFormat(item.lastBRead, dateF);
            }
            if (item.lastInitialCall !== undefined && item.lastInitialCall) {
                studentData.lastInitialCall = dateFormat(item.lastInitialCall, dateF);
            }
            if (item.lastReturnVisit !== undefined && item.lastReturnVisit) {
                studentData.lastReturnVisit = dateFormat(item.lastReturnVisit, dateF);
            }
            if (item.lastBibleStudy !== undefined && item.lastBibleStudy) {
                studentData.lastBibleStudy = dateFormat(item.lastBibleStudy, dateF);
            }
            if (item.lastTalk !== undefined && item.lastTalk) {
                studentData.lastTalk = dateFormat(item.lastTalk, dateF);
            }
            sheet.content.push(studentData);
        }

        data.push(sheet);

        let xlsx = require('json-as-xlsx')
        let settings = {
            fileName: 'Students_list',
            extraLength: 0,
            writeOptions: {}
        }

        xlsx(data, settings)
    }

    useEffect(() => {
        const filter = async () => {
            await handleFilterStudents(toSearch, genderValue, assignment);
        }
        
        filter();
    }, [dbStudents, toSearch, genderValue, assignment, handleFilterStudents])

    return ( 
        <>
            {isStudentDelete && (
                <Dialog
                    open={isStudentDelete}
                    onClose={handleClose}
                >
                    <DialogTitle>
                        <Box sx={{lineHeight: 1.2}}>
                            {t("students.deleteTitle", { currentStudent: currentStudent.name })}
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {t("students.deleteConfirmation")}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDelete} color="primary">
                            {t("global.delete")}
                        </Button>
                        <Button onClick={handleClose} color="primary" autoFocus>
                            {t("global.cancel")}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                }}
            >
                <Tooltip title={t("students.sendListOnline")}>
                    <IconButton sx={{padding: '2px'}} onClick={handleExportListForApps}>
                        <ShareIcon sx={{fontSize: '40px'}} />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t("students.exportListLocal")}>
                    <IconButton sx={{padding: '2px'}} onClick={exportList}>
                        <ArchiveIcon sx={{fontSize: '40px'}} />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t("students.addNew")}>
                    <IconButton sx={{padding: '2px'}} onClick={handleAddStudent}>
                        <AddCircleIcon sx={{fontSize: '40px'}} />
                    </IconButton>
                </Tooltip>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    width: '100%',
                    paddingRight: '10px'
                }}
            >
                <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder={t("students.search")}
                        inputProps={{ 'aria-label': 'search' }}
                        value={toSearch}
                        onChange={(e) => handleSearchStudent(e.target.value)}
                    />
                </Search>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        marginBottom: '5px',
                        marginLeft: '10px'
                    }}
                >
                    <TextField
                        id="outlined-select-schedule"
                        select
                        size="small"
                        value={genderValue}
                        onChange={handleChangeGender}
                        sx={{ 
                            minWidth: '130px',
                            marginRight: '5px',
                        }}
                    >
                        <MenuItem value="genderAll">{t("students.all")}</MenuItem>
                        <MenuItem value="isMale">{t("students.male")}</MenuItem>
                        <MenuItem value="isFemale">{t("students.female")}</MenuItem>
                    </TextField>
                    <TextField
                        id="outlined-select-schedule"
                        select
                        size="small"
                        value={assignment}
                        onChange={handleChangeAssignment}
                        sx={{ minWidth: '190px' }}
                    >
                        <MenuItem value={5}>{t("students.allAssignments")}</MenuItem>
                        <MenuItem value={0}>{t("global.bibleReading")}</MenuItem>
                        <MenuItem value={1}>{t("global.initialCall")}</MenuItem>
                        <MenuItem value={2}>{t("global.returnVisit")}</MenuItem>
                        <MenuItem value={3}>{t("global.bibleStudy")}</MenuItem>
                        <MenuItem value={4}>{t("global.talk")}</MenuItem>
                    </TextField>
                </Box>
            </Box>
            {isStudentDetailsOpen && (
                <StudentDetails />
            )}
            <Box sx={{marginBottom: '10px'}}>
                {students.length > 0 && (
                    <Grid container>
                        {students.map(student => (
                            <StudentCard
                                key={student.id}
                                student={student}
                            />
                        ))}
                    </Grid>
                )}
            </Box>
        </>
     );
}
 
export default Students;