/* ---------- escena y escalado ---------- */
const stage=$('stage'),cv=$('c'),ctx=cv.getContext('2d');ctx.imageSmoothingEnabled=false;
function fit(){
  const cs=getComputedStyle(document.body);
  const aw=document.body.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight)-8;
  const ah=document.body.clientHeight-8;
  let s=Math.min(aw/W,ah/H);if(s>=2)s=Math.floor(s);s=Math.max(0.75,s);
  Core.s=s;stage.style.setProperty('--u',s*W/480);stage.style.setProperty('--s',s);stage.style.width=(W*s)+'px';stage.style.height=(H*s)+'px';
  $('rotate').hidden=!(innerHeight>innerWidth&&innerWidth<760);
}
addEventListener('resize',fit);fit();

/* ---------- menú ---------- */
function bestOf(id){return Save.data.games[id]||null;}
function buildMenu(){
  const wrap=$('cards');wrap.innerHTML='';
  for(const id of Object.keys(GAMES)){
    const g=GAMES[id],b=document.createElement('button');b.className='card';b.dataset.id=id;
    const th=mk(W*2,H*2);const full=mk(W,H);const inst=g.make(mulberry32(5),true);inst.draw(full.getContext('2d'));
    th.getContext('2d').drawImage(full,0,0,W,H,0,0,W*2,H*2); // escena entera (se reduce suave en la tarjeta)
    const bs=bestOf(id);
    b.innerHTML='<span class="nm">'+g.name+'</span><span class="best">'+(bs?('Récord '+bs.score+' pts · '+bs.plays+' partidas'):'Sin jugar todavía')+'</span>';
    b.prepend(th);
    if(bs){const st=document.createElement('span');st.className='stamp'+(bs.rank==='S+'?' splus':'');st.textContent=bs.rank;b.appendChild(st);}
    b.addEventListener('click',()=>openGame(id));wrap.appendChild(b);
  }
  for(const s of SOON){
    const b=document.createElement('button');b.className='card';b.disabled=true;
    const th=mk(128,72);const t=th.getContext('2d');const full=mk(W,H);const f=full.getContext('2d');R(f,0,0,64,36,C.lavL);for(let y=0;y<36;y+=6)for(let x=((y/6)%2)*6;x<64;x+=12)rr(f,x,y,6,6,C.lav,1);dith(f,22,28,20,2,C.lavD);obj(f,l=>s.icon(l,32,18));t.drawImage(full,0,0,64,36,0,0,128,72);
    b.appendChild(th);b.insertAdjacentHTML('beforeend','<span class="nm">'+s.name+'</span><span class="best">En preparación</span><span class="soon">Próximamente</span>');
    wrap.appendChild(b);
  }
}
function syncToggles(){$('tSfx').setAttribute('aria-pressed',String(Save.data.prefs.sfx));$('tMus').setAttribute('aria-pressed',String(Save.data.prefs.music));}
$('tSfx').addEventListener('click',()=>{Save.data.prefs.sfx=!Save.data.prefs.sfx;Save.write();syncToggles();Snd.init();Snd.ui();});
$('tMus').addEventListener('click',()=>{Save.data.prefs.music=!Save.data.prefs.music;Save.write();syncToggles();Snd.init();});
syncToggles();

(function(){const h=$('hand').getContext('2d');const art=['....XX......','...XWWX.....','...XWWX.....','...XWWXXX...','...XWWXWWXX.','.XXXWWXWWXWX','XWWXWWWWWXWX','XWWWWWWWWWWX','.XWWWWWWWWWX','..XWWWWWWWX.','...XWWWWWWX.','....XXXXXX..'];
  art.forEach((row,y)=>[...row].forEach((ch,x)=>{if(ch==='X')R(h,x,y,1,1,C.out);else if(ch==='W')R(h,x,y,1,1,'#fff1e6');}));})();

