/* The VPS serves runtime-config.js with backend mode. No API secret reaches the browser. */
(()=>{'use strict';if(window.NINJA_MODE!=='backend')return;
 if(localStorage.getItem('token')==='local-demo-token'){localStorage.removeItem('token');localStorage.removeItem('user');}
 function map(raw){const url=new URL(raw,location.origin);return url.hostname==='demo.local.invalid'?location.origin+url.pathname+url.search:raw;}
 const NativeXHR=window.XMLHttpRequest;
 window.XMLHttpRequest=class extends NativeXHR{
  open(method,url,...args){this._ninjaMethod=method.toUpperCase();this._ninjaPath=new URL(url,location.origin).pathname;return super.open(method,map(url),...args)}
  send(body){if(this._ninjaPath.startsWith('/api/')&&!['GET','HEAD','OPTIONS'].includes(this._ninjaMethod))this.setRequestHeader('Idempotency-Key',crypto.randomUUID());
   if(this._ninjaPath.match(/\/schedules\/[^/]+\/reschedule$/)&&!body){const value=prompt('Novo agendamento: informe data e hora (AAAA-MM-DD HH:MM).');if(value){const date=new Date(value.replace(' ','T'));if(!Number.isNaN(date.valueOf()))body=JSON.stringify({scheduledAt:date.toISOString()});}}
   return super.send(body);
  }
 };
 const nativeFetch=window.fetch.bind(window);window.fetch=(input,options)=>{if(typeof input==='string'||input instanceof URL)return nativeFetch(map(String(input)),options);return nativeFetch(new Request(map(input.url),input),options)};
 document.addEventListener('click',event=>{const button=event.target.closest('button');if(button?.textContent.trim()==='Sair'){const token=localStorage.getItem('token');if(token)void nativeFetch('/api/auth/logout',{method:'POST',headers:{Authorization:'Bearer '+token},keepalive:true}).catch(()=>{});}},true);
 document.addEventListener('DOMContentLoaded',()=>{const a=document.createElement('a');a.className='demo-label';a.href='/operations.html';a.textContent='WhatsApp • envios e grupos';a.title='Gerenciar grupos, compor mensagens e acompanhar a fila';document.body.append(a)});
})();
