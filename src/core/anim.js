/* =====================================================================
   Motor de animación y "sensación de juego"
   - Ease: curvas de animación con nombre.
   - Anim: tweens sobre cualquier objeto (Anim.to(obj,{x:10},0.3,{ease:'outBack'})).
   - Spring: muelles amortiguados para aplastar y estirar (squash & stretch).
   - Feel: parada de impacto (hit-stop), anillos, nubecitas, confeti y
     transición en iris entre fases. Todo se dibuja en píxeles del mundo.
   ===================================================================== */
const clamp01=t=>t<0?0:t>1?1:t;
const Ease={
  linear:t=>t,
  inQuad:t=>t*t, outQuad:t=>1-(1-t)*(1-t), inOutQuad:t=>t<0.5?2*t*t:1-Math.pow(-2*t+2,2)/2,
  outCubic:t=>1-Math.pow(1-t,3), inOutCubic:t=>t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,
  inOutSine:t=>-(Math.cos(Math.PI*t)-1)/2,
  outBack:t=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2);},
  inBack:t=>{const c1=1.70158;return (c1+1)*t*t*t-c1*t*t;},
  outElastic:t=>t===0||t===1?t:Math.pow(2,-10*t)*Math.sin((t*10-0.75)*(2*Math.PI)/3)+1,
  outBounce:t=>{const n=7.5625,d=2.75;if(t<1/d)return n*t*t;if(t<2/d)return n*(t-=1.5/d)*t+0.75;if(t<2.5/d)return n*(t-=2.25/d)*t+0.9375;return n*(t-=2.625/d)*t+0.984375;}
};
const Anim={list:[],
  // anima las propiedades numéricas de o hasta los valores de props
  to(o,props,dur,opt){opt=opt||{};const tw={o,from:{},props,dur:Math.max(0.0001,dur),t:-(opt.delay||0),ease:Ease[opt.ease||'outCubic']||opt.ease,done:opt.done,started:false};
    this.list=this.list.filter(x=>!(x.o===o&&Object.keys(props).some(k=>k in x.props)));this.list.push(tw);return tw;},
  update(dt){for(const tw of this.list){tw.t+=dt;if(tw.t<0)continue;
      if(!tw.started){tw.started=true;for(const k in tw.props)tw.from[k]=tw.o[k];}
      const k=tw.ease(clamp01(tw.t/tw.dur));for(const p in tw.props)tw.o[p]=tw.from[p]+(tw.props[p]-tw.from[p])*k;
      if(tw.t>=tw.dur){tw.fin=true;tw.done&&tw.done();}}
    this.list=this.list.filter(x=>!x.fin);},
  clear(){this.list=[];}
};
// muelle amortiguado: x tiende a target; kick() le da un empujón. Para aplastar/estirar y rebotes.
function Spring(x0,k,d){return {x:x0||0,v:0,target:x0||0,k:k||170,d:d||11,
  step(dt){const n=Math.max(1,Math.ceil(dt/0.008)),h=dt/n;for(let i=0;i<n;i++){const a=-this.k*(this.x-this.target)-this.d*this.v;this.v+=a*h;this.x+=this.v*h;}return this.x;},
  kick(v){this.v+=v;return this;}};}
// circunferencia de píxeles (algoritmo del punto medio), cacheada por radio
const CIRC=[];
function circPts(r){r=Math.max(0,Math.round(r));if(CIRC[r])return CIRC[r];const p=[];let x=r,y=0,e=1-r;
  while(x>=y){for(const [a,b] of [[x,y],[y,x],[-y,x],[-x,y],[-x,-y],[-y,-x],[y,-x],[x,-y]])p.push([a,b]);y++;if(e<0)e+=2*y+1;else{x--;e+=2*(y-x)+1;}}
  return CIRC[r]=p;}
const Feel={stopT:0,fx:[],iris:null,
  // congela el juego un instante: el golpe "pesa"
  stop(s){if(DEMO||reduce)return;this.stopT=Math.max(this.stopT,s);},
  ring(x,y,col,max){if(DEMO)return;this.fx.push({k:'ring',x,y,col:col||C.butter,max:max||16,t:0,life:0.32});},
  puff(x,y,n,col){if(DEMO)return;for(let i=0;i<(n||5);i++){const a=Math.PI*(1+i/((n||5)-1||1));this.fx.push({k:'puff',x,y,vx:Math.cos(a)*(14+Math.random()*10),vy:Math.sin(a)*8-6,col:col||C.white,t:0,life:0.45+Math.random()*0.2,r:1+Math.random()*1.5});}},
  confetti(x,y,n){if(DEMO)return;const cols=[C.pink,C.butter,C.mint,C.sky,C.lav,C.peach];for(let i=0;i<(n||18);i++){const a=-Math.PI/2+(Math.random()-0.5)*2.2,s=60+Math.random()*70;
    this.fx.push({k:'conf',x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,col:cols[i%cols.length],t:0,life:1.1+Math.random()*0.5,ph:Math.random()*6});}},
  // transición en iris: la escena nueva se abre desde un punto
  irisOpen(x,y,dur){if(DEMO||reduce)return;this.iris={x:x==null?W/2:x,y:y==null?H/2:y,t:0,dur:dur||0.75};},
  update(dt){for(const f of this.fx){f.t+=dt;if(f.k!=='ring'){f.x+=f.vx*dt;f.y+=f.vy*dt;}
      if(f.k==='puff'){f.vx*=Math.pow(0.04,dt);f.vy*=Math.pow(0.04,dt);f.vy-=6*dt;f.r+=dt*4;}
      if(f.k==='conf'){f.vy+=150*dt;f.vx*=Math.pow(0.3,dt);}}
    this.fx=this.fx.filter(f=>f.t<f.life);
    if(this.iris){this.iris.t+=dt;if(this.iris.t>=this.iris.dur)this.iris=null;}},
  draw(c){
    for(const f of this.fx){const k=f.t/f.life;
      if(f.k==='ring'){const r=Ease.outCubic(k)*f.max;c.save();c.globalAlpha=1-k;for(const [a,b] of circPts(r))px(c,f.x+a,f.y+b,f.col);if(r>3)for(const [a,b] of circPts(r-2))if((a+b)%2===0)px(c,f.x+a,f.y+b,C.white);c.restore();}
      else if(f.k==='puff'){c.save();c.globalAlpha=0.85*(1-k);ell(c,Math.round(f.x),Math.round(f.y),Math.round(f.r),Math.round(f.r),f.col);c.restore();}
      else if(f.k==='conf'){const w=Math.abs(Math.cos(f.t*12+f.ph))>0.5?2:1;c.save();c.globalAlpha=k>0.75?(1-k)/0.25:1;R(c,f.x,f.y,w,3-w,f.col);c.restore();}}
    if(this.iris){const k=Ease.inOutCubic(clamp01(this.iris.t/this.iris.dur)),maxR=Math.hypot(W,H)/2+20,r=k*maxR;
      c.save();c.fillStyle='#2a2036';c.beginPath();c.rect(0,0,W,H);c.arc(this.iris.x,this.iris.y,Math.max(0.1,r),0,Math.PI*2,true);c.fill('evenodd');
      c.strokeStyle=C.pinkL;c.lineWidth=2;c.beginPath();c.arc(this.iris.x,this.iris.y,Math.max(0.1,r),0,Math.PI*2);c.stroke();c.restore();}
  },
  reset(){this.stopT=0;this.fx=[];this.iris=null;Anim.clear();}
};
