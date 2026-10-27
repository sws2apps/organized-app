import { PARTNER_SYNC_INTERVAL } from '@constants/preaching_partner';
import {
  fullnameOptionState,
  hour24FormatState,
  userLocalUIDState,
} from '@states/settings';
import {
  myArrangedPreachingPartnerRequestsState,
  partnerReadNotificationsState,
  partnerConnectionState,
  partnerSyncState,
} from '@states/preaching_partner';
import { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { StandardNotificationType } from '@definition/notification';
import { buildPersonFullname } from '@utils/common';
import { notificationsState } from '@states/notification';
import { personsActiveState } from '@states/persons';
import { preachingPartnerTimeLabel } from '@services/app/preaching_partner';
import { formatLongDateWithShortVars } from '@utils/date';
import { useAppTranslation } from '@hooks/index';

const NOTIFICATION_PREFIX = 'partner-request-joined-';

const usePartnerRequests = () => {
  const { t } = useAppTranslation();
  const connection = useAtomValue(partnerConnectionState);
  const sync = useSetAtom(partnerSyncState);
  useEffect(() => {
    if (!connection) return;
    const refresh = () => {
      if (!document.hidden) void sync().catch(() => undefined);
    };
    void sync(true).catch(() => undefined);
    const timer = setInterval(refresh, PARTNER_SYNC_INTERVAL);
    window.addEventListener('online', refresh);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      clearInterval(timer);
      window.removeEventListener('online', refresh);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [connection, sync]);

  const setNotifications = useSetAtom(notificationsState);

  const readNotifications = useAtomValue(partnerReadNotificationsState);
  const userUID = useAtomValue(userLocalUIDState);
  const hour24 = useAtomValue(hour24FormatState);
  const arranged = useAtomValue(myArrangedPreachingPartnerRequestsState);
  const persons = useAtomValue(personsActiveState);
  const fullnameOption = useAtomValue(fullnameOptionState);

  useEffect(() => {
    const incoming = arranged.map((request) => {
      const partner = persons.find(
        (record) => record.person_uid === request.request_data.partner_uid
      );

      const publisherName = partner
        ? buildPersonFullname(
            partner.person_data.person_lastname.value,
            partner.person_data.person_firstname.value,
            fullnameOption
          )
        : '';

      const notification: StandardNotificationType = {
        id: `${NOTIFICATION_PREFIX}${userUID}-${request.request_uid}-${request.request_data.arranged_at}`,
        title: t('tr_partnerRequestJoined'),
        description: t('tr_partnerRequestJoinedDesc', {
          publisherName,
          interpolation: { escapeValue: true },
          date: formatLongDateWithShortVars(request.request_data.date),
          time: preachingPartnerTimeLabel(request),
        }),
        date:
          request.request_data.arranged_at ?? request.request_data.updatedAt,
        icon: 'ministry',
        enableRead: true,
        read: readNotifications.includes(
          `${NOTIFICATION_PREFIX}${userUID}-${request.request_uid}-${request.request_data.arranged_at}`
        ),
      };

      return notification;
    });

    setNotifications((prev) => {
      const kept = prev.filter(
        (record) => !record.id.startsWith(NOTIFICATION_PREFIX)
      );

      // an already dismissed notification keeps its read state
      const merged = incoming.map((notification) => {
        const previous = prev.find(
          (record) => record.id === notification.id
        ) as StandardNotificationType;

        return previous
          ? { ...notification, read: notification.read || previous.read }
          : notification;
      });

      return [...kept, ...merged];
    });
  }, [
    arranged,
    persons,
    fullnameOption,
    t,
    setNotifications,
    readNotifications,
    hour24,
    userUID,
  ]);
};

export default usePartnerRequests;
