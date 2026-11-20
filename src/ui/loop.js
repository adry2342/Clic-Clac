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
  if(Core.game&&Core.scene!=='menu')Core.game.draw(ctx);else drawMenuFx(ctx,dt);
  Feel.draw(ctx);
  drawParts(ctx,running?dt:0);
  if(Core.wipe>0){Core.wipe-=dt;const p=1-Math.max(0,Core.wipe)/0.55;ctx.setTransform(1,0,0,1,0,0);
    for(let y=0;y<H;y+=16)for(let x=0;x<W;x+=16){const d=(x/W)*0.5+(y/H)*0.2;const t=Math.min(1,Math.max(0,(p-d)/0.3));const sz=Math.round(18*(1-smooth(t)));
      if(sz>0){rr(ctx,x+8-sz/2,y+8-sz/2,sz,sz,(x/16+y/16)%2?C.lav:C.pink,Math.min(3,sz>>1));}}}
  if(Core.scene==='play'){
    const g=Core.game,txt=g.unit+' '+Math.min(g.total,g.progress()+1)+' / '+g.total+(Core.run.streak>=3?'  ·  Racha '+Core.run.streak:'');
    const prac=g.inPractice();const key=txt+prac;
    const cue=g.cue?g.cue():'';if(cue!==lastCue){lastCue=cue;cueT=0;const e=$('hCue');e.textContent=cue;e.hidden=!cue;e.classList.remove('dim');void e.offsetWidth;e.style.animation='none';void e.offsetWidth;e.style.animation='';}
    else if(cue&&(cueT+=dt)>3&&cueT-dt<=3)$('hCue').classList.add('dim');
    if(key!==lastHud){lastHud=key;$('hProg').textContent=prac?'Práctica':txt;$('hPrac').hidden=!prac;}
  }
  requestAnimationFrame(frame);
}
buildMenu();setScene('menu');requestAnimationFrame(frame);
window.__cc={Snd,Core,openGame,press,release,showResults,GAMES,CONTAINERS};
