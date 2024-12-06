(()=>{const e="swrve.push_clicked",t="swrve.push_received",r="swrve_push_events_db",a="swrve_push_events",s="swrve_users",n=["body","image","icon","payload"];function o(){return new Promise(((e,t)=>{const n=indexedDB.open(r,1);n.onupgradeneeded=e=>{const t=e.target.result;t.createObjectStore(s,{keyPath:"user_id",autoIncrement:!1}).createIndex("last_active","last_active",{unique:!1}),t.createObjectStore(a,{keyPath:"id",autoIncrement:!0}).createIndex("user_id","user_id",{unique:!1})},n.onsuccess=t=>{e(t.target.result)},n.onerror=e=>{t(new Error(`Failed to open database: ${e.target.error}`))}}))}async function i(){try{const e=await o(),t=e.transaction(s,"readonly"),r=t.objectStore(s).index("last_active").openCursor(null,"prev");let a=null;return r.onsuccess=t=>{const r=t.target.result;if(!r)throw new Error("No user found");a=r.value,e.close()},new Promise(((s,n)=>{r.onerror=t=>{e.close(),n(new Error(`Failed to retrieve current user: ${t.target.error}`))},t.oncomplete=()=>s(a)}))}catch(e){throw new Error(`Error initializing database: ${e.message}`)}}async function c(e){try{const t=await o(),r=t.transaction(a,"readwrite"),s=r.objectStore(a),n={...e,timestamp:Date.now()};return new Promise(((e,a)=>{r.oncomplete=()=>{t.close(),e()},r.onerror=e=>{t.close(),a(new Error(`Failed to store push data: ${e.target.error}`))},s.add(n)}))}catch(e){throw new Error(`Error initializing database: ${e.message}`)}}function d(e,t,r){var a=new MessageChannel;a.port1.onmessage=function(e){e.data.error?reject(e.data.error):resolve(e.data)},clients.matchAll({includeUncontrolled:!0}).then((s=>{s.forEach((s=>{s.postMessage({event:JSON.stringify(e),type:t,body:r},[a.port2])}))}))}self.addEventListener("push",(e=>{if(!e.data)return;const r=e.data.json();if(!r.data.swrve||!r.data.swrve._p)return;const a=function(e){const t={data:{swrve:{title:e.data.swrve.title,p:e.data.swrve._p,sd:e.data.swrve._sd}}};return n.forEach((r=>{e[r]&&(("payload"===r?t.data:t)[r]=e[r])})),t}(r);e.waitUntil((async()=>{try{const e=await i();await c({event_type:t,event:`Swrve.Messages.Push-${r.data.swrve._p}.delivered`,timestamp:Date.now(),user_id:e.user_id})}catch(e){console.error("Error storing push event data",e)}await Promise.all([new Promise((()=>{d(e,t,{id:r.data.swrve._p})})),self.registration.showNotification(a.data.swrve.title,a)])})())})),self.addEventListener("notificationclick",(t=>{t.notification.close();let r=Promise.resolve();var a={id:t.notification.data.swrve.p,customPayload:t.notification.data.payload};t.notification.data.swrve.sd&&(a.deeplink=t.notification.data.swrve.sd,r=clients.openWindow(a.deeplink)),t.waitUntil((async()=>{try{const t=await i();await c({event_type:e,event:`Swrve.Messages.Push-${a.id}.engaged`,timestamp:Date.now(),user_id:t.user_id})}catch(e){console.error("Error storing push event data:",e)}await Promise.all([r,new Promise((()=>{d(t,e,a)}))])})())})),self.addEventListener("notificationclose",(e=>{e.waitUntil(Promise.all([new Promise((()=>{d(e,"swrve.push_closed",{})}))]))})),self.addEventListener("install",(function(e){self.skipWaiting()})),self.addEventListener("message",(async e=>{try{if(e.data)switch(e.data.type){case"setUserSession":const t=await async function(e){try{const t=await o(),r=t.transaction(s,"readwrite"),a=r.objectStore(s);let n=await async function(e,t){return new Promise(((r,a)=>{const s=e.get(t);s.onsuccess=e=>{r(e.target.result)},s.onerror=()=>{a(new Error("Failed to get user record"))}}))}(a,e.user_id);const i=Date.now();return n?(n.last_active=i,a.put(n)):(n={...e,last_active:i},a.add(n)),new Promise(((e,a)=>{r.oncomplete=()=>{t.close(),e(n)},r.onerror=e=>{t.close(),a(new Error(`Failed to store current user: ${e.target.error}`))}}))}catch(e){throw new Error(`Error initializing database: ${e.message}`)}}({user_id:e.data.user_id});e.ports[0].postMessage({type:"userSession",data:t});break;case"fetchPushData":const r=await async function(e){try{const t=await o(),r=t.transaction(a,"readonly").objectStore(a).index("user_id").getAll(e);return new Promise(((e,a)=>{r.onsuccess=r=>{t.close();const a=r.target.result.sort(((e,t)=>e.timestamp-t.timestamp));e(a)},r.onerror=e=>{t.close(),a(new Error(`Failed to retrieve push data: ${e.target.error}`))}}))}catch(e){throw new Error(`Error initializing database: ${e.message}`)}}(e.data.user_id);e.ports[0].postMessage({type:"pushData",data:r}),r.length>0&&await async function(e){try{const t=await o(),r=t.transaction(a,"readwrite").objectStore(a);r.index("user_id").getAll(e).onsuccess=e=>{e.target.result.forEach((e=>{r.delete(e.id)})),t.close()}}catch(e){throw new Error(`Error initializing database: ${e.message}`)}}(e.data.user_id);break;default:throw new Error("Unregistered message event: \n",e)}}catch(e){console.error(e)}}))})();