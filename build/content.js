(()=>{"use strict";const e={NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0}.EXTENSION_PREFIX||"",n=`${e}content`,o=`${e}page`,t=`${e}content`;const d="undefined"!==typeof globalThis?globalThis:"undefined"!==typeof global?global:"undefined"!==typeof self?self:"undefined"!==typeof window?window:Function("return this");const i=(s="chrome",a=d.browser,"undefined"===typeof d[s]?a:d[s]);var s,a;const c=i.runtime.connect({name:n});c.onMessage.addListener((e=>{window.postMessage({...e,origin:t},"*")})),window.addEventListener("message",(e=>{let{data:n,source:t}=e;t===window&&n.origin===o&&c.postMessage(n)}));const r=document.createElement("script");r.src=i.extension.getURL("page.js"),r.onload=()=>{r.parentNode&&r.parentNode.removeChild(r)},(document.head||document.documentElement).appendChild(r)})();
//# sourceMappingURL=content.js.map