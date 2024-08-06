import { Badge } from '@components/index';
import { BadgeColor } from '@definition/app';
import { Person } from './index.types';

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

export { ResponsibilityBadge, FieldServiceBadge };
