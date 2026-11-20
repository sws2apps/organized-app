let pending: Promise<unknown> = Promise.resolve();

// Read the latest state inside the queue so settings, assignments and events
// cannot overwrite each other's saves. A failed save must not block later edits.
export const runHallCleaningUpdate = <T>(
  update: () => Promise<T>
): Promise<T> => {
  const result = pending.then(update);
  pending = result.catch(() => undefined);
  return result;
};
