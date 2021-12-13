import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { dbGetAppSettings, dbUpdateAppSettings } from "../../indexedDb/dbAppSettings";

const BasicSettings = (props) => {
    const [congName, setCongName] = useState("");
    const [congNumber, setCongNumber] = useState("");
    const [isErrorCongName, setIsErrorCongName] = useState(false);
    const [isErrorCongNumber, setIsErrorCongNumber] = useState(false);
    const [meetingDay, setMeetingDay] = useState(3);
    const [classCount, setClassCount] = useState(1);
    const [liveClass, setLiveClass] = useState(false);

    const handleCongNameChange = (value) => {
        if (value) {
            setIsErrorCongName(false);
        } else {
            setIsErrorCongName(true);
        }
        setCongName(value);
    }

    const handleCongNumberChange = (value) => {
        if (value) {
            setIsErrorCongNumber(false);
        } else {
            setIsErrorCongNumber(true);
        }
        setCongNumber(value);
    }

    const handleMeetingDayChange = (e) => {
        setMeetingDay(e.target.value)
    }

    const handleClassChange = (e) => {
        setClassCount(e.target.value)
    }

    const saveAppSettings = async () => {
        var obj = {};
        obj.cong_name = congName;
        obj.cong_number = congNumber;
        obj.class_count = classCount;
        obj.meeting_day = meetingDay;
        obj.liveEventClass = liveClass;
        await dbUpdateAppSettings(obj);
        props.setAppSnackOpen(true);
        props.setAppSeverity("success");
        props.setAppMessage("Vita ny fanavaozana ny mombamomba ny fiangonana");
    };

    useEffect(() => {
        const loadInfo = async () => {
            const appSettings = await dbGetAppSettings();
            setCongName(appSettings.cong_name);
            setCongNumber(appSettings.cong_number);
            setClassCount(appSettings.class_count);
            setMeetingDay(appSettings.meeting_day);
            setLiveClass(appSettings.liveEventClass);
        };
        loadInfo();
    }, [])

    return ( 
        <>
            <Typography
                variant="h6"
                color="primary"
                className={"settingHeader"}
                gutterBottom
            >
                MOMBAMOMBA NY FIANGONANA
            </Typography>
            <Typography variant="body2" paragraph>Ampidiro eto ambany ny anaran’ny fiangonana sy nomerao</Typography>
            <TextField
                id="outlined-basic"
                label="Fiangonana"
                variant="outlined"
                size="small"
                autoComplete='off'
                required
                error={isErrorCongName ? true : false}
                helperText={isErrorCongName ? "Mila fenoina" : null}
                sx={{
                    width: '320px',
                    marginRight: '5px',
                    marginBottom: '10px',
                }}
                value={congName}
                onChange={(e) => handleCongNameChange(e.target.value)}
            />
            <TextField
                id="outlined-basic"
                type="number"
                label="Nomerao"
                variant="outlined"
                size="small"
                autoComplete='off'
                required
                error={isErrorCongNumber ? true : false}
                helperText={isErrorCongName ? "Mila fenoina" : null}
                sx={{width: '120px'}}
                value={congNumber}
                onChange={(e) => handleCongNumberChange(e.target.value)}
            />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginTop: '10px',
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
            
            <FormControlLabel
                control={<Checkbox
                    checked={liveClass}
                    onChange={(e) => setLiveClass(e.target.checked)}
                    color="primary"
                />}
                label="Mpianatra afaka mandray anjara mivantana ihany"
            />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={() => saveAppSettings()}
                >
                    Hitahiry
                </Button>
            </Box>
        </>
     );
}
 
export default BasicSettings;