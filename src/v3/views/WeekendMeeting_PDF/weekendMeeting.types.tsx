export type WeekendMeetingItemProps = {
  meetingData: {
    date: string;
    chairman: string;
    openingPrayer: string;
    studyConductor: string;
    reader: string;
    speechTitle: string;
    speechNumber: string;
    mainSpeaker: string;
    congregation: string;
    substituteName: string;
    text: string;
    weekType:
      | 'Normal week'
      | 'Week of Memorial'
      | 'Week of special talk'
      | 'Week of regional convention'
      | 'Week of Circuit Assembly'
      | 'Visit of the circuit overseer';
  };
  isLastItem: boolean;
};
