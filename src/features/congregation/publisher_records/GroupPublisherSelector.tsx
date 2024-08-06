import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { TerritoryGroup } from './index.types';
import { Tabs, Typography } from '@components/index';
import { IconExpand } from '@components/icons';
import { useMemo, useState } from 'react';
import useAppTranslation from '@hooks/useAppTranslation';
import { VerticalFlex } from './index.styles';
import PublisherCard from './PublisherCard';

const GroupAccordion = ({
  label,
  children,
  expanded,
  onChange,
}: {
  label?: React.ReactNode;
  children?: React.ReactNode;
  expanded: boolean;
  onChange: (event: React.SyntheticEvent, expanded: boolean) => void;
}) => {
  return (
    <Accordion
      elevation={0}
      sx={{
        margin: '0px !important',
        backgroundColor: 'var(--white)',
        '&::before': {
          content: 'unset',
        },
      }}
      expanded={expanded}
      onChange={onChange}
    >
      <AccordionSummary
        expandIcon={<IconExpand color="var(--black)" />}
        sx={{
          minHeight: 'unset !important',
          '.MuiAccordionSummary-content': {
            margin: '10px 0 !important',
          },
        }}
      >
        <Typography>{label}</Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          paddingBottom: '8px',
          paddingTop: '0',
        }}
      >
        <Typography>{children}</Typography>
      </AccordionDetails>
    </Accordion>
  );
};

const filterActivePersons = (groups: TerritoryGroup[]) => {
  return groups.map((group) => ({
    ...group,
    members: group.members.filter(
      (member) => member.inactiveLastReportDate === undefined
    ),
  }));
};

const filterInactivePersons = (groups: TerritoryGroup[]) => {
  return groups.map((group) => ({
    ...group,
    members: group.members.filter(
      (member) => member.inactiveLastReportDate !== undefined
    ),
  }));
};

const PublisherTab = ({ groups }: { groups: TerritoryGroup[] }) => {
  const [expanded, setExpanded] = useState<number | false>();

  const { t } = useAppTranslation();

  const amount = groups.reduce((prev, group) => prev + group.members.length, 0);

  return (
    <div>
      <span
        className="h3"
        style={{
          fontWeight: 570,
          display: 'block',
          marginBottom: '16px',
          color: 'var(--black)',
        }}
      >
        {t('tr_personsAmount', {
          amount: amount,
        })}
      </span>
      {groups.map((group, index) => (
        <GroupAccordion
          expanded={expanded === index}
          onChange={(_, state) => setExpanded(state ? index : false)}
          key={index}
          label={
            'Group ' + (index + 1) + (group.name ? ' – ' + group.name : '')
          }
        >
          <VerticalFlex sx={{ gap: '8px', marginTop: '8px' }}>
            {group.members.map((member, index) => (
              <PublisherCard key={index} person={member} />
            ))}
          </VerticalFlex>
        </GroupAccordion>
      ))}
    </div>
  );
};

const GroupPublisherSelector = ({ groups }: { groups: TerritoryGroup[] }) => {
  const { t } = useAppTranslation();

  const { activeGroups, inactiveGroups } = useMemo(() => {
    return {
      activeGroups: filterActivePersons(groups).filter(
        (group) => group.members.length
      ),
      inactiveGroups: filterInactivePersons(groups).filter(
        (group) => group.members.length
      ),
    };
  }, [groups]);

  const tabs = [
    {
      label: t('tr_activePublishers'),
      Component: <PublisherTab groups={activeGroups} />,
    },
    {
      label: t('tr_inactivePublishers'),
      Component: <PublisherTab groups={inactiveGroups} />,
    },
  ];
  return <Tabs tabs={tabs} />;
};

export default GroupPublisherSelector;
