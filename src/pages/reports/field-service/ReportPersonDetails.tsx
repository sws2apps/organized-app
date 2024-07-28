import { HorizontalFlex, StyledCardBox, VerticalFlex } from './index.styles';
import UserCardMaleImg from '@assets/img/illustration_male.svg?component';
import UserCardFemaleImg from '@assets/img/illustration_female.svg?component';
import { PersonWithReport } from './index.types';
import { FieldServiceBadge, ResponsibilityBadge } from './PersonBadge';
import {
  Checkbox,
  CustomDivider,
  CustomTimeTextField,
  InfoTip,
  MinusButton,
  PlusButton,
  TextField,
} from '@components/index';
import useAppTranslation from '@hooks/useAppTranslation';
import { useState } from 'react';
import { IconInfo } from '@components/icons';
import {
  convertDurationInSecondsToString,
  convertDurationStringToSeconds,
} from '@features/ministry/add_service_time_modal_window/utils';
import { Box } from '@mui/material';
import CustomTypography from '@components/typography';

const ReportPersonDetails = ({ person }: { person?: PersonWithReport }) => {
  if (!person) return <NoPersonSelected />;
  else return <PersonDetails person={person} />;
};

const NoPersonSelected = () => {
  const { t } = useAppTranslation();

  return (
    <InfoTip
      sx={{ borderRadius: 'var(--radius-l)' }}
      isBig={false}
      icon={<IconInfo />}
      color="white"
      text={t('tr_reportPageInfo')}
    />
  );
};

const PersonDetails = ({ person }: { person: PersonWithReport }) => {
  const { t } = useAppTranslation();

  const [isLate, setIsLate] = useState(person.report?.isLate ?? false);

  const [sharedAnyFormOfTheMinistry, setSharedAnyFormOfTheMinistry] = useState(
    person.report?.sharedAnyFormOfTheMinistry ?? false
  );
  const [totalHours, setTotalHours] = useState(person.report?.totalHours ?? 0);
  const [nbBibleStudies, setNbBibleStudies] = useState(
    person.report?.bibleStudies ?? 0
  );

  const isAPublisher = person.fieldService === 'Publisher';

  return (
    <StyledCardBox
      sx={{
        padding: '24px',
        borderRadius: 'var(--radius-l)',
        color: 'var(--black)',
      }}
    >
      <HorizontalFlex
        sx={{ justifyContent: 'space-between', alignItems: 'center' }}
      >
        <HorizontalFlex sx={{ gap: '13px' }}>
          {person.gender == 'female' ? (
            <UserCardFemaleImg />
          ) : (
            <UserCardMaleImg />
          )}
          <VerticalFlex sx={{ gap: '4px' }}>
            <span>
              {person.firstName} {person.lastName}
            </span>
            <HorizontalFlex sx={{ gap: '8px' }}>
              <ResponsibilityBadge responsability={person.responsibility} />
              <FieldServiceBadge fieldService={person.fieldService} />
            </HorizontalFlex>
          </VerticalFlex>
        </HorizontalFlex>
        <Checkbox
          label={t('tr_lateReport')}
          checked={isLate}
          onChange={(e) => setIsLate(e.target.checked)}
        />
      </HorizontalFlex>
      <CustomDivider color="var(--accent-200)" />

      {isAPublisher ? (
        <Checkbox
          label={t('tr_sharedMinistry')}
          checked={sharedAnyFormOfTheMinistry}
          onChange={(e) => setSharedAnyFormOfTheMinistry(e.target.checked)}
        />
      ) : (
        <HorizontalFlex
          sx={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span className="body-regular">{t('tr_totalHours')}</span>
          <TimeField
            value={totalHours}
            onChange={(value) => setTotalHours(value)}
          />
        </HorizontalFlex>
      )}
      <CustomDivider color="var(--accent-200)" />
      <HorizontalFlex
        sx={{ justifyContent: 'space-between', alignItems: 'center' }}
      >
        <span className="body-regular">{t('tr_bibleStudies')}</span>
        <CustomNumberField
          value={nbBibleStudies}
          onChange={(value) => setNbBibleStudies(value)}
        />
      </HorizontalFlex>
      <CustomDivider color="var(--accent-200)" />
      <TextField label={t('tr_comments')} multiline minRows={3} />
    </StyledCardBox>
  );
};

const TimeField = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => {
  const decrementDuration = () => {
    if (convertDurationInSecondsToString(value) != '00:00') {
      onChange(value - 3600);
    }
  };
  const incrementDuration = () => {
    onChange(value + 3600);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        minWidth: '168px',
        maxWidth: '168px',
        alignItems: 'center',
      }}
    >
      <MinusButton onClick={decrementDuration} />
      <CustomTimeTextField
        value={convertDurationInSecondsToString(value)}
        onChange={(event) => {
          const value = convertDurationStringToSeconds(event.target.value);
          onChange(value);
        }}
        color={'var(--black)'}
      />
      <PlusButton onClick={incrementDuration} />
    </Box>
  );
};

const CustomNumberField = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => {
  const increment = () => {
    onChange(value + 1);
  };

  const decrement = () => {
    onChange(value > 0 ? value - 1 : 0);
  };
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        minWidth: '168px',
        maxWidth: '168px',
        alignItems: 'center',
      }}
    >
      <MinusButton onClick={decrement} />
      <CustomTypography className="h3" color="var(--black)">
        {value}
      </CustomTypography>
      <PlusButton onClick={increment} />
    </Box>
  );
};

export default ReportPersonDetails;
