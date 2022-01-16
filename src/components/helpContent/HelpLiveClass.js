import { useTranslation } from 'react-i18next';
import parse from 'html-react-parser';
import Typography from '@mui/material/Typography';

const HelpLiveClass = () => {
	const { t } = useTranslation();
	return (
		<div>
			<Typography variant='body1' gutterBottom>
				{t('help.aCovidSchedule1')}
			</Typography>
			<Typography variant='body1' gutterBottom>
				{parse(t('help.aCovidSchedule2'))}
			</Typography>
		</div>
	);
};

export default HelpLiveClass;
