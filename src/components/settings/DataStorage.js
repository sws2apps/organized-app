import { useState } from "react";
import { fileDialog } from 'file-select-dialog';
import BackupIcon from '@mui/icons-material/Backup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Divider from '@mui/material/Divider';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SaveIcon from '@mui/icons-material/Save';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import Typography from '@mui/material/Typography';
import { dbExportDb } from "../../indexedDb/dbUtility";

const DataStorage = (props) => {
    const [anchorEl, setAnchorEl] = useState(null);

    let isMenuOpen = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    }

    const backupDb = async () => {
        handleClose();
        await dbExportDb();
    };

    const prepBackupDbOnline = async () => {

    }

    const restoreDb = async () => {
        handleClose();
        const file = await fileDialog({
            accept: '.db',
            strict: true
        });

        const getEncryptedText = () => {
            return new Promise((resolve, reject) => {
                let reader = new FileReader();
                reader.readAsText(file); 
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        };

        const backupData = await getEncryptedText()

        try {
            const myKey = '';
            const Cryptr = require('cryptr');
            const cryptr = new Cryptr(myKey);
            const decryptedData =  cryptr.decrypt(backupData);
            fetch(decryptedData)
            .then(res => res.blob())
            .then(blob => {
                props.setJsonFile(blob);
                props.setIsRedirect(true);
            })
        } catch (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (error.message === "Unsupported state or unable to authenticate data") {
                props.setAppSnackOpen(true);
                props.setAppSeverity("error");
                props.setAppMessage("Tsy afaka mamerina io rakitra fiandry io ny kaody manokana ampiasainao izao.");
            } else {
                props.setAppSnackOpen(true);
                props.setAppSeverity("error");
                props.setAppMessage(`(${errorCode}) ${errorMessage}`);
            }
        }
    };

    const prepRestoreDbOnline = async () => {

    }

    const handleDelete = () => {
        
    }

    return ( 
        <>
            <Typography variant="h6" color="primary" className={"settingHeader"}>FITEHIRIZANA</Typography>
            <div className={"settingSubItem"}>
            <Box>
                <Button
                    variant="contained"
                    color="primary"
                    className={"btnSubItem"}
                    startIcon={<SettingsBackupRestoreIcon />}
                    aria-controls="basic-menu"
                    aria-haspopup="true"
                    aria-expanded={isMenuOpen ? 'true' : undefined}
                    onClick={handleClick}
                >
                    Rakitra Fiandry
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
                    <MenuItem onClick={backupDb}>
                        <ListItemIcon>
                            <SaveIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Hamorona</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={prepBackupDbOnline}>
                        <ListItemIcon>
                            <BackupIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Hamorona (Internet)</ListItemText>
                    </MenuItem>
                    <Divider />                            
                    <MenuItem onClick={restoreDb}>
                        <ListItemIcon>
                            <DownloadForOfflineIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Hampiditra</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={prepRestoreDbOnline}>
                        <ListItemIcon>
                            <CloudDownloadIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Hampiditra (Internet)</ListItemText>
                    </MenuItem>
                </Menu>
            </Box>
            </div>
            <div className={"settingSubItem"}>
                <Box>
                    <Typography variant="body2">Hamafa tanteraka ny rakitra ampiasain’ny LMM-OA.</Typography>
                </Box>
                <Button
                    variant="contained"
                    color="error"
                    className={"btnSubItem"}
                    startIcon={<DeleteForeverIcon />}
                    onClick={() => handleDelete()}
                >
                    Hamafa
                </Button>
            </div>
        </>
     );
}
 
export default DataStorage;