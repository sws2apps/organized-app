export const {
  apiSendAuthorization,
  apiHandleVerifyOTP,
  apiRequestPasswordlesssLink,
  apiUpdatePasswordlessInfo,
  apiPocketSignUp,
  apiPocketValidate,
  apiFetchPocketSessions,
  apiPocketDeviceDelete,
  apiRequestTempOTPCode,
  apiHandleVerifyEmailOTP,
} = await import('./auth.js');

export const {
  apiFetchCountries,
  apiFetchCongregations,
  apiCreateCongregation,
  apiUpdateCongregation,
  apiFetchCongregationLastBackup,
  apiSendCongregationBackup,
  apiRestoreCongregationBackup,
  apiSendUserFieldServiceReports,
  apiUnpostUserFieldServiceReports,
  apiGetPendingFieldServiceReports,
  apiApprovePendingFieldServiceReports,
  apiDisapprovePendingFieldServiceReports,
} = await import('./congregation.js');

export const { fetchNotifications } = await import('./notification.js');

export const { fetchSourceMaterial } = await import('./public.js');

export const { apiFetchSchedule } = await import('./schedule.js');

export const {
  apiFetchUserLastBackup,
  apiSendUserBackup,
  apiRestoreUserBackup,
  apiSendPocketFieldServiceReports,
  apiUnpostPocketFieldServiceReports,
} = await import('./pocket.js');
