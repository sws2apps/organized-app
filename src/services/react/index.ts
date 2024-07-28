import { lazy } from 'react';

const lazyLoad = (path: string, namedExport: string) => {
  return lazy(() => {
    const promise = import(path);

    if (!namedExport) {
      return promise;
    }

    if (namedExport) {
      return promise.then((module) => ({ default: module[namedExport] }));
    }
  });
};

export default lazyLoad;
