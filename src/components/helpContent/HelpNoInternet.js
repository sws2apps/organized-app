import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import appNoInternet from '../../img/appNoInternet.png';

const HelpNoInternet = () => {
	const { t } = useTranslation();

	return (
		<div>
			<Typography variant='body1' gutterBottom>
				{t('help.aAlwaysInternet')}
			</Typography>
			<img src={appNoInternet} alt='No internet banner' className='imgHelp' />
		</div>
	);
};

export default HelpNoInternet;
