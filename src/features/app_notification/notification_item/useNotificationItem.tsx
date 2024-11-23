import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { formatDate } from '@services/dateformat';
import { useAppTranslation } from '@hooks/index';
import { NotificationRecordType } from '@definition/notification';
import { notificationsDbState, notificationsState } from '@states/notification';
import { isAppNotificationOpenState } from '@states/app';
import { personFilterFieldServiceReportState } from '@states/field_service_reports';
import { dbNotificationsSave } from '@services/dexie/notifications';

const useNotificationItem = (notification: NotificationRecordType) => {
  const { t } = useAppTranslation();

  const navigate = useNavigate();

  const setNotifications = useSetRecoilState(notificationsState);
  const setOpen = useSetRecoilState(isAppNotificationOpenState);
  const setFilter = useSetRecoilState(personFilterFieldServiceReportState);

  const dbNotifications = useRecoilValue(notificationsDbState);

  const itemDate = formatDate(
    new Date(notification.date),
    t('tr_longDateTimeFormat')
  );

  const handleMarkAsRead = async () => {
    const isStandardNotif = notification.id.startsWith('standard-notification');

    if (isStandardNotif) {
      const id = +notification.id.split('-').at(-1);
      const dbNotif = dbNotifications.find((record) => record.id === id);

      if (!dbNotif) return;

      const newNotif = structuredClone(dbNotif);
      newNotif.read = true;
      newNotif.updatedAt = new Date().toISOString();

      await dbNotificationsSave(newNotif);

      setNotifications((prev) => {
        const newValue = prev.filter((record) => record.id !== notification.id);
        return newValue;
      });
    }

    if (!isStandardNotif) {
      setNotifications((prev) => {
        const find = prev.find((record) => record.id === notification.id);
        const newObj = { icon: find.icon, ...find };
        newObj.read = true;

        const newData = prev.filter((record) => record.id !== notification.id);
        newData.push(newObj);

        return newData;
      });
    }
  };

  const handleAnchorClick = () => {
    setOpen(false);

    if (notification.id === 'reports-unverified') {
      setFilter('unverified');
      navigate('/reports/field-service');
    }
  };

  return { itemDate, handleMarkAsRead, handleAnchorClick };
};

export default useNotificationItem;
