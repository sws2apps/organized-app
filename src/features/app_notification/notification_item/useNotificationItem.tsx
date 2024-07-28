import { formatDate } from '@services/dateformat';
import { useAppTranslation } from '@hooks/index';
import { NotificationRecordType } from '@definition/notification';
import { useSetRecoilState } from 'recoil';
import { notificationsState } from '@states/notification';

const useNotificationItem = (notification: NotificationRecordType) => {
  const { t } = useAppTranslation();

  const setNotifications = useSetRecoilState(notificationsState);

  const itemDate = formatDate(
    new Date(notification.date),
    t('tr_longDateTimeFormat')
  );

  const handleMarkAsRead = () => {
    setNotifications((prev) => {
      const find = prev.find((record) => record.id === notification.id);
      const newObj = { icon: find.icon, ...find };
      newObj.read = true;

      const newData = prev.filter((record) => record.id !== notification.id);
      newData.push(newObj);

      return newData;
    });
  };

  return { itemDate, handleMarkAsRead };
};

export default useNotificationItem;
