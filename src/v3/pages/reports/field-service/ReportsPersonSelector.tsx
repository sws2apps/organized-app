import useAppTranslation from '@hooks/useAppTranslation';
import { HorizontalFlex, StyledCardBox, VerticalFlex } from './index.styles';
import { PersonWithReport } from './index.types';
import UserCardMaleImg from '@assets/img/illustration_male.svg?component';
import UserCardFemaleImg from '@assets/img/illustration_female.svg?component';
import NoSearchResults from '@assets/img/illustration_no_search_results.svg?component';
import { IconCheckmarkCircleAlt } from '@components/icons';
import { Box } from '@mui/material';
import { FieldServiceBadge, ResponsibilityBadge } from './PersonBadge';
import { useState } from 'react';

const ReportsPersonSelector = ({
  persons,
  onClick,
}: {
  persons: PersonWithReport[];
  onClick: (person: PersonWithReport) => void;
}) => {
  const [personSelected, setPersonSelected] = useState<PersonWithReport>();
  const { t } = useAppTranslation();
  const handleClick = (person: PersonWithReport) => {
    if (personSelected?.id == person.id) {
      setPersonSelected(undefined);
      onClick(undefined);
      return;
    }
    setPersonSelected(person);
    onClick(person);
  };
  return (
    <StyledCardBox>
      <span className="h3" style={{ color: 'var(--black)' }}>
        {t('tr_personsAmount', {
          amount: persons.length,
        })}
      </span>
      <VerticalFlex sx={{ gap: '8px' }}>
        {persons.map((person) => (
          <ReportPerson
            key={person.id}
            person={person}
            isSelected={personSelected?.id == person.id}
            onClick={handleClick.bind(null, person)}
          />
        ))}
        {persons.length === 0 && <NoPersons />}
      </VerticalFlex>
    </StyledCardBox>
  );
};

const NoPersons = () => {
  const { t } = useAppTranslation();

  return (
    <HorizontalFlex sx={{ alignItems: 'stretch' }}>
      <Box>
        <NoSearchResults viewBox="0 0 160 160" width={80} height={80} />
      </Box>
      <VerticalFlex sx={{ gap: '8px', flexShrink: '1', color: 'var(--black)' }}>
        <span className="h4">{t('tr_noPersonsFound')}</span>
        <span className="body">{t('tr_noPersonsFoundDesc')}</span>
      </VerticalFlex>
    </HorizontalFlex>
  );
};

const ReportPerson = ({
  person,
  isSelected,
  onClick,
}: {
  person: PersonWithReport;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <StyledCardBox
      onClick={onClick}
      sx={{
        padding: '24px',
        borderRadius: 'var(--radius-l)',
        cursor: 'pointer',
        borderColor: isSelected ? 'var(--accent-main)' : '',
        backgroundColor: isSelected ? 'var(--accent-100)' : '',
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
          <VerticalFlex sx={{ gap: '4px', color: 'var(--black)' }}>
            <span>
              {person.firstName} {person.lastName}
            </span>
            <HorizontalFlex sx={{ gap: '8px' }}>
              <ResponsibilityBadge responsability={person.responsibility} />
              <FieldServiceBadge fieldService={person.fieldService} />
            </HorizontalFlex>
          </VerticalFlex>
        </HorizontalFlex>
        {person.report && <IconCheckmarkCircleAlt color="var(--accent-main)" />}
      </HorizontalFlex>
    </StyledCardBox>
  );
};

export default ReportsPersonSelector;
