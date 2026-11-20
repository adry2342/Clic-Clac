/* ---------- núcleo ---------- */
const JUDGE={P:{pts:100,word:'¡Perfecto!',sym:'★'},B:{pts:70,word:'Bien',sym:'●'},R:{pts:30,word:'Regular',sym:'◆'},F:{pts:0,word:'Fallo',sym:'✕'}};
const RANKS=['D','C','B','A','S','S+'];
const RMSG={'S+':'¡Todo perfecto! Maestría total.','S':'Casi perfecto. El S+ está a un paso.','A':'¡Muy bien!','B':'Bien hecho.','C':'Vas cogiendo el truco.','D':'Sigue practicando, ya sale.'};
const Core={scene:'menu',game:null,run:null,paused:false,parts:[],shake:0,time:0,s:3,
  judge(j,x,y,practice,detail){
    if(DEMO){if(Demo&&!Demo.last)Demo.last={j,detail:detail||'',t:0};return;}
    Snd.judge(j);
    // el cartel anterior se aparta y se desvanece deprisa para que nunca se solapen dos
    const now_=performance.now();for(const o of $('stage').querySelectorAll('.pop:not(.old)'))if(now_-(+o.dataset.t||0)>150)o.classList.add('old');
    const el=document.createElement('div');el.className='pop '+j+(practice?' prac':'');el.dataset.t=now_;
    // el cartel sube y se aparta del punto de impacto para no tapar lo que acabas de hacer
    const px_=Math.max(34,Math.min(W-34,x)),py_=Math.max(40,y-14);
    el.style.left=(px_*this.s)+'px';el.style.top=(py_*this.s)+'px';
    el.innerHTML='<b>'+JUDGE[j].sym+' '+JUDGE[j].word+'</b>'+(detail?'<small>'+detail+'</small>':'');
    $('stage').appendChild(el);setTimeout(()=>el.remove(),1300);
    if(j==='P'){this.sparkle(x,y+12);buzz(12);Feel.stop(0.055);Feel.ring(x,y+14,C.butter,18);if(this.run&&this.run.streak>0&&(this.run.streak+1)%5===0)Feel.confetti(x,y+10,22);}
    else if(j==='B'){Feel.ring(x,y+14,C.mint,12);}
    else if(j==='F'){Feel.puff(x,y+16,5,'#d8d0e6');}
    if(j==='F'&&!reduce)this.shake=0.12;
    if(practice)return;
    const r=this.run;r.counts[j]++;
    // tendencia: ¿sueles adelantarte o pasarte?
    if(detail&&j!=='P'){if(/[◀▼]/.test(detail))r.early=(r.early||0)+1;else if(/[▶▲]/.test(detail))r.late=(r.late||0)+1;}r.n++;r.pts+=JUDGE[j].pts;r.streak=(j==='P')?r.streak+1:0;r.best=Math.max(r.best,r.streak);
  },
  sparkle(x,y){if(DEMO)return;for(let i=0;i<9;i++){const a=i/9*Math.PI*2+Math.random()*0.4,s=22+Math.random()*28;this.parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-12,g:30,life:.55+Math.random()*.3,t:0,kind:'star',col:i%3?C.butter:C.white});}},
  drops(x,y,n){if(DEMO)return;for(let i=0;i<n;i++){this.parts.push({x:x+(Math.random()-.5)*6,y,vx:(Math.random()-.5)*70,vy:-30-Math.random()*45,g:240,life:.8,t:0,kind:'drop',col:'#9fd5ff'});}},
  // al terminar: un momento para ver la última nota, cartel de fin y luego los resultados
  finish(){setTimeout(()=>{if(this.scene==='play')this.banner('Fin','¡Terminado!','Ahora verás tu nota…',2.2);},700);setTimeout(()=>showResults(),3000);},
  // cartel de cambio de fase: bloquea los clics mientras se lee
  bannerT:0,
  // con demo: en vez de un cartel que se va solo, se abre una ficha con el vídeo de la fase nueva y esperas a pulsar
  banner(tag,title,sub,dur,demo){if(DEMO)return false;if(demo&&this.scene==='play'){this.cardWait=1.1;this.cardInfo={tag,title,sub,demo};return true;}dur=dur||1.9;this.bannerT=dur;const el=$('phase');el.querySelector('span').textContent=tag;el.querySelector('b').textContent=title;el.querySelector('small').textContent=sub||'';el.className='';el.hidden=false;void el.offsetWidth;Feel.irisOpen(W/2,H/2,0.9);Snd.cap&&Snd.cap();return false;},
  card:false,cardWait:0,cardInfo:null,
  // aviso suave que no puntúa (p. ej. cuando las pistas rosas se desvanecen)
  note(x,y,txt){if(DEMO)return;const el=document.createElement('div');el.className='pop N';const px_=Math.max(40,Math.min(W-40,x)),py_=Math.max(30,y);
    el.style.left=(px_*this.s)+'px';el.style.top=(py_*this.s)+'px';el.innerHTML='<b>'+txt+'</b>';$('stage').appendChild(el);setTimeout(()=>el.remove(),1300);},
  // pistas que se desvanecen: la primera vez se ven las marcas rosas; después se apagan y se juega a ojo
  hint(){return {a:1,f:-1,fade(){if(this.f<0&&this.a>0)this.f=0;},step(dt){if(this.f>=0){this.f+=dt;this.a=Math.max(0,1-this.f/0.9);}return this.a;}};},
  // clic de más (sin nada que acertar): cuenta como fallo para que no compense aporrear
  waste(x,y,det){this.judge('F',x,y,false,det);}
};

