import UserCardMaleImg from '@assets/img/illustration_male.svg?component';
import UserCardFemaleImg from '@assets/img/illustration_female.svg?component';
import { CardSection } from '../publisher_records/Wrappers';
import { HorizontalFlex, VerticalFlex } from './index.styles';
import {
  FieldServiceBadge,
  ResponsibilityBadge,
} from '@pages/reports/field-service/PersonBadge';
import { PersonWithAnnualReport } from '../publisher_records/index.types';
import { DatePicker } from '@components/index';
import useAppTranslation from '@hooks/useAppTranslation';
import { Box } from '@mui/material';

const data: PersonWithAnnualReport = {
  id: '1',
  firstName: 'Alice',
  lastName: 'Adams',
  gender: 'female',
  fieldService: 'Publisher',
  serviceReports: [
    {
      year: 2021,
      months: [
        {
          sharedAnyFormOfTheMinistry: true,
          bibleStudies: 1,
          totalHours: 10,
          comments: 'Great month',
        },
        {
          sharedAnyFormOfTheMinistry: false,
        },
      ],
    },
  ],
};

const getYearsFromNow = (date: Date) => {
  const yearsFromNow =
    (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365);
  return Math.round(yearsFromNow * 10) / 10;
};

const DateCalcCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 16px',
        borderRadius: 'var(--radius-l)',
        backgroundColor: 'var(--accent-150)',
        width: '150px',
      }}
    >
      <span className="h4" style={{ color: 'var(--accent-dark)' }}>
        {children}
      </span>
    </Box>
  );
};

const PublisherDetailCard = () => {
  const { t } = useAppTranslation();

  const dateOfBirth = new Date('03/10/1992');
  const baptismDate = new Date('01/11/2016');

  return (
    <Box
      sx={{
        position: 'sticky',
        top: '72px',
      }}
    >
      <CardSection>
        <HorizontalFlex>
          {data.gender == 'male' ? <UserCardMaleImg /> : <UserCardFemaleImg />}
          <VerticalFlex sx={{ gap: '4px' }}>
            <span className="h2" style={{ color: 'var(--black)' }}>
              {data.firstName} {data.lastName}
            </span>
            <HorizontalFlex>
              {data.gender == 'male' && (
                <ResponsibilityBadge responsability={data?.responsibility} />
              )}
              <FieldServiceBadge fieldService={data.fieldService} />
            </HorizontalFlex>
          </VerticalFlex>
        </HorizontalFlex>
        <VerticalFlex>
          <HorizontalFlex>
            <DatePicker
              view={'input'}
              label={t('tr_dateOfBirth')}
              value={dateOfBirth}
            />
            <DateCalcCard>
              {t('tr_userAge', { userAge: getYearsFromNow(dateOfBirth) })}
            </DateCalcCard>
          </HorizontalFlex>
          <HorizontalFlex>
            <DatePicker
              view={'input'}
              label={t('tr_baptismDate')}
              value={baptismDate}
            />
            <DateCalcCard>
              {t('tr_yearsNumber', {
                yearsCount: getYearsFromNow(baptismDate),
              })}
            </DateCalcCard>
          </HorizontalFlex>
        </VerticalFlex>
      </CardSection>
    </Box>
  );
};

export default PublisherDetailCard;
