import { IconExport } from '@components/icons';
import { Button } from '@components/index';
import PageTitle from '@components/page_title';
import GroupPublisherSelector from '@features/congregation/publisher_records/GroupPublisherSelector';
import StatisticPanel from '@features/congregation/publisher_records/StatisticsPanel';
import {
  LeftColumn,
  RightColumn,
  Wrapper,
} from '@features/congregation/publisher_records/Wrappers';
import { TerritoryGroup } from '@features/congregation/publisher_records/index.types';
import { CardSection } from '@features/congregation/settings/CardSection';
import useAppTranslation from '@hooks/useAppTranslation';
import { Box } from '@mui/material';

const groups: TerritoryGroup[] = [
  {
    name: 'Group name if added',
    members: [
      {
        id: '1',
        firstName: 'Alice',
        lastName: 'Adams',
        gender: 'female',
        fieldService: 'Publisher',
        // serviceReports: [
        //   {
        //     year: 2021,
        //     months: [
        //       {
        //         sharedAnyFormOfTheMinistry: true,
        //         bibleStudies: 1,
        //         totalHours: 10,
        //         comments: 'Great month',
        //       },
        //       {
        //         sharedAnyFormOfTheMinistry: false,
        //       },
        //     ],
        //   },
        // ],
      },
      {
        id: '2',
        firstName: 'Bob',
        lastName: 'Brown',
        gender: 'male',
        fieldService: 'Regular pioneer',
        responsibility: 'Ministerial Servant',
      },
      {
        id: '3',
        firstName: 'Charlie',
        lastName: 'Clark',
        gender: 'female',
        fieldService: 'Special pioneer',
      },
    ],
  },
  {
    name: 'Emelrightes',
    members: [
      {
        id: '1',
        firstName: 'Alice',
        lastName: 'Adams',
        gender: 'female',
        fieldService: 'Publisher',
      },
      {
        id: '2',
        firstName: 'Bob',
        lastName: 'Brown',
        gender: 'male',
        fieldService: 'Regular pioneer',
        responsibility: 'Ministerial Servant',
      },
      {
        id: '3',
        firstName: 'Charlie',
        lastName: 'Clark',
        gender: 'female',
        fieldService: 'Special pioneer',
      },
      {
        id: '1',
        firstName: 'Alice',
        lastName: 'Adams',
        gender: 'female',
        fieldService: 'Publisher',
      },
      {
        id: '2',
        firstName: 'Bob',
        lastName: 'Brown',
        gender: 'male',
        fieldService: 'Regular pioneer',
        responsibility: 'Ministerial Servant',
      },
      {
        id: '3',
        firstName: 'Charlie',
        lastName: 'Clark',
        gender: 'female',
        fieldService: 'Special pioneer',
      },
      {
        id: '1',
        firstName: 'Alice',
        lastName: 'Adams',
        gender: 'female',
        fieldService: 'Publisher',
      },
      {
        id: '2',
        firstName: 'Bob',
        lastName: 'Brown',
        gender: 'male',
        fieldService: 'Regular pioneer',
        responsibility: 'Ministerial Servant',
      },
      {
        id: '3',
        firstName: 'Charlie',
        lastName: 'Clark',
        gender: 'female',
        fieldService: 'Special pioneer',
      },
    ],
  },
  {
    members: [
      {
        id: '1',
        firstName: 'Alice',
        lastName: 'Adams',
        gender: 'female',
        fieldService: 'Publisher',
      },
      {
        id: '2',
        firstName: 'Bob',
        lastName: 'Brown',
        gender: 'male',
        fieldService: 'Regular pioneer',
        responsibility: 'Ministerial Servant',
      },
      {
        id: '3',
        firstName: 'Charlie',
        lastName: 'Clark',
        gender: 'female',
        fieldService: 'Special pioneer',
      },
    ],
  },
  {
    members: [
      {
        id: '1',
        firstName: 'Alice',
        lastName: 'Adams',
        gender: 'female',
        fieldService: 'Publisher',
      },
      {
        id: '2',
        firstName: 'Bob',
        lastName: 'Brown',
        gender: 'male',
        fieldService: 'Regular pioneer',
        responsibility: 'Ministerial Servant',
      },
      {
        id: '3',
        firstName: 'Charlie',
        lastName: 'Clark',
        gender: 'female',
        fieldService: 'Special pioneer',
      },
    ],
  },
  {
    name: 'Sombekoe',
    members: [
      {
        id: '1',
        firstName: 'Alice',
        lastName: 'Adams',
        gender: 'female',
        fieldService: 'Publisher',
      },
      {
        id: '2',
        firstName: 'Bob',
        lastName: 'Brown',
        gender: 'male',
        fieldService: 'Regular pioneer',
        responsibility: 'Ministerial Servant',
      },
      {
        id: '3',
        firstName: 'Charlie',
        lastName: 'Clark',
        gender: 'female',
        fieldService: 'Special pioneer',
      },
    ],
  },
];

const PublisherRecord = () => {
  const { t } = useAppTranslation();

  const handleExport = () => {
    console.log('Export S21');
  };
  return (
    <>
      <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
        <PageTitle
          title={t('tr_publishersRecords')}
          buttons={
            <Button startIcon={<IconExport />} onClick={handleExport}>
              {t('tr_exportS21')}
            </Button>
          }
        />
      </Box>
      <Wrapper>
        <LeftColumn>
          <CardSection>
            <GroupPublisherSelector groups={groups} />
          </CardSection>
        </LeftColumn>
        <RightColumn>
          <StatisticPanel />
        </RightColumn>
      </Wrapper>
    </>
  );
};

export default PublisherRecord;
