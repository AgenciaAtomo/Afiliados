/* Frontend-only transport. Replace this file with your real API integration later. */
(()=>{'use strict';if(window.NINJA_MODE==='backend')return;
const KEY='ninja-demo-v1';let db;try{db=JSON.parse(localStorage.getItem(KEY))}catch{};
// Local access policy: no subscription, feature or volume gate in this frontend.
const UNLIMITED=Number.MAX_SAFE_INTEGER;
const FEATURES=Object.freeze({recentPromotions:true,autoAds:true,customTelegramBot:true,customSearchTerms:true,promoMonitor:true});
const fullPlan=()=>({id:'local-full-access',name:'Acesso completo',price:0,groups:UNLIMITED,maxGroups:UNLIMITED,durationMonths:0,tokenLimit:null,generationsLimit:null,active:true,...FEATURES});
const subscription=()=>({id:'local-full-access',status:'ACTIVE',isPromo:false,isChargeback:false,startDate:'2026-01-01T00:00:00.000Z',endDate:null,cancelledAt:null,refundedAt:null,nextRenewalDate:null,plan:fullPlan(),tokenUsage:{limit:null,remaining:null,used:0,unlimited:true}});
const names={mercadolivre:'Mercado Livre',amazon:'Amazon',shopee:'Shopee',magalu:'Magalu',aliexpress:'AliExpress',shein:'Shein',temu:'Temu',natura:'Natura'};
const fresh=()=>({user:{id:'demo-user',name:'Atomo',email:'demo@exemplo.com',role:'USER',hasPassword:true,emailVerified:true,phone:''},templates:[{id:'template-demo',name:'Padrão',platform:null,content:'🔥 {title}\n\n💰 Por: R$ {price}\n\n🛒 Compre aqui: {link}',isDefault:true,useCommaDecimal:true}],slogans:[],coupons:[],groups:[],configs:[],monitors:[],backgrounds:[],products:[],jobs:[],schedules:[],platforms:Object.entries(names).map(([platform,name])=>({id:platform,platform,name,enabled:false,configured:false,config:{}})),settings:{storeName:'Minha Loja',logoUrl:'',bannerUrl:'',customHtml:'',primaryColor:'#16A34A',secondaryColor:'#3B82F6',bgColor:'#F4F7FA',textColor:'#111827',headerHtml:'',customCss:''}});
if(!db||!db.user)db=fresh();db.demoPaid=true;const save=()=>localStorage.setItem(KEY,JSON.stringify(db));save();localStorage.setItem('token','local-demo-token');localStorage.setItem('user',JSON.stringify(db.user));['actingAs','originalToken','originalUser','isImpersonating'].forEach(k=>localStorage.removeItem(k));
window.__demoRequests=[];
function notice(message){let n=document.createElement('div');n.className='demo-note';n.setAttribute('role','status');n.textContent=message;document.body.append(n);setTimeout(()=>n.remove(),5000)}
const localOnly=()=>({status:409,data:{error:'Esta ação depende do backend. A interface está em modo de demonstração.',message:'Esta ação depende do backend.'}});
function respond(method,raw,body){let u=new URL(raw,location.origin),p=u.pathname.replace(/^\/api/,'').replace(/\/$/,'')||'/';let data={};try{data=typeof body==='string'?JSON.parse(body):body||{}}catch{}
window.__demoRequests.push({method,path:p});if(window.__demoRequests.length>200)window.__demoRequests.shift();
const ok=d=>({status:200,data:d});
if(p==='/auth/me')return ok({user:db.user});
if(['/auth/login','/auth/google','/auth/register'].includes(p)){db.user.name=data.name||db.user.name;db.user.email=data.email||db.user.email;save();return ok({token:'local-demo-token',user:db.user})}
if(p.startsWith('/auth/')){notice('Demonstração: nenhum e-mail ou credencial foi enviado.');return ok({success:true,message:'Modo de demonstração'})}
if(p==='/users/stats')return ok({configuredStores:db.platforms.filter(x=>x.enabled).length,coupons:db.coupons.length,templates:db.templates.length,subdomain:db.subdomain||null});
if(p==='/users/profile'){Object.assign(db.user,data);save();return ok({user:db.user})}
if(p.includes('password')||p.includes('push-token')){notice('Disponível quando o backend for conectado.');return localOnly()}
if(p==='/whatsapp/status')return ok({connected:!!db.demoConnected,connection:db.demoConnected?{status:'CONNECTED',phone:'Demonstração'}:null,hasPaidPlan:true,hasAvailablePool:true,pausedSchedules:0});
if(p==='/telegram/link'&&method==='GET')return ok({linked:false,link:null,botId:null,botUsername:null});
if(p==='/telegram/bot-links')return ok({links:[],bots:[]});
if(p==='/telegram/knowledge')return ok({items:[],knowledge:[]});
if(p==='/telegram/bot-profile')return ok({profile:{about:'',description:''}});
if(p.startsWith('/whatsapp/')||p.startsWith('/telegram/')||p.includes('/send')||p.includes('checkout')||p.includes('cancel-subscription')||p==='/plans/redeem'){notice('Esta ação estará disponível com o backend.');return localOnly()}
if(p==='/admin/announcement')return ok({announcement:null});if(p==='/admin/banner')return ok({banner:null});if(p==='/admin/settings')return ok({settings:{registration_mode:'open'}});
if(p==='/plans/my-subscription')return ok({hasPaidActive:true,hasPaidPlan:true,unlimited:true,planFeatures:{...FEATURES},subscriptions:[subscription()],generations:{limit:null,remaining:null,used:0,unlimited:true},subscription:subscription()});
if(p==='/plans')return ok({available:true,plans:[{...fullPlan(),description:'Todos os recursos liberados no frontend local',checkoutUrl:null,hotmartUrl:null}]});
if(p==='/promotions/credits')return ok({remaining:UNLIMITED,total:UNLIMITED,unlimited:true,limit:null,used:0,credits:UNLIMITED,hasPaidPlan:true});
if(p==='/promotions/mercadolivre-cookie-warning')return ok({mercadoLivreCookieWarning:false});
if(p==='/promotions/domain-map')return ok({domainMap:{},domains:{}});
if(p==='/promotions/loading-tips')return ok({tips:[]});
if(p==='/promotions/auto-send-consent')return ok({consent:false,accepted:false});
if(p==='/promotions/recent')return ok({items:[],nextCursor:null});
if(p==='/promotions/recent/categories'||p==='/auto-ads/categories')return ok({categories:[]});
if(p==='/promotions/scrape-batch/history')return ok({jobs:db.jobs});
if(p==='/groups/ai-schedule-times')return ok({times:[],available:true});
if(p.includes('/scrape')||p.includes('affiliate-link')||p.includes('ai-')){notice('Recurso liberado. A execução precisa da futura API.');return localOnly()}
if(p==='/templates/render'){let text=data.content||'';for(const[k,v]of Object.entries(data.data||{}))text=text.replaceAll('{'+k+'}',String(v??''));return ok({text,rendered:text})}
if(p==='/groups/schedules')return ok({items:db.schedules,total:db.schedules.length});
if(p==='/groups/whatsapp-channels')return ok({channels:[]});
if(p==='/groups/whatsapp'||p==='/promo-monitor/source-groups')return ok({groups:[]});
if(p==='/auto-ads/groups'||p==='/promo-monitor/destinations')return ok({groups:db.groups.filter(x=>x.active!==false)});
if(p==='/promo-monitor/logs')return ok({logs:[],items:[]});
if(p==='/store/settings'){if(method!=='GET'){Object.assign(db.settings,data);save()}return ok({settings:db.settings,hasPaidPlan:true})}
if(p==='/domains')return ok({tenant:db.subdomain?{subdomain:db.subdomain}:null,customDomains:[]});
if(p.startsWith('/domains/check-subdomain/'))return ok({available:true});
if(p==='/domains/subdomain'){db.subdomain=data.subdomain;save();return ok({tenant:{subdomain:db.subdomain}})}
if(p==='/story-backgrounds/defaults')return ok({backgrounds:[]});
if(p.startsWith('/story-backgrounds')&&method!=='GET'){notice('O envio de arquivos será conectado na etapa do backend.');return localOnly()}
if(p.startsWith('/platforms/')&&method!=='GET'){const platform=p.split('/')[2];let entry=db.platforms.find(x=>x.platform===platform);if(entry){entry.config={...entry.config,...data};entry.configured=Object.values(entry.config).some(Boolean);entry.enabled=entry.configured;save()}return ok({success:true})}
if(p.startsWith('/sharing/'))return ok({shares:[],sharedByMe:[],sharedWithMe:[]});
const map={'templates':'templates','slogans':'slogans','coupons':'coupons','groups':'groups','platforms':'platforms','auto-ads':'configs','promo-monitor':'monitors','story-backgrounds':'backgrounds','store/products':'products'};
for(const[base,key]of Object.entries(map)){if(p!=='/'+base&&!p.startsWith('/'+base+'/'))continue;const id=p.slice(base.length+2),rows=db[key];
if(method==='GET')return ok({[key]:rows,...(base==='groups'?{activeCount:rows.filter(x=>x.active!==false).length,maxGroups:UNLIMITED,hasPaidPlan:true,planFeatures:{...FEATURES}}:{}),...(base==='auto-ads'?{allowed:true,maxAutoAdsGroups:UNLIMITED,hasPaidPlan:true,customSearchTermsAllowed:true,activeConfigCount:rows.length,activeGroupCount:0,configuredPlatforms:db.platforms.filter(x=>x.configured).map(x=>x.platform),autoAdsPlatforms:['shopee','aliexpress','mercadolivre','amazon','magalu','temu']}:{}),...(base==='promo-monitor'?{allowed:true,maxMonitors:UNLIMITED,hasPaidPlan:true,activeCount:rows.length,overLimit:false,configuredPlatforms:db.platforms.filter(x=>x.configured).map(x=>x.platform)}:{}),...(base==='store/products'?{nextCursor:null}:{} )});
if(method==='DELETE'){db[key]=rows.filter(x=>String(x.id)!==id);save();return ok({success:true})}
let item=rows.find(x=>String(x.id)===id);if(item)Object.assign(item,data);else{item={...data,id:globalThis.crypto?.randomUUID?.()||String(Date.now())+Math.random().toString(36).slice(2),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};rows.push(item)}save();return ok({[key.replace(/s$/,'')]:item,...item,success:true})}
if(method!=='GET'){notice('Esta operação será conectada na etapa do backend.');return localOnly()}
return ok({items:[],total:0});
}
const isApi=url=>{try{let u=new URL(url,location.origin);return u.hostname==='demo.local.invalid'||u.pathname.startsWith('/api/')}catch{return false}};
const realFetch=window.fetch.bind(window);window.fetch=async(input,options={})=>{const url=typeof input==='string'?input:input.url;if(isApi(url)){const r=respond(options.method||input.method||'GET',url,options.body);return new Response(JSON.stringify(r.data),{status:r.status,headers:{'Content-Type':'application/json'}})}return realFetch(input,options)};
const NativeXHR=window.XMLHttpRequest;
class DemoXHR extends EventTarget{constructor(){super();this.readyState=0;this.status=0;this.responseText='';this.response=null;this.responseType='';this.timeout=0;this.withCredentials=false;this.upload=new EventTarget();this.onloadend=null;this._headers={}}open(method,url){this._method=method.toUpperCase();this._url=url;this._native=!isApi(url)?new NativeXHR():null;if(this._native){this._native.open(method,url);return}this.readyState=1}setRequestHeader(k,v){if(this._native)this._native.setRequestHeader(k,v);else this._headers[k]=v}getAllResponseHeaders(){return this._native?this._native.getAllResponseHeaders():'content-type: application/json\r\n'}getResponseHeader(){return'application/json'}addEventListener(...args){super.addEventListener(...args)}_emit(type){const e=new Event(type);this.dispatchEvent(e);if(typeof this['on'+type]==='function')this['on'+type](e)}send(body){if(this._native){for(const type of ['load','loadend','error','timeout','readystatechange'])this._native.addEventListener(type,()=>{this.status=this._native.status;this.readyState=this._native.readyState;this.responseText=this._native.responseText;this.response=this._native.response;this._emit(type)});this._native.send(body);return}setTimeout(()=>{try{const r=respond(this._method,this._url,body);this.status=r.status;this.statusText=r.status<400?'OK':'Demo only';this.responseURL=this._url;this.responseText=JSON.stringify(r.data);this.response=this.responseType==='json'?r.data:this.responseText;this.readyState=4;this._emit('readystatechange');this._emit('load');this._emit('loadend')}catch(e){console.error('Local adapter:',e);this._emit('error')}},35)}abort(){if(this._native)this._native.abort();else this._emit('abort')}}
window.XMLHttpRequest=DemoXHR;
const nativeOpen=window.open.bind(window);window.open=(url,...args)=>{if(url&&new URL(url,location.origin).origin!==location.origin){notice('Ação externa indisponível na demonstração.');return null}return nativeOpen(url,...args)};
document.addEventListener('DOMContentLoaded',()=>{const badge=document.createElement('button');badge.className='demo-label';badge.textContent='Acesso completo • dados locais';badge.title='Todos os recursos liberados';badge.onclick=()=>{const panel=document.createElement('dialog');panel.className='demo-panel';panel.innerHTML='<h2>Acesso completo</h2><p>Todos os recursos e limites de plano estão liberados neste frontend. As integrações continuam em demonstração.</p><label><input type="checkbox" name="connected"> Simular WhatsApp conectado</label><label><input type="checkbox" name="store"> Habilitar Shopee de demonstração</label><div><button data-reset>Reiniciar dados</button><button data-close>Cancelar</button><button data-save>Aplicar</button></div>';panel.querySelector('[name=connected]').checked=!!db.demoConnected;panel.querySelector('[name=store]').checked=!!db.platforms.find(x=>x.platform==='shopee')?.configured;panel.querySelector('[data-close]').onclick=()=>panel.remove();panel.querySelector('[data-reset]').onclick=()=>{if(confirm('Reiniciar os dados locais de demonstração?')){localStorage.removeItem(KEY);location.href='/dashboard'}};panel.querySelector('[data-save]').onclick=()=>{db.demoPaid=true;db.demoConnected=panel.querySelector('[name=connected]').checked;const store=db.platforms.find(x=>x.platform==='shopee');if(store){store.configured=store.enabled=panel.querySelector('[name=store]').checked;store.config=store.configured?{appId:'demonstracao',password:'demonstracao'}:{}}save();location.reload()};document.body.append(panel);panel.showModal()};document.body.append(badge)});
document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a||!a.href)return;const u=new URL(a.href,location.origin);if(u.origin!==location.origin&&!u.protocol.startsWith('blob')){e.preventDefault();e.stopImmediatePropagation();notice('Link externo da plataforma original. Esta prévia demonstra apenas a interface.')}},true);
})();
