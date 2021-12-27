import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Box from "@mui/material/Box";
import CircleIcon from '@mui/icons-material/Circle';
import CircularProgress from '@mui/material/CircularProgress';
import FlashAutoIcon from '@mui/icons-material/FlashAuto';
import IconButton from '@mui/material/IconButton';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { apiHostState, isCongConnectedState, uidUserState } from '../appStates/appSettings';
import { congIDState, congNameState, congNumberState, congPasswordState } from '../appStates/appCongregation';
import { appMessageState, appSeverityState, appSnackOpenState } from '../appStates/appNotification';
import { dbUpdateAppSettings } from '../indexedDb/dbAppSettings';

const Administration = () => {
    const { t } = useTranslation();

    const [isNewID, setIsNewID] = useState(false);
    const [isFailedConnect, setIsFailedConnect] = useState(false);
    const [isIddle, setIsIddle] = useState(false);
    const [isGenerate, setIsGenerate] = useState(false);

    const [congID, setCongID] = useRecoilState(congIDState);
    const [congPassword, setCongPassword] = useRecoilState(congPasswordState);
    const [isConnected, setIsConnected] = useRecoilState(isCongConnectedState);

    const [congTempID, setCongTempID] = useState(congID);
    const [congTempPassword, setCongTempPassword] = useState(congPassword);

    const apiHost = useRecoilValue(apiHostState);
    const uidUser = useRecoilValue(uidUserState);

    const congName = useRecoilValue(congNameState);
    const congNumber = useRecoilValue(congNumberState);

    const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
    const setAppSeverity = useSetRecoilState(appSeverityState);
    const setAppMessage = useSetRecoilState(appMessageState);

    const handleChangeID = (e) => {
        setCongTempID(e.target.value);
        setIsNewID(false);
    }

    const handleGenerateCongPIN = () => {
        setIsGenerate(true);
        if (apiHost !== '') {
            fetch(`${apiHost}api/generate-congregation-id`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    uid: uidUser,
                },
            })
            .then(async (res) => {
                const data = await res.json();
                if (res.status === 200) {
                    setCongTempID(data.message);
                    setIsNewID(true);
                } else {
                    let warnMsg;
                    if (data.message === 'FORBIDDEN') {
                        warnMsg = t("administration.warnForbidden")
                    } else {
                        warnMsg = t("global.errorTryAgain");
                    }
                    setAppMessage(warnMsg);
                    setAppSeverity('warning');
                    setAppSnackOpen(true);
                }
                setIsGenerate(false);
            })
            .catch((err) => {
                setIsGenerate(false);
                setAppMessage(err.message);
                setAppSeverity('error');
                setAppSnackOpen(true);
            })
        }
    }

    const resetLoginInfo = () => {
        setCongTempID(congID);
        setCongTempPassword(congPassword);
    }

    const handleCreateCongAccount = async () => {
        setIsIddle(true);
        setIsConnected(false);
        setIsFailedConnect(false);

        const reqPayload = {
            cong_id: congTempID,
            cong_password: congTempPassword,
            cong_name: congName,
            cong_number: congNumber,
        }

        if (apiHost !== '') {
            fetch(`${apiHost}api/create-congregation-account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    uid: uidUser,
                },
                body: JSON.stringify(reqPayload),
            })
            .then(async (res) => {
                const data = await res.json();
                if (res.status === 200) {
                    await dbUpdateAppSettings({
                        cong_id: congTempID,
                        cong_password: congTempPassword,
                    })
                    setCongID(congTempID);
                    setCongPassword(congTempPassword);
                    setIsIddle(false);
                    setIsConnected(true);
                } else {
                    let warnMsg;
                    if (data.message === 'FORBIDDEN') {
                        warnMsg = t("administration.warnForbidden")
                    } else {
                        warnMsg = t("global.errorTryAgain");
                    }
                    setAppMessage(warnMsg);
                    setAppSeverity('warning');
                    setAppSnackOpen(true);
                    setIsIddle(false);
                    setIsFailedConnect(true);
                }
            })
            .catch((err) => {
                setIsIddle(false);
                setIsFailedConnect(true);
                setAppMessage(err.message);
                setAppSeverity('error');
                setAppSnackOpen(true);
            })
        }
    }

    const handleSaveCongInfo = () => {
        console.log(isNewID);
    }

    return ( 
        <Box>
            <Box
                sx={{
                    borderBottom: '1px solid black',
                    paddingBottom: '10px',
                    marginRight: '5px',
                    marginLeft: '2px',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '15px',
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 'bold',
                            lineHeight: '1.2',
                        }}
                    >
                        {t("administration.congConnectInfo")}
                    </Typography>
                    <Tooltip
                        title={isIddle ? t("administration.iddleConnection") : isFailedConnect ? t("administration.failedConnection") : isConnected ? t("administration.connected") : t("administration.notConnected")}
                    >
                        <CircleIcon sx={{color: `${isIddle ? 'orange' : isFailedConnect ? 'red' : isConnected ? 'green' : 'black'}`}} />
                    </Tooltip>
                </Box>                
                
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                    }}
                >
                    <Box>
                        <TextField
                            label={t("administration.congregationId")}
                            variant="outlined"
                            type="number"
                            size="small"
                            sx={{
                                width: '220px',
                                marginRight: '13px',
                                marginBottom: '10px',
                            }}
                            value={congTempID}
                            onChange={handleChangeID}
                        />
                        {isGenerate && (
                            <CircularProgress
                                disableShrink
                                color="secondary"
                                size={'30px'}
                                sx={{
                                    marginRight: '8px',
                                    marginTop: '3px',
                                }}
                            />
                        )}
                        {!isGenerate && (
                            <Tooltip title={t("administration.generateCongID")}>
                                <IconButton
                                    color="inherit"
                                    edge="start"
                                    sx={{
                                        marginRight: '5px'
                                    }}
                                    onClick={handleGenerateCongPIN}
                                >
                                    <FlashAutoIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                        <TextField
                            label={t("administration.congregationPassphrase")}
                            variant="outlined"
                            size="small"
                            type="password"
                            sx={{
                                width: '180px',
                                marginBottom: '10px',
                            }}
                            value={congTempPassword}
                            onChange={(e)=> setCongTempPassword(e.target.value)}
                        />
                    </Box>
                    <Box
                        sx={{
                            marginLeft: '10px',
                            display: 'flex',
                        }}
                    >
                        <Tooltip title={t("global.undo")}>
                            <IconButton
                                color="inherit"
                                edge="start"
                                sx={{marginRight: '5px'}}
                                onClick={resetLoginInfo}
                            >
                                <SettingsBackupRestoreIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={isNewID ? t("administration.createAccount") : t("administration.connectToCongregaton")}>
                            <span>
                                <IconButton
                                    color="inherit"
                                    edge="start"
                                    onClick={isNewID ? handleCreateCongAccount : handleSaveCongInfo}
                                >
                                    <InsertLinkIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    borderBottom: '1px solid black',
                    paddingBottom: '10px',
                    marginRight: '5px',
                    marginTop: '10px',
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 'bold',
                        lineHeight: '1.2',
                    }}
                >
                    {t("administration.swsPocketAccess")}
                </Typography>
            </Box>
        </Box>
     );
}
 
export default Administration;