import { Stack } from '@mui/material';
import {
  DoubleFieldContainer,
  PrimaryFieldContainer,
  SecondaryFieldContainer,
} from '../../../shared_styles';
import { AssignmentCode } from '@definition/assignment';
import { PartRowProps } from './index.types';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import usePartRow from './usePartRow';
import Divider from '@components/divider';
import MeetingPart from '@features/meetings/meeting_part';
import PersonComponent from '@features/meetings/weekly_schedules/person_component';
import Typography from '@components/typography';
import PartTiming from '../../../part_timing';

const PartRow = (props: PartRowProps) => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const { showAuxClass, studentField, ayfType, showAssistant } =
    usePartRow(props);

  return (
    <DoubleFieldContainer sx={{ flexDirection: laptopUp ? 'row' : 'column' }}>
      <PrimaryFieldContainer>
        {props.timings?.[props.type.toString()] && (
          <PartTiming time={props.timings[props.type.toString()]} />
        )}
        <MeetingPart
          week={props.week}
          type={props.type}
          color="var(--apply-yourself-to-the-field-ministry)"
        />
      </PrimaryFieldContainer>
      <SecondaryFieldContainer sx={{ maxWidth: laptopUp ? '360px' : '100%' }}>
        <Stack spacing="8px" divider={<Divider color="var(--grey-200)" />}>
          <Stack spacing="4px">
            {showAuxClass && ayfType !== AssignmentCode.MM_Discussion && (
              <Typography
                className="body-small-semibold"
                color="var(--grey-350)"
              >
                {t('tr_mainHall')}
              </Typography>
            )}

            <Stack>
              <PersonComponent
                label={`${ayfType === AssignmentCode.MM_Discussion ? t('tr_brother') : t('tr_student')}:`}
                week={props.week}
                assignment={studentField.main_hall.student}
              />

              {showAssistant && (
                <PersonComponent
                  label={`${t('tr_assistant')}:`}
                  week={props.week}
                  assignment={studentField.main_hall.assistant}
                />
              )}
            </Stack>
          </Stack>

          {showAuxClass && (
            <Stack spacing="4px">
              {ayfType !== AssignmentCode.MM_Discussion && (
                <Typography
                  className="body-small-semibold"
                  color="var(--grey-350)"
                >
                  {t('tr_auxClassroom')}
                </Typography>
              )}

              <Stack>
                <PersonComponent
                  label={`${t('tr_student')}:`}
                  week={props.week}
                  assignment={studentField.aux_class.student}
                />

                {showAssistant && (
                  <PersonComponent
                    label={`${t('tr_assistant')}:`}
                    week={props.week}
                    assignment={studentField.aux_class.assistant}
                  />
                )}
              </Stack>
            </Stack>
          )}
        </Stack>
      </SecondaryFieldContainer>
    </DoubleFieldContainer>
  );
};

export default PartRow;
