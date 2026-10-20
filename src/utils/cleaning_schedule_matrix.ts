import type {
  HallCleaningExportRowType,
  HallCleaningTurnGroupType,
  HallCleaningTurnType,
} from '@views/activities/hall_cleaning/index.types';

export const cleaningScheduleMatrix = (rows: HallCleaningExportRowType[]) => {
  const assignments = new Map<string, HallCleaningTurnGroupType>();
  const turns: HallCleaningTurnType[] = [];

  for (const row of rows) {
    const badges = row.groups?.length
      ? row.groups
      : row.group
        ? [row.group]
        : [];
    const leaders = [row.responsible, ...row.persons].filter(
      (name): name is string => !!name
    );
    const label = row.isMajor ? row.label : undefined;
    const participants = row.participants ?? [];
    const signature = JSON.stringify([
      badges,
      row.responsible,
      row.persons,
      label,
      participants,
    ]);
    let assignment = assignments.get(signature);
    if (!assignment) {
      assignment = {
        id: `assignment-${assignments.size}`,
        name: '',
        color: '',
        badges,
        leaders,
        responsible: row.responsible,
        label,
        participants,
      };
      assignments.set(signature, assignment);
    }
    turns.push({
      id: row.id,
      label: [row.weekday, row.date].filter((text): text is string => !!text),
      groups: [assignment.id],
    });
  }

  return { groups: [...assignments.values()], turns };
};
