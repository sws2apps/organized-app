import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { formatDate } from '@services/dateformat';
import { IncomingCongregationResponseType } from '@definition/api';
import { CongregationIncomingDetailsType } from './index.types';
import { SpeakersCongregationsType } from '@definition/speakers_congregations';
import { dbSpeakersCongregationsCreate } from '@services/dexie/speakers_congregations';
import {
  congAccountConnectedState,
  encryptedMasterKeyState,
} from '@states/app';
import { apiRequestAccessCongregationSpeakers } from '@services/api/visitingSpeakers';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { congMasterKeyState } from '@states/settings';
import { decryptData } from '@services/encryption';

const useCongregationAdd = (onClose: VoidFunction) => {
  const congAccountConnected = useRecoilValue(congAccountConnectedState);
  const congMasterKey = useRecoilValue(congMasterKeyState);
  const encryptedMasterKey = useRecoilValue(encryptedMasterKeyState);

  const [congregation, setCongregation] =
    useState<IncomingCongregationResponseType>(null);
  const [incomingCongregation, setIncomingCongregation] =
    useState<CongregationIncomingDetailsType>(null);
  const [isFindCongregation, setIsFindCongregation] = useState(true);

  const handleSelectCongregation = (
    value: IncomingCongregationResponseType
  ) => {
    setCongregation(value);
  };

  const handleResetCongregation = () => setCongregation(null);

  const handleMovePrevious = () => {
    handleResetCongregation();
    setIsFindCongregation(true);
  };

  const handleMoveNext = () => {
    if (congregation === null) return;

    setIsFindCongregation(false);
  };

  const handleCongAddressChange = (value: string) => {
    setIncomingCongregation((prev) => {
      const obj = structuredClone(prev);
      obj.cong_location.address = value;

      return obj;
    });
  };

  const handleMidweekWeekdayChange = (value: number) => {
    setIncomingCongregation((prev) => {
      const obj = structuredClone(prev);
      obj.midweek_meeting.weekday.value = value;

      return obj;
    });
  };

  const handleMidweekTimeChange = (value: Date) => {
    setIncomingCongregation((prev) => {
      const obj = structuredClone(prev);
      obj.midweek_meeting.time.value = formatDate(value, 'HH:MM');

      return obj;
    });
  };

  const handleWeekendWeekdayChange = (value: number) => {
    setIncomingCongregation((prev) => {
      const obj = structuredClone(prev);
      obj.weekend_meeting.weekday.value = value;

      return obj;
    });
  };

  const handleWeekendTimeChange = (value: Date) => {
    setIncomingCongregation((prev) => {
      const obj = structuredClone(prev);
      obj.weekend_meeting.time.value = formatDate(value, 'HH:MM');

      return obj;
    });
  };

  const handleTalkCoordinatorNameChange = (value: string) => {
    setIncomingCongregation((prev) => {
      const obj = structuredClone(prev);
      obj.public_talk_coordinator.name = value;

      return obj;
    });
  };

  const handleTalkCoordinatorEmailChange = (value: string) => {
    setIncomingCongregation((prev) => {
      const obj = structuredClone(prev);
      obj.public_talk_coordinator.email = value;

      return obj;
    });
  };

  const handleTalkCoordinatorPhoneChange = (value: string) => {
    setIncomingCongregation((prev) => {
      const obj = structuredClone(prev);
      obj.public_talk_coordinator.phone = value;

      return obj;
    });
  };

  const handleCoordinatorNameChange = (value: string) => {
    setIncomingCongregation((prev) => {
      const obj = structuredClone(prev);
      obj.coordinator.name = value;

      return obj;
    });
  };

  const handleCoordinatorEmailChange = (value: string) => {
    setIncomingCongregation((prev) => {
      const obj = structuredClone(prev);
      obj.coordinator.email = value;

      return obj;
    });
  };

  const handleCoordinatorPhoneChange = (value: string) => {
    setIncomingCongregation((prev) => {
      const obj = structuredClone(prev);
      obj.coordinator.phone = value;

      return obj;
    });
  };

  const handleIncomingCongregationAdd = async () => {
    try {
      const tmpCong: SpeakersCongregationsType = {
        _deleted: { value: false, updatedAt: '' },
        id: crypto.randomUUID(),
        cong_data: {
          cong_number: {
            value: incomingCongregation.cong_number,
            updatedAt: new Date().toISOString(),
          },
          cong_id: incomingCongregation.cong_id || '',
          cong_location: {
            ...incomingCongregation.cong_location,
            address: {
              value: incomingCongregation.cong_location.address,
              updatedAt: new Date().toISOString(),
            },
          },
          cong_name: {
            value: incomingCongregation.cong_name,
            updatedAt: new Date().toISOString(),
          },
          cong_circuit: {
            value: incomingCongregation.cong_circuit,
            updatedAt: new Date().toISOString(),
          },
          coordinator: {
            email: {
              value: incomingCongregation.coordinator.email,
              updatedAt: new Date().toISOString(),
            },
            name: {
              value: incomingCongregation.coordinator.name,
              updatedAt: new Date().toISOString(),
            },
            phone: {
              value: incomingCongregation.coordinator.phone,
              updatedAt: new Date().toISOString(),
            },
          },
          public_talk_coordinator: {
            email: {
              value: incomingCongregation.public_talk_coordinator.email,
              updatedAt: new Date().toISOString(),
            },
            name: {
              value: incomingCongregation.public_talk_coordinator.name,
              updatedAt: new Date().toISOString(),
            },
            phone: {
              value: incomingCongregation.public_talk_coordinator.phone,
              updatedAt: new Date().toISOString(),
            },
          },
          midweek_meeting: {
            time: {
              value: incomingCongregation.midweek_meeting.time.value,
              updatedAt: new Date().toISOString(),
            },
            weekday: {
              value: incomingCongregation.midweek_meeting.weekday.value,
              updatedAt: new Date().toISOString(),
            },
          },
          weekend_meeting: {
            time: {
              value: incomingCongregation.weekend_meeting.time.value,
              updatedAt: new Date().toISOString(),
            },
            weekday: {
              value: incomingCongregation.weekend_meeting.weekday.value,
              updatedAt: new Date().toISOString(),
            },
          },
          request_id: incomingCongregation.cong_id ? crypto.randomUUID() : '',
          request_status: incomingCongregation.cong_id ? 'pending' : 'approved',
        },
      };

      if (tmpCong.cong_data.cong_id.length > 0) {
        const masterKey = decryptData(encryptedMasterKey, congMasterKey);

        const { data, status } = await apiRequestAccessCongregationSpeakers(
          tmpCong.cong_data.cong_id,
          tmpCong.cong_data.request_id,
          masterKey
        );

        if (status !== 200) {
          await displaySnackNotification({
            header: getMessageByCode('error_app_generic-title'),
            message: getMessageByCode(data.message),
            severity: 'error',
          });
          return;
        }
      }

      await dbSpeakersCongregationsCreate(tmpCong);
      onClose();
    } catch (err) {
      console.error(err);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode((err as Error).message),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    if (congregation) {
      const obj: CongregationIncomingDetailsType = {
        ...congregation,
        coordinator: { email: '', name: '', phone: '' },
        public_talk_coordinator: { email: '', name: '', phone: '' },
      };

      setIncomingCongregation(obj);
    }
  }, [congregation]);

  return {
    congregation: incomingCongregation,
    handleSelectCongregation,
    handleResetCongregation,
    handleMoveNext,
    handleMovePrevious,
    isFindCongregation,
    handleCongAddressChange,
    handleMidweekWeekdayChange,
    handleMidweekTimeChange,
    handleWeekendTimeChange,
    handleWeekendWeekdayChange,
    handleTalkCoordinatorNameChange,
    handleTalkCoordinatorEmailChange,
    handleTalkCoordinatorPhoneChange,
    handleCoordinatorNameChange,
    handleCoordinatorEmailChange,
    handleCoordinatorPhoneChange,
    handleIncomingCongregationAdd,
    congAccountConnected,
  };
};

export default useCongregationAdd;
