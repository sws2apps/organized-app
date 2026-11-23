/** Serialize related writes while allowing unrelated records to save independently. */
export const createKeyedWriteQueue = () => {
  const pending = new Map<string, Promise<void>>();

  return <T>(key: string, write: () => Promise<T>): Promise<T> => {
    const result = (pending.get(key) ?? Promise.resolve()).then(write);
    const settled = result.then(
      () => undefined,
      () => undefined
    );
    pending.set(key, settled);
    void settled.then(() => {
      if (pending.get(key) === settled) pending.delete(key);
    });
    return result;
  };
};
