const worker = new Worker(new URL('./backupAction.js', import.meta.url), { type: 'module' });

export default worker;
