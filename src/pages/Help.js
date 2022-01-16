import { useTranslation } from 'react-i18next';
import { styled } from '@mui/styles';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import HelpBrowserSupport from '../components/helpContent/HelpBrowserSupport';
import HelpUpdateSource from '../components/helpContent/HelpUpdateSource';
import HelpLiveClass from '../components/helpContent/HelpLiveClass';
import HelpNoInternet from '../components/helpContent/HelpNoInternet';
import HelpInstallPwa from '../components/helpContent/HelpInstallPwa';

const sharedStyles = {
	heading: {
		fontWeight: 'bold',
	},
};

const AccordingFaqItem = styled(Accordion)(() => ({
	marginBottom: '10px',
}));

const TypographyFaqSubheading = styled(Typography)(() => ({
	marginBottom: '10px',
	fontWeight: 'bold',
	backgroundColor: '#2C3E50',
	color: 'white',
	padding: '5px',
	borderRadius: '10px',
}));

const Help = () => {
	const { t } = useTranslation();
	return (
		<Box sx={{ margin: '0 20px 0 15px' }}>
			<Typography
				variant='h6'
				color='primary'
				sx={{
					lineHeight: '1.2',
					marginBottom: '15px',
				}}
			>
				Life and Ministry Meeting - Overseer Assistant (LMM-OA)
			</Typography>
			<Typography variant='body1' sx={{ marginBottom: '10px' }}>
				{t('help.headDesc')}
			</Typography>
			<TypographyFaqSubheading>{t('help.aboutApps')}</TypographyFaqSubheading>
			<AccordingFaqItem>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography variant='body1' sx={sharedStyles.heading}>
						{t('help.qDeviceSupported')}
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<HelpBrowserSupport />
				</AccordionDetails>
			</AccordingFaqItem>
			<AccordingFaqItem>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography variant='body1' sx={sharedStyles.heading}>
						{t('help.qAlwaysBrowser')}
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<HelpInstallPwa />
				</AccordionDetails>
			</AccordingFaqItem>
			<AccordingFaqItem>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography variant='body1' sx={sharedStyles.heading}>
						{t('help.qAlwaysInternet')}
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<HelpNoInternet />
				</AccordionDetails>
			</AccordingFaqItem>
			<TypographyFaqSubheading>{t('help.scheduling')}</TypographyFaqSubheading>
			<AccordingFaqItem>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography variant='body1' sx={sharedStyles.heading}>
						{t('help.qCovidSchedule')}
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<HelpLiveClass />
				</AccordionDetails>
			</AccordingFaqItem>
			<TypographyFaqSubheading>
				{t('help.sourceMaterial')}
			</TypographyFaqSubheading>
			<AccordingFaqItem>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography variant='body1' sx={sharedStyles.heading}>
						{t('help.qAddSourceMaterial')}
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<HelpUpdateSource />
				</AccordionDetails>
			</AccordingFaqItem>
		</Box>
	);
};

export default Help;
