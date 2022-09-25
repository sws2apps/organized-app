import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import FlashAutoIcon from '@mui/icons-material/FlashAuto';
import FiberPinIcon from '@mui/icons-material/FiberPin';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { dbGetAppSettings } from "../../indexedDb/dbAppSettings";

const sharedStyles = {
    btnSubItem: {
        marginRight: '5px',
        marginBottom: '5px',
        display: 'flex',
        alignItems: 'center',
    },
    textBeforeField: {
        marginBottom: '10px',
    },
    inputCongID: {
        width: '210px',
        marginRight: '5px',
        marginBottom: '10px',
    },
    inputCongPIN: {
        width: '160px',
        marginBottom: '10px',
    },
}

const UseInternet = (props) => {
    const [congID, setCongID] = useState("");
    const [isErrorID, setIsErrorID] = useState(false);
    const [isLessID, setIsLessID] = useState(true);
    const [congPIN, setCongPIN] = useState("");
    const [isErrorPIN, setIsErrorPIN] = useState(false);
    const [isLessPIN, setIsLessPIN] = useState(true);
    const [isBtnDisabled, setIsBtnDisabled] = useState(false);

    const handleChangeID = (value) => {
        setIsErrorID(false);
        setIsLessID(false);

        if (value === "") {
            setCongID(value);
            setIsLessID(true);
        } else {
            if (value.length < 10) {
                setIsLessID(true);
                setIsErrorID(true);
            } else if (value.length === 10) {
                setIsLessID(false);
            }
            setCongID(parseInt(value, 10));
        }
    }

    const handleChangePIN = (value) => {
        setIsErrorPIN(false);
        setIsLessPIN(false);

        if (value === "") {
            setCongPIN(value);
            setIsLessPIN(true);
        } else {
            if (value.length < 6) {
                setIsLessPIN(true);
                setIsErrorPIN(true);
            } else if (value.length === 6) {
                setIsLessPIN(false);
            }
            setCongPIN(parseInt(value, 10));
        }
    }

    const handleSaveLogin = async () => {

    }

    const handleUserSignIn = () => {

    };

    const handleGenerateCongID = async () => {
       
    }

    useEffect(() => {
        const loadInfo = async () => {
            const appSettings = await dbGetAppSettings();
            if (appSettings.cong_ID !== undefined) {
                setCongID(appSettings.cong_ID);
                setIsLessID(false);
            }
            if (appSettings.cong_PIN !== undefined) {
                setCongPIN(appSettings.cong_PIN);
                setIsLessPIN(false);
            }
        };
        loadInfo();
    }, [])

    useEffect(() => {
        if (!isLessID && !isLessPIN) {
            setIsBtnDisabled(false);
        } else {
            setIsBtnDisabled(true);
        }
    }, [isLessID, isLessPIN])

    return ( 
        <>
            <Typography variant="h6" color="primary" className={"settingHeader"}>HAMPIASA INTERNET</Typography>
            <div className={"settingSubItem"}>
                <Box>
                    <Typography variant="body2">Mila manana kaonty Gmail aloha ianao raha tianao ny hampiasa internet. Ireto avy ny zavatra fanampiny azo atao ao amin’ny LMM-OA: mandefa rakitra fiandry any amin’ny internet, mandefa ny fandaharana misy ny anjaran’ny mpianatra any amin’ny Anti-panahy Mpandrindra, sy ny mpianatra rehetra.</Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    sx={sharedStyles.btnSubItem}
                    startIcon={<ExitToAppIcon />} //{isLoggedIn ? <ExitToAppIcon /> : <VpnKeyIcon />}
                    onClick={() => handleUserSignIn()}
                >
                    
                </Button>
            </div>
            <div className={"settingSubItem"}>
                <Box sx={sharedStyles.textBeforeField}>
                    <Typography variant="body2" gutterBottom>Hitanao eto ambany ny nomerao famantarana sy ny kaody miafina ampiasain’ny fiangonana raha te hizara fanazavana avy ato amin’ny LMM-OA.</Typography>
                </Box>
                <TextField
                    label="Nomerao famantarana"
                    variant="outlined"
                    type="number"
                    size="small"
                    required
                    error={isErrorID ? true : false}
                    helperText={isErrorID ? "10 fara fahakeliny" : null}
                    sx={sharedStyles.inputCongID}
                    value={congID}
                    onChange={(e) => handleChangeID(e.target.value)}
                />
                <TextField
                    label="Kaody miafina"
                    variant="outlined"
                    type="number"
                    size="small"
                    required
                    error={isErrorPIN ? true : false}
                    helperText={isErrorPIN ? "6 fara fahakeliny" : null}
                    sx={sharedStyles.inputCongPIN}
                    value={congPIN}
                    onChange={(e) => handleChangePIN(e.target.value)}
                />
                <Box sx={sharedStyles.btnSubItem} >
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={isBtnDisabled}
                        sx={sharedStyles.btnSubItem}
                        startIcon={<FiberPinIcon />}
                        onClick={handleSaveLogin}
                    >
                        Hitahiry
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={sharedStyles.btnSubItem}
                        startIcon={<FlashAutoIcon />}
                        onClick={handleGenerateCongID}
                    >
                        Vaovao
                    </Button>
                </Box>
            </div>
        </>
     );
}
 
export default UseInternet;