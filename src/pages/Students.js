import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useState } from "react";
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
import { dbDeleteStudent } from "../indexedDb/dbPersons";
import { appMessageState, appSeverityState, appSnackOpenState } from "../appStates/appNotification";
import { allStudentsState, filteredStudentsState } from "../appStates/appStudents";
import { currentStudentState, isStudentAddState, isStudentDeleteState, isStudentDetailsOpenState } from "../appStates/appStudent";

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.25),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.black, 0.15),
    },
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(1),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: '300px',
    },
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
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }));

const Students = () => {
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

    const currentStudent = useRecoilValue(currentStudentState);
    const isStudentDetailsOpen = useRecoilValue(isStudentDetailsOpenState);

    const handleClose = () => {
        setIsStudentDelete(false);
    };

    const handleFilterStudents = async (toSearch, genderValue, assignment) => {
        let newStudents = [];
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

        setStudents(newStudents);  
    }

    const handleSearchStudent = async (varText) => {
        setToSearch(varText);
        await handleFilterStudents(varText, genderValue, assignment);
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
        setAppMessage("Voafafa soa aman-tsara ny mpianatra");
    }

    const handleChangeGender = async (e) => {
        setGenderValue(e.target.value);
        await handleFilterStudents(toSearch, e.target.value, assignment);
    }

    const handleChangeAssignment = async (e) => {
        setAssignment(e.target.value);
        await handleFilterStudents(toSearch, genderValue, e.target.value);
    }

    const handleExportListForApps = async () => {
        
    }

    const exportList = async () => {
        let data = [];
        let sheet = {};
        sheet.sheet = "Lisitra";
        sheet.columns = [
            {label: 'Anarana', value: 'person_name'},
            {label: 'Fanafohezana', value: 'person_displayName'},
            {label: 'Lahy/Vavy', value: 'gender'},
            {label: 'Famakiana Baiboly', value: 'isBRead'},
            {label: 'Fitoriana', value: 'isInitialCall'},
            {label: 'Fiverenana Mitsidika', value: 'isReturnVisit'},
            {label: 'Fampianarana Baiboly', value: 'isBibleStudy'},
            {label: 'Lahateny', value: 'isTalk'},
            {label: 'Tsy omena anjara', value: 'isUnavailable'},
            {label: 'Anjara farany', value: 'lastAssignment'},
            {label: 'Anjara FB farany', value: 'lastBRead'},
            {label: 'Anjara FIT farany', value: 'lastInitialCall'},
            {label: 'Anjara FIV farany', value: 'lastReturnVisit'},
            {label: 'Anjara FAMP farany', value: 'lastBibleStudy'},
            {label: 'Anjara L farany', value: 'lastTalk'},
        ];
        sheet.content = [];

        for(let i=0; i < students.length; i++) {
            let studentData = {};
            var dateFormat = require("dateformat");
            const item = students[i];
            studentData.person_name = item.person_name;
            studentData.person_displayName = item.person_displayName;
            if (item.isMale) {
                studentData.gender = 'Lahy';
            };
            if (item.isFemale) {
                studentData.gender = 'Vavy';
            };
            studentData.isBRead = item.isBRead ? 'Eny' : '';
            studentData.isInitialCall = item.isInitialCall ? 'Eny' : '';
            studentData.isReturnVisit = item.isReturnVisit ? 'Eny' : '';
            studentData.isBibleStudy = item.isBibleStudy ? 'Eny' : '';
            studentData.isTalk = item.isTalk ? 'Eny' : '';
            studentData.isUnavailable = item.isUnavailable ? 'Eny' : '';
            if (item.lastAssignment !== undefined && item.lastAssignment) {
                studentData.lastAssignment = dateFormat(item.lastAssignment, "mm/dd/yyyy");
            }
            if (item.lastBRead !== undefined && item.lastBRead) {
                studentData.lastBRead = dateFormat(item.lastBRead, "mm/dd/yyyy");
            }
            if (item.lastInitialCall !== undefined && item.lastInitialCall) {
                studentData.lastInitialCall = dateFormat(item.lastInitialCall, "mm/dd/yyyy");
            }
            if (item.lastReturnVisit !== undefined && item.lastReturnVisit) {
                studentData.lastReturnVisit = dateFormat(item.lastReturnVisit, "mm/dd/yyyy");
            }
            if (item.lastBibleStudy !== undefined && item.lastBibleStudy) {
                studentData.lastBibleStudy = dateFormat(item.lastBibleStudy, "mm/dd/yyyy");
            }
            if (item.lastTalk !== undefined && item.lastTalk) {
                studentData.lastTalk = dateFormat(item.lastTalk, "mm/dd/yyyy");
            }
            sheet.content.push(studentData);
        }

        data.push(sheet);

        let xlsx = require('json-as-xlsx')
        let settings = {
            fileName: 'Lisitra_Mpianatra', // Name of the spreadsheet
            extraLength: 0, // A bigger number means that columns will be wider
            writeOptions: {} // Style options from https://github.com/SheetJS/sheetjs#writing-options
        }

        xlsx(data, settings)
    }

    return ( 
        <>
            {isStudentDelete && (
                <Dialog
                    open={isStudentDelete}
                    onClose={handleClose}
                >
                    <DialogTitle>
                        <Box sx={{lineHeight: 1.2}}>
                            Hamafa an’i: {currentStudent.name}?
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Tianao hofafana ao amin’ny rakitra fitehirizana ve io mpianatra io?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDelete} color="primary">
                            Hamafa
                        </Button>
                        <Button onClick={handleClose} color="primary" autoFocus>
                            Aoka ihany
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Search>
                    <SearchIconWrapper>
                    <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Hikaroka…"
                        inputProps={{ 'aria-label': 'search' }}
                        onChange={(e) => handleSearchStudent(e.target.value)}
                    />
                </Search>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                    }}
                >
                    <IconButton sx={{padding: '2px'}} onClick={handleExportListForApps}>
                        <ShareIcon sx={{fontSize: '40px'}} />
                    </IconButton>
                    <IconButton sx={{padding: '2px'}} onClick={exportList}>
                        <ArchiveIcon sx={{fontSize: '40px'}} />
                    </IconButton>
                    <IconButton sx={{padding: '2px'}} onClick={() => setIsStudentAdd(true)}>
                        <AddCircleIcon sx={{fontSize: '40px'}} />
                    </IconButton>
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    marginBottom: '5px',
                    marginLeft: '5px',
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
                        marginBottom: '5px',
                    }}
                >
                    <MenuItem value="genderAll">Izy Rehetra</MenuItem>
                    <MenuItem value="isMale">Lahy</MenuItem>
                    <MenuItem value="isFemale">Vavy</MenuItem>
                </TextField>
                <TextField
                    id="outlined-select-schedule"
                    select
                    size="small"
                    value={assignment}
                    onChange={handleChangeAssignment}
                    sx={{ minWidth: '190px' }}
                >
                    <MenuItem value={5}>Anjara rehetra</MenuItem>
                    <MenuItem value={0}>Famakiana Baiboly</MenuItem>
                    <MenuItem value={1}>Fitoriana</MenuItem>
                    <MenuItem value={2}>Fiverenena Mitsidika</MenuItem>
                    <MenuItem value={3}>Fampianarana Baiboly</MenuItem>
                    <MenuItem value={4}>Lahateny</MenuItem>
                </TextField>
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