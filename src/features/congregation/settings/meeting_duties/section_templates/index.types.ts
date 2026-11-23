import { DutiesMeetingValue } from '@services/app/duties';

export type SectionTemplatesProps = {
  meeting: DutiesMeetingValue;
  onClose: VoidFunction;
  onMeetingChange: (meeting: DutiesMeetingValue) => void;
};
