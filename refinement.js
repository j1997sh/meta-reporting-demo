/** META Reporting 5.1 — compact, typographic navigation and contextual tabs.
 * UI-only: preserves all existing view IDs, reporting functions, auth and APIs.
 */
(()=>{
'use strict';
const HQ=[
 {label:'Overview',view:'overview'},
 {label:'Analytics',children:[
   ['audience','Audience & growth'],['geography','Audience geography'],
   ['content','Content & engagement'],['activity','Publishing activity'],
   ['campaigns','Campaigns'],['advertising','Advertising'],
   ['hq-social','Social listening'],['league','League table'],['compare','Compare accounts']]},
 {label:'Insights & Actions',children:[
   ['hq-insights','Insights'],['hq-actions','Action centre'],['shared-practices','Shared practices']]},
 {label:'Reports',children:[
   ['reports','Report studio'],['cloud-reports','Report library'],
   ['hq-meetings','Meeting packs'],['hq-report-sharing','Share reports']]},
 {label:'Accounts',children:[
   ['accounts','MP directory'],['hq-office-access','Office access'],
   ['cloud-admin','Organisation admin'],['connections','Connections & diagnostics']]},
 {label:'Settings',view:'settings',children:[['cloud-workspace','My workspace']]}
];
const OFFICE=[
 {label:'Overview',view:'office-home'},
 {label:'Analytics',children:[['office-analytics','Page analytics'],['office-conversations','Community conversations']]},
 {label:'Insights & Actions',children:[['office-insights','Insights'],['office-actions','Action centre'],['shared-practices','Shared practices']]},
 {label:'Reports',children:[['office-reports','My reports']]},
 {label:'Settings',view:'office-settings',children:[['cloud-workspace','My workspace']]}
];
const escHtml=str=>String(str||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const openGroups=new Set();
const closedGroups=new Set();
let lastMode='';
const nav=()=>document.getElementById('navigation');
function mode(){return typeof intelIsOffice==='function'&&intelIsOffice()?'office':'hq'}
const groups=()=>mode()==='office'?OFFICE:HQ;
function currentGroup(view){
  if(view==='account-detail')return 'Accounts';
  if(view==='cloud-workspace')return 'Settings';
  if(view==='office-settings')return 'Settings';
  for(const g of groups())if(g.view===view||g.children?.some(x=>x[0]===view))return g.label;
  return 'Overview';
}
function groupURL(g){return g.view||g.children?.[0]?.[0]||'overview'}
function shouldBeOpen(g,view){return !closedGroups.has(g.label)&&(openGroups.has(g.label)||g.children?.some(x=>x[0]===view))}
function renderNav(){
  const target=nav();if(!target)return;
  const m=mode(); if(lastMode!==m){lastMode=m;openGroups.clear();closedGroups.clear();}
  const view=state.view||'overview',active=currentGroup(view);
  target.classList.add('nav-refined');
  target.innerHTML=groups().map((g,i)=>{
    const key='ref-group-'+i,expanded=!!g.children&&shouldBeOpen(g,view),isActive=active===g.label;
    const children=g.children?.map(([route,title])=>`<a href="#${route}" data-view="${route}" class="ref-sub-link${view===route?' active':''}" ${view===route?'aria-current="page"':''}>${escHtml(title)}</a>`).join('')||'';
    if(!g.children)return `<a href="#${groupURL(g)}" data-view="${groupURL(g)}" class="ref-primary-link${isActive?' active':''}" ${isActive?'aria-current="page"':''}>${escHtml(g.label)}</a>`;
    return `<section class="ref-nav-group${expanded?' expanded':''}${isActive?' current':''}" data-group="${escHtml(g.label)}">
      <button type="button" class="ref-group-toggle" aria-controls="${key}" aria-expanded="${expanded}" data-ref-toggle="${escHtml(g.label)}">${escHtml(g.label)}<span class="ref-caret" aria-hidden="true"></span></button>
      <div class="ref-nav-children" id="${key}" ${expanded?'':'hidden'}>${children}</div>
    </section>`;
  }).join('');
  const title=mode()==='office'?'MP office':'Headquarters';
  const bottom=document.querySelector('.sidebar-bottom');
  if(bottom){bottom.innerHTML=`<strong>${title}</strong><small>${typeof intelDemo==='function'&&intelDemo()?'Fictional demonstration data':'Authenticated workspace'}</small>`;}
}
const TABSETS={
 overview:[['overview','Network overview'],['hq-intelligence','Conversation overview']],
 audience:[['audience','Overview'],['geography','Geography']],
 geography:[['audience','Overview'],['geography','Geography']],
 content:[['content','Content feed'],['activity','Publishing'],['campaigns','Campaigns']],
 activity:[['content','Content feed'],['activity','Publishing'],['campaigns','Campaigns']],
 campaigns:[['content','Content feed'],['activity','Publishing'],['campaigns','Campaigns']],
 league:[['league','League table'],['compare','Compare accounts']],
 compare:[['league','League table'],['compare','Compare accounts']],
 'hq-intelligence':[['overview','Network overview'],['hq-intelligence','Conversation overview']],
 'hq-social':[['hq-social','Topics & comments']],
 'hq-insights':[['hq-insights','Insights'],['hq-actions','Action centre'],['shared-practices','Shared practices']],
 'hq-actions':[['hq-insights','Insights'],['hq-actions','Action centre'],['shared-practices','Shared practices']],
 'shared-practices':[['hq-insights','Insights'],['hq-actions','Action centre'],['shared-practices','Shared practices']],
 reports:[['reports','Report studio'],['cloud-reports','Report library'],['hq-meetings','Meeting packs'],['hq-report-sharing','Sharing']],
 'cloud-reports':[['reports','Report studio'],['cloud-reports','Report library'],['hq-meetings','Meeting packs'],['hq-report-sharing','Sharing']],
 'hq-meetings':[['reports','Report studio'],['cloud-reports','Report library'],['hq-meetings','Meeting packs'],['hq-report-sharing','Sharing']],
 'hq-report-sharing':[['reports','Report studio'],['cloud-reports','Report library'],['hq-meetings','Meeting packs'],['hq-report-sharing','Sharing']],
 accounts:[['accounts','MP directory'],['hq-office-access','Office access'],['cloud-admin','Organisation admin'],['connections','Connections']],
 'hq-office-access':[['accounts','MP directory'],['hq-office-access','Office access'],['cloud-admin','Organisation admin'],['connections','Connections']],
 'cloud-admin':[['accounts','MP directory'],['hq-office-access','Office access'],['cloud-admin','Organisation admin'],['connections','Connections']],
 connections:[['accounts','MP directory'],['hq-office-access','Office access'],['cloud-admin','Organisation admin'],['connections','Connections']],
 'office-home':[['office-home','Overview']],
 'office-analytics':[['office-analytics','Page analytics'],['office-conversations','Community conversations']],
 'office-conversations':[['office-analytics','Page analytics'],['office-conversations','Community conversations']],
 'office-insights':[['office-insights','Insights'],['office-actions','Action centre'],['shared-practices','Shared practices']],
 'office-actions':[['office-insights','Insights'],['office-actions','Action centre'],['shared-practices','Shared practices']],
 'office-reports':[['office-reports','My reports']]
};
function tabsFor(view){let set=TABSETS[view];if(!set)return null;
 if(mode()==='office'){
   if(view==='shared-practices')set=TABSETS['office-insights'];
   else if(!view.startsWith('office'))return null;
 }else if(view==='shared-practices')set=TABSETS['hq-insights'];
 return set;
}
function renderTabs(){
 const root=document.getElementById('main-content');if(!root)return;
 root.querySelectorAll(':scope > .ref-context-tabs').forEach(x=>x.remove());
 const set=tabsFor(state.view);if(!set||set.length<2)return;
 const navEl=document.createElement('nav');navEl.className='ref-context-tabs';navEl.setAttribute('aria-label','Section views');
 navEl.innerHTML=set.map(([id,name])=>`<a href="#${id}" class="${id===state.view?'selected':''}" ${id===state.view?'aria-current="page"':''}>${escHtml(name)}</a>`).join('');
 const heading=root.querySelector('.page-heading,.intel-header,.cloud-header');
 if(heading&&heading.parentNode===root)heading.insertAdjacentElement('afterend',navEl);
 else root.prepend(navEl);
}
const oldRender=render;
TITLES['shared-practices']='Shared practices';
render=function(){
 if(state.view==='shared-practices'){
   if(typeof intelEnforceRoute==='function')intelEnforceRoute();
   const root=document.getElementById('main-content');
   document.getElementById('breadcrumb-current').textContent='Shared practices';
   document.title='Shared practices | META Reporting';
   root.innerHTML=header('Shared practices','Documented office processes and operational reference material.')+intelScopeBanner()+(typeof intelPracticePanel==='function'?intelPracticePanel():'');
   document.getElementById('sidebar').classList.remove('open');
 } else oldRender();
 renderNav();renderTabs();
 const bc=document.querySelector('.breadcrumb');if(bc){const group=currentGroup(state.view);bc.innerHTML=`${escHtml(group)} <span>/</span> <strong id="breadcrumb-current">${escHtml(TITLES[state.view]||'Overview')}</strong>`;}
};
const previousIntelNav=typeof intelNavigation==='function'?intelNavigation:null;
if(previousIntelNav){intelNavigation=function(){previousIntelNav();renderNav()}}
// Toggle group navigation without changing the current content or URL.
document.addEventListener('click',e=>{
 const toggle=e.target.closest('[data-ref-toggle]');if(!toggle)return;
 e.preventDefault();
 const key=toggle.dataset.refToggle;
 const wasOpen=toggle.getAttribute('aria-expanded')==='true';
 if(wasOpen){openGroups.delete(key);closedGroups.add(key)}else{openGroups.add(key);closedGroups.delete(key)}
 const parent=toggle.closest('.ref-nav-group'),next=!wasOpen;
 if(parent){parent.classList.toggle('expanded',next);const panel=parent.querySelector('.ref-nav-children');if(panel)panel.hidden=!next;toggle.setAttribute('aria-expanded',String(next))}
});
// Suppress old navigation look during startup.
render();
})();
