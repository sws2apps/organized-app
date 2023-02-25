export const {
  apiSendAuthorization,
  apiHandleVerifyOTP,
  apiRequestPasswordlesssLink,
  apiUpdatePasswordlessInfo,
  apiPocketSignUp,
  apiPocketValidate,
  apiFetchPocketSessions,
  apiPocketDeviceDelete,
} = await import('./auth.js');

export const { apiFetchCountries, apiFetchCongregations, apiCreateCongregation, apiUpdateCongregation } = await import(
  './congregation.js'
);

export const { fetchNotifications } = await import('./notification.js');

export const { fetchSourceMaterial } = await import('./public.js');

export const { apiFetchSchedule } = await import('./schedule.js');
