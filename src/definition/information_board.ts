export type InformationBoardCategory =
  | 'general_information'
  | 'local_announcements'
  | 'branch_letters'
  | 'frequently_used_information';

export type InfoBoardGeneralInformationType = {
  type: string;
  external_links?: {
    label: string;
    link: string;
    _deleted: boolean;
    updatedAt: string;
  }[];
  smart_widgets: {
    meeting_times: boolean;
    videoconference_info: boolean;
    auxiliary_pioneers: boolean;
    months_of_special_activity: boolean;
  };
};

export type InfoBoardAnnouncement = {
  type: string;
  title: string;
  category?: InformationBoardCategory;
  short_description: string;
  text?: string;
  pin_at_the_top: boolean;
  notify_everybody: boolean;
  _deleted: boolean;
  updatedAt: string;
  attachment_files?: string[];
};

export type InformationBoardType = {
  id: number;
  information: {
    general_information: InfoBoardGeneralInformationType;
    local_announcements?: InfoBoardAnnouncement[];
    branch_letters?: InfoBoardAnnouncement[];
    frequently_used_information?: InfoBoardAnnouncement[];
  };
};
