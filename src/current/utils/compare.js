const excludeFields = ['changes', 'id', 'lastAssignment', 'person_uid'];

export const comparePerson = (source, modified) => {
  let changes = source.changes ? [...source.changes] : [];

  changes = compareNonArray(source, modified, changes);
  changes = compareAssignments(source, modified, changes);
  changes = compareTimeAway(source, modified, changes);
  changes = compareSpiritualStatus(source, modified, changes);
  changes = compareOtherService(source, modified, changes);

  return changes;
};

const compareNonArray = (source, modified, changes) => {
  const localExclude = [...excludeFields, 'timeAway', 'assignments', 'spiritualStatus', 'otherService'];

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

const compareSpiritualStatus = (source, modified, changes) => {
  // check added or modified status
  if (modified.spiritualStatus) {
    for (const updated of modified.spiritualStatus) {
      const findSource = source.spiritualStatus?.find((item) => item.statusId === updated.statusId);
      // status modified
      if (findSource) {
        const excludeArrayFields = ['statusId', 'isActive'];
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
            if (item.field === 'spiritualStatus' && item.value.statusId === updated.statusId) {
              return;
            }
            filteredChanges.push(item);
          });
          changes = [...filteredChanges];
          changes.push({ date: new Date().toISOString(), field: 'spiritualStatus', isModified: true, value: updated });
        }
      }

      // new status
      if (!findSource) {
        changes.push({ date: new Date().toISOString(), field: 'spiritualStatus', isAdded: true, value: updated });
      }
    }
  }

  // check deleted spiritualStatus
  if (source.spiritualStatus) {
    for (const original of source.spiritualStatus) {
      const findModified = modified.spiritualStatus?.find((item) => item.statusId === original.statusId);
      if (!findModified) {
        const filteredChanges = [];
        changes.forEach((item) => {
          if (item.field === 'spiritualStatus' && item.value.statusId === original.statusId) {
            return;
          }
          filteredChanges.push(item);
        });
        changes = [...filteredChanges];
        changes.push({ date: new Date().toISOString(), field: 'spiritualStatus', isDeleted: true, value: original });
      }
    }
  }

  return changes;
};

const compareOtherService = (source, modified, changes) => {
  // check added or modified service
  if (modified.otherService) {
    for (const updated of modified.otherService) {
      const findSource = source.otherService?.find((item) => item.serviceId === updated.serviceId);
      // service modified
      if (findSource) {
        const excludeArrayFields = ['serviceId', 'isActive'];
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
            if (item.field === 'otherService' && item.value.serviceId === updated.serviceId) {
              return;
            }
            filteredChanges.push(item);
          });
          changes = [...filteredChanges];
          changes.push({ date: new Date().toISOString(), field: 'otherService', isModified: true, value: updated });
        }
      }

      // new service
      if (!findSource) {
        changes.push({ date: new Date().toISOString(), field: 'otherService', isAdded: true, value: updated });
      }
    }
  }

  // check deleted otherService
  if (source.otherService) {
    for (const original of source.otherService) {
      const findModified = modified.otherService?.find((item) => item.serviceId === original.serviceId);
      if (!findModified) {
        const filteredChanges = [];
        changes.forEach((item) => {
          if (item.field === 'otherService' && item.value.serviceId === original.serviceId) {
            return;
          }
          filteredChanges.push(item);
        });
        changes = [...filteredChanges];
        changes.push({ date: new Date().toISOString(), field: 'otherService', isDeleted: true, value: original });
      }
    }
  }

  return changes;
};
