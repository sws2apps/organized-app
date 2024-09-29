/// <reference types="../../../node_modules/@types/react/index.d.ts"/>
/// <reference types="../../../node_modules/@types/react-dom/index.d.ts"/>

declare const React: typeof React;
declare const ReactDOM: typeof ReactDOM;

interface MyWorkerGlobalScope extends DedicatedWorkerGlobalScope {
  setting: {
    apiHost: string | undefined;
    congID: string | undefined;
    userID: string | undefined;
    idToken: string | undefined;
  };
  onmessage: DedicatedWorkerGlobalScope['onmessage'];
  postMessage: DedicatedWorkerGlobalScope['postMessage'];
}
