import{k as A,S as o,o as N,l as I,q as S,v as h,w as T,s as u,U as d,g,m as w,f as m,x as O,d as v,y as C,z as L,H as M,A as j,B as E,C as x,D as R,E as p,c as _,a as q}from"./runtime.C4czf1J6.js";import{h as z,g as D,i as B}from"./disclose-version.BI7YQDog.js";function y(e,t=!0,s=null){if(typeof e=="object"&&e!=null&&!A(e)){if(o in e){const n=e[o];if(n.t===e||n.p===e)return n.p}const i=C(e);if(i===N||i===I){const n=new Proxy(e,F);return S(e,o,{value:{s:new Map,v:h(0),a:T(e),i:t,p:n,t:e},writable:!0,enumerable:!1}),n}}return e}function P(e,t=1){u(e,e.v+t)}const F={defineProperty(e,t,s){if(s.value){const i=e[o],n=i.s.get(t);n!==void 0&&u(n,y(s.value,i.i,i))}return Reflect.defineProperty(e,t,s)},deleteProperty(e,t){const s=e[o],i=s.s.get(t),n=s.a,f=delete e[t];if(n&&f){const a=s.s.get("length"),c=e.length-1;a!==void 0&&a.v!==c&&u(a,c)}return i!==void 0&&u(i,d),f&&P(s.v),f},get(e,t,s){var f;if(t===o)return Reflect.get(e,o);const i=e[o];let n=i.s.get(t);if(n===void 0&&(!(t in e)||(f=g(e,t))!=null&&f.writable)&&(n=(i.i?h:w)(y(e[t],i.i,i)),i.s.set(t,n)),n!==void 0){const a=m(n);return a===d?void 0:a}return Reflect.get(e,t,s)},getOwnPropertyDescriptor(e,t){const s=Reflect.getOwnPropertyDescriptor(e,t);if(s&&"value"in s){const n=e[o].s.get(t);n&&(s.value=m(n))}return s},has(e,t){var f;if(t===o)return!0;const s=e[o],i=Reflect.has(e,t);let n=s.s.get(t);return(n!==void 0||O!==null&&(!i||(f=g(e,t))!=null&&f.writable))&&(n===void 0&&(n=(s.i?h:w)(i?y(e[t],s.i,s):d),s.s.set(t,n)),m(n)===d)?!1:i},set(e,t,s,i){const n=e[o];let f=n.s.get(t);f===void 0&&(v(()=>i[t]),f=n.s.get(t)),f!==void 0&&u(f,y(s,n.i,n));const a=n.a,c=!(t in e);if(a&&t==="length")for(let r=s;r<e.length;r+=1){const l=n.s.get(r+"");l!==void 0&&u(l,d)}if(e[t]=s,c){if(a){const r=n.s.get("length"),l=e.length;r!==void 0&&r.v!==l&&u(r,l)}P(n.v)}return!0},ownKeys(e){const t=e[o];return m(t.v),Reflect.ownKeys(e)}};function b(e){throw new Error("lifecycle_outside_component")}function Z(e,t,s,i=null,n=!1){var f=null,a=null,c=null,r=n?p:0;L(()=>{if(c===(c=!!t()))return;let l=!1;if(z){const k=e.data===M;c===k&&(j(B),D(!1),l=!0)}c?(f?E(f):f=x(()=>s(e)),a&&R(a,()=>{a=null})):(a?E(a):i&&(a=x(()=>i(e))),f&&R(f,()=>{f=null})),l&&D(!0)},r)}function H(e){_===null&&b(),_.l!==null?U(_).m.push(e):q(()=>{const t=v(e);if(typeof t=="function")return t})}function G(e){_===null&&b(),H(()=>()=>v(e))}function K(e,t,{bubbles:s=!1,cancelable:i=!1}={}){return new CustomEvent(e,{detail:t,bubbles:s,cancelable:i})}function J(){const e=_;return e===null&&b(),(t,s,i)=>{var f;const n=(f=e.s.$$events)==null?void 0:f[t];if(n){const a=T(n)?n.slice():[n],c=K(t,s,i);for(const r of a)r.call(e.x,c);return!c.defaultPrevented}return!0}}function U(e){var t=e.l;return t.u??(t.u={a:[],b:[],m:[]})}export{G as a,J as c,Z as i,H as o,y as p};
