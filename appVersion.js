let envInjectionFailed = false;

const appVersion = () => {
  return {
    name: '@sws2apps/vite-app-version',
    config: (_, env) => {
      if (env) {
        const key = 'import.meta.env.PACKAGE_VERSION';
        const val = JSON.stringify(process.env.npm_package_version);

        return { define: { [key]: val } };
      } else {
        envInjectionFailed = true;
      }
    },
    configResolved(config) {
      if (envInjectionFailed) {
        config.logger.warn(`import.meta.env.PACKAGE_VERSION was not injected.`);
      }
    },
  };
};

export default appVersion;
