import {
  DoubleFieldContainer,
  PersonContainer,
  PrimaryFieldContainer,
  SecondaryFieldContainer,
} from '../../../shared_styles';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { PartRowProps } from './index.types';
import MeetingPart from '@features/meetings/meeting_part';

const PartRow = (props: PartRowProps) => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

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
        <PersonContainer label={`${t('tr_brother')}:`} name="Jeremiah Green" />
      </SecondaryFieldContainer>
    </DoubleFieldContainer>
  );
};

export default PartRow;
