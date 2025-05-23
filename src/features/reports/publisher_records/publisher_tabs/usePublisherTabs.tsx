import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { personsActiveState } from '@states/persons';
import { PersonType } from '@definition/person';
import usePerson from '@features/persons/hooks/usePerson';
import ListByGroups from './list_by_groups';
import TabLabelWithBadge from '@components/tab_label_with_badge';

const usePublisherTabs = () => {
  const { t } = useAppTranslation();

  const { personIsPublisher } = usePerson();

  const persons = useAtomValue(personsActiveState);

  const publishers = useMemo(() => {
    const active: PersonType[] = [];
    const inactive: PersonType[] = [];

    const current = persons.filter(
      (person) =>
        person.person_data.publisher_baptized.active.value ||
        person.person_data.publisher_unbaptized.active.value
    );

    for (const person of current) {
      const isPublisher = personIsPublisher(person);

      if (isPublisher) {
        active.push(person);
      }

      if (!isPublisher) {
        inactive.push(person);
      }
    }

    return { active: active.length, inactive: inactive.length };
  }, [persons, personIsPublisher]);

  const tabs = useMemo(() => {
    return [
      {
        label: (
          <TabLabelWithBadge
            label={t('tr_activePublishers')}
            count={publishers.active}
          />
        ),
        Component: <ListByGroups type="active" />,
      },
      {
        label: (
          <TabLabelWithBadge
            label={t('tr_inactivePublishers')}
            count={publishers.inactive}
          />
        ),
        Component: <ListByGroups type="inactive" />,
      },
    ];
  }, [t, publishers]);

  return { tabs };
};

export default usePublisherTabs;
