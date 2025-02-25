import { useAppTranslation, useBreakpoints } from '@hooks/index';
import {
  DoubleFieldContainer,
  PrimaryFieldContainer,
  SecondaryFieldContainer,
} from '@features/meetings/shared_styles';
import { BrotherAssignmentProps } from './index.types';
import MeetingPart from '@features/meetings/meeting_part';
import PartDuration from '@features/meetings/part_duration';
import PersonSelector from '@features/meetings/person_selector';
import Tooltip from '@components/tooltip';
import useBrotherAssignment from './useBrotherAssignment';

const BrotherAssignment = (props: BrotherAssignmentProps) => {
  const { laptopUp } = useBreakpoints();

  const { t } = useAppTranslation();

  const { isEdit, selectedWeek, durationEditable, type, isOverwrite } = props;

  const {
    meetingPartColor,
    assignmentType,
    assignment,
    partDuration,
    enableAssignment,
  } = useBrotherAssignment(props);

  return (
    <DoubleFieldContainer sx={{ flexDirection: laptopUp ? 'row' : 'column' }}>
      <PrimaryFieldContainer
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        {durationEditable && isEdit && (
          <PartDuration length={partDuration} week={selectedWeek} type={type} />
        )}

        <MeetingPart
          week={selectedWeek}
          type={type}
          color={meetingPartColor}
          isEdit={isEdit}
          isOverwrite={isOverwrite}
        />
      </PrimaryFieldContainer>
      <SecondaryFieldContainer sx={{ maxWidth: laptopUp ? '360px' : '100%' }}>
        {enableAssignment && (
          <Tooltip
            title={t('tr_notEditableInEditPartsMode')}
            show={isEdit}
            followCursor
          >
            <PersonSelector
              week={selectedWeek}
              label={t('tr_brother')}
              type={assignmentType}
              assignment={assignment}
              readOnly={isEdit}
            />
          </Tooltip>
        )}
      </SecondaryFieldContainer>
    </DoubleFieldContainer>
  );
};

export default BrotherAssignment;
