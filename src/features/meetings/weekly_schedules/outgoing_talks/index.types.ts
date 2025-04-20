export type OutgoingTalkSchedule = {
  id: string;
  date: string;
  weekOf: string;
  speaker: string;
  talk: number;
  congregation: string;
};

export type OutgoingTalkSchedules = {
  date: string;
  schedules: OutgoingTalkSchedule[];
};
