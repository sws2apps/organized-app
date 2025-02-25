import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { AssignmentCode } from '@definition/assignment';
import {
  DoubleFieldContainer,
  PrimaryFieldContainer,
  SecondaryFieldContainer,
} from '@features/meetings/shared_styles';
import {
  ClassAssignmentContainer,
  PersonDoubleContainer,
} from '../index.styles';
import { MinistryPartProps } from './index.types';
import useMinistryPart from './useMinistryPart';
import MeetingPart from '@features/meetings/meeting_part';
import Tooltip from '@components/tooltip';
import Typography from '@components/typography';
import PersonSelector from '@features/meetings/person_selector';

const MinistryPart = (props: MinistryPartProps) => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const { selectedWeek, isEdit } = props;

  const { type, assignmentType, doublePerson, showAssistant, assignmentName } =
    useMinistryPart(props);

  return (
    <DoubleFieldContainer sx={{ flexDirection: laptopUp ? 'row' : 'column' }}>
      <PrimaryFieldContainer>
        <MeetingPart
          week={selectedWeek}
          type={type}
          color="var(--apply-yourself-to-the-field-ministry)"
        />
      </PrimaryFieldContainer>
      <SecondaryFieldContainer sx={{ maxWidth: laptopUp ? '360px' : '100%' }}>
        <ClassAssignmentContainer>
          {assignmentType !== AssignmentCode.MM_Discussion && doublePerson && (
            <Typography className="body-small-semibold" color="var(--grey-350)">
              {t('tr_mainHall')}
            </Typography>
          )}

          <PersonDoubleContainer>
            <Tooltip
              title={t('tr_notEditableInEditPartsMode')}
              show={isEdit}
              followCursor
            >
              <PersonSelector
                week={selectedWeek}
                label={
                  assignmentType === AssignmentCode.MM_Discussion
                    ? t('tr_brother')
                    : t('tr_student')
                }
                type={assignmentType}
                assignment={assignmentName.main_hall.student}
                readOnly={isEdit}
              />
            </Tooltip>

            {showAssistant && (
              <Tooltip
                title={t('tr_notEditableInEditPartsMode')}
                show={isEdit}
                followCursor
              >
                <PersonSelector
                  week={selectedWeek}
                  label={t('tr_assistant')}
                  type={assignmentType}
                  assignment={assignmentName.main_hall.assistant}
                  readOnly={isEdit}
                />
              </Tooltip>
            )}
          </PersonDoubleContainer>
        </ClassAssignmentContainer>

        {doublePerson && (
          <ClassAssignmentContainer>
            <Typography className="body-small-semibold" color="var(--grey-350)">
              {t('tr_auxClass')}
            </Typography>
            <PersonDoubleContainer>
              <Tooltip
                title={t('tr_notEditableInEditPartsMode')}
                show={isEdit}
                followCursor
              >
                <PersonSelector
                  week={selectedWeek}
                  label={t('tr_student')}
                  type={assignmentType}
                  assignment={assignmentName.aux_class_1.student}
                  readOnly={isEdit}
                />
              </Tooltip>

              {showAssistant && (
                <Tooltip
                  title={t('tr_notEditableInEditPartsMode')}
                  show={isEdit}
                  followCursor
                >
                  <PersonSelector
                    week={selectedWeek}
                    label={t('tr_assistant')}
                    type={assignmentType}
                    assignment={assignmentName.aux_class_1.assistant}
                    readOnly={isEdit}
                  />
                </Tooltip>
              )}
            </PersonDoubleContainer>
          </ClassAssignmentContainer>
        )}
      </SecondaryFieldContainer>
    </DoubleFieldContainer>
  );
};

export default MinistryPart;
