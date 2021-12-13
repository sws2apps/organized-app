import { useRecoilState } from "recoil";
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { classCountState, meetingDayState } from "../../appStates/appCongregation";

const StepperMeetingDetails = () => {
    const [meetingDay, setMeetingDay] = useRecoilState(meetingDayState);
    const [classCount, setClassCount] = useRecoilState(classCountState);

    const handleMeetingDayChange = (e) => {
        setMeetingDay(e.target.value)
    }

    const handleClassChange = (e) => {
        setClassCount(e.target.value)
    }

    return ( 
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
            }}
        >
            <Typography variant="body2" paragraph>Ampidiro eto ambany ny andro hanaovana ny fivoriana andavanandro, sy ny isan’ny kilasy misy anjaran’ny mpianatra</Typography>
            <TextField
                id="outlined-select-day"
                select
                label="Andro hivoriana"
                value={meetingDay}
                defaultValue={3}
                onChange={handleMeetingDayChange}
                size="small"
                sx={{
                    minWidth: 150,
                    marginRight: '5px',
                    marginBottom: '10px',
                }}
            >
                <MenuItem value={1}>Alatsinainy</MenuItem>
                <MenuItem value={2}>Talata</MenuItem>
                <MenuItem value={3}>Alarobia</MenuItem>
                <MenuItem value={4}>Alakamisy</MenuItem>
                <MenuItem value={5}>Zoma</MenuItem>
                <MenuItem value={6}>Asabotsy</MenuItem>
            </TextField>
            <TextField
                id="outlined-select-class"
                select
                label="Isan’ny kilasy"
                value={classCount}
                defaultValue={1}
                onChange={handleClassChange}
                size="small"
                sx={{
                    minWidth: 100,
                    marginRight: '5px',
                    marginBottom: '10px',
                }}
            >
                <MenuItem value={1}>Kilasy 1</MenuItem>
                <MenuItem value={2}>Kilasy 2</MenuItem>
            </TextField>
        </Box>
     );
}
 
export default StepperMeetingDetails;