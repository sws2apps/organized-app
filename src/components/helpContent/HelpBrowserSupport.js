import { useTranslation } from 'react-i18next';
import { styled } from '@mui/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

const ListItemCustom = styled(ListItem)(() => ({
	paddingTop: '0px',
	paddingBottom: '0px',
}));

const HelpBrowserSupport = () => {
	const { t } = useTranslation();

	return (
		<div>
			<Typography>{t('help.aDeviceSupported')}</Typography>
			<List>
				<ListItemCustom>
					<ListItemText primary='Chrome 53+' />
				</ListItemCustom>
				<ListItemCustom>
					<ListItemText primary='Edge 17+' />
				</ListItemCustom>
				<ListItemCustom>
					<ListItemText primary='Firefox 49+' />
				</ListItemCustom>
				<ListItemCustom>
					<ListItemText primary='Samsung Internet (Android)' />
				</ListItemCustom>
				<ListItemCustom>
					<ListItemText primary='Safari 10+' />
				</ListItemCustom>
			</List>
		</div>
	);
};

export default HelpBrowserSupport;
