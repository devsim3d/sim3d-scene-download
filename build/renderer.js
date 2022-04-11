!function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function r(t){t.forEach(e)}function o(t){return"function"==typeof t}function c(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}let s,a;function l(t,e){return s||(s=document.createElement("a")),s.href=e,t===s.href}function i(t){return null==t?"":t}function u(t,e){t.appendChild(e)}function f(t,e,n){t.insertBefore(e,n||null)}function d(t){t.parentNode.removeChild(t)}function h(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function m(t){return document.createElement(t)}function g(t){return document.createTextNode(t)}function p(){return g(" ")}function $(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function b(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function v(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function x(t,e){t.value=null==e?"":e}function y(t){a=t}function w(t){(function(){if(!a)throw new Error("Function called outside component initialization");return a})().$$.on_mount.push(t)}const E=[],_=[],A=[],k=[],P=Promise.resolve();let C=!1;function I(t){A.push(t)}const L=new Set;let j=0;function M(){const t=a;do{for(;j<E.length;){const t=E[j];j++,y(t),N(t.$$)}for(y(null),E.length=0,j=0;_.length;)_.pop()();for(let t=0;t<A.length;t+=1){const e=A[t];L.has(e)||(L.add(e),e())}A.length=0}while(E.length);for(;k.length;)k.pop()();C=!1,L.clear(),y(t)}function N(t){if(null!==t.fragment){t.update(),r(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(I)}}const O=new Set;function S(t,e){-1===t.$$.dirty[0]&&(E.push(t),C||(C=!0,P.then(M)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function T(c,s,l,i,u,f,h,m=[-1]){const g=a;y(c);const p=c.$$={fragment:null,ctx:null,props:f,update:t,not_equal:u,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(s.context||(g?g.$$.context:[])),callbacks:n(),dirty:m,skip_bound:!1,root:s.target||g.$$.root};h&&h(p.root);let $=!1;if(p.ctx=l?l(c,s.props||{},((t,e,...n)=>{const r=n.length?n[0]:e;return p.ctx&&u(p.ctx[t],p.ctx[t]=r)&&(!p.skip_bound&&p.bound[t]&&p.bound[t](r),$&&S(c,t)),e})):[],p.update(),$=!0,r(p.before_update),p.fragment=!!i&&i(p.ctx),s.target){if(s.hydrate){const t=function(t){return Array.from(t.childNodes)}(s.target);p.fragment&&p.fragment.l(t),t.forEach(d)}else p.fragment&&p.fragment.c();s.intro&&((b=c.$$.fragment)&&b.i&&(O.delete(b),b.i(v))),function(t,n,c,s){const{fragment:a,on_mount:l,on_destroy:i,after_update:u}=t.$$;a&&a.m(n,c),s||I((()=>{const n=l.map(e).filter(o);i?i.push(...n):r(n),t.$$.on_mount=[]})),u.forEach(I)}(c,s.target,s.anchor,s.customElement),M()}var b,v;y(g)}function D(t,e,n){const r=t.slice();return r[17]=e[n],r}function H(t,e,n){const r=t.slice();return r[20]=e[n],r}function q(t){let e,n,r,o,c,s,a,h,x,y,w,E,_=t[20].name+"";function A(){return t[11](t[20])}return{c(){e=m("tr"),n=m("th"),r=g(_),o=p(),c=m("th"),s=m("img"),x=p(),l(s.src,a=t[20].thumb)||b(s,"src",a),b(s,"alt",h=t[20].thumb),b(s,"class","svelte-etax63"),b(e,"class",y=i(t[20].name===t[6]?"current":"")+" svelte-etax63")},m(t,a){f(t,e,a),u(e,n),u(n,r),u(e,o),u(e,c),u(c,s),u(e,x),w||(E=$(e,"click",A),w=!0)},p(n,o){t=n,32&o&&_!==(_=t[20].name+"")&&v(r,_),32&o&&!l(s.src,a=t[20].thumb)&&b(s,"src",a),32&o&&h!==(h=t[20].thumb)&&b(s,"alt",h),96&o&&y!==(y=i(t[20].name===t[6]?"current":"")+" svelte-etax63")&&b(e,"class",y)},d(t){t&&d(e),w=!1,E()}}}function z(t){let e,n,r,o,c,s,a,i,h,x,y,w,E,_,A,k,P=t[17].id+"",C=t[17].name+"";function I(){return t[14](t[17])}return{c(){e=m("tr"),n=m("th"),r=g(P),o=p(),c=m("button"),c.textContent="Descargar",s=p(),a=m("th"),i=g(C),h=p(),x=m("th"),y=m("img"),_=p(),l(y.src,w=t[17].screenshot)||b(y,"src",w),b(y,"alt",E=t[17].name),b(y,"class","svelte-etax63"),b(e,"class","svelte-etax63")},m(t,l){f(t,e,l),u(e,n),u(n,r),u(n,o),u(n,c),u(e,s),u(e,a),u(a,i),u(e,h),u(e,x),u(x,y),u(e,_),A||(k=$(c,"click",I),A=!0)},p(e,n){t=e,16&n&&P!==(P=t[17].id+"")&&v(r,P),16&n&&C!==(C=t[17].name+"")&&v(i,C),16&n&&!l(y.src,w=t[17].screenshot)&&b(y,"src",w),16&n&&E!==(E=t[17].name)&&b(y,"alt",E)},d(t){t&&d(e),A=!1,k()}}}function B(e){let n,r,o;return{c(){n=m("button"),n.textContent="Abrir"},m(t,c){f(t,n,c),r||(o=$(n,"click",e[15]),r=!0)},p:t,d(t){t&&d(n),r=!1,o()}}}function F(e){let n,o,c,s,a,l,y,w,E,_,A,k,P,C,I,L,j,M,N,O,S=e[5],T=[];for(let t=0;t<S.length;t+=1)T[t]=q(H(e,S,t));let F=e[4],R=[];for(let t=0;t<F.length;t+=1)R[t]=z(D(e,F,t));let U=""!==e[2]&&B(e);return{c(){n=m("div"),o=m("table"),c=m("tr"),c.innerHTML="<th>Entorno</th> \n            <th>Miniatura</th>",s=p();for(let t=0;t<T.length;t+=1)T[t].c();a=p(),l=m("input"),y=p(),w=m("button"),w.textContent="Listar Escenas",E=p(),_=m("div"),A=m("table"),k=m("tr"),k.innerHTML="<th>Escena</th> \n            <th>Nombre</th> \n            <th>Vista Previa</th>",P=p();for(let t=0;t<R.length;t+=1)R[t].c();C=p(),I=m("p"),L=g(e[0]),j=p(),U&&U.c(),b(c,"class","table-header svelte-etax63"),b(o,"class","svelte-etax63"),b(n,"class","environment-list svelte-etax63"),b(l,"type","text"),b(l,"class","svelte-etax63"),b(k,"class","table-header svelte-etax63"),b(A,"class","svelte-etax63"),b(_,"class","scene-list svelte-etax63"),b(I,"class",M=i(e[1])+" svelte-etax63")},m(t,r){f(t,n,r),u(n,o),u(o,c),u(o,s);for(let t=0;t<T.length;t+=1)T[t].m(o,null);f(t,a,r),f(t,l,r),x(l,e[3]),f(t,y,r),f(t,w,r),f(t,E,r),f(t,_,r),u(_,A),u(A,k),u(A,P);for(let t=0;t<R.length;t+=1)R[t].m(A,null);f(t,C,r),f(t,I,r),u(I,L),u(I,j),U&&U.m(I,null),N||(O=[$(l,"input",e[12]),$(w,"click",e[13])],N=!0)},p(t,[e]){if(1120&e){let n;for(S=t[5],n=0;n<S.length;n+=1){const r=H(t,S,n);T[n]?T[n].p(r,e):(T[n]=q(r),T[n].c(),T[n].m(o,null))}for(;n<T.length;n+=1)T[n].d(1);T.length=S.length}if(8&e&&l.value!==t[3]&&x(l,t[3]),272&e){let n;for(F=t[4],n=0;n<F.length;n+=1){const r=D(t,F,n);R[n]?R[n].p(r,e):(R[n]=z(r),R[n].c(),R[n].m(A,null))}for(;n<R.length;n+=1)R[n].d(1);R.length=F.length}1&e&&v(L,t[0]),""!==t[2]?U?U.p(t,e):(U=B(t),U.c(),U.m(I,null)):U&&(U.d(1),U=null),2&e&&M!==(M=i(t[1])+" svelte-etax63")&&b(I,"class",M)},i:t,o:t,d(t){t&&d(n),h(T,t),t&&d(a),t&&d(l),t&&d(y),t&&d(w),t&&d(E),t&&d(_),h(R,t),t&&d(C),t&&d(I),U&&U.d(),N=!1,r(O)}}}function R(t,e,n){let r="",o="progress",c="",s="http://127.0.0.1:5005",a=[],l=[],i="";const u=async()=>{try{n(0,r="Obteniendo lista de escenas"),n(1,o="progress");const t=await window.fsAPI.getAvailableScenes(s);n(4,a=t.scenes),n(0,r=""),n(1,o="success")}catch(t){n(0,r=t.message),n(1,o="fail")}},f=async t=>{try{n(0,r="Descargando escena"),n(1,o="progress");const e=("/"!==s[s.length-1]?s+"/":s)+`api/v1/bg2scene/${t}/scene.vitscnj`,a=`scene-${t}`,l=await window.fsAPI.downloadScene(e,a);n(1,o="success"),n(0,r=`Escena descargada en la ruta ${l}. Abriendo entorno...`),n(2,c=l),await fsAPI.launchEnvironment()}catch(t){n(1,o="fail"),n(0,r="Error descargando la escena. Comprueba la URL del servidor"),console.error(t)}},d=async()=>{await fsAPI.launchEnvironment()},h=async t=>{n(6,i=await window.fsAPI.setCurrentEnvironment(t))};w((async()=>{n(5,l=await window.fsAPI.getEnvironments()),n(6,i=await window.fsAPI.getCurrentEnvironment())}));return[r,o,c,s,a,l,i,u,f,d,h,async t=>await h(t.name),function(){s=this.value,n(3,s)},async()=>await u(),async t=>await f(t.id),()=>d()]}new class extends class{$destroy(){!function(t,e){const n=t.$$;null!==n.fragment&&(r(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}{constructor(t){super(),T(this,t,R,F,c,{})}}({target:document.body})}();
//# sourceMappingURL=renderer.js.map
