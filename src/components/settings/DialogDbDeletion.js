import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { deleteDb } from '../../indexedDb/dbUtility';
import { useEffect } from 'react';

const DialogDbDeletion = (props) => {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        props.setOpen(false);
    };

    const handleDelete = async () => {
        await deleteDb();
        window.location.href = './';
    };

    useEffect(() => {
        setOpen(props.open)
    }, [props.open])

    return ( 
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Hofafana tanteraka ve ny rakitra LMM-OA?"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Ho voafafa daholo ny rakitra rehetra momba ny LMM-OA, anisan’izany ny lisitry ny mpianatra, fandaharana, mombamomba ny fiangonana.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Aoka ihany
                </Button>
                <Button onClick={handleDelete} color="primary" autoFocus>
                    Hamafa
                </Button>
                </DialogActions>
            </Dialog>
        </div>
     );
}
 
export default DialogDbDeletion;