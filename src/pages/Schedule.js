import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import AssignmentIcon from '@mui/icons-material/Assignment';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import FlashAutoIcon from '@mui/icons-material/FlashAuto';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import { dbGetScheduleListByYear, dbGetSourceMaterial, dbGetWeekListBySched, dbGetYearList } from "../indexedDb/dbSourceMaterial";
import { dbGetScheduleData } from "../indexedDb/dbSchedule";
import ScheduleDetails from "../components/schedule/ScheduleDetails";
import DialogAutoFill from "../components/schedule/DialogAutoFill";
import ScheduleActions from "../components/schedule/ScheduleActions";
import DialogAssignmentDelete from "../components/schedule/DialogAssignmentDelete";

const sharedStyles = {
    btnSchedule: {
        margin: '0 2px 2px 0',
    },
};

const Schedule = (props) => {
    let history = useHistory();
    const [years, setYears] = useState([]);
    const [currentYear, setCurrentYear] = useState("");
    const [schedules, setSchedules] = useState([]);
    const [currentSchedule, setCurrentSchedule] = useState("");
    const [weeks, setWeeks] = useState([]);
    const [currentWeek, setCurrentWeek] = useState("");
    const [weeksDelete, setWeeksDelete] = useState([]);
    const [scheduleParams, setScheduleParams] = useState({});
    const [dlgAutoFillOpen, setDlgAutoFillOpen] = useState(false);
    const [dlgAssDeleteOpen, setDlgAssDeleteOpen] = useState(false);
    const [isDlgActionOpen, setIsDlgActionOpen] = useState(false);
    const [isAutoFill, setIsAutoFill] = useState(false);
    const [isS89, setIsS89] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    let isMenuOpen = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAutoFill = () => {
        setDlgAutoFillOpen(true);
    }

    const handleS89 = () => {
        setIsS89(true);
    }

    const handleDeleteAssignment = () => {
        setDlgAssDeleteOpen(true);
    }

    const renderYearList = year => {
        return (
            <MenuItem key={year.value} value={year.value}>{year.label}</MenuItem>
        );
    }

    const renderScheduleList = schedule => {
        return (
            <MenuItem key={schedule.value} value={schedule.value}>{schedule.label}</MenuItem>
        );
    }

    const handleYearChange = async (e) => {
        setIsS89(false);
        setCurrentYear(e.target.value);
        const scheduleData = await dbGetScheduleListByYear(e.target.value);
        setCurrentSchedule("");
        setSchedules(scheduleData);
        handleScheduleChange(scheduleData[0].value);
    }

    const handleScheduleChange = async (value) => {
        setIsS89(false);
        setCurrentSchedule(value);
        const weekData = await dbGetWeekListBySched(value);
        setCurrentWeek("");
        setWeeks(weekData);
        handleWeekChange(weekData[0].value);
    }

    const renderWeekList = week => {
        return (
            <MenuItem key={week.value} value={week.value}>{week.label}</MenuItem>
        );
    }

    const handleWeekChange = async (value) => {
        setIsS89(false);
        const scheduleData = await dbGetScheduleData(value);
        const sourceData = await dbGetSourceMaterial(value);
        setScheduleParams({...sourceData, ...scheduleData});
        setCurrentWeek(value);
    }

    const handlePreviewSchedule = () => {
        history.push({
            pathname: '/ScheduleTemplate',
            state: { currentSchedule }
        });
    }

    const handleSendScheduleToMSC = async () => {

    }

    const handleShareSchedule = async () => {
        
    }

    useEffect(() => {
        let mounted = true;

        const getSchedules = async () => {
            const years = await dbGetYearList();
            setYears(years);
            const year = years[0].value;
            setCurrentYear(year);
            const data = await dbGetScheduleListByYear(year);
            setSchedules(data);
            const sched = data[0].value;
            setCurrentSchedule(sched);
            const weekData = await dbGetWeekListBySched(sched);
            setWeeks(weekData);
            const scheduleData = await dbGetScheduleData(weekData[0].value);
            const sourceData = await dbGetSourceMaterial(weekData[0].value);
            setScheduleParams({...sourceData, ...scheduleData});
            setCurrentWeek(weekData[0].value);
        };

        if (mounted === true) {
            getSchedules();
        }

        return (() => {
            mounted = false;
        })
    }, [])

    return ( 
        <Box sx={{marginRight: '5px'}}>
            {dlgAutoFillOpen && (
                <DialogAutoFill
                    scheduleName={currentSchedule}
                    dlgAutoFillOpen={dlgAutoFillOpen}
                    setIsAutoFill={(value) => setIsAutoFill(value)}
                    setDlgAutoFillOpen={(value) => setDlgAutoFillOpen(value)}
                    setIsDlgActionOpen={(value) => setIsDlgActionOpen(value)}
                />
            )}
            {dlgAssDeleteOpen && (
                <DialogAssignmentDelete
                    weekList={weeks}
                    currentWeek={currentWeek}
                    scheduleName={currentSchedule}
                    dlgAssDeleteOpen={dlgAssDeleteOpen}
                    setIsDelete={(value) => setIsDelete(value)}
                    setWeeksDelete={(value) => setWeeksDelete(value)}
                    setDlgAssDeleteOpen={(value) => setDlgAssDeleteOpen(value)}
                    setIsDlgActionOpen={(value) => setIsDlgActionOpen(value)}
                />
            )}
            {isDlgActionOpen && (
                <ScheduleActions
                    scheduleName={currentSchedule}
                    isDlgActionOpen={isDlgActionOpen}
                    setIsDlgActionOpen={(value) => setIsDlgActionOpen(value)}
                    currentWeek={currentWeek}
                    handleWeekChange={handleWeekChange}
                    weeks={weeksDelete}
                    type={isAutoFill ? "AutoFill" : isDelete ? "DeleteAssignment" : ""}
                />
            )}
            {schedules.length > 0 && (
                <>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            marginTop: '10px',
                        }}
                    >
                        <div>
                            <TextField
                                id="outlined-select-year"
                                select
                                label="Taona"
                                value={currentYear}
                                onChange={(e) => handleYearChange(e)}
                                size="small"
                                sx={{
                                    minWidth: '80px',
                                    marginRight: '5px',
                                    marginBottom: '10px',
                                }}
                            >
                                {years.map(year => renderYearList(year))}
                            </TextField>
                            {schedules.length > 0 && (
                                <TextField
                                    id="outlined-select-schedule"
                                    select
                                    label="Fandaharana"
                                    value={currentSchedule}
                                    onChange={(e) => handleScheduleChange(e.target.value)}
                                    size="small"
                                    sx={{
                                        minWidth: '130px',
                                        marginRight: '5px',
                                        marginBottom: '10px',
                                    }}
                                >
                                    {schedules.map(schedule => renderScheduleList(schedule))}
                                </TextField>
                            )}
                            {weeks.length > 0 && (
                                <TextField
                                    id="outlined-select-week"
                                    select
                                    label="Herinandro"
                                    value={currentWeek}
                                    onChange={(e) => handleWeekChange(e.target.value)}
                                    size="small"
                                    sx={{
                                        minWidth: '140px',
                                        marginRight: '5px',
                                        marginBottom: '10px',
                                    }}
                                >
                                    {weeks.map(week => renderWeekList(week))}
                                </TextField>
                            )}
                        </div>
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<FlashAutoIcon />}
                                sx={sharedStyles.btnSchedule}
                                onClick={() => handleAutoFill()}
                            >
                                Hameno ho azy
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<SaveAltIcon />}
                                sx={sharedStyles.btnSchedule}
                                onClick={handlePreviewSchedule}
                            >
                                PDF
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={sharedStyles.btnSchedule}
                                startIcon={<SendIcon />}
                                onClick={handleClick}
                                aria-controls="basic-menu"
                                aria-haspopup="true"
                                aria-expanded={isMenuOpen ? 'true' : undefined}
                            >
                                Hizara
                            </Button>
                            <Menu
                                id="basic-menu"
                                disableScrollLock={true}
                                anchorEl={anchorEl}
                                open={isMenuOpen}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={handleSendScheduleToMSC}>
                                    Alefa MSC
                                </MenuItem>
                                <MenuItem onClick={handleShareSchedule}>
                                    Mpianatra rehetra
                                </MenuItem>
                            </Menu>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={sharedStyles.btnSchedule}
                                startIcon={<AssignmentIcon />}
                                onClick={() => handleS89()}
                            >
                                S-89
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                sx={sharedStyles.btnSchedule}
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDeleteAssignment()}
                            >
                                Hamafa
                            </Button>
                        </div>
                    </Box>
                    <div>
                        {currentWeek && (
                            <ScheduleDetails
                                isS89={isS89}
                                setIsS89={(value) => setIsS89(value)}
                                currentSchedule={currentSchedule}
                                scheduleParams={scheduleParams}
                            />
                        )}
                    </div>
                </>
            )}
        </Box>
     );
}
 
export default Schedule;