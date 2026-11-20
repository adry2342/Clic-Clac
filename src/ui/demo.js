/* ---------- demostración animada en la intro ---------- */
let Demo=null;const demoFull=mk(W,H),demoCv=$('demo'),demoCx=demoCv.getContext('2d');
// La intro es un vídeo corto que se juega solo: primero un intento perfecto ("Así") y luego uno con
// error ("Si te retrasas…"), con el resultado a la vista. Así no hacen falta rondas de práctica.
const TSEQ=[['bien','pelar'],['bien','cortar'],['bien','huevo'],['bien','batir'],['bien','vuelta'],['mal','huevo']];
function demoStart(id,phase,only){
  // la tortilla enseña sus gestos, uno por vuelta del vídeo
  const SQ=id==='tortilla'?TSEQ:GAMES[id].seq;if(only){TDEMO=only;}else if(SQ){const q=SQ[demoN%SQ.length];phase=q[0];TDEMO=q[1];}demoN++;
  Demo={id,phase:phase||'bien',g:GAMES[id].make(mulberry32(7+Math.floor(Math.random()*4))),only,t:0,down:false,flash:0,word:'',dt:0,pend:[],last:null,doneT:0};
  DEMO=true;try{for(let w=GAMES[id].warm||0;w>0;w-=1/30)Demo.g.update(1/30);}finally{DEMO=false;}Demo.last=null;
  $('demoTag').textContent=Demo.phase==='bien'?'✓ Así sí':'✕ Así no: con retraso';$('demoTag').className='demo-tag '+Demo.phase;demoWord('','');
}
function demoWord(w,cls){const el=$('demoNow');if(el.textContent!==w)el.textContent=w;el.className=cls||'';el.hidden=!w;}
function demoAct(D,a){
  if(a==='tap'){D.g.press();D.g.release&&D.g.release();D.flash=0.32;D.word='¡Toca!';}
  else if(a==='down'){D.g.press();D.down=true;D.word='Mantén…';}
  else if(a==='up'){D.g.release();D.down=false;D.flash=0.45;D.word='¡Suelta!';}
}
function demoStep(dt){
  const D=Demo,G=GAMES[D.id];D.t+=dt;D.dt=dt;
  if(D.t>G.loopT+2||(D.last&&D.last.t>1.6)){demoStart(D.id,D.phase==='bien'?'mal':'bien',D.only);return;}
  DEMO=true;
  try{
    // al acertar o fallar, la imagen se congela un momento para que se vea bien el resultado
    if(!D.last||D.last.t>1.15)D.g.update(dt);
    if(!D.last){const a=G.bot(D.g,D);
      if(a){if(D.phase==='mal'&&(a!=='down'||G.lagDown))D.pend.push({a,at:D.t+(G.lag||0.12)});else demoAct(D,a);}
      for(const q of D.pend.slice()){if(D.t>=q.at){demoAct(D,q.a);D.pend.splice(D.pend.indexOf(q),1);}}}
    else if(D.down){D.g.release();D.down=false;}
  }finally{DEMO=false;}
  D.flash=Math.max(0,D.flash-dt);
  const pressed=D.down||(G.gesture!=='hold'&&D.word==='¡Toca!'&&D.flash>0.16);
  $('hand').classList.toggle('down',pressed);
  if(D.last){D.last.t+=dt;const L=D.last;demoWord(L.j==='P'?'★ ¡Perfecto!':(JUDGE[L.j].sym+' '+JUDGE[L.j].word.replace(/[¡!]/g,'')+(L.detail?' · '+L.detail:'')),'j'+L.j);}
  else demoWord(D.down||D.flash>0?D.word:'','');
  const fc=demoFull.getContext('2d');D.g.draw(fc);
  demoCx.clearRect(0,0,W*2,H*2);demoCx.drawImage(demoFull,0,0,W,H,0,0,W*2,H*2); // el vídeo enseña la escena entera
}
