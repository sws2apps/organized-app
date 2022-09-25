import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppLanguage from '../root/AppLanguage';

const StartupHeader = ({ children }) => {
	return (
		<Box>
			<Box
				sx={{
					position: 'absolute',
					right: 10,
				}}
			>
				<AppLanguage isStartup />
			</Box>

			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: {
						xs: 'auto',
						sm: '90vh',
					},
					marginTop: {
						xs: '5px',
						sm: '',
					},
				}}
			>
				<Box
					sx={{
						margin: 'auto',
						border: {
							xs: 'none',
							sm: '2px solid #BFC9CA',
						},
						width: {
							xs: '90%',
							sm: '400px',
						},
						display: 'flex',
						justifyContent: 'center',
						padding: '10px',
						borderRadius: '10px',
						flexDirection: 'column',
						marginTop: {
							xs: '50px',
							sm: '',
						},
					}}
				>
					{children}
					<Typography
						sx={{
							marginTop: '10px',
							borderTop: '1px outset',
							fontSize: '12px',
							fontWeight: 'bold',
							color: '#707B7C',
							paddingTop: '2px',
						}}
					>
						{`v${process.env.REACT_APP_VERSION}`}
					</Typography>
				</Box>
			</Box>
		</Box>
	);
};

export default StartupHeader;
