import { promiseSetRecoil } from 'recoil-outside';
import { appNotificationsState } from '../states/main';
import { langList } from '../locales/langList';
import appDb from './mainDb';

export const dbGetNotifications = async () => {
	const notifications = await appDb.table('notifications').toArray();

	return notifications;
};

export const dbSaveNotifications = async (data) => {
	let notifications = await dbGetNotifications();

	await appDb.notifications.clear();

	for (let i = 0; i < data.length; i++) {
		const announcement = data[i];

		let obj = {};
		const notification = notifications.find(
			(item) => item.notification_id === announcement.id
		);

		if (notification) {
			obj.isRead = notification.isRead;
		} else {
			obj.isRead = false;
		}
		obj.notification_id = announcement.id;
		obj.content = {};
		langList.forEach((lang) => {
			const code = lang.code.toUpperCase();
			obj.content[code] = announcement[code];
		});

		await appDb.notifications.add(obj);
	}

	notifications = await dbGetNotifications();

	await promiseSetRecoil(appNotificationsState, notifications);
	return;
};

export const dbReadNotification = async (id) => {
	let notifications = await dbGetNotifications();

	const notification = notifications.find(
		(item) => item.notification_id === id
	);

	if (notification) {
		await appDb.notifications.update(notification.id, { isRead: true });
	}

	notifications = await dbGetNotifications();
	await promiseSetRecoil(appNotificationsState, notifications);
	return;
};
