export type TalkTitleSoloType = {
  label?: string;
  type: 'public_talk' | 'co_public_talk' | 'co_service_talk';
  week: string;
  readOnly?: boolean;
};
