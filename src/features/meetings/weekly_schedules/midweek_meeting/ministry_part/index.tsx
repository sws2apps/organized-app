import { Stack } from '@mui/material';
import { IconMinistry } from '@components/icons';
import { MinistryPartProps } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useMinistryPart from './useMinistryPart';
import Divider from '@components/divider';
import MeetingSection from '@features/meetings/meeting_section';
import PartRow from './part_row';

const MinistryPart = ({ week, timings }: MinistryPartProps) => {
  const { t } = useAppTranslation();

  const { parts } = useMinistryPart(week);

  return (
    <MeetingSection
      part={t('tr_applyFieldMinistryPart')}
      color="var(--apply-yourself-to-the-field-ministry)"
      icon={<IconMinistry color="var(--always-white)" />}
      alwaysExpanded
    >
      <Stack spacing="8px" divider={<Divider color="var(--grey-200)" />}>
        {parts.map((part) => (
          <PartRow key={part} week={week} type={part} timings={timings} />
        ))}
      </Stack>
    </MeetingSection>
  );
};

export default MinistryPart;
