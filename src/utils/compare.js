export const comparePerson = (source, modified) => {
  const excludeFields = ['changes', 'id', 'lastAssignment', 'person_uid'];
  const changes = source.changes ? [...source.changes] : [];

  for (const [key, value] of Object.entries(modified)) {
    if (excludeFields.indexOf(key) === -1) {
      const arrayFields = [
        { name: 'assignments', id: 'assignmentId' },
        { name: 'timeAway', id: 'timeAwayId' },
      ];

      if (arrayFields.findIndex((field) => field.name === key) === -1) {
        if (value !== source[key]) {
          const findIndex = changes.findIndex((item) => item.field === key);
          if (findIndex !== -1) changes.splice(findIndex, 1);
          changes.push({ date: new Date().toISOString(), field: key, value });
        }
      }

      const foundArray = arrayFields.find((field) => field.name === key);
      if (foundArray) {
        // check added or modified assignment
        value.forEach((updated) => {
          const findSource = source[key].find((item) => item[foundArray.id] === updated[foundArray.id]);
          // assignment modified
          if (findSource) {
            const excludeArrayFields = [foundArray.id, 'isActive'];
            let arrayFieldChanged = false;
            for (const [arrayKey, arrayValue] of Object.entries(updated)) {
              if (excludeArrayFields.indexOf(arrayKey) === -1) {
                if (arrayValue !== findSource[arrayKey]) {
                  arrayFieldChanged = true;
                  break;
                }
              }
            }
            if (arrayFieldChanged) {
              const findIndex = changes.findIndex(
                (item) => item.field === key && item.value[foundArray.id] === updated[foundArray.id]
              );
              if (findIndex !== -1) changes.splice(findIndex, 1);
              changes.push({ date: new Date().toISOString(), field: key, isModified: true, value: updated });
            }
          }

          // new assignment
          if (!findSource) {
            changes.push({ date: new Date().toISOString(), field: key, isAdded: true, value: updated });
          }
        });

        // check deleted assignment
        source[key].forEach((original) => {
          const findModified = value.find((item) => item[foundArray.id] === original[foundArray.id]);
          if (!findModified) {
            const findIndex = changes.findIndex(
              (item) => item.field === key && item.value[foundArray.id] === original[foundArray.id]
            );
            if (findIndex !== -1) changes.splice(findIndex, 1);
            changes.push({ date: new Date().toISOString(), field: key, isDeleted: true, value: original });
          }
        });
      }
    }
  }

  return changes;
};
