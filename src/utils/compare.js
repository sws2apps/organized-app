const excludeFields = ['changes', 'id', 'lastAssignment', 'person_uid'];

export const comparePerson = (source, modified) => {
  let changes = source.changes ? [...source.changes] : [];

  changes = compareNonArray(source, modified, changes);
  changes = compareAssignments(source, modified, changes);
  changes = compareTimeAway(source, modified, changes);

  return changes;
};

const compareNonArray = (source, modified, changes) => {
  const localExclude = [...excludeFields, 'timeAway', 'assignments'];

  for (const [key, value] of Object.entries(modified)) {
    if (localExclude.indexOf(key) === -1) {
      if (value !== source[key]) {
        const findIndex = changes.findIndex((item) => item.field === key);
        if (findIndex !== -1) changes.splice(findIndex, 1);
        changes.push({ date: new Date().toISOString(), field: key, value });
      }
    }
  }

  return changes;
};

const compareAssignments = (source, modified, changes) => {
  // check added or deleted assignment
  if (modified.assignments) {
    for (const updated of modified.assignments) {
      const findSource = source.assignments?.find((item) => item.code === updated.code);
      // new assignment
      if (!findSource) {
        const filteredChanges = [];
        changes.forEach((item) => {
          if (item.field === 'assignments' && item.value.code === updated.code) {
            return;
          }
          filteredChanges.push(item);
        });
        changes = [...filteredChanges];
        changes.push({ date: new Date().toISOString(), field: 'assignments', isAdded: true, value: updated });
      }
    }
  }

  // check deleted assignment
  if (source.assignments) {
    for (const original of source.assignments) {
      const findModified = modified.assignments?.find((item) => item.code === original.code);
      if (!findModified) {
        const filteredChanges = [];
        changes.forEach((item) => {
          if (item.field === 'assignments' && item.value.code === original.code) {
            return;
          }
          filteredChanges.push(item);
        });
        changes = [...filteredChanges];
        changes.push({ date: new Date().toISOString(), field: 'assignments', isDeleted: true, value: original });
      }
    }
  }

  return changes;
};

const compareTimeAway = (source, modified, changes) => {
  // check added or modified time away
  if (modified.timeAway) {
    for (const updated of modified.timeAway) {
      const findSource = source.timeAway?.find((item) => item.timeAwayId === updated.timeAwayId);
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
          const filteredChanges = [];
          changes.forEach((item) => {
            if (item.field === 'timeAway' && item.value.timeAwayId === updated.timeAwayId) {
              return;
            }
            filteredChanges.push(item);
          });
          changes = [...filteredChanges];
          changes.push({ date: new Date().toISOString(), field: 'timeAway', isModified: true, value: updated });
        }
      }

      // new time away
      if (!findSource) {
        changes.push({ date: new Date().toISOString(), field: 'timeAway', isAdded: true, value: updated });
      }
    }
  }

  // check deleted timeAway
  if (source.timeAway) {
    for (const original of source.timeAway) {
      const findModified = modified.timeAway?.find((item) => item.timeAwayId === original.timeAwayId);
      if (!findModified) {
        const filteredChanges = [];
        changes.forEach((item) => {
          if (item.field === 'timeAway' && item.value.timeAwayId === original.timeAwayId) {
            return;
          }
          filteredChanges.push(item);
        });
        changes = [...filteredChanges];
        changes.push({ date: new Date().toISOString(), field: 'timeAway', isDeleted: true, value: original });
      }
    }
  }

  return changes;
};
