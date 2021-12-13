import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { dbAutoFill, dbDeleteWeekAssignment } from '../../indexedDb/dbSchedule';

const ScheduleActions = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(props.isDlgActionOpen);
    }, [props.isDlgActionOpen])

    useEffect(() => {
        const currentSchedule = props.scheduleName;
        const autoAssignSchedule = async () => {
            if ((currentSchedule !== "") && typeof currentSchedule !== "undefined") {
                await dbAutoFill(currentSchedule);
            }
            props.handleWeekChange(props.currentWeek);
            props.setIsDlgActionOpen(false);
        }

        const deleteAssignment = async () => {
            const allWeeks = props.weeks;
            if (allWeeks.length > 0) {
                for (let i=0; i < allWeeks.length; i++) {
                    await dbDeleteWeekAssignment(allWeeks[i].value);
                }
            }
            props.handleWeekChange(props.currentWeek);
            props.setIsDlgActionOpen(false);
        }

        if (props.type === "AutoFill") {
            autoAssignSchedule();
        } else if (props.type === "DeleteAssignment") {
            deleteAssignment();
        }

        return () => {
            //clean-up
        }
    }, [props])

    return ( 
        <Dialog
            open={isOpen}
            aria-labelledby="dialog-title"
        >
            <DialogTitle id="dialog-title">
                <Typography>Miandrasa kely ...</Typography>
            </DialogTitle>
            <DialogContent>
                <CircularProgress
                    color="secondary"
                    size={80}
                    disableShrink={true}
                    sx={{
                        display: 'flex',
                        margin: '10px auto',
                    }}
                />
            </DialogContent>
        </Dialog>
     );
}
 
export default ScheduleActions;