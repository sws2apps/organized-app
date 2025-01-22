import { Grid2 as Grid } from '@mui/material';
import { ReportItemProps } from './index.types';
import useReportItem from './useReportItem';
import Card from '@components/card';
import FormS4 from '@features/ministry/report/form_S4';
import Typography from '@components/typography';

const ReportItem = ({ person }: ReportItemProps) => {
  const { publisher_name, month } = useReportItem(person);

  return (
    <Grid size={{ mobile: 12, laptop: 6, desktop: 4 }}>
      <Card>
        <Typography className="h3">{publisher_name}</Typography>

        <FormS4 month={month} person_uid={person.person_uid} publisher={true} />
      </Card>
    </Grid>
  );
};

export default ReportItem;
