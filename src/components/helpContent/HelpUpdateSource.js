import { useTranslation } from 'react-i18next';
import { Markup } from 'interweave';
import Typography from '@mui/material/Typography';

const HelpUpdateSource = () => {
	const { t } = useTranslation();

	return (
		<div>
			<Typography variant='body1'>
				<Markup content={t('help.aAddSourceMaterial')} />
			</Typography>
		</div>
	);
};

export default HelpUpdateSource;
