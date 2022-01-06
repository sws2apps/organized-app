import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import TranslateIcon from '@mui/icons-material/Translate';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import { appLangState } from '../../appStates/appSettings';
import { dbUpdateAppSettings } from '../../indexedDb/dbAppSettings';
import { isDbExist } from '../../indexedDb/dbUtility';
import { langList } from '../../locales/langList';

const AppLanguage = (props) => {
	const { t, i18n } = useTranslation();
	const { isStartup } = props;

	const [anchorEl, setAnchorEl] = useState(null);

	const [appLang, setAppLang] = useRecoilState(appLangState);
	const [appLangLocal, setAppLangLocal] = useState(appLang);

	const blueColor = blue[400];

	let isMenuOpen = Boolean(anchorEl);

	const handleLangChange = async (e) => {
		setAppLangLocal(e.target.parentElement.dataset.code);
		handleClose();
	};

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	useEffect(() => {
		const updateLang = async () => {
			i18n.changeLanguage(appLangLocal);
			setAppLang(appLangLocal);

			const isExist = await isDbExist();

			if (isExist) {
				await dbUpdateAppSettings({
					app_lang: appLangLocal,
				});
			}
		};

		updateLang();
	}, [appLangLocal, i18n, setAppLang]);

	return (
		<>
			<Tooltip title={t('global.changeLanguage')}>
				<IconButton
					color='inherit'
					edge='start'
					sx={{
						marginRight: '8px',
						backgroundColor: isStartup ? blueColor : null,
					}}
					onClick={handleClick}
				>
					<TranslateIcon />
				</IconButton>
			</Tooltip>
			<Menu
				id='menu-language'
				disableScrollLock={true}
				anchorEl={anchorEl}
				open={isMenuOpen}
				onClose={handleClose}
				sx={{ padding: 0 }}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
			>
				{langList.map((lang) => (
					<MenuItem
						key={lang.code}
						onClick={handleLangChange}
						sx={{ padding: 0 }}
					>
						<ListItemText data-code={lang.code}>
							<Typography sx={{ padding: '6px 16px' }}>{lang.name}</Typography>
						</ListItemText>
					</MenuItem>
				))}
			</Menu>
		</>
	);
};

export default AppLanguage;
