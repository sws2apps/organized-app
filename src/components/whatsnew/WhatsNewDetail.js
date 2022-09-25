import { useRecoilValue } from 'recoil';
import { Markup } from 'interweave';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { appLangState } from '../../appStates/appSettings';

const WhatsNewDetail = ({ announcement, setItem, setIsView }) => {
	const appLang = useRecoilValue(appLangState);

	return (
		<Box>
			<Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
				{announcement.content[appLang.toUpperCase()].title}
			</Typography>
			<Box>
				<Markup content={announcement.content[appLang.toUpperCase()].content} />
			</Box>
		</Box>
	);
};

export default WhatsNewDetail;
