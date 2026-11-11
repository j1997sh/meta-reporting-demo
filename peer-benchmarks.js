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
function formatReport(data){
 const rows=TYPES.map(t=>{
  const own=data.own.formats[t],ref=data.reference[t]||{};
  return `<tr><th scope="row">${t}</th><td>${number(own.count)}</td><td>${percent(own.share)}</td><td>${percent(ref.share)}</td><td>${number(own.perPost)}</td><td>${number(ref.perPost)}</td></tr>`;
 }).join('');
 const insights=[];
 for(const t of TYPES){const m=data.own.formats[t],b=data.reference[t];if(!b||b.share==null||b.perPost==null||m.share==null)continue;
   // Only surface measurable differences, and never imply causal superiority.
   if(m.count<3 && b.share>=.2)insights.push(`There are fewer than three ${t.toLowerCase()} posts in this period, so an engagement comparison for this format is unreliable.`);
   else if(m.count>=3 && m.share < b.share*.75)insights.push(`${t} accounts for ${percent(m.share)} of your posts, compared with ${percent(b.share)} for your colleagues. This describes different publishing mixes, not a recommended target.`);
 }
 if(!insights.length)insights.push('Your publishing format mix is available above. Review differences alongside posting frequency, accessibility, subject matter and data completeness.');
 return `${intelScopeBanner()}<div class="benchmark-intro"><h2>How you compare with your colleagues</h2><p>See how your content formats compare with your colleagues. Colleague figures are combined into a single anonymous median; no individual offices are identified.</p></div>
  <div class="benchmark-cards"><div><span>Your published posts</span><strong>${number(data.own.n)}</strong><small>Selected ${data.period}-day period</small></div><div><span>Comparison</span><strong>Your colleagues</strong><small>Anonymous median</small></div><div><span>Metrics</span><strong>Content mix</strong><small>Format share and interactions per post</small></div></div>
  <section class="panel"><div class="panel-header"><h2>Content formats</h2><span class="subtle">Fictional reporting period</span></div><div class="panel-body"><div class="table-wrap"><table class="benchmark-table"><thead><tr><th>Format</th><th>Your posts</th><th>Your mix</th><th>Your colleagues</th><th>Your interactions/post</th><th>Your colleagues</th></tr></thead><tbody>${rows}</tbody></table></div><p class="intel-footnote">“Your colleagues” shows the median across eligible offices, not the average of all their posts. Engagement is unadjusted and does not establish why results differ.</p></div></section>
 <section class="panel"><div class="panel-header"><h2>What the figures suggest checking</h2></div><div class="panel-body"><div class="benchmark-notes">${insights.map(x=>`<p>${safe(x)}</p>`).join('')}</div><p class="intel-footnote">These are descriptive content-workflow observations, not political effectiveness scores or instructions for influencing voters. A different format mix does not itself cause higher engagement.</p></div></section>`;
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
 const d=remote;
 const table=TYPES.map(t=>{let a=d.own?.formats?.[t]||{},b=d.reference?.[t]||{};return `<tr><th>${t}</th><td>${number(a.count)}</td><td>${percent(a.share)}</td><td>${percent(b.share)}</td><td>${number(a.perPost)}</td><td>${number(b.perPost)}</td></tr>`}).join('');
 return `${intelScopeBanner()}<p class="intel-footnote">Your colleagues’ figures are shown as an anonymous group median only when enough offices have data. No peer account names or underlying records are returned.</p><section class="panel"><div class="panel-header"><h2>Publishing formats</h2></div><div class="panel-body"><div class="table-wrap"><table class="benchmark-table"><thead><tr><th>Format</th><th>Your posts</th><th>Your mix</th><th>Your colleagues</th><th>Your interactions/post</th><th>Your colleagues</th></tr></thead><tbody>${table}</tbody></table></div></div></section><p class="intel-footnote">Aggregates are descriptive only and do not imply causal gains from changing format. Missing metrics are not treated as zero.</p>`;
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
