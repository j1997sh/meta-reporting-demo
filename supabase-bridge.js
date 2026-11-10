'use strict';
/*
 * META Reporting — read-only Supabase demonstration connector.
 * Only public, simulated rows are accessible through narrowly scoped RLS policies.
 * This publishable API key is intended for browser use. NEVER add service-role or Meta tokens here.
 * All editing/scheduling/report template changes remain local browser demo functionality.
 */
const DEMO_DB = Object.freeze({
  url: 'https://hlwqgzhtmhmwfywiiwdx.supabase.co',
  publishableKey: 'sb_publishable_fMBWFk9DXBAvw5KCVCLFEQ_dfmIVj6c',
  pageSize: 1000
});

const DEMO_GEO = Object.create(null);
const DEMO_DB_STATUS = {connected:false, loading:true, recordCounts:{}};
function demoSetBadge(message, kind) {
  const badge = document.getElementById('database-status');
  if (!badge) return;
  badge.textContent = message;
  badge.dataset.status = kind;
  badge.title = kind === 'connected' ? 'Read-only simulated data fetched from Supabase' : message;
}
async function demoFetchTable(table, columns, {filters='', order=''}={}) {
  const values = [];
  for (let offset=0; ; offset += DEMO_DB.pageSize) {
    const url = new URL(`${DEMO_DB.url}/rest/v1/${table}`);
    url.searchParams.set('select',columns);
    url.searchParams.set('limit',String(DEMO_DB.pageSize));
    url.searchParams.set('offset',String(offset));
    if (order) url.searchParams.set('order',order);
    if (filters) {
      for (const [key,value] of new URLSearchParams(filters)) url.searchParams.set(key,value);
    }
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(),15000);
    let response;
    try {
      response = await fetch(url, {
        headers: {'apikey':DEMO_DB.publishableKey,'Accept':'application/json'},
        signal:controller.signal,
        cache:'no-store'
      });
    } finally {clearTimeout(timeout)}
    if(!response.ok) throw new Error(`${table} HTTP ${response.status}: ${(await response.text()).slice(0,120)}`);
    const part = await response.json();
    if(!Array.isArray(part)) throw new Error(`${table}: invalid response`);
    values.push(...part);
    if(part.length < DEMO_DB.pageSize) break;
    if(offset > 250000) throw new Error('Demonstration pagination safety limit exceeded');
  }
  DEMO_DB_STATUS.recordCounts[table] = values.length;
  return values;
}
function demoDate(value) {return String(value||'').slice(0,10)}
function demoNum(value) {return value === null || value === undefined ? null : Number(value)}
async function demoConnect() {
  demoSetBadge('CONNECTING TO SUPABASE…','loading');
  try {
    const pages = await demoFetchTable('facebook_pages','id,name,constituency,demo',{filters:'demo=eq.true',order:'name.asc'});
    if (!pages.length) throw new Error('No public demonstration Pages returned');
    // The browser's original account identifiers remain stable for saved templates/views.
    const byName = new Map(MP.map(m=>[m[1],m[0]]));
    const dbToDemo = new Map();
    for (const page of pages) {
      const localId = byName.get(page.name);
      if (localId) dbToDemo.set(page.id,localId);
    }
    if(dbToDemo.size !== MP.length) throw new Error('The Supabase demonstration Page directory is incomplete');
    const [snapshots,dbPosts,insights,adAccounts,campaigns,adMetrics,locations,templates] = await Promise.all([
      demoFetchTable('follower_snapshots','page_id,observed_at,followers,source',{order:'id.asc'}),
      demoFetchTable('posts','id,page_id,published_at,message,media_type,demo',{filters:'demo=eq.true',order:'id.asc'}),
      demoFetchTable('post_insight_snapshots','post_id,observed_at,reactions,comments,shares,media_views',{order:'id.asc'}),
      demoFetchTable('ad_accounts','id,page_id,name',{order:'name.asc'}),
      demoFetchTable('ad_campaigns','id,ad_account_id,name',{order:'name.asc'}),
      demoFetchTable('ad_insights_daily','ad_account_id,campaign_id,day,spend_gbp,impressions,link_clicks,leads',{order:'id.asc'}),
      demoFetchTable('audience_geography','page_id,geography_type,location_label,percentage,observed_on',{order:'observed_on.desc'}),
      demoFetchTable('report_templates','name,layout,branding',{order:'created_at.asc'})
    ]);
    const insightByPost = new Map();
    for(const item of insights) if(!insightByPost.has(item.post_id)) insightByPost.set(item.post_id,item);
    const nextPosts = dbPosts.map((p,i)=>{
      const ins=insightByPost.get(p.id) || {};
      const reactions=demoNum(ins.reactions)??0,comments=demoNum(ins.comments)??0,shares=demoNum(ins.shares)??0;
      return {id:p.id,mp:dbToDemo.get(p.page_id),date:demoDate(p.published_at),format:p.media_type||'Text',
        message:p.message||'Simulated post',topic:'Simulated content',reactions,comments,shares,
        engagement:reactions+comments+shares,views:demoNum(ins.media_views)};
    }).filter(x=>x.mp);
    const statsByDate = new Map();
    for(const post of nextPosts) {
      const key=post.mp+'|'+post.date;
      let s=statsByDate.get(key);
      if(!s) {s={posts:0,engagement:0,views:0}; statsByDate.set(key,s)}
      s.posts++; s.engagement+=post.engagement;s.views+=post.views||0;
    }
    const lastFollowerByMP = new Map();
    const nextDaily = snapshots.slice().sort((a,b)=>String(a.observed_at).localeCompare(String(b.observed_at))).map(s=>{
      const mp=dbToDemo.get(s.page_id),date=demoDate(s.observed_at),followers=Number(s.followers);
      const previous=lastFollowerByMP.get(mp),sum=statsByDate.get(mp+'|'+date)||{posts:0,engagement:0,views:0};
      lastFollowerByMP.set(mp,followers);
      return {mp,date,followers,change:previous===undefined?0:followers-previous,
        posts:sum.posts,engagement:sum.engagement,views:sum.views};
    }).filter(x=>x.mp).sort((a,b)=>a.date.localeCompare(b.date));
    const accountToMP=new Map(adAccounts.map(a=>[a.id,dbToDemo.get(a.page_id)]));
    const campaignName=new Map(campaigns.map(c=>[c.id,c.name]));
    const nextAds=adMetrics.map(a=>({mp:accountToMP.get(a.ad_account_id),date:demoDate(a.day),
      campaign:campaignName.get(a.campaign_id)||'Demo campaign',spend:Number(a.spend_gbp||0),
      impressions:Number(a.impressions||0),clicks:Number(a.link_clicks||0),leads:Number(a.leads||0)}))
      .filter(x=>x.mp);
    if(nextDaily.length<500 || nextPosts.length<100 || nextAds.length<100) throw new Error('Incomplete demonstration analytics data returned');
    // Replace the initially-generated local dataset atomically only after every request succeeds.
    posts.splice(0,posts.length,...nextPosts);
    daily.splice(0,daily.length,...nextDaily);
    ads.splice(0,ads.length,...nextAds);
    for(const key of Object.keys(DEMO_GEO)) delete DEMO_GEO[key];
    for(const item of locations) {
      const mp=dbToDemo.get(item.page_id),type=item.geography_type;
      if(!mp || !['city','country'].includes(type)) continue;
      const key=mp+'|'+type;
      (DEMO_GEO[key] ||= []).push([item.location_label,Number(item.percentage||0)*100]);
    }
    // Use Supabase geography for report blocks as well as the audience geography view.
    xcities = function(id){return DEMO_GEO[id+'|city']?.length?DEMO_GEO[id+'|city']:[]};
    xcountries = function(id){return DEMO_GEO[id+'|country']?.length?DEMO_GEO[id+'|country']:[]};
    xgeonote = function(){return '<div class="data-caption">Read-only fictional geography loaded from Supabase. These are <strong>simulated estimates</strong>, not Meta API measurements. City locations do not establish constituency residence.</div>'};
    // Existing templates remain in browser storage. Supabase presets are offered without anonymous write permissions.
    if(Array.isArray(templates) && typeof X !== 'undefined') {
      for(const row of templates) {
        const blocks=(row.layout?.components||[]).map((c,i)=>({id:'db'+i,type:c.type==='metric'?'kpi':c.type,title:c.metric||c.type,metric:c.metric||'followers',geoMode:'city',limit:5}));
        if(blocks.length && !X.templates.some(t=>t.title===row.name+' (database preset)'))
          X.templates.push({...xclone(XDEFAULT),id:'dbpreset'+X.templates.length,title:row.name+' (database preset)',blocks});
      }
    }
    cache=null;
    DEMO_DB_STATUS.connected=true;
    DEMO_DB_STATUS.loading=false;
    if(typeof X !== 'undefined') X.sourceStatus='SUPABASE — SIMULATED DATA';
    demoSetBadge('SUPABASE · DEMO DATA','connected');
    render();
    console.info('META Reporting: fetched fictional data from Supabase', DEMO_DB_STATUS.recordCounts);
  } catch(error) {
    DEMO_DB_STATUS.loading=false;
    DEMO_DB_STATUS.error=String(error.message||error);
    demoSetBadge('LOCAL DEMO · DATABASE OFFLINE','fallback');
    console.error('META Reporting Supabase connection failed, retaining local fictional data:',error);
  }
}
// Do not delay the normal public demonstration if the database is unavailable.
demoConnect();
