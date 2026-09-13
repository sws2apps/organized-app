const avatarUrls = new WeakMap<ArrayBuffer, { url: string; users: number }>();

/** Acquire from an effect; release when that consumer replaces or unmounts. */
export const acquireAvatarUrl = (buffer: ArrayBuffer) => {
  let entry = avatarUrls.get(buffer);
  if (!entry) {
    entry = { url: URL.createObjectURL(new Blob([buffer])), users: 0 };
    avatarUrls.set(buffer, entry);
  }
  entry.users++;
  let released = false;

  return {
    url: entry.url,
    release: () => {
      if (released) return;
      released = true;
      entry.users--;
      if (entry.users === 0) {
        URL.revokeObjectURL(entry.url);
        avatarUrls.delete(buffer);
      }
    },
  };
};
