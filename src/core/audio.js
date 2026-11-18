/* ---------- guardado ---------- */
const Save={data:{v:1,prefs:{sfx:true,music:true},games:{}},
  load(){try{const d=JSON.parse(localStorage.getItem('cliclac.v1'));if(d&&d.v===1)this.data=Object.assign(this.data,d);}catch(e){}},
  write(){try{localStorage.setItem('cliclac.v1',JSON.stringify(this.data));}catch(e){}}};
Save.load();

/* ---------- sonido y música ---------- */
/* Canciones: corcheas, 8 compases (64 pasos), 4 acordes (uno por compás, se repiten). Semitonos sobre root. */
const SONGS={
  menu:{root:349.23,bpm:80,ch:[[0,4,7,11],[4,7,11,14],[5,9,12,16],[7,11,14,16]],
    mel:'12 . 9 . 7 . . 4|7 . 4 . 2 4 . .|5 . 9 . 12 . 14 .|12 . . 9 7 . . .|12 . 9 . 7 . 9 12|16 . 14 . 12 . . .|14 . 12 . 9 . 7 .|9 . . 7 . . . .'},
  botellas:{root:261.63,bpm:76,ch:[[0,4,7,11],[-3,0,4,7],[5,9,12,16],[7,11,14,16]],
    mel:'16 . . 14 12 . . .|. . 9 . 12 . 9 .|12 . 14 . 16 . . .|14 . . . 11 . . .|16 . 19 . 16 14 . .|12 . 9 . . 7 . .|9 . 12 . 14 . 12 .|11 . . 7 . . . .'},
  grapadora:{root:293.66,bpm:84,ch:[[0,3,7,10,14],[5,9,14,15],[0,3,7,10,14],[7,10,14,17]],
    mel:'12 . 10 . 7 . 10 .|9 . 7 . 5 . . .|7 . 10 . 12 . 14 .|12 . . 10 . . . .|15 . 14 . 12 . 10 .|9 . . 7 9 . . .|10 . 12 . 7 . 5 .|7 . . . . . . .'},
  tortilla:{root:329.63,bpm:78,ch:[[0,4,7,11],[-3,0,4,7],[5,9,12,16],[7,11,14,16]],
    mel:'4 . 7 . 11 . 9 .|7 . . 4 . . 2 .|0 . 4 . 9 . 12 .|11 . . 9 . 7 . .|12 . 11 . 9 . 7 .|4 . 7 . . 9 . .|11 . 9 . 7 . 4 .|7 . . . . . . .'},
  fotos:{root:311.13,bpm:82,ch:[[0,4,7,11],[4,7,11,14],[5,9,12,16],[7,11,14,16]],
    mel:'7 . 4 . 7 . 9 .|11 . . 7 . . . .|9 . 12 . 9 . 7 .|5 . . 4 . 2 . .|7 . 11 . 14 . 12 .|11 . 9 . . 7 . .|9 . 7 . 4 . 2 .|0 . . . . . . .'},
  tostadora:{root:392,bpm:72,ch:[[0,4,7,11],[-3,0,4,7],[5,9,12,16,19],[7,11,14,16]],
    mel:'7 . 9 . 11 . 12 .|7 . . 4 . 2 . .|4 . 7 . 9 . 12 .|11 . 9 . 7 . . .|14 . 12 . 11 . 9 .|7 . 4 . . 2 . .|4 . 7 . 9 . 7 .|7 . . . . . . .'}
};
Object.values(SONGS).forEach(S=>{S.m=S.mel.split('|').flatMap(b=>b.trim().split(/\s+/).map(x=>x==='.'?null:+x));});
const st2f=(S,s)=>S.root*Math.pow(2,s/12);
let DEMO=false,TDEMO=null,demoN=0;// TDEMO: fase por la que empieza el vídeo de la intro
const Snd={ctx:null,master:null,mus:null,sfxBus:null,water:null,mood:'menu',step:0,loop:0,next:0,curCh:[0,4,7],
  get sfx(){return Save.data.prefs.sfx&&!DEMO;},get music(){return Save.data.prefs.music;},
  init(){
    if(this.ctx){if(this.ctx.state==='suspended')this.ctx.resume();return;}
    try{
      const AC=window.AudioContext||window.webkitAudioContext;const c=this.ctx=new AC();
      this.master=c.createGain();this.master.gain.value=0.75;
      const comp=c.createDynamicsCompressor();comp.threshold.value=-18;comp.ratio.value=3;this.master.connect(comp);comp.connect(c.destination);
      // bus de música: filtro cálido + eco suave (sensación lo-fi)
      const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2600;lp.Q.value=0.4;
      this.mus=c.createGain();this.mus.gain.value=0.0001;this.mus.connect(lp);lp.connect(this.master);
      const dl=c.createDelay(1);dl.delayTime.value=60/80*0.75;const fb=c.createGain();fb.gain.value=0.28;const dlp=c.createBiquadFilter();dlp.type='lowpass';dlp.frequency.value=1500;
      this.echo=c.createGain();this.echo.gain.value=0.35;this.echo.connect(dl);dl.connect(dlp);dlp.connect(fb);fb.connect(dl);dlp.connect(lp);this.dl=dl;
      this.sfxBus=c.createGain();this.sfxBus.gain.value=1;this.sfxBus.connect(this.master);
      this.crackle();this.next=c.currentTime+0.15;this.fadeIn();
      setInterval(()=>this.tick(),40);
    }catch(e){this.ctx=null;}
  },
  fadeIn(){const g=this.mus.gain,t=this.ctx.currentTime;g.cancelScheduledValues(t);g.setValueAtTime(Math.max(0.0001,g.value),t);g.exponentialRampToValueAtTime(0.75,t+0.9);},
  setMood(m){
    if(m===this.mood||!SONGS[m])return;this.mood=m;if(!this.ctx){return;}
    const g=this.mus.gain,t=this.ctx.currentTime;g.cancelScheduledValues(t);g.setValueAtTime(Math.max(0.0001,g.value),t);g.exponentialRampToValueAtTime(0.0001,t+0.3);
    this.step=0;this.loop=0;this.next=t+0.35;this.dl.delayTime.setValueAtTime(60/SONGS[m].bpm*0.75,t+0.32);
    setTimeout(()=>this.ctx&&this.fadeIn(),330);
  },
  tick(){
    const c=this.ctx;if(!c)return;const now=c.currentTime;
    this.crk.gain.setTargetAtTime(this.music?0.05:0,now,0.2);
    if(!this.music||document.visibilityState!=='visible'){this.next=now+0.1;return;}
    if(this.next<now)this.next=now+0.02;
    const S=SONGS[this.mood],e=60/S.bpm/2;
    while(this.next<now+0.25){
      const s=this.step%64;this.play(S,s,this.next);
      this.next+=e*(this.step%2===0?1.14:0.86);this.step++;if(this.step%64===0)this.loop++;
    }
  },
  /* instrumentos */
  env(t,a,peak,dec,dest,end){const g=this.ctx.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(0.0001,t+dec);g.connect(dest);return g;},
  osc(type,f,t,dur,dest){const o=this.ctx.createOscillator();o.type=type;o.frequency.value=f;o.connect(dest);o.start(t);o.stop(t+dur+0.05);return o;},
  kal(f,t,vol,dest,dec){ // kalimba: cuerpo sinusoidal + "tine" agudo muy corto
    dec=dec||1.4;const g=this.env(t,0.004,vol,dec,dest);this.osc('sine',f,t,dec,g);
    const g2=this.env(t,0.002,vol*0.35,0.12,dest);this.osc('sine',f*5.4,t,0.12,g2);
    const g3=this.env(t,0.003,vol*0.18,dec*0.5,dest);this.osc('triangle',f*2,t,dec*0.5,g3);
    return g;
  },
  ep(f,t,dur,vol){ // piano eléctrico suave
    const g=this.ctx.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+0.02);g.gain.exponentialRampToValueAtTime(vol*0.45,t+0.5);g.gain.setValueAtTime(vol*0.45,t+Math.max(0.5,dur-0.4));g.gain.exponentialRampToValueAtTime(0.0001,t+dur);g.connect(this.mus);
    this.osc('sine',f,t,dur,g);const g2=this.ctx.createGain();g2.gain.value=0.35;g2.connect(g);this.osc('triangle',f*1.003,t,dur,g2);
    const b=this.env(t,0.005,vol*0.25,0.35,this.mus);this.osc('sine',f*2,t,0.35,b);
  },
  bass(f,t,dur,vol){const g=this.ctx.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+0.025);g.gain.exponentialRampToValueAtTime(vol*0.5,t+dur*0.6);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);g.connect(this.mus);this.osc('sine',f,t,dur,g);const g2=this.ctx.createGain();g2.gain.value=0.12;g2.connect(g);this.osc('triangle',f*2,t,dur,g2);},
  hiss(t,freq,dur,vol,type,dest){const s=this.ctx.createBufferSource();s.buffer=this.nbuf();const f=this.ctx.createBiquadFilter();f.type=type||'highpass';f.frequency.value=freq;const g=this.env(t,0.003,vol,dur,dest||this.mus);s.connect(f);f.connect(g);s.start(t,Math.random()*0.5);s.stop(t+dur+0.02);},
  kick(t,vol){const o=this.ctx.createOscillator();o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(42,t+0.12);const g=this.env(t,0.004,vol,0.22,this.mus);o.connect(g);o.start(t);o.stop(t+0.25);},
  crackle(){ // vinilo: chasquidos sueltos muy bajos
    const c=this.ctx,n=c.sampleRate*3,b=c.createBuffer(1,n,c.sampleRate),d=b.getChannelData(0);
    for(let i=0;i<n;i++){d[i]=(Math.random()*2-1)*0.012;if(Math.random()<0.00035){const a=(Math.random()*2-1)*0.9;for(let k=0;k<30&&i+k<n;k++)d[i+k]+=a*Math.exp(-k/5);}}
    const s=c.createBufferSource();s.buffer=b;s.loop=true;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=2500;f.Q.value=0.5;
    this.crk=c.createGain();this.crk.gain.value=0;s.connect(f);f.connect(this.crk);this.crk.connect(this.mus);s.start();
  },
  play(S,s,t){
    const bar=s>>3,pos=s&7,ch=S.ch[bar%4],e=60/S.bpm/2,odd=this.loop%2===1;this.curCh=ch;
    if(pos===0){ch.forEach((x,k)=>this.ep(st2f(S,x)/2,t+k*0.016,e*8*0.98,0.022));this.bass(st2f(S,ch[0])/4,t,e*3,0.085);this.kick(t,0.06);}
    if(pos===3&&bar%2===1)this.bass(st2f(S,ch[0])/4,t,e*1.2,0.05);
    if(pos===5){this.bass(st2f(S,ch[0]+7)/4,t,e*2.5,0.065);this.kick(t,0.04);}
    if(pos===4)this.hiss(t,1700,0.09,0.03,'bandpass');
    if(pos===2||pos===6)this.hiss(t,7000,0.05,0.016);else if(pos%2)this.hiss(t,8000,0.03,0.006);
    if(pos===6&&bar%2===0)ch.slice(1,3).forEach(x=>this.ep(st2f(S,x)/2,t,e*2,0.012));
    const m=S.m[s];
    if(m!==null&&!(odd&&Math.random()<0.22)){const g=this.kal(st2f(S,m),t,0.055,this.mus);g.connect(this.echo);}
    if(odd&&(pos===3||pos===7)&&Math.random()<0.3){const x=ch[(Math.random()*ch.length)|0]+24;this.kal(st2f(S,x),t,0.018,this.echo,0.8);}
  },
  /* efectos */
  sk(semis,delay,vol,dec){if(!this.ctx||!this.sfx)return;const S=SONGS[this.mood];this.kal(st2f(S,semis),this.ctx.currentTime+(delay||0),vol,this.sfxBus,dec||0.9);},
  tone(f,dur,type,vol,delay,f2){
    if(!this.ctx||!this.sfx)return;const t=this.ctx.currentTime+(delay||0);
    const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type||'triangle';o.frequency.setValueAtTime(f,t);
    if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur);
    g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol||0.1,t+0.012);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g);g.connect(this.sfxBus);o.start(t);o.stop(t+dur+0.03);
  },
  nbuf(){if(this._nb)return this._nb;const b=this.ctx.createBuffer(1,this.ctx.sampleRate,this.ctx.sampleRate);const d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return this._nb=b;},
  burst(freq,dur,vol,q){
    if(!this.ctx||!this.sfx)return;const t=this.ctx.currentTime;const s=this.ctx.createBufferSource();s.buffer=this.nbuf();
    const f=this.ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=freq;f.Q.value=q||2.5;const g=this.ctx.createGain();
    g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);s.connect(f);f.connect(g);g.connect(this.sfxBus);s.start(t,Math.random()*0.5);s.stop(t+dur+0.02);
  },
  // Los aciertos suenan con las notas del acorde que está sonando: siempre "encajan" con la música.
  judge(j){
    const c=this.curCh;
    if(j==='P'){[c[0],c[1],c[2],c[0]+12].forEach((x,k)=>this.sk(x+12,k*0.055,0.11-k*0.012,1.1));this.tone(2400,.25,'sine',.012,.2);}
    else if(j==='B'){this.sk(c[0]+12,0,0.1);this.sk(c[2]+12,0.07,0.08);}
    else if(j==='R'){this.sk(c[0]+12,0,0.08,0.6);}
    else{this.tone(220,.22,'sine',.13,0,140);this.sk(c[0]-12,0.02,0.05,0.4);}
  },
  ui(){this.sk(this.curCh[2]+12,0,0.06,0.35);},
  shutter(){this.burst(5200,.025,.28,2);this.burst(1400,.05,.16,2);this.tone(1900,.03,'square',.02,.05);},
  staple(){this.burst(2400,.04,.35);this.burst(900,.06,.2);this.tone(280,.05,'square',.03);},
  cap(){this.tone(500,.07,'sine',.09,0,1300);this.burst(3200,.03,.12,6);},
  boing(){this.tone(260,.32,'sine',.11,0,560);this.tone(520,.16,'triangle',.03,.02,900);this.burst(1800,.04,.1,4);},
  fanfare(rk){const c=this.curCh,seq=rk==='S+'?[0,1,2,0,1,2,0]:[0,1,2];seq.forEach((i,k)=>this.sk(c[i%c.length]+12+(k>=3?12:0)+(k>=6?12:0),k*0.09,0.1,1.3));},
  waterStart(){
    if(!this.ctx||!this.sfx||this.water)return;const t=this.ctx.currentTime;
    const s=this.ctx.createBufferSource();s.buffer=this.nbuf();s.loop=true;
    const f=this.ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=380;f.Q.value=6;
    const g=this.ctx.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.14,t+0.08);
    s.connect(f);f.connect(g);g.connect(this.sfxBus);s.start(t);this.water={s,f,g};
  },
  sizzle(on){
    if(!this.ctx)return;const t=this.ctx.currentTime;
    if(on&&this.sfx&&!this.sz){const s=this.ctx.createBufferSource();s.buffer=this.nbuf();s.loop=true;const f=this.ctx.createBiquadFilter();f.type='highpass';f.frequency.value=3500;
      const g=this.ctx.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.07,t+0.1);const lfo=this.ctx.createOscillator(),lg=this.ctx.createGain();lfo.frequency.value=13;lg.gain.value=0.03;lfo.connect(lg);lg.connect(g.gain);lfo.start(t);
      s.connect(f);f.connect(g);g.connect(this.sfxBus);s.start(t);this.sz={s,g,lfo};}
    else if(!on&&this.sz){const z=this.sz;z.g.gain.cancelScheduledValues(t);z.g.gain.setValueAtTime(0.05,t);z.g.gain.exponentialRampToValueAtTime(0.0001,t+0.15);z.s.stop(t+0.2);z.lfo.stop(t+0.2);this.sz=null;}
  },
  waterLevel(p){if(this.water)this.water.f.frequency.setTargetAtTime(340+p*1100,this.ctx.currentTime,0.05);},
  waterStop(){if(!this.water)return;const w=this.water,t=this.ctx.currentTime;w.g.gain.cancelScheduledValues(t);w.g.gain.setValueAtTime(Math.max(0.0001,w.g.gain.value),t);w.g.gain.exponentialRampToValueAtTime(0.0001,t+0.08);w.s.stop(t+0.1);this.water=null;}
};
function buzz(ms){try{navigator.vibrate&&navigator.vibrate(ms);}catch(e){}}

