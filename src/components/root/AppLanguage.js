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

const AppLanguage = (props) => {
    const { t, i18n } = useTranslation();
    const { isStartup } = props;

    const [anchorEl, setAnchorEl] = useState(null);

    const [appLang, setAppLang] = useRecoilState(appLangState);

    const blueColor = blue[400];

    const listLangs = [
        {langName: 'English', langCode: 'e'},
        {langName: 'Malagasy', langCode: 'mg'},
    ]

    let isMenuOpen = Boolean(anchorEl);

    const handleLangChange = async (e) => {
        setAppLang(e.target.parentElement.dataset.code);
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
            i18n.changeLanguage(appLang);

            const isExist = await isDbExist();
            
            if (isExist) {
                await dbUpdateAppSettings({
                    app_lang: appLang,
                });
            }
        }
        
        updateLang();
    }, [appLang, i18n])

    return ( 
        <>
            <Tooltip title={t("global.changeLanguage")}>
                <IconButton
                    color='inherit'
                    edge="start"
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
                id="menu-language"
                disableScrollLock={true}
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleClose}
                sx={{padding: 0}}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
                }}
            >
                {listLangs.map(lang => (
                    <MenuItem
                        key={lang.langCode}
                        onClick={handleLangChange}
                        sx={{padding: 0}}
                    >
                        <ListItemText
                            data-code={lang.langCode}
                        >
                            <Typography sx={{padding: '6px 16px'}}>{lang.langName}</Typography>
                        </ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </>
     );
}
 
export default AppLanguage;