import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';

const DialogAutoFill = (props) => {
    const [scheduleName, setScheduleName] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleAutoFill = () => {
        props.setIsAutoFill(true);
        props.setIsDlgActionOpen(true);
        props.setDlgAutoFillOpen(false);
    }

    const handleClose = () => {
        props.setDlgAutoFillOpen(false);
    }

    useEffect(() => {
        setIsOpen(props.dlgAutoFillOpen)
    }, [props.dlgAutoFillOpen])

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
                <Typography variant="h6" component="p">Hameno ho azy fandaharana</Typography>
            </DialogTitle>
            <DialogContent>
                <Typography>Tianao hofenoina ho azy ve ny fandaharana {scheduleName}?</Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    autoFocus
                    onClick={handleAutoFill}
                    color="primary"
                >
                    Eny
                </Button>
                <Button onClick={handleClose} color="primary" autoFocus>
                    Tsia
                </Button>
            </DialogActions>
        </Dialog>
     );
}
 
export default DialogAutoFill;