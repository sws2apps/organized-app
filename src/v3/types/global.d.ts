/// <reference types="../../../node_modules/@types/react/index.d.ts"/>
/// <reference types="../../../node_modules/@types/react-dom/index.d.ts"/>

declare const React: typeof React;
declare const ReactDOM: typeof ReactDOM;

interface MyWorkerGlobalScope extends DedicatedWorkerGlobalScope {
  setting: {
    visitorID: string | undefined;
    apiHost: string | undefined;
    congID: string | undefined;
    userRole: string[];
    accountType: string | undefined;
    userUID: string | undefined;
    userID: string | undefined;
  };
  onmessage: DedicatedWorkerGlobalScope['onmessage'];
  postMessage: DedicatedWorkerGlobalScope['postMessage'];
}
