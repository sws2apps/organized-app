export const comparePerson = (source, modified) => {
  const excludeFields = ['changes', 'id', 'lastAssignment', 'person_uid'];
  const changes = source.changes ? [...source.changes] : [];

  for (const [key, value] of Object.entries(modified)) {
    if (excludeFields.indexOf(key) === -1) {
      if (key !== 'timeAway') {
        if (key !== 'assignments') {
          if (value !== source[key]) {
            const findIndex = changes.findIndex((item) => item.field === key);
            if (findIndex !== -1) changes.splice(findIndex, 1);
            changes.push({ date: new Date().toISOString(), field: key, value });
          }
        }

        if (key === 'assignments') {
          // check added or deleted assignment
          value?.forEach((updated) => {
            const findSource = source[key]?.find((item) => item.code === updated.code);
            // new assignment
            if (!findSource) {
              const findIndex = changes.findIndex((item) => item.field === key && item.value.code === updated.code);
              if (findIndex !== -1) changes.splice(findIndex, 1);

              changes.push({ date: new Date().toISOString(), field: key, isAdded: true, value: updated });
            }
          });

          // check deleted assignment
          source[key]?.forEach((original) => {
            const findModified = value?.find((item) => item.code === original.code);
            if (!findModified) {
              const findIndex = changes.findIndex((item) => item.field === key && item.value.code === original.code);
              if (findIndex !== -1) changes.splice(findIndex, 1);
              changes.push({ date: new Date().toISOString(), field: key, isDeleted: true, value: original });
            }
          });
        }
      }

      if (key === 'timeAway') {
        // check added or modified time away
        value?.forEach((updated) => {
          const findSource = source[key]?.find((item) => item.timeAwayId === updated.timeAwayId);
          // time away modified
          if (findSource) {
            const excludeArrayFields = ['timeAwayId', 'isActive'];
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
                (item) => item.field === key && item.value.timeAwayId === updated.timeAwayId
              );
              if (findIndex !== -1) changes.splice(findIndex, 1);
              changes.push({ date: new Date().toISOString(), field: key, isModified: true, value: updated });
            }
          }

          // new time away
          if (!findSource) {
            changes.push({ date: new Date().toISOString(), field: key, isAdded: true, value: updated });
          }
        });

        // check deleted timeAway
        source[key]?.forEach((original) => {
          const findModified = value?.find((item) => item.timeAwayId === original.timeAwayId);
          if (!findModified) {
            const findIndex = changes.findIndex(
              (item) => item.field === key && item.value.timeAwayId === original.timeAwayId
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
