import { useEffect, useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import StorageIcon from '@mui/icons-material/Storage';
import Typography from '@mui/material/Typography';

const DialogDbBackup = (props) => {
    const { 
        backupDbOnline,
        backupType, 
        hasBackup, 
        backupDate, 
        backupDevice, 
        backupNewDevice,
        isLoadingBackup,
        open, 
        restoreDbOnline,
        setOpen
    } = props;
    const [isDisabled, setIsDisabled] = useState(true);
    const [dateFormat, setDateFormat] = useState("");

    const handleClose = () => {
        setOpen(false);
    };

    const handleDialogActions = () => {
        if (backupType === "backup") {
            backupDbOnline();
            handleClose();
        } else if (backupType === "restore") {
            restoreDbOnline();
            handleClose();
        }
    }

    useEffect(() => {
        if (backupDate !== "") {
            var timestamp = backupDate;
            var date = new Date(timestamp);
            setDateFormat(date.toLocaleDateString() + " " + date.toLocaleTimeString());
        }
    }, [backupDate])

    useEffect(() => {
        setIsDisabled(isLoadingBackup);
    }, [isLoadingBackup])

    return ( 
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Rakitra Fiandry</DialogTitle>
                <DialogContent>
                    <>
                        {isLoadingBackup && (
                            <CircularProgress
                                color="secondary"
                                size={80}
                                disableShrink={true}
                                sx={{
                                    display: 'flex',
                                    margin: '10px auto',
                                }}
                            />
                        )}
                        {!isLoadingBackup && (
                            <>
                                {(backupType === "backup") && (
                                    <>
                                        {hasBackup && (
                                            <>
                                                <Typography gutterBottom>Efa misy rakitra fiandry any amin’ny internet, ka tianao hosoloina ve?</Typography>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            flexDirection: 'column',
                                                        }}
                                                    >
                                                        <Typography sx={{fontWeight: 'bold'}} align="center">Vaovao</Typography>
                                                        <StorageIcon sx={{fontSize: '72px'}} color="primary" />
                                                        <Typography align="center">{backupNewDevice.split("|")[0]}</Typography>
                                                        <Typography sx={{fontSize: '11px'}} align="center">{backupNewDevice.split("|")[1]}</Typography>
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            width: '100px',
                                                            display: 'flex',
                                                            justifyContent: 'space-around',
                                                        }}
                                                    >
                                                        <ArrowForwardIcon fontSize="large" />
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            flexDirection: 'column',
                                                        }}
                                                    >
                                                        <Typography sx={{fontWeight: 'bold'}} align="center">Any amin’ny internet</Typography>
                                                        <StorageIcon sx={{fontSize: '72px'}} color="error" />
                                                        <Typography align="center">{backupDevice.split("|")[0]}</Typography>
                                                        <Typography sx={{fontSize: '11px'}} align="center">{backupDevice.split("|")[1]}</Typography>
                                                        <Typography sx={{fontSize: '11px'}} align="center">{dateFormat}</Typography>
                                                    </Box>
                                                </Box>
                                            </>
                                        )}
                                        {!hasBackup && (
                                            <>
                                                <Typography gutterBottom>Handefa rakitra fiandry any amin’ny internet:</Typography>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        flexDirection: 'column',
                                                    }}
                                                >
                                                    <StorageIcon sx={{fontSize: '72px'}} color="primary" />
                                                    <Typography align="center">{backupNewDevice.split("|")[0]}</Typography>
                                                    <Typography sx={{fontSize: '11px'}} align="center">{backupNewDevice.split("|")[1]}</Typography>
                                                </Box>
                                            </>
                                        )}
                                    </>
                                )}
                                {(backupType === "restore") && (
                                    <>
                                        <Typography>Hamerina rakitra fiandry avy any amin’ny internet</Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                flexDirection: 'column',
                                            }}
                                        >
                                            <StorageIcon sx={{fontSize: '72px'}} color="success" />
                                            <Typography align="center">{backupDevice.split("|")[0]}</Typography>
                                            <Typography sx={{fontSize: '11px'}} align="center">{backupDevice.split("|")[1]}</Typography>
                                            <Typography sx={{fontSize: '11px'}} align="center">{dateFormat}</Typography>
                                        </Box>
                                    </>
                                )}
                            </>
                        )}
                    </>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={isDisabled} color="primary">
                        Aoka ihany
                    </Button>
                    <Button onClick={handleDialogActions} disabled={isDisabled} color="primary" autoFocus>
                        Hanohy
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
     );
}
 
export default DialogDbBackup;