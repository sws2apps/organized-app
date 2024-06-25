export type MiniPerson = {
  username: string;
  uid: string;
  role?: string;
};

export const MiniPersonRolesTranslations = {
  coordinator: 'tr_coordinator',
  secretary: 'tr_secretary',
  public_talk_coordinator: 'tr_publicTalkCoordinator',
  midweek_meeting_overseer: 'tr_midweekMeetingOverseer',
};
