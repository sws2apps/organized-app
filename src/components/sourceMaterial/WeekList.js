import { useEffect, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { dbGetScheduleListByYear, dbGetWeekListBySched, dbGetYearList } from "../../indexedDb/dbSourceMaterial";

const WeekList = (props) => {
    const [years, setYears] = useState([]);
    const [currentYear, setCurrentYear] = useState("");
    const [schedules, setSchedules] = useState([]);
    const [currentSchedule, setCurrentSchedule] = useState("");
    const [weeks, setWeeks] = useState([]);
    const [currentWeek, setCurrentWeek] = useState("");

    const handleYearChange = async (e) => {
        setCurrentYear(e.target.value);
        const scheduleData = await dbGetScheduleListByYear(e.target.value);
        setCurrentSchedule("");
        setSchedules(scheduleData);
        handleScheduleChange(scheduleData[0].value);
    }

    const handleScheduleChange = async (value) => {
        setCurrentSchedule(value);
        const weekData = await dbGetWeekListBySched(value);
        setCurrentWeek("");
        setWeeks(weekData);
        handleWeekChange(weekData[0].value);
    }

    const handleWeekChange = (value) => {
        if (value !== undefined) {
            setCurrentWeek(value);
            props.setCurrentWeek(value);
        }
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

    const renderWeekList = week => {
        return (
            <MenuItem key={week.value} value={week.value}>{week.label}</MenuItem>
        );
    }

    useEffect(() => {
        let mounted = true;
        const getSchedules = async () => {
            const years = await dbGetYearList();            
            const year = years[0].value;            
            const data = await dbGetScheduleListByYear(year);            
            const sched = data[0].value;            
            const weekData = await dbGetWeekListBySched(sched);

            if (mounted) {
                setYears(years);
                setCurrentYear(year);
                setSchedules(data);
                setCurrentSchedule(sched);
                setWeeks(weekData);
                setCurrentWeek(weekData[0].value);
            }
        };

        if (mounted) {
            getSchedules();
        }
        
        return (() => {
            mounted = false;
        })
    }, [])

    useEffect(() => {
        const refreshData = async () => {
            const years = await dbGetYearList();
            setYears(years);
            const data = await dbGetScheduleListByYear(currentYear);
            setSchedules(data);
            const weekData = await dbGetWeekListBySched(currentSchedule);
            setWeeks(weekData);
        }

        if (props.isRender === true) {
            refreshData();
        }
    }, [props.isRender, currentYear, currentSchedule])

    useEffect(() => {
        if (currentWeek) {
            props.setCurrentWeek(currentWeek);
        }
        return (() => {
            //clean
        })
    }, [props, currentWeek])

    return ( 
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
     );
}
 
export default WeekList;