import{F as x,G,I as O,g as T,r as U,q as D,w as R,J as V,K as $,L as j,M as q,P as A,C as J,p as K,i as W,c as z,x as Q,N as X,T as Z,O as ee}from"./runtime.C4czf1J6.js";function ne(n){console.warn("hydration_mismatch")}let f=!1;function E(n){f=n}let c=null;function te(n){c=n}function N(n){if(n.nodeType!==8)return n;var e=n;if(e.data!==x)return n;for(var t=[],a=0;(e=e.nextSibling)!==null;){if(e.nodeType===8){var o=e.data;if(o===x)a+=1;else if(o[0]===G){if(a===0)return c=t,e;a-=1}}t.push(e)}throw ne(),O}var h,m,I,M,L,k,B;function F(){h===void 0&&(h=Node.prototype,m=Element.prototype,I=Text.prototype,h.appendChild,M=h.cloneNode,m.__click=void 0,I.__nodeValue=" ",m.__className="",m.__attributes=null,m.__e=void 0,L=T(h,"firstChild").get,k=T(h,"nextSibling").get,B=T(h,"textContent").set,T(m,"className").set)}function re(n,e){return M.call(n,e)}function g(){return document.createTextNode("")}function fe(n){const e=L.call(n);return f?e===null?n.appendChild(g()):N(e):e}function le(n,e){if(!f)return L.call(n);const t=n[0];return N(t)}function de(n,e=!1){const t=k.call(n);if(!f)return t;if(e&&(t==null?void 0:t.nodeType)!==3){const a=g();if(t){const o=c.indexOf(t);c.splice(o,0,a),t.before(a)}else c.push(a);return a}return N(t)}function ae(n){B.call(n,"")}function _e(n,e,t,a,o){var r={capture:a,passive:o};function l(i){if(S(e,i),!i.cancelBubble)return t.call(this,i)}e.addEventListener(n,l,r),(e===document.body||e===window||e===document)&&U(()=>()=>{e.removeEventListener(n,l,r)})}function S(n,e){var p;var t=n.ownerDocument,a=e.type,o=((p=e.composedPath)==null?void 0:p.call(e))||[],r=o[0]||e.target;e.target!==r&&D(e,"target",{configurable:!0,value:r});var l=0,i=e.__root;if(i){var v=o.indexOf(i);if(v!==-1&&(n===document||n===window)){e.__root=n;return}var w=o.indexOf(n);if(w===-1)return;v<=w&&(l=v+1)}r=o[l]||e.target,D(e,"currentTarget",{configurable:!0,get(){return r||t}});function y(s){r=s;var u=s.parentNode||s.host||null;try{var d=s["__"+a];if(d!==void 0&&!s.disabled)if(R(d)){var[_,...Y]=d;_.apply(s,[e,...Y])}else d.call(s,e)}finally{!e.cancelBubble&&u!==n&&u!==null&&s!==n&&y(u)}}try{y(r)}finally{e.__root=n,r=n}}const oe=new Set,P=new Set;function pe(n,e){const t=n.__nodeValue,a=ie(e);f&&n.nodeValue===a?n.__nodeValue=a:t!==a&&(n.nodeValue=a,n.__nodeValue=a)}function he(n,e,t,a){e===void 0||e(n,t)}function ie(n){return typeof n=="string"?n:n==null?"":n+""}function se(n,e){const t=e.anchor??e.target.appendChild(g());return V(()=>H(n,{...e,anchor:t}),!1)}function ve(n,e){const t=e.target,a=c;let o=!1;try{return V(()=>{E(!0);for(var r=t.firstChild;r&&(r.nodeType!==8||r.data!==x);)r=r.nextSibling;if(!r)throw O;const l=N(r),i=H(n,{...e,anchor:l});return E(!1),o=!0,i},!1)}catch(r){if(r===O)return e.recover===!1&&$(),F(),ae(t),E(!1),se(n,e);throw r}finally{E(!!a),te(a)}}function H(n,{target:e,anchor:t,props:a={},events:o,context:r,intro:l=!1}){F();const i=new Set,v=S.bind(null,e),w=S.bind(null,document),y=u=>{for(let d=0;d<u.length;d++){const _=u[d];i.has(_)||(i.add(_),e.addEventListener(_,v,A.includes(_)?{passive:!0}:void 0),document.addEventListener(_,w,A.includes(_)?{passive:!0}:void 0))}};y(j(oe)),P.add(y);let p;const s=q(()=>(J(()=>{if(r){K({});var u=z;u.c=r}o&&(a.$$events=o),p=n(t,a)||{},r&&W()}),()=>{for(const u of i)e.removeEventListener(u,v);P.delete(y),C.delete(p)}));return C.set(p,s),p}let C=new WeakMap;function ye(n){const e=C.get(n);e==null||e()}function b(n,e=Q){var t=e.dom;return t===null?e.dom=n:(R(t)||(t=e.dom=[t]),R(n)?t.push(...n):t.push(n)),n}function me(n,e){var t=(e&Z)!==0,a=(e&ee)!==0,o;return()=>{if(f)return b(t?c:c[0]);o||(o=X(n),t||(o=o.firstChild));var r=a?document.importNode(o,!0):re(o,!0);return b(t?[...r.childNodes]:r),r}}function ge(n){if(!f)return b(g());var e=c[0];return e||n.before(e=g()),b(e)}function be(){if(f)return b(c);var n=document.createDocumentFragment(),e=g();return n.append(e),b([e]),n}function we(n,e){f||n.before(e)}const ue="5";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(ue);export{we as a,pe as b,be as c,fe as d,de as e,le as f,E as g,f as h,c as i,ve as j,ge as k,ae as l,se as m,ie as n,_e as o,b as p,he as s,me as t,ye as u};
