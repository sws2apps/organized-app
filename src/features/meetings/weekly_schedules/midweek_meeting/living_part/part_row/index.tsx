import {
  DoubleFieldContainer,
  PrimaryFieldContainer,
  SecondaryFieldContainer,
} from '../../../shared_styles';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { PartRowProps } from './index.types';
import usePartRow from './usePartRow';
import MeetingPart from '@features/meetings/meeting_part';
import PersonComponent from '@features/meetings/weekly_schedules/person_component';

const PartRow = (props: PartRowProps) => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const { lcField } = usePartRow(props);

  return (
    <DoubleFieldContainer laptopUp={laptopUp}>
      <PrimaryFieldContainer>
        <MeetingPart
          week={props.week}
          type={props.type}
          color="var(--living-as-christians)"
        />
      </PrimaryFieldContainer>
      <SecondaryFieldContainer laptopUp={laptopUp}>
        <PersonComponent
          label={`${t('tr_brother')}:`}
          week={props.week}
          assignment={lcField}
        />
      </SecondaryFieldContainer>
    </DoubleFieldContainer>
  );
};

export default PartRow;