/* ---------- flujo ---------- */
function show(id,on){$(id).hidden=!on;}
function wipe(){if(!reduce)Core.wipe=0.55;}
function setScene(s){
  Core.scene=s;stage.classList.toggle('menubg',s==='menu');show('menu',s==='menu');show('intro',s==='intro');show('hud',s==='play');show('results',s==='results');show('pause',false);Core.paused=false;
}
function openGame(id){
  Snd.init();Snd.ui();Snd.waterStop();
  const seed=(Math.random()*1e9)>>>0;Core.gameId=id;Core.parts=[];TDEMO=null;
  Core.run={id,seed,counts:{P:0,B:0,R:0,F:0},n:0,pts:0,streak:0,best:0};
  Core.game=GAMES[id].make(mulberry32(seed));Snd.setMood(Core.game.mood);
  $('inName').textContent=GAMES[id].name;demoStart(id);$('inGest').innerHTML=GAMES[id].chips||(GAMES[id].gesture==='mix'?'<b style="background:var(--pink)">Toca</b> <b>Toca a ritmo</b> <b style="background:var(--mint)">Mantén y suelta</b>':GAMES[id].gesture==='hold'?'<b>Mantén pulsado</b> y <b>suelta</b>':'<b>Toca una vez</b> en el momento justo');$('inHint').textContent=GAMES[id].hint;$('hName').textContent=GAMES[id].name;
  lastHud='';setScene('intro');wipe();
}
function startPlay(){Demo=null;Feel.reset();$('phase').hidden=true;Core.bannerT=0;setScene('play');Core.ready=1.5;$('ready').hidden=false;$('ready').textContent='¿Listo?';$('ready').className='r1';}
function toMenu(){Feel.reset();$('ready').hidden=true;$('phase').hidden=true;Core.bannerT=0;Core.ready=0;Snd.waterStop();Snd.sizzle(false);$('hCue').hidden=true;lastCue='';Snd.setMood('menu');Core.game=null;buildMenu();setScene('menu');wipe();const f=document.querySelector('.card:not(:disabled)');f&&f.focus({preventScroll:true});}
function rankOf(r){if(r.n===0)return 'D';if(r.counts.P===r.n)return 'S+';const p=r.pts/(100*r.n)*100;return p>=95?'S':p>=85?'A':p>=70?'B':p>=50?'C':'D';}
function showResults(){
  if(Core.scene!=='play')return;
  const r=Core.run,rk=rankOf(r),pct=r.n?r.pts/(100*r.n)*100:0;
  const prev=bestOf(r.id);const better=!prev||r.pts>prev.score||RANKS.indexOf(rk)>RANKS.indexOf(prev.rank);
  const rec=prev?{...prev}:{rank:'D',score:0,plays:0,splus:0};
  rec.plays++;if(rk==='S+')rec.splus++;if(!prev||r.pts>prev.score)rec.score=r.pts;if(!prev||RANKS.indexOf(rk)>RANKS.indexOf(prev.rank))rec.rank=rk;
  Save.data.games[r.id]=rec;Save.write();
  $('rName').textContent=GAMES[r.id].name;
  const rr_=$('rRank');rr_.textContent=rk;rr_.dataset.r=rk;$('rMsg').textContent=RMSG[rk];
  $('rTally').innerHTML=['P','B','R','F'].map(j=>'<li><span>'+JUDGE[j].sym+' '+JUDGE[j].word.replace(/[¡!]/g,'')+'</span><b>'+r.counts[j]+'</b></li>').join('');
  $('rMeta').textContent='Precisión '+pct.toFixed(1).replace('.',',')+' % · '+r.pts+' pts · Racha máx. '+r.best+' · Semilla '+r.seed;
  const e=r.early||0,l=r.late||0;let tip='';
  if(e+l>=2){tip=e>l*1.5?'Tiendes a adelantarte: espera un pelín más.':l>e*1.5?'Tiendes a llegar tarde: anticípate un poco.':'Tus fallos se reparten entre pronto y tarde: vas bien encaminado.';}
  $('rTip').textContent=tip?('Pronto '+e+' · Tarde '+l+' · '+tip):'';$('rTip').hidden=!tip;
  $('rRec').hidden=!(better&&prev);
  setScene('results');
  if(rk==='S+'||rk==='S')setTimeout(()=>Snd.fanfare(rk),350);
  setTimeout(()=>$('again').focus({preventScroll:true}),50);
}
function pause(on){if(Core.scene!=='play')return;if(on)release();Core.paused=on;show('pause',on);if(on){Snd.waterStop();Snd.sizzle(false);$('resume').focus({preventScroll:true});}}
$('again').addEventListener('click',()=>openGame(Core.run.id));
$('toMenu').addEventListener('click',toMenu);
$('resume').addEventListener('click',()=>pause(false));
$('quit').addEventListener('click',toMenu);
$('pauseBtn').addEventListener('click',e=>{e.stopPropagation();pause(true);});

/* ---------- un solo botón ---------- */
function release(){if(Core.scene==='play'&&!Core.paused&&Core.game.release)Core.game.release();}
function press(){Snd.init();if(Core.scene==='intro'){startPlay();return;}if(Core.scene==='play'&&!Core.paused&&!(Core.ready>0)&&!(Core.bannerT>0))Core.game.press();}
stage.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;e.preventDefault();press();});
addEventListener('pointerup',release);addEventListener('pointercancel',release);
addEventListener('keyup',e=>{if(e.key==='Escape'||e.key==='Tab')return;release();});
addEventListener('blur',release);
addEventListener('keydown',e=>{
  if(e.repeat)return;
  if(e.key==='Escape'){if(Core.scene==='play')pause(!Core.paused);else if(Core.scene==='intro')toMenu();return;}
  if(e.key==='Tab'||e.metaKey||e.ctrlKey||e.altKey)return;
  if(Core.scene==='intro'||(Core.scene==='play'&&!Core.paused)){e.preventDefault();press();}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&Core.scene==='play'&&!Core.paused)pause(true);});
const padPrev={};
function pollPads(){
  const ps=navigator.getGamepads?navigator.getGamepads():[];
  for(const p of ps){if(!p)continue;const prev=padPrev[p.index]||[];const now=p.buttons.map(b=>b.pressed);
    if(now.some((v,i)=>v&&!prev[i])){
      if(Core.scene==='menu'){const f=document.activeElement&&document.activeElement.classList.contains('card')?document.activeElement:document.querySelector('.card:not(:disabled)');f&&f.click();}
      else if(Core.scene==='results'){(document.activeElement&&document.activeElement.tagName==='BUTTON'?document.activeElement:$('again')).click();}
      else if(Core.paused)pause(false);else press();
    }
    if(now.some((v,i)=>!v&&prev[i])&&!now.some(v=>v))release();
    padPrev[p.index]=now;}
}

/* ---------- bucle ---------- */
let lastHud='';
