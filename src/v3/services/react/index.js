import { lazy } from 'react';

const lazyLoad = (path, namedExport) => {
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
