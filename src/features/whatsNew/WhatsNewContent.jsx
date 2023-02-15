import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import WhatsNewItem from './WhatsNewItem';
import { appLangState, appNotificationsState, isWhatsNewOpenState } from '../../states/main';
import { LANGUAGE_LIST } from '../../locales/langList';

const WhatsNewContent = () => {
  const { t } = useTranslation('ui');

  const [drawerOpen, setDrawerOpen] = useRecoilState(isWhatsNewOpenState);

  const announcements = useRecoilValue(appNotificationsState);
  const appLang = useRecoilValue(appLangState);

  const [localAnnouncements, setLocalAnnouncements] = useState([]);

  const fldKey = LANGUAGE_LIST.find((language) => language.code === appLang).locale;

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawerOpen(open);
  };

  useEffect(() => {
    const newAnnouncements = announcements.map((announcement) => {
      const localeTitle = announcement.title.find((item) => item.language === fldKey);
      const localeBody = announcement.body.find((item) => item.language === fldKey);

      const titleModified = localeTitle.modifiedAt;
      const bodyModified = localeBody.modifiedAt;
      let publishedDate = titleModified;

      if (bodyModified > titleModified) publishedDate = bodyModified;

      return { ...announcement, publishedDate };
    });

    newAnnouncements.sort((a, b) => {
      return a.publishedDate < b.publishedDate ? 1 : -1;
    });

    setLocalAnnouncements(newAnnouncements);
  }, [announcements, fldKey]);

  return (
    <SwipeableDrawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
      <Box
        sx={{
          paddingTop: '50px',
          borderBottom: '1px outset',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography sx={{ padding: '20px', textTransform: 'uppercase', fontWeight: 'bold' }}>
          {t('announcements')}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '20px' }}>
          <IconButton color="error" aria-label="close" onClick={() => setDrawerOpen(false)}>
            <CloseIcon sx={{ fontSize: '30px' }} />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ minWidth: '350px', maxWidth: '650px', padding: '20px' }}>
        {localAnnouncements.length > 0 && (
          <>
            {localAnnouncements.map((announcement) => (
              <WhatsNewItem key={announcement.announcement_id} announcement={announcement} />
            ))}
          </>
        )}
        {localAnnouncements.length === 0 && <Typography>{t('nothingNew')}</Typography>}
      </Box>
    </SwipeableDrawer>
  );
};

export default WhatsNewContent;
