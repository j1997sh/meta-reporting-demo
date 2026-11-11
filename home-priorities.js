/* META Reporting 5.5 — top-of-home weekly community brief and colleague context.
   Factual descriptive metrics only; fictional examples never silently stand in for real imports. */
(()=>{
'use strict';
const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const n=x=>Number(x||0).toLocaleString('en-GB');
const pct=x=>Number.isFinite(x)?(100*x).toFixed(1)+'%':'Unavailable';
const med=a=>{if(!a.length)return null;const s=[...a].sort((x,y)=>x-y),m=Math.floor(s.length/2);return s.length%2?s[m]:(s[m-1]+s[m])/2;};
const TOPICS=typeof INTEL_TOPICS!=='undefined'?INTEL_TOPICS:{};
const label=s=>TOPICS[s]||String(s||'Other').replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase());
function scope(){let office=typeof intelIsOffice==='function'&&intelIsOffice();let page=office&&typeof intelPage==='function'?intelPage():null;return {office,page,fictional:typeof intelDemo==='function'&&intelDemo()};}
function weeklyData(s){
 const all=typeof INTEL==='object'&&Array.isArray(INTEL.topics)?INTEL.topics:[];
 // The demo source currently covers 2 October–31 October 2026; the completed week is 25–31 October.
 const end=s.fictional?'2026-10-31':new Date(Date.now()-86400000).toISOString().slice(0,10);
 const weekStart=new Date(end+'T12:00:00Z');weekStart.setUTCDate(weekStart.getUTCDate()-6);
 const first=weekStart.toISOString().slice(0,10);
 const pageId=s.office?s.page?.id:null;
 const rows=all.filter(t=>String(t.day||'')>=first&&String(t.day||'')<=end&&(!pageId||t.page_id===pageId));
 let sums={comments:0,questions:0,review:0};const counts=new Map();
 for(const r of rows){const amount=Number(r.comment_count||0);sums.comments+=amount;sums.questions+=Number(r.question_count||0);sums.review+=Number(r.needs_review_count||0);counts.set(r.topic_key,(counts.get(r.topic_key)||0)+amount)}
 return {...sums,first,end,topics:[...counts.entries()].sort((a,b)=>b[1]-a[1]).slice(0,4),complete:rows.length>0};
}
function weeklyCard(s){const w=weeklyData(s), destination=s.office?'#office-conversations':'#hq-social';
 let main=w.complete?`<div class="meta55-weekly-metrics"><div><b>${n(w.comments)}</b><span>Comments analysed</span></div><div><b>${n(w.questions)}</b><span>Tagged questions</span></div><div><b>${n(w.review)}</b><span>For office review</span></div></div><div class="meta55-topics">${w.topics.map(([key,value])=>`<div><span>${escape(label(key))}</span><strong>${n(value)}</strong></div>`).join('')}</div><p class="meta55-explanation">These are topics appearing in the available Page comments, not a survey of constituents. Review flags are not confirmed unanswered messages.</p>`
 :`<div class="meta55-no-data">No weekly comment data has been collected for this workspace. Connect a Page and verify authorised comment access to start producing weekly briefs.</div>`;
 return `<section class="meta55-home-card meta55-weekly" aria-label="Weekly community brief"><div class="meta55-card-heading"><div><div class="meta55-kicker">SOCIAL LISTENING</div><h2>The Weekly Community Brief</h2><p>${escape(w.first)}–${escape(w.end)} · ${s.fictional?'Fictional example':'Available Page data'}</p></div><a href="${destination}">View conversations</a></div>${main}</section>`;
}
function peerData(s){
 if(!s.fictional)return null;
 const d=typeof metricData==='function'?metricData():null;if(!d)return null;
 const code=s.page?.key||'mp01';const all=typeof MP!=='undefined'?MP:[];
 const each=all.map(m=>{const posts=d.posts.filter(p=>p.mp===m[0]);const by={};for(const f of ['Video','Photo','Link','Text']){const ps=posts.filter(p=>p.format===f);by[f]={count:ps.length,share:posts.length?ps.length/posts.length:null,interactions:ps.length?ps.reduce((a,p)=>a+Number(p.engagement||0),0)/ps.length:null};}return {id:m[0],n:posts.length,by};});
 const mine=each.find(x=>x.id===code),others=each.filter(x=>x.id!==code&&x.n>=5);
 if(!mine||!others.length)return null;
 const ref={};for(const f of ['Video','Photo','Link','Text'])ref[f]={share:med(others.map(p=>p.by[f].share).filter(x=>x!==null)),interactions:med(others.filter(p=>p.by[f].count>=3).map(p=>p.by[f].interactions).filter(x=>x!==null))};
 return {mine,others,ref,total:all.length};
}
function peersCard(s){const href='#office-benchmarks';if(!s.office)return `<section class="meta55-home-card"><div class="meta55-card-heading"><div><div class="meta55-kicker">HEADQUARTERS</div><h2>Account context</h2><p>Manage account-level comparisons and shared standards</p></div><a href="#compare">Compare accounts</a></div><p class="meta55-explanation">HQ can review the whole network. Individual offices receive only anonymous, combined comparisons.</p></section>`;
 const p=peerData(s);if(!p)return `<section class="meta55-home-card"><div class="meta55-card-heading"><div><div class="meta55-kicker">YOUR COLLEAGUES</div><h2>How your office compares</h2></div><a href="${href}">Open benchmarks</a></div><div class="meta55-no-data">Not enough eligible, verified Page records for an anonymous colleagues comparison yet.</div></section>`;
 const video=p.mine.by.Video,ref=p.ref.Video;const statements=[];
 if(video.share!=null&&ref.share!=null)statements.push(`Video makes up <b>${pct(video.share)}</b> of your published posts, compared with <b>${pct(ref.share)}</b> for your colleagues.`);
 if(video.interactions!=null&&ref.interactions!=null)statements.push(`Your video posts recorded <b>${n(Math.round(video.interactions))}</b> interactions per post; the colleagues' typical figure was <b>${n(Math.round(ref.interactions))}</b>.`);
 const valid=p.others.length+1;
 return `<section class="meta55-home-card meta55-peers" aria-label="Your colleagues"><div class="meta55-card-heading"><div><div class="meta55-kicker">YOUR COLLEAGUES</div><h2>How your office compares</h2><p>Anonymous comparisons of publishing activity and recorded interactions</p></div><a href="${href}">Explore comparison</a></div><div class="meta55-coverage"><strong>${valid} out of ${p.total}</strong><span>fictional office datasets included in this comparison</span></div><div class="meta55-statements">${statements.map(t=>`<p>${t}</p>`).join('')}</div><p class="meta55-explanation">Colleagues’ identities and individual figures are hidden. Differences in content mix or recorded engagement do not establish what caused them.</p></section>`;
}
function enhance(){const main=document.querySelector('#main-content .meta53');if(!main)return;const s=scope(),key=(s.fictional?'demo':'private')+'|'+(s.office?'office':'hq')+'|'+(s.page?.id||'none')+'|'+(typeof INTEL==='object'?INTEL.updatedAt||0:0)+'|'+(typeof state==='object'?state.period:'');if(main.dataset.meta55===key)return;main.dataset.meta55=key;
 // Avoid exposing invented comparisons in a real private workspace.
 const holder=document.createElement('div');holder.className='meta55-priority';holder.innerHTML=weeklyCard(s)+peersCard(s);
 const before=main.querySelector('.meta53-kpis')||main.querySelector('.meta53-hero-empty');if(before)before.before(holder);else main.append(holder);
}
const prior=render;render=function(){prior();if(['overview','office-home'].includes(state.view))enhance()};
// Existing background Supabase topic loads trigger render() when completed.
render();
})();
