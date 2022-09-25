import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import WhatsNewItem from '../whatsnew/WhatsNewItem';
import { appNotificationsState } from '../../appStates/appSettings';

const NotificationContent = ({ id, open, anchorEl, handleClose }) => {
	const { t } = useTranslation();
	const notifications = useRecoilValue(appNotificationsState);

	return (
		<Popover
			id={id}
			open={open}
			anchorEl={anchorEl}
			onClose={handleClose}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			sx={{ marginTop: '10px' }}
		>
			<Box
				sx={{
					backgroundColor: '#AEB6BF',
					maxWidth: '400px',
					padding: '10px',
				}}
			>
				{notifications.length > 0 && (
					<>
						{notifications.map((notification) => (
							<WhatsNewItem
								key={notification.id}
								announcement={notification}
								handlePopoverClose={handleClose}
							/>
						))}
					</>
				)}
				{notifications.length === 0 && (
					<Typography sx={{ fontSize: '12px' }}>
						{t('global.nothingNew')}
					</Typography>
				)}
			</Box>
		</Popover>
	);
};

export default NotificationContent;
