const worker = new Worker(new URL('./backupAction.ts', import.meta.url), {
  type: 'module',
});

export default worker;
