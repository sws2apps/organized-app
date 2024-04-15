import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import AnnouncementItem from './AnnouncementItem';
import { appLangState, appNotificationsState } from '../../states/main';
import { LANGUAGE_LIST } from '../../../shared/locales/langList';

const Announcements = () => {
	const announcements = useRecoilValue(appNotificationsState);
	const appLang = useRecoilValue(appLangState);

	const [localAnnouncements, setLocalAnnouncements] = useState([]);

	const fldKey = LANGUAGE_LIST.find((language) => language.code === appLang).locale;

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
		<Box>
			{localAnnouncements.length > 0 &&
				localAnnouncements.map((announcement) => (
					<AnnouncementItem key={announcement.announcement_id} announcement={announcement} />
				))}
		</Box>
	);
};

export default Announcements;
