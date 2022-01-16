import { useTranslation } from 'react-i18next';
import parse from 'html-react-parser';
import Typography from '@mui/material/Typography';

const HelpUpdateSource = () => {
	const { t } = useTranslation();

	return (
		<div>
			<Typography variant='body1'>
				{parse(t('help.aAddSourceMaterial'))}
			</Typography>
		</div>
	);
};

export default HelpUpdateSource;
