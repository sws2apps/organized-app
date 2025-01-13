import { Box, Stack } from '@mui/material';
import { IconCongregation } from '@components/icons';
import {
  DoubleFieldContainer,
  PrimaryFieldContainer,
  SecondaryFieldContainer,
} from '../../shared_styles';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { ScheduleItemProps } from './index.types';
import useScheduleItem from './useScheduleItem';
import PersonComponent from '../../person_component';
import Typography from '@components/typography';

const ScheduleItem = (props: ScheduleItemProps) => {
  const { t } = useAppTranslation();

  const { laptopUp, tabletUp } = useBreakpoints();

  const { talkSchedule } = useScheduleItem(props);

  return (
    <DoubleFieldContainer sx={{ flexDirection: laptopUp ? 'row' : 'column' }}>
      <PrimaryFieldContainer>
        <Stack spacing="8px">
          <Stack
            spacing="8px"
            flexWrap="wrap"
            direction={tabletUp ? 'row' : 'column'}
            alignItems={tabletUp && 'center'}
          >
            <Typography className="h4" color="var(--weekend-meeting)">
              {t('tr_publicTalk')}
            </Typography>
            {tabletUp && (
              <Typography className="h4" color="var(--weekend-meeting)">
                —
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <IconCongregation color="var(--weekend-meeting)" />
              <Typography className="h4" color="var(--weekend-meeting)">
                {talkSchedule.congregation.name}
              </Typography>
            </Box>
          </Stack>
          <Typography className="h4">{talkSchedule.talk}</Typography>
        </Stack>
      </PrimaryFieldContainer>
      <SecondaryFieldContainer sx={{ maxWidth: laptopUp ? '360px' : '100%' }}>
        <PersonComponent
          label={`${t('tr_speaker')}:`}
          week={props.week}
          schedule_id={props.schedule_id}
        />
      </SecondaryFieldContainer>
    </DoubleFieldContainer>
  );
};

export default ScheduleItem;
