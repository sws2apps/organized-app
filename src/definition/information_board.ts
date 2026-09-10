export type InformationBoardCategory =
  | 'general_information'
  | 'local_announcements'
  | 'branch_letters'
  | 'frequently_used_information';

export type ExternalLinkType = {
  id: string;
  label: string;
  link: string;
  _deleted: boolean;
  updatedAt: string;
};

export type InfoBoardGeneralInformationType = {
  type: string;
  external_links?: ExternalLinkType[];
  smart_widgets: {
    meeting_times: {
      value: boolean;
      updatedAt: string;
    };
    videoconference_info: {
      value: boolean;
      updatedAt: string;
    };
    auxiliary_pioneers: {
      value: boolean;
      updatedAt: string;
    };
    months_of_special_activity: {
      value: boolean;
      updatedAt: string;
    };
  };
};

export type InfoBoardAnnouncementType = {
  id: string;
  type: string;
  title: string;
  category?: InformationBoardCategory;
  short_description: string;
  text?: string;
  pin_at_the_top: {
    updatedAt: string;
    value: boolean;
  };
  notify_everybody: boolean;
  notification_id?: string;
  _deleted: boolean;
  updatedAt: string;
  attachment_files?: string[];
};

export type InformationBoardType = {
  id: number;
  information: {
    general_information: InfoBoardGeneralInformationType[];
    announcements: InfoBoardAnnouncementType[];
  };
};
