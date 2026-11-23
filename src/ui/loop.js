let last=performance.now(),lastCue='',cueT=0;
function frame(now){
  const dt=Math.min(0.05,(now-last)/1000);last=now;Core.time+=dt;pollPads();
  if(Core.scene==='play'&&!Core.paused&&Core.ready>0){Core.ready-=dt;const el=$('ready');
    if(Core.ready<=0.55&&el.className!=='r2'){el.textContent='¡Ya!';el.className='r2';}if(Core.ready<=0)el.hidden=true;}
  if(Core.scene==='play'&&!Core.paused&&Core.cardWait>0){Core.cardWait-=dt;if(Core.cardWait<=0)openCard();}
  const running=Core.scene==='play'&&!Core.paused&&!(Core.ready>0)&&!Core.card&&!(Core.cardWait>0);
  // parada de impacto: el mundo se congela un instante tras un Perfecto
  if(running){if(Feel.stopT>0)Feel.stopT-=dt;else{Core.game.update(dt);Anim.update(dt);}Feel.update(dt);}
  if(Core.bannerT>0&&!Core.paused){Core.bannerT-=dt;const el=$('phase');if(Core.bannerT<=0.3&&el.className!=='out')el.className='out';if(Core.bannerT<=0||Core.scene!=='play')el.hidden=true;}
  if((Core.scene==='intro'||Core.card)&&Demo&&!Core.paused)demoStep(dt);
  ctx.setTransform(1,0,0,1,0,0);let sx=0;if(Core.shake>0&&running){Core.shake-=dt;sx=(Math.floor(Core.time*60)%2)?1:-1;}
  ctx.translate(sx,0);
  if(Core.scene==='intro')drawIntroBg(ctx);else if(Core.game&&Core.scene!=='menu')Core.game.draw(ctx);else drawMenuFx(ctx,dt);
  Feel.draw(ctx);
  drawParts(ctx,running?dt:0);
  Trans.step(dt);
  if(Core.scene==='play'){
    const g=Core.game,txt=g.unit+' '+Math.min(g.total,g.progress()+1)+' / '+g.total+(Core.run.streak>=3?'  ·  Racha '+Core.run.streak:'');
    const prac=g.inPractice();const key=txt+prac;
    const cue=g.cue?g.cue():'';if(cue!==lastCue){lastCue=cue;cueT=0;const e=$('hCue');e.textContent=cue;e.hidden=!cue;e.classList.remove('dim');void e.offsetWidth;e.style.animation='none';void e.offsetWidth;e.style.animation='';}
    else if(cue&&(cueT+=dt)>3&&cueT-dt<=3)$('hCue').classList.add('dim');
    if(key!==lastHud){lastHud=key;$('hProg').textContent=prac?'Práctica':txt;$('hPrac').hidden=!prac;}
  }
  requestAnimationFrame(frame);
}
buildMenu();setScene('menu');scenePre();
// al cargar la página se empieza tapado y los cuadraditos se retiran para descubrir el menú
Trans.run(null,{covered:true,hold:0.45,outD:1.1,reveal:sceneEnter});requestAnimationFrame(frame);
window.__cc={Snd,Core,Trans,openGame,press,release,showResults,GAMES,CONTAINERS};
