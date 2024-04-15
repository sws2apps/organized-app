import { useTranslation } from 'react-i18next';
import dateFormat from 'dateformat';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import DevicesIcon from '@mui/icons-material/Devices';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const CongregationPersonPocketDevice = ({ device, handleDeleteDevice }) => {
	const { t } = useTranslation('ui');

	const formatLastSeen = (last_seen) => {
		return last_seen ? dateFormat(new Date(last_seen), t('shortDateTimeFormat')) : '';
	};

	const getInfoIP = () => {
		if (!device.visitor_details) return '';

		let result = device.visitor_details.ip;

		if (device.visitor_details.ipLocation?.country_name) {
			result += ` - ${device.visitor_details.ipLocation.country_name}`;
		}

		return result;
	};

	return (
		<Grid item key={device.visitorid} xs={12} md={6}>
			<Paper elevation={8} sx={{ padding: '10px' }}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						flexWrap: 'wrap',
						gap: '20px',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<DevicesIcon
							sx={{
								fontSize: '60px',
								marginRight: '10px',
								color: '#1976d2',
							}}
						/>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
							<Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>{`IP: ${getInfoIP()}`}</Typography>
							<Typography>{device.visitor_details?.browser || ''}</Typography>
							<Box>
								<Chip
									label={formatLastSeen(device.sws_last_seen)}
									sx={{
										backgroundColor: '#1976d2',
										color: 'white',
										fontWeight: 'bold',
									}}
								/>
							</Box>
						</Box>
					</Box>
					<Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
						<Button
							variant='outlined'
							color='error'
							sx={{ marginBottom: '10px' }}
							onClick={() => handleDeleteDevice(device.visitorid)}
						>
							{t('sessionRevoke')}
						</Button>
					</Box>
				</Box>
			</Paper>
		</Grid>
	);
};

export default CongregationPersonPocketDevice;
