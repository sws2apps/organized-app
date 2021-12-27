import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';

const DialogAssignmentDelete = (props) => {
    const [scheduleName, setScheduleName] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [weekList, setWeekList] = useState([]);
    const [currentWeek, setCurrentWeek] = useState("");
    const [currentWeekFormat, setCurrentWeekFormat] = useState("");

    const handleDeleteAll = () => {
        props.setWeeksDelete(weekList);
        props.setIsDelete(true);
        props.setIsDlgActionOpen(true);
        props.setDlgAssDeleteOpen(false);
    }

    const handleDeleteWeek = () => {
        var obj = [];
        obj.push({value: currentWeek});
        props.setWeeksDelete(obj);
        props.setIsDelete(true);
        props.setIsDlgActionOpen(true);
        props.setDlgAssDeleteOpen(false);
    }

    const handleClose = () => {
        props.setDlgAssDeleteOpen(false);
    }

    useEffect(() => {
        setWeekList(props.weekList)
    }, [props.weekList])

    useEffect(() => {
        setIsOpen(props.dlgAssDeleteOpen)
    }, [props.dlgAssDeleteOpen])

    useEffect(() => {
        if (props.currentWeek !== "") {
            setCurrentWeek(props.currentWeek);
            const weekDate = props.currentWeek;
            const day = weekDate.split("/")[1];
            const month = weekDate.split("/")[0];
            const year = weekDate.split("/")[2];
            const weekDateFormatted = day + "/" + month + "/" + year;
            setCurrentWeekFormat(weekDateFormatted);
        }
    }, [props.currentWeek])

    useEffect(() => {
        if (props.scheduleName !== "") {
            const sched = props.scheduleName;
            const month = sched.split("/")[0];
            const year = sched.split("/")[1];
            var monthName = "";
            if (month === "01") {
                monthName = "Janoary"
            } else if (month === "02") {
                monthName = "Febroary"
            } else if (month === "03") {
                monthName = "Martsa"
            } else if (month === "04") {
                monthName = "Aprily"
            } else if (month === "05") {
                monthName = "Mey"
            } else if (month === "06") {
                monthName = "Jona"
            } else if (month === "07") {
                monthName = "Jolay"
            } else if (month === "08") {
                monthName = "Aogositra"
            } else if (month === "09") {
                monthName = "Septambra"
            } else if (month === "10") {
                monthName = "Oktobra"
            } else if (month === "11") {
                monthName = "Novambra"
            } else if (month === "12") {
                monthName = "Desambra"
            }
            const str = monthName + " " + year;
            setScheduleName(str);
        }
    }, [props.scheduleName])

    return ( 
        <Dialog
            open={isOpen}
            aria-labelledby="dialog-title"
            onClose={handleClose}
        >
            <DialogTitle id="dialog-title">
                <Typography variant="h6" component="p">Hamafa fanendrana</Typography>
            </DialogTitle>
            <DialogContent>
                <Typography>Tianao hofafana ve ny fanendrena rehetra amin’ny fandaharana {scheduleName}, sa ny amin’ny herinandron’ny {currentWeekFormat} ihany?</Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    autoFocus
                    onClick={handleDeleteAll}
                    color="primary"
                >
                    Fandaharana Rehetra
                </Button>
                <Button
                    autoFocus
                    onClick={handleDeleteWeek}
                    color="primary"
                >
                    {currentWeekFormat} ihany
                </Button>
                <Button onClick={handleClose} color="primary" autoFocus>
                    Tsia
                </Button>
            </DialogActions>
        </Dialog>
     );
}
 
export default DialogAssignmentDelete;