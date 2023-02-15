import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { Markup } from 'interweave';
import { useTheme } from '@mui/material';
import dateFormat from 'dateformat';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import IconButton from '@mui/material/IconButton';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Typography from '@mui/material/Typography';
import { dbReadNotification } from '../../indexedDb/dbNotifications';
import { appLangState } from '../../states/main';
import { LANGUAGE_LIST } from '../../locales/langList';
import { useState } from 'react';

const styles = {
  announcementAction: {
    borderRadius: '8px',
    '.MuiTouchRipple-ripple .MuiTouchRipple-child': {
      borderRadius: 0,
      backgroundColor: 'rgba(23, 32, 42, .3)',
    },
  },
};

const WhatsNewItem = ({ announcement }) => {
  const { t } = useTranslation('ui');

  const appLang = useRecoilValue(appLangState);

  const [sliceWord, setSliceWord] = useState('');
  const [publishedAt, setPublishedAt] = useState('');
  const [hasExpand, setHasExpand] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [bodyText, setBodyText] = useState('');

  const theme = useTheme();
  const largeView = useMediaQuery(theme.breakpoints.up('sm'), {
    noSsr: true,
  });

  const fldKey = LANGUAGE_LIST.find((language) => language.code === appLang).locale;

  const localeTitle = announcement.title.find((item) => item.language === fldKey);
  const localeBody = announcement.body.find((item) => item.language === fldKey);

  const handleMarkAsRead = async () => {
    await dbReadNotification(announcement.announcement_id, fldKey);
  };

  const handleToggleExpand = () => {
    setIsExpanded((prev) => {
      if (prev) setBodyText(sliceWord);
      if (!prev) setBodyText(localeBody.text);
      return !prev;
    });
  };

  useEffect(() => {
    const titleModified = localeTitle.modifiedAt;
    const bodyModified = localeBody.modifiedAt;
    let publishedDate = titleModified;

    if (bodyModified > titleModified) publishedDate = bodyModified;

    const publishedLocale = dateFormat(new Date(new Date(publishedDate).toLocaleString()), t('shortDateTimeFormat'));

    setPublishedAt(publishedLocale);
  }, [localeTitle, localeBody, t]);

  useEffect(() => {
    setHasExpand(false);
    setIsExpanded(false);
    if (localeBody.text.length > 400) {
      const split = localeBody.text.slice(0, 120).split(' ');

      let finalWord = '';
      for (let i = 0; i < split.length - 1; i++) {
        finalWord = finalWord + split[i] + ' ';
      }

      finalWord = finalWord + ' ...';
      setSliceWord(finalWord);
      setBodyText(finalWord);
      setHasExpand(true);
    }

    if (localeBody.text.length <= 400) {
      setBodyText(localeBody.text);
    }
  }, [localeBody]);

  return (
    <Box
      sx={{
        padding: '5px',
        marginBottom: '10px',
        paddingBottom: '8px',
        borderBottom: '1px outset',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <NotificationsActiveIcon
          color={localeTitle.isRead && localeBody.isRead ? '' : 'error'}
          sx={{ fontSize: '30px', marginTop: '5px' }}
        />
        <Box sx={{ width: '100%' }}>
          <Typography variant="h6" sx={{ marginBottom: '10px' }}>
            {localeTitle.text}
          </Typography>
          <Box>
            <Markup content={bodyText} />
          </Box>

          <Box sx={{ marginTop: '15px', marginLeft: '10px', display: 'flex', gap: '15px' }}>
            {(!localeTitle.isRead || !localeBody.isRead) && (!hasExpand || (hasExpand && isExpanded)) && (
              <IconButton color="inherit" edge="start" sx={styles.announcementAction} onClick={handleMarkAsRead}>
                <CheckCircleIcon color="success" />
                {largeView && <Typography sx={{ marginLeft: '5px' }}>{t('markAsRead')}</Typography>}
              </IconButton>
            )}

            {hasExpand && (
              <IconButton color="inherit" edge="start" sx={styles.announcementAction} onClick={handleToggleExpand}>
                {isExpanded && <CloseFullscreenIcon color="info" />}
                {!isExpanded && <ExpandCircleDownIcon color="info" />}

                {largeView && (
                  <Typography sx={{ marginLeft: '5px' }}>{isExpanded ? t('collapse') : t('expand')}</Typography>
                )}
              </IconButton>
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Typography sx={{ fontSize: '13px', fontStyle: 'italic' }}>{publishedAt}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default WhatsNewItem;
