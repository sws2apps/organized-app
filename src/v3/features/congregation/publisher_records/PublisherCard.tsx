import { HorizontalFlex, StyledCardBox, VerticalFlex } from './index.styles';
import UserCardMaleImg from '@assets/img/illustration_male.svg?component';
import UserCardFemaleImg from '@assets/img/illustration_female.svg?component';
import { Badge } from '@components/index';
import { BadgeColor } from '@definition/app';
import { Person } from './index.types';
import { IconArrowLink } from '@components/icons';
import { Link } from 'react-router-dom';

const ResponsibilityBadge = ({
  responsability,
}: {
  responsability?: Person['responsibility'];
}) => {
  return (
    responsability && (
      <Badge text={responsability} color="green" size="small" filled={false} />
    )
  );
};

const FieldServiceBadge = ({
  fieldService,
}: {
  fieldService: Person['fieldService'];
}) => {
  const colors: Record<string, BadgeColor> = {
    'Special pioneer': 'orange',
    'Regular pioneer': 'orange',
    'Auxiliary pioneer': 'orange',
    Publisher: 'grey',
  };
  return (
    <Badge
      text={fieldService}
      color={colors[fieldService]}
      size="small"
      filled={false}
    />
  );
};

const PublisherCard = ({
  person,
  onClick,
}: {
  person: Person;
  onClick?: () => void;
}) => {
  return (
    <Link to={'./id'} style={{ textDecoration: 'unset' }}>
      <StyledCardBox
        onClick={onClick}
        sx={{
          padding: '24px',
          borderRadius: 'var(--radius-l)',
          cursor: 'pointer',
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
          <IconArrowLink color="var(--black)" />
        </HorizontalFlex>
      </StyledCardBox>
    </Link>
  );
};

export default PublisherCard;
