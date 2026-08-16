/* =====================================================================
   TQMS — Tuhin Hossain, Software QA Engineer
   Vanilla JS, no dependencies.
   ===================================================================== */
(function(){
'use strict';
var $=function(s,c){return (c||document).querySelector(s)};
var $$=function(s,c){return [].slice.call((c||document).querySelectorAll(s))};
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- data ---------- */
var SYS=[
 {id:'SUT-01',nm:'OS Pharmacy',desc:'Pharmacy management platform. I am the dedicated QA owner — every store release passes through me before it ships.',plat:'Web · Android · iOS',scale:'5,000+ installs · 200+ web users',cls:'Live',t:'t-live',url:'https://www.os-pharmacy.com/',role:['Functional, compatibility and release-candidate testing on every Google Play and App Store submission','Regression suites maintained across three platforms','Defect life cycle owned end to end in Jira']},
 {id:'SUT-02',nm:'Zaagshop',desc:'SaaS eCommerce website builder. I shaped the test strategy from the requirement phase and signed off each release.',plat:'Web · SaaS',scale:'~1,500 users · 50 paid subscribers',cls:'MVP',t:'t-mvp',url:'https://zaagshop.com/',role:['Test strategy and test plans written from requirement analysis','UI/UX validation and cross-browser coverage','Go/no-go release sign-off']},
 {id:'SUT-03',nm:'ZaagAI',desc:'AI chatbot built on a Retrieval-Augmented Generation architecture — a system where "correct" is not a fixed string.',plat:'Web · AI',scale:'RAG pipeline',cls:'MVP',t:'t-mvp',url:'https://zaag.ai/',role:['Response accuracy and relevance validation','Conversation flow and context-retention testing','Integration behaviour with the retrieval layer']},
 {id:'SUT-04',nm:'Apex Footwear Limited',desc:'Corporate site for one of the country’s best-known footwear brands.',plat:'Web',scale:'Cross-browser',cls:'Client',t:'t-cli',url:'https://www.apexfootwearltd.com/',role:['Functional and compatibility testing','Responsive validation across devices and screen sizes']},
 {id:'SUT-05',nm:'SwitchNest',desc:'UK platform for updating an address across multiple organisations in one place.',plat:'Web · UK',scale:'Multi-organisation flows',cls:'Client',t:'t-cli',url:'https://switchnest.co.uk/',role:['Multi-step workflow testing','Third-party integration validation','Data accuracy verification']},
 {id:'SUT-06',nm:'Northern Handicraft',desc:'eCommerce platform for sustainable handmade products crafted from natural materials.',plat:'Web · eCommerce',scale:'Catalogue &amp; checkout',cls:'Client',t:'t-cli',url:'https://northernhandicraft.com/',role:['Catalogue, cart and checkout flow validation','Order lifecycle from browse to payment confirmation']},
 {id:'SUT-07',nm:'Go Global',desc:'B2B marketplace connecting high-quality freelancers with companies.',plat:'Web · Marketplace',scale:'Two-sided platform',cls:'Client',t:'t-cli',url:'https://go-global.space/',role:['Role-based journey testing for both sides of the marketplace','Matching flow and account management coverage']},
 {id:'SUT-08',nm:'Selenium Automation Suite',desc:'End-to-end automation of the CURA Healthcare appointment-booking flow, plus ParaBank registration, login and home-page journeys.',plat:'Python · Selenium',scale:'E2E suite',cls:'Source',t:'t-src',url:'https://github.com/Tuhingits/Selenium_python_Automation_Project',role:['Page Object Model structure','Reusable locators and test data','Repeatable end-to-end runs']},
 {id:'SUT-09',nm:'API Test Collection',desc:'API test cases built as Postman collections with reusable environments, executed headlessly through Newman.',plat:'Postman · Newman',scale:'CLI + HTML reports',cls:'Source',t:'t-src',url:'https://github.com/Tuhingits/API-Testing-Project',role:['Collection and environment design','Newman CLI execution generating HTML reports','Response and status assertions']},
 {id:'SUT-10',nm:'PCUK Chatbot Load Test',desc:'Load and stress testing of the Prostate Cancer UK chatbot, finding the breaking point before real traffic did.',plat:'JMeter · BlazeMeter',scale:'Concurrent user load',cls:'Source',t:'t-src',url:'https://github.com/Tuhingits/PerformanceTesting_on_PCUKchatbotchatbot',role:['Load and stress test plans in JMeter','Response time and throughput analysis','Cloud execution via BlazeMeter']}
];

/* ---------- render systems ---------- */
var tb=$('#sysBody');
tb.innerHTML=SYS.map(function(s,i){
  return '<tr data-i="'+i+'" tabindex="0">'+
    '<td class="id">'+s.id+'</td>'+
    '<td class="nm"><b>'+s.nm+'</b><span>'+s.desc.slice(0,72)+'…</span></td>'+
    '<td class="mono" style="font-size:11.5px">'+s.plat+'</td>'+
    '<td class="mono" style="font-size:11.5px">'+s.scale+'</td>'+
    '<td><span class="tag '+s.t+'">'+s.cls+'</span></td></tr>';
}).join('');

/* ---------- drawer ---------- */
var drawer=$('#drawer'),scrim=$('#scrim');
function openSys(i){
  var s=SYS[i];
  $('#dTitle').textContent=s.nm;
  $('#dMeta').innerHTML='<dt>ID</dt><dd class="mono">'+s.id+'</dd><dt>Platform</dt><dd>'+s.plat+'</dd><dt>Scale</dt><dd>'+s.scale+'</dd><dt>Class</dt><dd><span class="tag '+s.t+'">'+s.cls+'</span></dd>';
  $('#dDesc').innerHTML=s.desc;
  $('#dRole').innerHTML='<div class="mono" style="font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--dim);margin-bottom:8px">My role</div><ul class="feed">'+s.role.map(function(r){return '<li><span class="dot dot--b"></span><span>'+r+'</span></li>'}).join('')+'</ul>';
  $('#dLink').href=s.url;
  drawer.classList.add('open');scrim.classList.add('on');drawer.setAttribute('aria-hidden','false');
}
function closeSys(){drawer.classList.remove('open');scrim.classList.remove('on');drawer.setAttribute('aria-hidden','true')}
tb.addEventListener('click',function(e){var r=e.target.closest('tr');if(r)openSys(+r.dataset.i)});
tb.addEventListener('keydown',function(e){if(e.key==='Enter'){var r=e.target.closest('tr');if(r)openSys(+r.dataset.i)}});
$('#dClose').addEventListener('click',closeSys);
scrim.addEventListener('click',closeSys);

/* ---------- view switching ---------- */
/* Re-trigger a CSS animation by forcing reflow — used so entrance
   animations replay every time a module is opened, not just on load. */
function replay(el){el.style.animation='none';void el.offsetWidth;el.style.animation=''}

function countUp(el){
  var target=+el.dataset.c||0, suf=el.dataset.s||'';
  var fmt=function(n){return n>=1000?n.toLocaleString('en-US'):String(n)};
  if(reduce){el.textContent=fmt(target)+suf;return}
  var t0=performance.now(), dur=1100;
  (function step(now){
    var p=Math.min((now-t0)/dur,1), e=1-Math.pow(1-p,3);
    el.textContent=fmt(Math.round(target*e))+(p===1?suf:'');
    if(p<1)requestAnimationFrame(step);
  })(performance.now());
}

function onEnter(v){
  if(v==='dashboard'){
    $$('.kpi b[data-c]').forEach(function(el,i){
      el.textContent='0';
      setTimeout(function(){countUp(el)},120+i*70);
    });
    runLog();
  }
  if(v==='suites'){
    $$('.bar i').forEach(function(b,i){
      b.style.width='0';
      setTimeout(function(){b.style.width=(b.dataset.w||'100')+'%'},150+i*90);
    });
  }
  if(v==='systems'){
    $$('#sysBody tr').forEach(function(r,i){r.style.animationDelay=(i*45)+'ms';replay(r)});
  }
}

function go(v){
  $$('.view').forEach(function(s){s.classList.toggle('on',s.id==='v-'+v)});
  $$('#nav button').forEach(function(b){
    var on=b.dataset.v===v;b.classList.toggle('on',on);b.setAttribute('aria-selected',String(on));
  });
  var view=$('#v-'+v);
  if(view)$$('.view.on > *',view.parentNode).forEach(replay);
  $('#main').scrollTop=0;closeSys();
  onEnter(v);
  if(history.replaceState)history.replaceState(null,'','#'+v);
}
$('#nav').addEventListener('click',function(e){var b=e.target.closest('button');if(b)go(b.dataset.v)});
$$('[data-go]').forEach(function(b){b.addEventListener('click',function(){go(b.dataset.go)})});

/* ---------- suites accordion ---------- */
$$('.suite__h').forEach(function(h){
  h.addEventListener('click',function(){h.parentNode.classList.toggle('open')});
});

/* ---------- command palette ---------- */
var MODS=[{v:'dashboard',n:'Dashboard'},{v:'suites',n:'Test Suites'},{v:'systems',n:'Systems Under Test'},{v:'triage',n:'Triage Reference'},{v:'releases',n:'Release History'},{v:'toolchain',n:'Toolchain'},{v:'contact',n:'Contact'}];
var pal=$('#pal'),palIn=$('#palInput'),palList=$('#palList'),sel=0,shown=MODS;
function drawPal(){
  palList.innerHTML=shown.map(function(m,i){return '<li data-v="'+m.v+'" class="'+(i===sel?'sel':'')+'">'+m.n+'<span class="kbd">↵</span></li>'}).join('')||'<li style="color:var(--dim)">No module found</li>';
}
function openPal(){pal.classList.add('on');palIn.value='';shown=MODS;sel=0;drawPal();palIn.focus()}
function closePal(){pal.classList.remove('on')}
$('#palBtn').addEventListener('click',openPal);
palIn.addEventListener('input',function(){
  var q=palIn.value.toLowerCase();
  shown=MODS.filter(function(m){return m.n.toLowerCase().indexOf(q)>-1});sel=0;drawPal();
});
palList.addEventListener('click',function(e){var li=e.target.closest('li');if(li&&li.dataset.v){go(li.dataset.v);closePal()}});
document.addEventListener('keydown',function(e){
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();pal.classList.contains('on')?closePal():openPal();return}
  if(e.key==='Escape'){closePal();closeSys();return}
  if(!pal.classList.contains('on'))return;
  if(e.key==='ArrowDown'){e.preventDefault();sel=Math.min(sel+1,shown.length-1);drawPal()}
  if(e.key==='ArrowUp'){e.preventDefault();sel=Math.max(sel-1,0);drawPal()}
  if(e.key==='Enter'&&shown[sel]){go(shown[sel].v);closePal()}
});

/* ---------- clock + last-run counter ---------- */
var runAt=Date.now();
function tick(){
  var d=new Date();
  $('#clock').textContent=d.toLocaleTimeString('en-GB',{timeZone:'Asia/Dhaka',hour12:false})+' +06';
  var s=Math.floor((Date.now()-runAt)/1000);
  $('#uptime').textContent = s<5 ? 'just now' : (s<60 ? s+'s ago' : Math.floor(s/60)+'m ago');
}
tick();setInterval(tick,1000);

/* ---------- run log ---------- */
var LOG=[
 '<span class="d">$</span> <span class="b">pytest</span> suites/regression --env=staging',
 '<span class="d">collected 128 tests · web · android · ios</span>',
 '',
 '<span class="p">PASS</span>  auth/login_valid_credentials',
 '<span class="p">PASS</span>  pharmacy/invoice_stock_deduction',
 '<span class="p">PASS</span>  pharmacy/expiry_batch_alert',
 '<span class="f">FAIL</span>  checkout/discount_boundary  <span class="d">→ filed S2, fixed</span>',
 '<span class="p">PASS</span>  api/orders_schema  <span class="d">(newman · 42 requests)</span>',
 '<span class="p">PASS</span>  mobile/release_candidate_smoke  <span class="d">(android 14)</span>',
 '<span class="w">LOAD</span>  jmeter · 500 users · p95 1.8s · errors 0.2%',
 '',
 '<span class="p">127 passed</span> · <span class="f">1 failed</span> · defect triaged · <span class="p">release: GO</span>'
];
var logEl=$('#log'),logTimer=null;
function runLog(){
  runAt=Date.now();
  if(logTimer){clearTimeout(logTimer);logTimer=null}
  if(reduce){logEl.innerHTML=LOG.join('\n');return}
  var i=0;logEl.innerHTML='';
  (function next(){
    if(i>=LOG.length){logEl.innerHTML+='\n<span class="d">$</span> <span class="cur">▊</span>';return}
    logEl.innerHTML+=(i?'\n':'')+LOG[i++];
    logTimer=setTimeout(next,i<3?170:110);
  })();
}

/* ---------- boot ---------- */
var BOOT=[
 'Loading test environment ......... <span class="ok">OK</span>',
 'Mounting suites (6) ............. <span class="ok">OK</span>',
 'Indexing systems under test (10)  <span class="ok">OK</span>',
 'Connecting defect tracker ....... <span class="ok">OK</span>',
 'Verifying credentials ........... <span class="ok">OK</span>',
 '',
 '<span class="ok">READY.</span> It is now safe to review this candidate.'
];
var bootEl=$('#boot'),lines=$('#bootlines'),booted=false,bootTimer=null;
function finish(){
  if(booted)return;booted=true;
  if(bootTimer){clearTimeout(bootTimer);bootTimer=null}
  bootEl.classList.add('done');
  $('#app').hidden=false;
  var h=(location.hash||'').replace('#','');
  var start=(h&&MODS.some(function(m){return m.v===h}))?h:'dashboard';
  go(start);
}
function playBoot(){
  booted=false;
  bootEl.classList.remove('done');
  lines.innerHTML='';
  if(reduce){finish();return}
  var bi=0;
  (function nb(){
    if(bi>=BOOT.length){bootTimer=setTimeout(finish,480);return}
    lines.innerHTML+=BOOT[bi++]+'<br />';
    bootTimer=setTimeout(nb,bi<3?150:190);
  })();
}
// Skip on click or key — bound once, guarded by the `booted` flag.
document.addEventListener('keydown',function(){if(!booted)finish()});
bootEl.addEventListener('click',function(){if(!booted)finish()});
$('#replayBtn').addEventListener('click',playBoot);
playBoot();

/* ---------- custom cursor: inspector reticle ----------
   Dot tracks the pointer exactly; the ring lags behind it and the
   label reads out coordinates — or what the hovered element does.
   Fine pointers only, so touch devices keep native behaviour.      */
(function cursor(){
  if(!matchMedia('(pointer: fine)').matches)return;

  var dot=$('#curDot'),ring=$('#curRing'),label=$('#curLabel'),b=document.body;
  b.classList.add('cur-on');

  var mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my,seen=false;

  function labelFor(el){
    var a=el.closest('a[href]'),btn=el.closest('button'),row=el.closest('#sysBody tr');
    if(row)return 'Inspect';
    if(a){
      var h=a.getAttribute('href')||'';
      if(h.indexOf('mailto:')===0)return 'Compose';
      if(h.indexOf('tel:')===0)return 'Call';
      if(a.hasAttribute('download'))return 'Download';
      if(a.target==='_blank')return 'Open ↗';
      return 'Open';
    }
    if(btn)return btn.id==='replayBtn'?'Replay':'Select';
    if(el.closest('input,textarea'))return 'Type';
    return null;
  }

  addEventListener('mousemove',function(e){
    mx=e.clientX;my=e.clientY;
    if(!seen){seen=true;rx=mx;ry=my;[dot,ring,label].forEach(function(n){n.classList.remove('cur--hide')})}

    var el=e.target,txt=labelFor(el);
    b.classList.toggle('cur-hot',!!txt);
    label.textContent=txt||(mx+','+my);
    // native caret is better inside fields — hide ours there
    var inField=!!el.closest('input,textarea');
    dot.classList.toggle('cur--hide',inField);
    ring.classList.toggle('cur--hide',inField);
  },{passive:true});

  addEventListener('mousedown',function(){b.classList.add('cur-down')});
  addEventListener('mouseup',function(){b.classList.remove('cur-down')});
  addEventListener('mouseleave',function(){[dot,ring,label].forEach(function(n){n.classList.add('cur--hide')})});
  addEventListener('mouseenter',function(){[dot,ring,label].forEach(function(n){n.classList.remove('cur--hide')})});

  (function frame(){
    // ring eases toward the pointer; reduced-motion pins it exactly
    var k=reduce?1:.19;
    rx+=(mx-rx)*k; ry+=(my-ry)*k;
    dot.style.transform='translate3d('+mx+'px,'+my+'px,0)';
    ring.style.transform='translate3d('+rx+'px,'+ry+'px,0)';
    label.style.transform='translate3d('+mx+'px,'+my+'px,0)';
    requestAnimationFrame(frame);
  })();
})();
})();
