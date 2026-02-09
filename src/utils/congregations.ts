import { CongregationIncomingDetailsType } from '@definition/speakers_congregations';
import { formatDate } from '@utils/date';
import { SpeakersCongregationsType } from '@definition/speakers_congregations';

export const createEmptyCongregation = (): CongregationIncomingDetailsType => {
  return {
    cong_name: '',
    cong_number: '',
    cong_circuit: '',
    cong_id: '',

    // HIER HAT ES GEFEHLT:
    country_code: '', // Leer initialisieren

    cong_location: {
      address: '',
      lat: 0,
      lng: 0,
    },

    midweek_meeting: {
      weekday: { value: 2 },
      time: { value: '18:00' },
    },
    weekend_meeting: {
      weekday: { value: 6 },
      time: { value: '09:00' },
    },

    coordinator: { email: '', name: '', phone: '' },
    public_talk_coordinator: { email: '', name: '', phone: '' },
  };
};

export const updateCongregationAddress = (
  cong: CongregationIncomingDetailsType,
  address: string
): void => {
  cong.cong_location.address = address;
};

// --- Meetings ---

export const updateMidweekWeekday = (
  cong: CongregationIncomingDetailsType,
  weekday: number
): void => {
  cong.midweek_meeting.weekday.value = weekday;
};

export const updateMidweekTime = (
  cong: CongregationIncomingDetailsType,
  time: Date | string
): void => {
  const timeString = time instanceof Date ? formatDate(time, 'HH:MM') : time;
  cong.midweek_meeting.time.value = timeString;
};

export const updateWeekendWeekday = (
  cong: CongregationIncomingDetailsType,
  weekday: number
): void => {
  cong.weekend_meeting.weekday.value = weekday;
};

export const updateWeekendTime = (
  cong: CongregationIncomingDetailsType,
  time: Date | string
): void => {
  const timeString = time instanceof Date ? formatDate(time, 'HH:MM') : time;
  cong.weekend_meeting.time.value = timeString;
};

// --- Public Talk Coordinator ---

export const updatePublicTalkCoordinatorName = (
  cong: CongregationIncomingDetailsType,
  name: string
): void => {
  cong.public_talk_coordinator.name = name;
};

export const updatePublicTalkCoordinatorEmail = (
  cong: CongregationIncomingDetailsType,
  email: string
): void => {
  cong.public_talk_coordinator.email = email;
};

export const updatePublicTalkCoordinatorPhone = (
  cong: CongregationIncomingDetailsType,
  phone: string
): void => {
  cong.public_talk_coordinator.phone = phone;
};

// --- Coordinator (BOE) ---

export const updateCoordinatorName = (
  cong: CongregationIncomingDetailsType,
  name: string
): void => {
  cong.coordinator.name = name;
};

export const updateCoordinatorEmail = (
  cong: CongregationIncomingDetailsType,
  email: string
): void => {
  cong.coordinator.email = email;
};

export const updateCoordinatorPhone = (
  cong: CongregationIncomingDetailsType,
  phone: string
): void => {
  cong.coordinator.phone = phone;
};

/**
 * Wandelt das UI/Import-Objekt in das komplexe Datenbank-Format um.
 * Nutzt das Feld 'cong_number' direkt aus dem Input-Objekt.
 */
export const convertToDatabaseCongregation = (
  incoming: CongregationIncomingDetailsType
): SpeakersCongregationsType => {
  const now = new Date().toISOString();

  // Status-Logik:
  // Keine Online-ID (cong_id leer) -> Lokal -> 'approved'
  // Mit Online-ID -> Sync -> 'pending'
  const hasOnlineId = incoming.cong_id && incoming.cong_id.length > 0;
  const status = hasOnlineId ? 'pending' : 'approved';

  // Request-ID nur für Online-Sync nötig
  const requestId = hasOnlineId ? crypto.randomUUID() : '';

  return {
    id: crypto.randomUUID(), // Lokale UUID
    _deleted: { value: false, updatedAt: '' },
    cong_data: {
      cong_id: incoming.cong_id || '',
      request_id: requestId,
      request_status: status,

      cong_number: {
        // Hier greifen wir jetzt direkt zu.
        // Falls optional (?) definiert, Fallback auf leeren String.
        value: incoming.cong_number ?? '',
        updatedAt: now,
      },
      cong_name: {
        value: incoming.cong_name,
        updatedAt: now,
      },
      cong_circuit: {
        value: incoming.cong_circuit,
        updatedAt: now,
      },
      cong_location: {
        address: {
          value: incoming.cong_location.address,
          updatedAt: now,
        },
        lat: incoming.cong_location.lat,
        lng: incoming.cong_location.lng,
      },
      midweek_meeting: {
        time: {
          value: incoming.midweek_meeting.time.value,
          updatedAt: now,
        },
        weekday: {
          value: incoming.midweek_meeting.weekday.value,
          updatedAt: now,
        },
      },
      weekend_meeting: {
        time: {
          value: incoming.weekend_meeting.time.value,
          updatedAt: now,
        },
        weekday: {
          value: incoming.weekend_meeting.weekday.value,
          updatedAt: now,
        },
      },
      coordinator: {
        name: { value: incoming.coordinator.name, updatedAt: now },
        email: { value: incoming.coordinator.email, updatedAt: now },
        phone: { value: incoming.coordinator.phone, updatedAt: now },
      },
      public_talk_coordinator: {
        name: { value: incoming.public_talk_coordinator.name, updatedAt: now },
        email: {
          value: incoming.public_talk_coordinator.email,
          updatedAt: now,
        },
        phone: {
          value: incoming.public_talk_coordinator.phone,
          updatedAt: now,
        },
      },
    },
  };
};
