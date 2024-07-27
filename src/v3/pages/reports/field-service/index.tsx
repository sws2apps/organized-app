import { IconPrepareReport } from '@components/icons';
import { Button } from '@components/index';
import PageTitle from '@components/page_title';
import useAppTranslation from '@hooks/useAppTranslation';
import { Box } from '@mui/material';
import ReportPersonDetails from './ReportPersonDetails';
import ReportsPersonSelector from './ReportsPersonSelector';
import ReportsRangeSelector from './ReportsRangeSelector';
import { VerticalFlex } from './index.styles';
import { PersonWithReport } from './index.types';
import { useState } from 'react';
import { convertDurationStringToSeconds } from '@features/ministry/add_service_time_modal_window/utils';

const persons = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Adams',
    gender: 'female',
    fieldService: 'Publisher',
    report: {
      isLate: false,
      sharedAnyFormOfTheMinistry: true,
      bibleStudies: 0,
    },
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
    report: {
      isLate: true,
      totalHours: convertDurationStringToSeconds('2:00'),
      bibleStudies: 1,
    },
  },
] satisfies PersonWithReport[];

const FieldServiceReportsPage = () => {
  const [selectedPerson, setSelectedPerson] = useState<PersonWithReport>();

  const { t } = useAppTranslation();

  const handleCreateReport = () => null;

  return (
    <VerticalFlex>
      <PageTitle
        title={t('tr_fieldServiceReports')}
        buttons={
          <Button
            startIcon={<IconPrepareReport />}
            onClick={handleCreateReport}
          >
            {t('tr_createS1')}
          </Button>
        }
      />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          '& > *': {
            flexBasis: 0,
            flexGrow: 1,
          },
          gap: '16px',
        }}
      >
        <VerticalFlex>
          <ReportsRangeSelector />
          <ReportsPersonSelector
            persons={persons}
            onClick={(person) => setSelectedPerson(person)}
          />
        </VerticalFlex>
        <VerticalFlex>
          <ReportPersonDetails person={selectedPerson} />
        </VerticalFlex>
      </Box>
    </VerticalFlex>
  );
};

export default FieldServiceReportsPage;
