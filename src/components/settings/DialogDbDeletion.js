import { useRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { deleteDb } from '../../indexedDb/dbUtility';
import { isDeleteDbOpenState } from '../../appStates/appSettings';

const DialogDbDeletion = () => {
	const { t } = useTranslation();

	const [open, setOpen] = useRecoilState(isDeleteDbOpenState);

	const handleClose = () => {
		setOpen(false);
	};

	const handleDelete = async () => {
		await deleteDb();
		window.location.href = './';
	};

	return (
		<div>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-description'
			>
				<DialogTitle id='alert-dialog-title'>
					{t('settings.deleteDbTitle')}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id='alert-dialog-description'>
						{t('settings.deleteDbDesc')}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color='primary'>
						{t('global.cancel')}
					</Button>
					<Button onClick={handleDelete} color='primary' autoFocus>
						{t('global.delete')}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default DialogDbDeletion;
