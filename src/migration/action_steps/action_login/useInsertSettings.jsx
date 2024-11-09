import organizedDb from '../../../indexedDb/appDb';
import appDb from '../../db';

const useInsertSettings = () => {
  const handleInsertSettings = async ({ user_settings, cong_settings }) => {
    const settings = await appDb.app_settings.get(1);

    const midweek = cong_settings.midweek_meeting.map((record) => {
      return {
        type: 'main',
        time: record.time,
        weekday: record.weekday,
        class_count: {
          value: settings.class_count,
          updatedAt: new Date().toISOString(),
        },
        opening_prayer_auto_assigned: {
          value: settings.opening_prayer_MM_autoAssign,
          updatedAt: new Date().toISOString(),
        },
        closing_prayer_auto_assigned: {
          value: false,
          updatedAt: '',
        },
        aux_class_counselor_default: {
          enabled: { value: false, updatedAt: '' },
          person: { value: '', updatedAt: '' },
        },
      };
    });

    const weekend = cong_settings.weekend_meeting.map((record) => {
      return {
        type: 'main',
        time: record.time,
        weekday: record.weekday,
        opening_prayer_auto_assigned: {
          value: settings.opening_prayer_WM_autoAssign,
          updatedAt: new Date().toISOString(),
        },
        substitute_speaker_enabled: {
          value: settings.weekend_meeting_useSubstituteSpeaker,
          updatedAt: new Date().toISOString(),
        },
        w_study_conductor_default: {
          value: '',
          updatedAt: '',
        },
        substitute_w_study_conductor_displayed: {
          value: false,
          updatedAt: '',
        },
        consecutive_monthly_parts_notice_shown: {
          value: false,
          updatedAt: '',
        },
        outgoing_talks_schedule_public: {
          value: false,
          updatedAt: '',
        },
      };
    });

    const CO = {
      display_name: {
        value: settings.co_displayName,
        updatedAt: new Date().toISOString(),
      },
      visits: [],
      firstname: { value: '', updatedAt: '' },
      lastname: { value: '', updatedAt: '' },
    };

    if (settings.co_name.length > 0) {
      const names = settings.co_name.split(' ');
      const lastname = names.shift();
      const firstname = names.join(' ');

      CO.firstname = { value: firstname, updatedAt: new Date().toISOString() };
      CO.lastname = { value: lastname, updatedAt: new Date().toISOString() };
    }

    await organizedDb.app_settings.update(1, {
      'user_settings.firstname': user_settings.firstname,
      'user_settings.lastname': user_settings.lastname,
      'user_settings.account_type': user_settings.role,
      'user_settings.user_local_uid': user_settings.user_local_uid,
      'user_settings.user_members_delegate':
        user_settings.user_members_delegate,
      'user_settings.cong_role': user_settings.cong_role,
      'cong_settings.country_code': cong_settings.country_code,
      'cong_settings.cong_number': cong_settings.cong_number,
      'cong_settings.cong_name': cong_settings.cong_name,
      'cong_settings.cong_location': cong_settings.cong_location,
      'cong_settings.cong_migrated': true,
      'cong_settings.cong_new': false,
      'cong_settings.cong_circuit': cong_settings.cong_circuit,
      'cong_settings.midweek_meeting': midweek,
      'cong_settings.weekend_meeting': weekend,
      'cong_settings.circuit_overseer': CO,
    });
  };

  return { handleInsertSettings };
};

export default useInsertSettings;
