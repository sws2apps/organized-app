import appDb from '../../db';

const useFieldGroupsMigrate = () => {
  const handleMigrateGroups = async () => {
    const oldLists = await appDb.fieldServiceGroup.toArray();

    const currentList = oldLists.find(
      (record) => record.isCurrent && !record.deleted
    );

    if (!currentList) return [];

    const groups = [];

    let index = 0;
    for (const group of currentList.groups) {
      const sortedPersons = group.persons.sort((a, b) => {
        if (b.isOverseer !== a.isOverseer) {
          return b.isOverseer - a.isOverseer;
        } else {
          return b.isAssistant - a.isAssistant;
        }
      });

      groups.push({
        group_id: group.group_uid,
        group_data: {
          _deleted: false,
          updatedAt: new Date().toISOString(),
          name: '',
          sort_index: index,
          members: sortedPersons.map((person, sort_index) => {
            return { ...person, sort_index };
          }),
        },
      });

      index++;
    }

    return groups;
  };

  return { handleMigrateGroups };
};

export default useFieldGroupsMigrate;
