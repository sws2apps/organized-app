import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { NotificationRecordType } from '@definition/notification';
import { notificationsDbState, notificationsState } from '@states/notification';
import { isAppNotificationOpenState } from '@states/app';
import { formatLongDate } from '@utils/date';
import { personFilterFieldServiceReportState } from '@states/field_service_reports';
import { dbNotificationsSave } from '@services/dexie/notifications';
import { hour24FormatState, shortDateFormatState } from '@states/settings';

const useNotificationItem = (notification: NotificationRecordType) => {
  const navigate = useNavigate();

  const setNotifications = useSetAtom(notificationsState);
  const setOpen = useSetAtom(isAppNotificationOpenState);
  const setFilter = useSetAtom(personFilterFieldServiceReportState);

  const dbNotifications = useAtomValue(notificationsDbState);
  const shortDateFormat = useAtomValue(shortDateFormatState);
  const hour24 = useAtomValue(hour24FormatState);

  const itemDate = useMemo(() => {
    const toFormat = new Date(notification.date);

    return formatLongDate(toFormat, shortDateFormat, hour24);
  }, [hour24, shortDateFormat, notification.date]);

  const handleMarkAsRead = async () => {
    if (!notification.id.startsWith('standard-notification-')) {
      setNotifications((prev) =>
        prev.map((record) =>
          record.id === notification.id ? { ...record, read: true } : record
        )
      );

      return;
    }

    const id = Number(notification.id.replace('standard-notification-', ''));

    const dbNotification = dbNotifications.find((record) => record.id === id);

    if (!dbNotification) return;

    await dbNotificationsSave({
      ...dbNotification,
      read: true,
      updatedAt: new Date().toISOString(),
    });

    setNotifications((prev) =>
      prev.filter((record) => record.id !== notification.id)
    );
  };

  const handleAnchorClick = () => {
    setOpen(false);

    if (notification.id === 'reports-unverified') {
      setFilter('unverified');
      navigate('/reports/field-service');
    }
  };

  return {
    itemDate,
    handleMarkAsRead,
    handleAnchorClick,
  };
};

export default useNotificationItem;
