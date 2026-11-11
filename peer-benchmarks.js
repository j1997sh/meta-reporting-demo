/* META Reporting 5.2 — anonymous content-format benchmarks.
   No colleague identities, account results, rank, or electoral recommendations are exposed. */
(()=>{
'use strict';
const route='office-benchmarks';
const TYPES=['Video','Photo','Link','Text'];
let remote=null,remoteKey='',busy=false;
const safe=x=>esc(x);
function med(a){if(!a.length)return null;const v=[...a].sort((x,y)=>x-y),i=Math.floor(v.length/2);return v.length%2?v[i]:(v[i-1]+v[i])/2}
function demoStats(){
 const d=metricData(), mine=intelPage(),myCode=mine?.key||'mp01';
 const calculate=id=>{
  const a=d.posts.filter(p=>p.mp===id),n=a.length;
  return {n,formats:Object.fromEntries(TYPES.map(t=>{const selected=a.filter(p=>p.format===t);return [t,{count:selected.length,share:n?selected.length/n:null,perPost:selected.length?selected.reduce((s,p)=>s+p.engagement,0)/selected.length:null}] }))};
 };
 const own=calculate(myCode),peers=MP.filter(p=>p[0]!==myCode).map(p=>calculate(p[0]));
 return {source:'fictional',period:state.period,own,
   reference:Object.fromEntries(TYPES.map(t=>[t,{
     share:med(peers.filter(x=>x.n>=5).map(x=>x.formats[t].share).filter(x=>x!=null)),
     perPost:med(peers.filter(x=>x.formats[t].count>=3).map(x=>x.formats[t].perPost).filter(x=>x!=null))
   }]))};
}
function number(x){return x==null?'Not available':Math.round(x).toLocaleString('en-GB')}
function percent(x){return x==null?'—':(x*100).toFixed(1)+'%'}
function comparisonCards(data){
 const observations=[];
 const formatName=t=>({Video:'video posts',Photo:'photos and graphics',Link:'link posts',Text:'text posts'})[t];
 for(const t of TYPES){
   const own=data.own?.formats?.[t]||{},other=data.reference?.[t]||{};
   if(own.share==null||other.share==null)continue;
   const diff=other.share-own.share;
   if(Math.abs(diff)>=0.04){
      observations.push({kind:'Content mix',format:t,title:diff>0?`Your colleagues publish a higher share of ${formatName(t)}`:`You publish a higher share of ${formatName(t)}`,
        detail:`Your posts: ${percent(own.share)} · Your colleagues: ${percent(other.share)}. This is a difference in the publishing mix, not a recommended quota.`});
   }
   if(own.perPost!=null&&other.perPost!=null&&Math.abs(other.perPost-own.perPost)>=8){
      observations.push({kind:'Recorded interactions',format:t,title:other.perPost>own.perPost?`Your colleagues' ${formatName(t)} recorded more interactions per post`:`Your ${formatName(t)} recorded more interactions per post`,
        detail:`Your posts: ${number(own.perPost)} · Your colleagues: ${number(other.perPost)}. Different topics, audiences and timing can influence these figures.`});
   }
 }
 return observations.slice(0,5);
}
function formatReport(data,privateMode=false){
 const rows=TYPES.map(t=>{
  const own=data.own?.formats?.[t]||{},ref=data.reference?.[t]||{};
  const ownShare=own.share||0,colleagueShare=ref.share||0;
  return `<tr><th scope="row">${t==='Photo'?'Photos / graphics':t}</th><td>${number(own.count)}</td><td><div class="peer-bar-row"><span>${percent(own.share)}</span><span class="peer-bar-track"><span style="width:${Math.min(100,ownShare*100)}%"></span></span></div></td><td><div class="peer-bar-row"><span>${percent(ref.share)}</span><span class="peer-bar-track peer-bar-muted"><span style="width:${Math.min(100,colleagueShare*100)}%"></span></span></div></td><td>${number(own.perPost)}</td><td>${number(ref.perPost)}</td></tr>`;
 }).join('');
 const highlights=comparisonCards(data);
 const findings=highlights.length?highlights.map(f=>`<article class="peer-finding"><div class="peer-finding-label">${safe(f.kind)} · ${safe(f.format)}</div><h3>${safe(f.title)}</h3><p>${safe(f.detail)}</p></article>`).join(''):`<article class="peer-finding"><div class="peer-finding-label">Content review</div><h3>Your content format mix is broadly similar to your colleagues</h3><p>Review the detailed breakdown below alongside accessibility, available resources and posting context.</p></article>`;
 const checklist=`<section class="peer-guidance"><h2>Production and accessibility checklist</h2><p>Practical checks for the office's content workflow, independent of the comparison figures.</p><div class="peer-guidance-grid"><div><strong>Video</strong><span>Check captions, transcripts, legible text and audio quality.</span></div><div><strong>Graphics</strong><span>Check contrast, image descriptions and source attribution.</span></div><div><strong>Links</strong><span>Check destination pages, mobile usability and accessibility.</span></div><div><strong>Planning</strong><span>Keep a realistic content calendar and review what resources are available.</span></div></div></section>`;
 return `${intelScopeBanner()}<div class="benchmark-intro"><h2>How you compare with your colleagues</h2><p>An anonymous view of publishing formats and recorded interactions. Colleagues' individual accounts and figures remain private.</p></div>
  <div class="peer-summary"><div class="peer-lead-number"><span>Your published posts</span><strong>${number(data.own.n)}</strong><small>Selected ${privateMode?data.days:data.period}-day period</small></div><div class="peer-lead-copy"><span>What stands out</span><strong>${highlights.length?safe(highlights[0].title):'Your publishing patterns at a glance'}</strong><small>Based on content format and recorded post interactions; not a measure of political effectiveness.</small></div></div>
  <section class="panel peer-section"><div class="panel-header"><h2>What your colleagues are doing</h2><span class="subtle">Anonymous comparisons</span></div><div class="panel-body"><div class="peer-findings">${findings}</div></div></section>
  <section class="panel peer-section"><div class="panel-header"><h2>Your content compared</h2><span class="subtle">${privateMode?'Available verified records':'Fictional reporting period'}</span></div><div class="panel-body"><div class="table-wrap"><table class="benchmark-table peer-data-table"><thead><tr><th>Format</th><th>Your posts</th><th>Your share</th><th>Your colleagues</th><th>Your interactions/post</th><th>Colleagues' interactions/post</th></tr></thead><tbody>${rows}</tbody></table></div><p class="intel-footnote">The colleague figure is the median across eligible offices. Interactions per post are descriptive; differences do not establish that a format causes more engagement. Small or missing samples are not treated as zero.</p></div></section>
 ${checklist}`;
}
function privateBody(){
 if(!CLOUD?.user||!CLOUD?.org)return intelEmpty('Sign in to your assigned office workspace to see your Page benchmarks.');
 const key=CLOUD.org.id+'|'+(intelPage()?.id||'')+'|'+state.period;
 if(remoteKey!==key){remoteKey=key;remote=null;loadPrivate(key)}
 if(busy)return intelEmpty('Checking whether enough authorised Page data is available for an anonymous comparison…');
 if(!remote)return intelEmpty('Comparison data is currently unavailable. Other offices’ Page figures are not accessible from your workspace.');
 if(remote.status==='insufficient')return intelEmpty('A comparison with your colleagues needs data from at least five other eligible offices. No individual office results will be shown.');
 if(remote.status==='no_data')return intelEmpty('Your Page has no verified post-format data for this period. Connect a Page and allow its data to sync.');
 if(remote.status==='error')return intelEmpty('The comparison could not be loaded. Please try again.');
 return formatReport(remote,true);
}
async function loadPrivate(key){
 if(busy)return;busy=true;
 try{
  const page=intelPage();if(!page||!CLOUD?.client)throw Error('No assigned page');
  const {data,error}=await CLOUD.client.functions.invoke('meta-peer-benchmarks',{body:{organisation_id:CLOUD.org.id,page_id:page.id,days:Math.min(Math.max(Number(state.period)||30,7),90)}});
  if(error)throw error;
  if(remoteKey===key)remote=data;
 }catch(e){console.warn('Peer benchmark unavailable',e);if(remoteKey===key)remote={status:'error'};}
 finally{busy=false;if(state.view===route)render()}
}
function view(){const mode=intelDemo(),picker=mode?`<div class="intel-toolbar">${intelPagePicker()}</div>`:'';
 return header('Peer benchmarks','How you compare with your colleagues · No individual office identities')+picker+(mode?formatReport(demoStats()):privateBody());
}
const oldView=intelView;intelView=function(){return state.view===route?view():oldView()};
const oldEnforce=intelEnforceRoute;intelEnforceRoute=function(){if(state.view===route && intelIsOffice())return;oldEnforce()};
TITLES[route]='Peer benchmarks';
const oldRender=render;
render=function(){oldRender();if(!intelIsOffice())return;
 const nav=document.getElementById('navigation');
 const child=nav?.querySelector('.ref-nav-group[data-group="Analytics"] .ref-nav-children');
 if(child&&!child.querySelector(`[data-view="${route}"]`)){
  const a=document.createElement('a');a.href='#'+route;a.dataset.view=route;a.className='ref-sub-link'+(state.view===route?' active':'');a.textContent='Peer benchmarks';child.appendChild(a);
 }
 if(state.view===route){const group=nav?.querySelector('.ref-nav-group[data-group="Analytics"]');if(group){group.classList.add('current','expanded');let panel=group.querySelector('.ref-nav-children');if(panel)panel.hidden=false;const b=group.querySelector('.ref-group-toggle');if(b)b.setAttribute('aria-expanded','true')}
  const bc=document.querySelector('.breadcrumb');if(bc)bc.innerHTML='Analytics <span>/</span> <strong id="breadcrumb-current">Peer benchmarks</strong>';
  const main=document.getElementById('main-content');const tabs=document.createElement('nav');tabs.className='ref-context-tabs';tabs.innerHTML='<a href="#office-analytics">Page analytics</a><a href="#office-conversations">Community conversations</a><a href="#office-benchmarks" class="selected" aria-current="page">Peer benchmarks</a>';
  const heading=main.querySelector('.page-heading');if(heading)heading.insertAdjacentElement('afterend',tabs);else main.prepend(tabs);
 }
 // Make the new view discoverable from the office start page.
 if(state.view==='office-home'){const list=document.querySelector('.intel-feature-list');if(list&&!list.querySelector('[data-peer-benchmark]')){
  const b=document.createElement('button');b.dataset.peerBenchmark='yes';b.innerHTML='<strong>Peer benchmarks</strong><span>Compare your content mix and typical interactions with your colleagues.</span>';list.appendChild(b);
 }}
};
document.addEventListener('click',e=>{if(e.target.closest('[data-peer-benchmark]'))navigate(route)});
const pickerObs=new MutationObserver(()=>{}); // UI refresh relies on existing page-picker render cycle.
})();
