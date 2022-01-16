import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import installBanner from '../../img/installBanner.png';

const HelpInstallPwa = () => {
	const { t } = useTranslation();

	return (
		<div>
			<Typography gutterBottom>{t('help.aAlwaysBrowser1')}</Typography>
			<Typography>{t('help.aAlwaysBrowser2')}</Typography>
			<img src={installBanner} alt='Install Banner' className='imgHelp' />
			<Typography gutterBottom>{t('help.aAlwaysBrowser3')}</Typography>
			<Typography>{t('help.aAlwaysBrowser4')}</Typography>
		</div>
	);
};

export default HelpInstallPwa;
