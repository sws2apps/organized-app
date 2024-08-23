import useAppTranslation from '@hooks/useAppTranslation';
import { Box } from '@mui/material';
import { Badge } from '@components/index';

import {
  ScheduleGrid,
  ScheduleHeader,
  ScheduleItem,
  ScheduleMemberRow,
  ScheduleMembers,
  ScheduleSubtitle,
  ScheduleTitle,
} from '../shared_components';
import { IconCongregation, IconInfo } from '@components/icons';

const OutgoingTalks = () => {
  const { t } = useAppTranslation();
  const lastUpdated = new Date().toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '16px',
          marginBottom: '8px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <IconInfo color="var(--grey-350)" />
          <span style={{ color: 'var(--grey-350)' }} className="body-regular">
            {t('tr_infoOutgoingTalk')}
          </span>
        </Box>
        <Badge
          text={t('tr_lastUpdated') + ' ' + lastUpdated}
          color="grey"
          size="small"
          filled={false}
        />
      </Box>
      <ScheduleGrid>
        <ScheduleHeader text="8 November 2023" color="var(--weekend-meeting)" />
        <ScheduleItem>
          <Box>
            <ScheduleTitle color="var(--weekend-meeting)">
              Public talk —{' '}
              <IconCongregation
                sx={{ margin: '0px 6px !important' }}
                color="var(--weekend-meeting)"
              />{' '}
              Berdychyv-Ost
            </ScheduleTitle>
            <ScheduleSubtitle>
              “The Resurrection — Why That Hope Should Be Real to You”
            </ScheduleSubtitle>
          </Box>
          <ScheduleMembers>
            <ScheduleMemberRow
              type={t('tr_speaker') + ':'}
              name="Jeremiah Green"
            />
          </ScheduleMembers>
        </ScheduleItem>
        <ScheduleItem>
          <Box>
            <ScheduleTitle color="var(--weekend-meeting)">
              Public talk —{' '}
              <IconCongregation
                sx={{ margin: '0px 6px !important' }}
                color="var(--weekend-meeting)"
              />{' '}
              Berdychyv-Ost
            </ScheduleTitle>
            <ScheduleSubtitle>“Real Help for the Family”</ScheduleSubtitle>
          </Box>
          <ScheduleMembers>
            <ScheduleMemberRow
              type={t('tr_speaker') + ':'}
              name="Jeremiah Green"
            />
          </ScheduleMembers>
        </ScheduleItem>
        <ScheduleHeader
          text="16 Novemxber 2023"
          color="var(--weekend-meeting)"
        />
        <ScheduleItem>
          <Box>
            <ScheduleTitle color="var(--weekend-meeting)">
              Public talk —{' '}
              <IconCongregation
                sx={{ margin: '0px 6px !important' }}
                color="var(--weekend-meeting)"
              />{' '}
              Berdychyv-Ost
            </ScheduleTitle>
            <ScheduleSubtitle>
              “The Resurrection — Why That Hope Should Be Real to You”
            </ScheduleSubtitle>
          </Box>
          <ScheduleMembers>
            <ScheduleMemberRow
              type={t('tr_speaker') + ':'}
              name="Jeremiah Green"
            />
          </ScheduleMembers>
        </ScheduleItem>
        <ScheduleHeader
          text="22 November 2023"
          color="var(--weekend-meeting)"
        />
        <ScheduleItem>
          <Box>
            <ScheduleTitle color="var(--weekend-meeting)">
              Public talk —{' '}
              <IconCongregation
                sx={{ margin: '0px 6px !important' }}
                color="var(--weekend-meeting)"
              />{' '}
              Berdychyv-Ost
            </ScheduleTitle>
            <ScheduleSubtitle>“Real Help for the Family”</ScheduleSubtitle>
          </Box>
          <ScheduleMembers>
            <ScheduleMemberRow
              type={t('tr_speaker') + ':'}
              name="Jeremiah Green"
            />
          </ScheduleMembers>
        </ScheduleItem>
        <ScheduleItem>
          <Box>
            <ScheduleTitle color="var(--weekend-meeting)">
              Public talk —{' '}
              <IconCongregation
                sx={{ margin: '0px 6px !important' }}
                color="var(--weekend-meeting)"
              />{' '}
              Berdychyv-Ost
            </ScheduleTitle>
            <ScheduleSubtitle>“The Resurrection”</ScheduleSubtitle>
          </Box>
          <ScheduleMembers>
            <ScheduleMemberRow
              type={t('tr_speaker') + ':'}
              name="Jeremiah Green"
            />
          </ScheduleMembers>
        </ScheduleItem>
        <ScheduleItem>
          <Box>
            <ScheduleTitle color="var(--weekend-meeting)">
              Public talk —{' '}
              <IconCongregation
                sx={{ margin: '0px 6px !important' }}
                color="var(--weekend-meeting)"
              />{' '}
              Berdychyv-Ost
            </ScheduleTitle>
            <ScheduleSubtitle>
              “The Resurrection — Why That Hope Should Be Real to You”
            </ScheduleSubtitle>
          </Box>
          <ScheduleMembers>
            <ScheduleMemberRow
              type={t('tr_speaker') + ':'}
              name="Jeremiah Green"
            />
          </ScheduleMembers>
        </ScheduleItem>
      </ScheduleGrid>
    </Box>
  );
};

export default OutgoingTalks;
