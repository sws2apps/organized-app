import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { formatDate } from '@services/dateformat';
import { useAppTranslation } from '@hooks/index';
import { NotificationRecordType } from '@definition/notification';
import { notificationsState } from '@states/notification';
import { isAppNotificationOpenState } from '@states/app';
import { personFilterFieldServiceReportState } from '@states/field_service_reports';

const useNotificationItem = (notification: NotificationRecordType) => {
  const { t } = useAppTranslation();

  const navigate = useNavigate();

  const setNotifications = useSetRecoilState(notificationsState);
  const setOpen = useSetRecoilState(isAppNotificationOpenState);
  const setFilter = useSetRecoilState(personFilterFieldServiceReportState);

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
