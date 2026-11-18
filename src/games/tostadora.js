/* =====================================================================
   MINIJUEGO 3 · TOSTADORA (vista lateral, cocina)
   Mantener pulsado baja la palanca; soltar saca la tostada.
   ===================================================================== */
const TX=150,TOP=124;
const TOAST=['#fbecc9','#f9e2b3','#f6d69c','#f1c785','#ebb76f','#e2a55c','#d4914d','#c07c41','#a66637','#86512f','#5e3f2c','#3e2f2b'];
function toastCol(p,d){const i=Math.max(0,Math.min(TOAST.length-1,Math.floor(p*10)+(d||0)));return TOAST[i];}
const BREADS={
  molde:{name:'Pan de molde',rate:1/3.3,base:0,w:26,h:24,top:'bumps'},
  integral:{name:'Pan integral',rate:1/3.8,base:0.12,w:26,h:24,top:'flat',seeds:true},
  brioche:{name:'Brioche',rate:1/2.7,base:0.04,w:24,h:22,top:'round'},
  gofre:{name:'Gofre',rate:1/2.5,base:0.06,w:24,h:22,top:'flat',grid:true}
};
function breadShape(l,x,y,B,col,crust){
  // x,y = esquina superior izquierda de la rebanada vista de frente
  const w=B.w,h=B.h;
  if(B.top==='bumps'){ell(l,x+6,y+5,6,5,crust);ell(l,x+w-7,y+5,6,5,crust);rr(l,x,y+5,w,h-5,crust,2);ell(l,x+6,y+6,5,4,col);ell(l,x+w-7,y+6,5,4,col);rr(l,x+1,y+6,w-2,h-7,col,2);}
  else if(B.top==='round'){ell(l,x+w/2,y+8,w/2,8,crust);rr(l,x,y+8,w,h-8,crust,3);ell(l,x+w/2,y+9,w/2-1,7,col);rr(l,x+1,y+8,w-2,h-9,col,3);}
  else{rr(l,x,y,w,h,crust,3);rr(l,x+1,y+1,w-2,h-2,col,3);}
}
function breadDots(c,x,y,B,p){
  if(B.grid){for(let k=5;k<B.w-2;k+=5)R(c,x+k,y+2,1,B.h-4,toastCol(p,2));for(let k=5;k<B.h-2;k+=5)R(c,x+2,y+k,B.w-4,1,toastCol(p,2));}
  else if(B.seeds){for(const [dx,dy] of [[6,8],[14,12],[19,7],[9,16],[18,18],[5,19]])px(c,x+dx,y+dy,toastCol(p,3));}
  else{for(const [dx,dy] of [[7,10],[15,14],[10,18],[19,9]])px(c,x+dx,y+dy,toastCol(p,1));}
}
function drawKitchenBg(c){
  // azulejos de cocina
  R(c,0,0,W,TOP,C.peachL);
  for(let y=0;y<TOP;y+=12){R(c,0,y+11,W,1,C.peach);for(let x=0;x<W;x+=12)R(c,x+11,y,1,11,C.peach);}
  for(let y=0;y<TOP;y+=12)for(let x=0;x<W;x+=12)R(c,x,y,11,1,'#fff4ea');
  for(let y=24;y<TOP;y+=48)for(let x=36;x<W;x+=72){R(c,x,y,11,11,C.pinkL);R(c,x+3,y+3,5,5,C.pink);}
  dith(c,0,0,W,3,C.peach);
  // ventanita con cortina corta
  obj(c,l=>{rr(l,22,14,58,46,C.cream,2);});
  R(c,26,18,50,38,C.skyD);dith(c,26,30,50,3,C.sky);R(c,26,33,50,23,C.sky);dith(c,26,48,50,3,C.skyL);R(c,26,51,50,5,C.skyL);
  ell(c,40,28,6,3,C.white);ell(c,46,26,5,3,C.white);R(c,50,18,2,38,C.cream);
  obj(c,l=>{l.fillStyle=C.mint;for(let x=20;x<82;x++){const h=12+Math.round(Math.sin((x-20)/61*Math.PI*6)*1.5);l.fillRect(x,14,1,h);}rr(l,18,12,66,3,C.woodD,1);});
  for(let x=24;x<82;x+=6)R(c,x,16,1,9,C.mintD);
  // estante con tarros
  obj(c,l=>{rr(l,206,40,92,4,C.wood,1);R(l,214,44,3,6,C.woodD);R(l,286,44,3,6,C.woodD);});
  for(const [x,col,lid,h] of [[212,C.butter,C.pinkD,16],[230,'#e8d0ff',C.mintD,20],[250,C.pinkL,C.butterD,14],[268,C.mintL,C.pinkD,18]]){
    obj(c,l=>{rr(l,x,40-h,14,h,'rgba(235,245,255,0.75)',2);rr(l,x+1,40-h+5,12,h-6,col,2);rr(l,x+1,40-h-3,12,4,lid,1);});
    R(c,x+2,40-h+2,1,h-6,'rgba(255,255,255,0.8)');rr(c,x+4,40-h+8,6,4,C.cream,1);
  }
  // utensilios colgados
  obj(c,l=>{R(l,104,10,72,2,C.metalD);
    rr(l,112,12,2,22,C.woodD,0);rr(l,108,32,10,8,C.woodD,2);
    R(l,130,12,2,20,C.metal);ell(l,131,36,5,4,C.metal);
    R(l,148,12,2,18,C.pinkD);rr(l,145,29,8,10,C.pinkD,2);
    R(l,166,12,2,24,C.metal);for(let k=0;k<4;k++)R(l,163+k*2,36,1,6,C.metal);
  });
  ell(c,131,35,3,2,C.metalD);
  // encimera y muebles
  obj(c,l=>{rr(l,-2,TOP,W+4,8,C.lavL,1);});
  R(c,0,TOP+1,W,1,C.white);dith(c,0,TOP+6,W,2,C.lav);
  R(c,0,TOP+8,W,H-TOP-8,C.mint);
  obj(c,l=>{for(let x=4;x<W;x+=64){rr(l,x,TOP+12,58,40,C.mintL,3);}},{out:false});
  for(let x=4;x<W;x+=64){obj(c,l=>{rr(l,x+25,TOP+18,8,3,C.peachD,1);});}
  R(c,0,H-4,W,4,C.mintDD);
  // tetera
  dith(c,38,TOP+1,36,2,C.lavD);
  obj(c,l=>{ell(l,54,TOP-12,15,12,C.pink);rr(l,40,TOP-8,30,8,C.pink,2);rr(l,49,TOP-27,10,4,C.pinkD,2);
    for(let k=0;k<9;k++)l.fillRect(68+k,TOP-12-Math.round(k*0.9),3,3);});
  ell(c,54,TOP-12,10,8,C.pinkL);ell(c,50,TOP-16,3,2,C.white);R(c,40,TOP-4,30,1,C.pinkD);
  obj(c,l=>{for(let a=Math.PI*1.05;a<Math.PI*1.95;a+=0.05){l.fillRect(54+Math.cos(a)*13,TOP-22+Math.sin(a)*9,2,2);}},{rim:false});
  // bote de mermelada
  dith(c,90,TOP+1,16,2,C.lavD);
  obj(c,l=>{rr(l,90,TOP-16,14,16,'rgba(255,190,210,0.95)',3);rr(l,89,TOP-19,16,4,C.cream,1);});
  R(c,92,TOP-11,10,5,C.cream);px(c,96,TOP-9,C.pinkDD);px(c,97,TOP-9,C.pinkDD);R(c,91,TOP-14,1,10,'rgba(255,255,255,0.8)');
  // plato
  dith(c,238,TOP+1,48,2,C.lavD);
  obj(c,l=>{rr(l,236,TOP-4,48,4,C.white,2);rr(l,244,TOP-6,32,3,C.white,1);});
  R(c,240,TOP-3,40,1,C.lavL);
}
const TOPPINGS=[
  {name:'mantequilla',col:'#fff0a0',d:'#f3d36c',l:'#fffbe0'},
  {name:'mermelada de fresa',col:'#ff7fa6',d:'#e0507e',l:'#ffc2d6',seeds:true},
  {name:'crema de cacahuete',col:'#d08a4e',d:'#9c5e30',l:'#f0c08e'},
  {name:'miel',col:'#ffc94d',d:'#eda531',l:'#ffe79a'},
  {name:'chocolate',col:'#a0705a',d:'#7d5242',l:'#c99a82'},
  {name:'aguacate',col:'#b6db84',d:'#8fbf5f',l:'#e0f5c2',seeds:true}
];
function Toaster(rng,preview){
  // Fase 1: tostar (mantén y suelta). Fase 2: untar cada tostada de una sola pasada:
  // la espátula cruza de izquierda a derecha; mantén justo al entrar en la tostada y suelta justo al salir.
  const N=6,PRACTICE=0;
  const UN=[];for(let i=0;i<N;i++){const v=(64+rng()*14)*(1+i*0.09);UN.push({top:TOPPINGS[Math.floor(rng()*TOPPINGS.length)],v,lead:0.85+rng()*0.55,t:0,st:'pre',sx:null,ex:null,jp:null,jr:null,out:0,dip:0});}
  const TOTAL=N*3;
  const keys=Object.keys(BREADS);const items=[];
  for(let i=0;i<N;i++){
    const B=i<PRACTICE?BREADS.molde:BREADS[keys[Math.floor(rng()*keys.length)]];
    const prog=i/(N-1);
    const shade=[0.42,0.58,0.72][Math.floor(rng()*3)]+(rng()-0.5)*0.06;
    // a partir de la cuarta: tostadora con turbo (de golpe tuesta más rápido) o pedido "a ojo" (sin marca: hay que igualar el color del pedido)
    const mr=rng(),mode=i<3?'normal':mr<0.36?'turbo':'normal';
    items.push({B,mode,tt:0.45+rng()*0.6,el:0,target:Math.max(B.base+0.2,shade),rate:B.rate*(1+prog*0.4)*(0.92+rng()*0.16),practice:i<PRACTICE,p:B.base,j:null});
  }
  const lv=Spring(0,320,13);let cur=0,st='insert',t=0,lever=0,endT=0,ended=false,holding=false;const stack=[];let fly=null;const smoke=[];
  const bg=mk(W,H);drawKitchenBg(bg.getContext('2d'));grain(bg.getContext('2d'),15,4);
  if(preview){st='toast';items[0].p=0.5;lever=1;}
  const it=()=>items[cur];
  function pop(j,det){const b=it();b.j=j;st='pop';t=0;Snd.boing();done++;Core.judge(j,TX,62,b.practice,det);}
  // ---- fase 2: untar (una pasada por tostada) ----
  let phase=1,done=0,ui=0,kx=0,swapT=0,h2=false;const UTX=160,UTY=98,UTH=60;
  const U=()=>UN[ui];
  const tw=i=>{const b=stack[i]||items[i];return Math.max(66,Math.min(88,Math.round((b?b.B.w:26)*3.2)));};
  const edges=()=>{const w=tw(ui);return [UTX-w/2,UTX+w/2];};
  const J2=a=>a<=0.05?'P':a<=0.1?'B':a<=0.16?'R':'F';
  function goPhase2(){phase=2;swapT=0;ui=0;}
  if(TDEMO==='untar'){for(const b of items){b.j='P';b.p=b.target;stack.push(b);}cur=N;goPhase2();swapT=2;}TDEMO=null;
  function startX(){const u=U(),[x0]=edges();return Math.max(60,x0-u.v*u.lead);}
  function judgeIn(){const u=U(),[x0]=edges(),e=(kx-x0)/u.v,j=J2(Math.abs(e));u.jp=j;u.sx=kx;done++;
    Core.judge(j,UTX-40,UTY-42,false,j==='P'?'':(e<0?'◀ Pronto: antes de la tostada':'Tarde ▶'));}
  function judgeOut(auto){const u=U(),[,x1]=edges(),e=(kx-x1)/u.v,j=auto?'F':J2(Math.abs(e));u.jr=j;u.ex=kx;done++;
    Core.judge(j,UTX+40,UTY-42,false,j==='P'?'':(e<0?'▼ Te quedaste corto':'▲ Te pasaste'));if(u.jp==='P'&&j==='P')Core.sparkle(UTX,UTY);}
  function update2(dt){
    if(swapT<2){swapT+=dt;if(swapT>=2&&U())kx=startX();return;}
    const u=U();if(!u){endT+=dt;if(endT>0.8&&!ended){ended=true;Core.finish();}return;}
    const [x0,x1]=edges();
    if(u.st==='pre'){u.t+=dt;kx=startX();if(u.t>0.45){u.st='pass';u.t=0;}return;}
    if(u.st==='pass'){
      u.t+=dt;kx+=u.v*dt;if(h2)u.dip=Math.min(1,u.dip+dt*14);else u.dip=Math.max(0,u.dip-dt*14);
      // si sigues apretando al salir de la tostada, te pasas
      if(h2&&u.sx!=null&&u.ex==null&&(kx-x1)/u.v>0.16){h2=false;judgeOut(true);}
      if(kx>x1+u.v*0.2+14){
        if(u.sx==null){done+=2;u.jp=u.jr='F';Core.judge('F',UTX-40,UTY-42,false,'No la untaste');Core.judge('F',UTX+40,UTY-42,false,'');}
        u.st='out';u.t=0;}
      return;}
    if(u.st==='out'){u.t+=dt;u.dip=Math.max(0,u.dip-dt*10);kx+=u.v*dt;if(u.t>0.9){ui++;if(U())kx=startX();}}
  }
  function press2(){
    if(swapT<2)return;const u=U();if(!u||u.st!=='pass'||u.sx!=null)return; // una sola bajada por pasada
    h2=true;Snd.burst(2400,.05,.12,1.5);judgeIn();
  }
  function release2(){
    const u=U();if(!h2)return;h2=false;if(!u||u.sx==null||u.ex!=null)return;judgeOut(false);
  }
  function draw2(c){
    const k=inout(Math.min(1,swapT/0.8)),oy=Math.round((1-k)*150);
    // bandeja de madera con la tostada en grande (vista desde arriba)
    c.save();c.globalAlpha=0.35*k;R(c,0,0,W,H,'#5b4a6b');c.restore();
    obj(c,l=>{rr(l,44,24+oy,232,148,C.wood,8);},{sel:true});rr(c,50,30+oy,220,136,C.woodL,6);for(let y=40;y<160;y+=14)R(c,54,y+oy,212,1,'rgba(217,167,127,0.35)');
    const u=U()||UN[UN.length-1],slide=u.st==='out'?inout(Math.min(1,Math.max(0,u.t-0.35)/0.55)):0,dx=Math.round(slide*150),bread=stack[Math.min(stack.length-1,ui)]||{p:0.55};
    // tarro del ingrediente
    const jx=72,jy=112+oy;obj(c,l=>{rr(l,jx-12,jy-8,24,32,'rgba(240,246,255,0.92)',6);rr(l,jx-10,jy+3,20,19,u.top.col,5);rr(l,jx-13,jy-14,26,8,C.pinkD,3);},{sel:true});
    rr(c,jx-8,jy+7,16,9,C.cream,2);R(c,jx-5,jy+10,10,1,u.top.d);R(c,jx-5,jy+13,7,1,u.top.d);R(c,jx-9,jy-5,2,24,'rgba(255,255,255,0.8)');
    // platos terminados (arriba a la izquierda y a la derecha)
    for(let i=0;i<ui;i++){const q=UN[i],px0=i<3?58+i*24:216+(i-3)*20,py0=36+oy;obj(c,l=>{ell(l,px0+10,py0+9,11,8,C.paper);},{sel:true});
      rr(c,px0+2,py0+3,16,12,toastCol((stack[i]||{p:0.5}).p),3);if(q.sx!=null){const f=q.jr==='P'&&q.jp==='P'?1:0.7;rr(c,px0+3,py0+4,Math.round(14*f),10,q.top.col,3);R(c,px0+4,py0+5,6,1,q.top.l);}}
    // la tostada
    const w=tw(Math.min(ui,N-1)),x0=UTX-w/2+dx,y0=UTY-UTH/2+oy;
    dith(c,x0+3,y0+4,w,UTH,'#b07a5a');
    obj(c,l=>{rr(l,x0-4,y0-4,w+8,UTH+8,toastCol(bread.p,2),10);},{sel:true});rr(c,x0-1,y0-1,w+2,UTH+2,toastCol(bread.p),8);
    for(const [ddx,ddy] of [[8,10],[30,6],[48,14],[14,36],[40,40],[24,24],[58,30]])if(ddx<w-4)px(c,x0+ddx,y0+ddy,toastCol(bread.p,1));
    // guías rosas de entrada y salida
    if(u.st!=='out'){for(let yy=y0-8;yy<y0+UTH+8;yy+=3){px(c,x0,yy,'rgba(243,154,192,0.95)');px(c,x0+w-1,yy,'rgba(243,154,192,0.95)');}
      for(const gx of [x0,x0+w-1]){R(c,gx-2,y0-10,5,1,C.pinkD);px(c,gx,y0-9,C.pinkD);R(c,gx-2,y0+UTH+9,5,1,C.pinkD);px(c,gx,y0+UTH+8,C.pinkD);}}
    // lo untado: sobre la tostada y, si te sales, manchurrón en la bandeja
    if(u.sx!=null){const a=Math.round(u.sx)+dx,bb=Math.round(u.ex!=null?u.ex:kx)+dx;
      if(bb>a){
        const on0=Math.max(a,x0+2),on1=Math.min(bb,x0+w-2);
        if(a<x0)rr(c,a,y0+12,x0-a+3,UTH-24,u.top.d,4);
        if(bb>x0+w)rr(c,x0+w-3,y0+12,bb-(x0+w)+3,UTH-24,u.top.d,4);
        if(on1>on0){rr(c,on0,y0+3,on1-on0,UTH-6,u.top.d,5);rr(c,on0+1,y0+4,on1-on0-2,UTH-8,u.top.col,4);R(c,on0+3,y0+7,Math.max(0,on1-on0-8),1,u.top.l);
          for(let yy=y0+12;yy<y0+UTH-6;yy+=8)for(let xx=on0+4+(yy%16?0:6);xx<on1-6;xx+=12)R(c,xx,yy,6,1,u.top.d);
          if(u.top.seeds)for(let yy=y0+8;yy<y0+UTH-6;yy+=7)for(let xx=on0+3+((yy*5)%9);xx<on1-3;xx+=11)px(c,xx,yy,u.top.d);}}}
    // espátula: cruza de izquierda a derecha; baja y unta mientras mantienes
    if(swapT>=2&&U()&&(u.st!=='out'||u.t<0.35)){const kxx=Math.round(kx)+0,lift=Math.round((1-u.dip)*8),ky=y0-20+lift;
      c.save();c.globalAlpha=0.35;R(c,kxx-3,y0+6,8,UTH-12,'#7a5a4a');c.restore();
      obj(c,l=>{rr(l,kxx-4,ky,9,UTH+10-lift,C.metal,4);rr(l,kxx-3,ky-22,7,24,C.pinkD,3);},{sel:true});R(c,kxx-2,ky+3,1,UTH+2-lift,C.metalL);
      rr(c,kxx-3,ky+UTH-6-lift,7,8,u.top.col,3);R(c,kxx-2,ky-20,1,18,C.pinkL);}
  }
  return {_dbg:()=>({st,b:items[cur],phase,kx,u:U(),swapT,e:U()&&stack.length?edges():[0,0],h2}),unit:'Paso',total:TOTAL,mood:'tostadora',hold:true,
    inPractice(){return false;},
    progress(){return done;},
    cue(){return phase===1?'Fase 1 · Tuesta hasta el color del pedido':'Fase 2 · Mantén al entrar en la tostada y suelta al salir: una sola pasada';},
    update(dt){
      if(phase===2){update2(dt);return;}
      t+=dt;for(const s of smoke){s.t+=dt;s.y-=dt*14;s.x+=Math.sin(s.t*3+s.k)*dt*6;}
      for(let i=smoke.length-1;i>=0;i--)if(smoke[i].t>1.4)smoke.splice(i,1);
      if(fly){fly.t+=dt;if(fly.t>=0.75){stack.push(fly.b);fly=null;}}
      const b=it();
      if(!b){endT+=dt;if(endT>0.8){endT=0;goPhase2();Core.banner('Fase 2','¡A untar!','La espátula cruza una sola vez. Mantén justo cuando entre en la tostada y suelta justo cuando salga.');}return;}
      if(st==='insert'){lever=0;if(t>0.55){st='ready';t=0;}}
      else if(st==='ready'){lever=0;}
      else if(st==='toast'){
        lever=Math.min(1,lever+dt*8);b.el+=dt;if(b.mode==='turbo'&&!b.turbo&&b.el>=b.tt){b.turbo=true;b.rate*=1.75;Snd.burst(900,.08,.18,2);}
        b.p+=b.rate*dt;
        if(b.p>0.9&&Math.random()<dt*8)smoke.push({x:TX-12+Math.random()*24,y:74,t:0,k:Math.random()*6});
        if(b.p>=1.06){holding=false;pop('F','▲ Te pasaste: quemada');for(let k=0;k<6;k++)smoke.push({x:TX-14+k*5,y:74,t:0,k});}
      }
      else if(st==='pop'){if(t<dt*1.5)lv.kick(-9);lever=Math.max(0,lever-dt*10);if(t>0.6){st='serve';t=0;fly={b,t:0};}}
      else if(st==='serve'){if(!fly){cur++;st='insert';t=0;}}
      lv.target=lever;lv.step(dt); // la palanca baja y sube con muelle (rebota al soltar)
    },
    press(){if(phase===2){press2();return;}const b=it();if(!b)return;holding=true;if(st==='ready'){st='toast';t=0;Snd.burst(700,.06,.2);}},
    release(){holding=false;if(phase===2){release2();return;}const b=it();if(!b||st!=='toast')return;
      const d=b.p-b.target,a=Math.abs(d),w=1;const j=a<=0.03*w?'P':a<=0.07*w?'B':a<=0.13*w?'R':'F';
      pop(j,j==='P'?'':(d<0?'▼ Te quedaste corto':'▲ Te pasaste'));},
    draw(c){
      c.drawImage(bg,0,0);
      // tostadas apiladas en el plato
      stack.forEach((b,k)=>{const y=TOP-8-k*3;obj(c,l=>{rr(l,246,y,28,3,toastCol(b.p),1);});R(c,247,y+2,26,1,toastCol(b.p,2));});
      const b=it();
      // sombra de la tostadora
      dith(c,TX-32,TOP+1,70,2,C.lavD);
      // pan asomando por la ranura
      let rise=0;
      if(b&&st==='insert')rise=Math.max(0,1-t/0.4)*30+10;
      else if(b&&st==='ready')rise=10;
      else if(b&&st==='toast')rise=10-lever*14;
      if(st==='pop'&&cur<items.length){rise=10+backOut(Math.min(1,t/0.32))*18;}
      const shown=st==='serve'?null:b&&(st!=='pop')?b:(st==='pop'?items[cur]:null);
      if(shown&&rise>-4){
        const B=shown.B,bx=TX-B.w/2,by=76-rise;
        c.save();c.beginPath();c.rect(0,0,W,77);c.clip();
        obj(c,l=>breadShape(l,bx,by,B,toastCol(shown.p),toastCol(shown.p,2)));
        breadDots(c,bx,by,B,shown.p);c.restore();
      }
      // tostadora
      obj(c,l=>{
        rr(l,TX-32,78,64,46,C.mint,6);
        rr(l,TX+30,88,6,30,C.mintD,2);
        rr(l,TX-30,TOP-2,8,3,C.metalD,1);rr(l,TX+22,TOP-2,8,3,C.metalD,1);
      },{sel:true});
      // sombreado anime de la tostadora: banda de sombra a la derecha, luz reflejada en el borde y brillo
      R(c,TX+22,82,6,40,C.mintD);R(c,TX+28,84,1,36,C.mintL);dith(c,TX+20,82,2,40,C.mintD);
      R(c,TX-29,84,2,14,C.mintL);R(c,TX-29,104,2,16,C.mintL);R(c,TX-26,81,6,1,C.white);px(c,TX-29,82,C.white);px(c,TX-29,83,C.white);
      R(c,TX-30,121,58,1,C.mintD);
      R(c,TX-31,80,62,1,C.mintL);R(c,TX-31,100,62,3,C.metal);R(c,TX-31,100,62,1,C.metalL);R(c,TX-31,102,62,1,C.metalD);
      // ranura
      rr(c,TX-16,77,32,4,C.out,1);
      if(st==='toast'){dith(c,TX-14,78,28,2,'#ff9d6e',Math.floor(Core.time*10));}
      // ventana con el pan dentro
      rr(c,TX-22,84,36,14,C.metalD,2);rr(c,TX-21,85,34,12,'#8a7aa8',2);R(c,TX-19,85,30,1,'#b9acd6');
      if(st==='toast'&&b){
        R(c,TX-20,86,1,10,'#ff9d6e');R(c,TX+11,86,1,10,'#ff9d6e');
        const B=b.B;c.save();c.beginPath();c.rect(TX-20,86,32,10);c.clip();
        breadShape(c,TX-4-B.w/2,86-6+Math.round((1-lever)*8),B,toastCol(b.p),toastCol(b.p,2));c.restore();
        if(Math.floor(Core.time*4)%2)px(c,TX-19,87,'#ffd6b0');
      }else{R(c,TX-20,86,1,10,C.lavDD);R(c,TX+11,86,1,10,C.lavDD);}
      R(c,TX-20,86,3,1,'rgba(255,255,255,0.6)');R(c,TX-20,87,1,2,'rgba(255,255,255,0.6)');
      // indicador de tostado: rampa de color, objetivo y aguja
      const gx=TX-24,gy=108,gw=44;
      rr(c,gx-2,gy-2,gw+4,9,'#8a7aa8',2);R(c,gx-1,gy-2,gw+2,1,'#b9acd6');
      for(let i=0;i<gw;i++)R(c,gx+i,gy,1,5,toastCol(i/gw));
      if(b){
        const tx=gx+Math.round(b.target*gw);
        if(true){R(c,tx-1,gy-5,3,1,C.pinkDD);px(c,tx,gy-4,C.pinkDD);R(c,tx-1,gy+7,3,1,C.pinkDD);px(c,tx,gy+6,C.pinkDD);
          R(c,tx-2,gy-1,1,7,C.white);R(c,tx+2,gy-1,1,7,C.white);}
        else if(st!=='pop'&&st!=='serve'){// sin marca: un ojito avisa de que hay que fiarse del color del pedido
          obj(c,l=>{ell(l,gx+gw+9,gy+2,5,3,C.white);},{sel:true});ell(c,gx+gw+9,gy+2,1,1,C.lavDD);px(c,gx+gw+9,gy+1,C.out);px(c,gx+gw+10,gy+1,C.white);R(c,gx+gw+5,gy-2,1,1,C.out);R(c,gx+gw+9,gy-3,1,1,C.out);R(c,gx+gw+13,gy-2,1,1,C.out);}
        else{R(c,tx-1,gy-5,3,1,C.pinkDD);px(c,tx,gy-4,C.pinkDD);}
        if(b.turbo&&st==='toast'){const f=Math.floor(Core.time*16)%2;for(let k=0;k<4;k++)px(c,TX-30+k*20+f,78-((k+f)%2),k%2?C.butter:'#ff9d6e');R(c,TX-31,100,62,1,f?'#ffb38a':C.metalL);}
        b.np=b.np==null?b.p:b.np+(b.p-b.np)*0.35;const nx=gx+Math.min(gw-1,Math.round(Math.min(1.06,b.np)*gw/1.0));
        if(st==='toast'||st==='pop'){R(c,nx,gy-2,1,9,C.out);px(c,nx,gy-3,C.out);}
      }
      // palanca
      const ly=90+Math.round(Math.max(-0.25,Math.min(1.1,lv.x))*22);
      R(c,TX+32,90,2,26,C.mintDD);
      obj(c,l=>{rr(l,TX+30,ly,12,6,C.pink,2);});R(c,TX+32,ly+1,8,1,C.pinkL);
      // rueda
      obj(c,l=>{ell(l,TX+22,90,4,4,C.cream);});px(c,TX+22,87,C.pinkDD);px(c,TX+22,88,C.pinkDD);
      // tostada volando al plato
      if(fly){const B=fly.b.B,f=Math.min(1,fly.t/0.55),x0=TX-B.w/2,x1=260-B.w/2,y0=76-28,y1=TOP-8-stack.length*3-B.h;
        if(fly.t<0.55){const g=inout(f),x=Math.round(x0+(x1-x0)*g),y=Math.round(y0+(y1-y0)*f*f-Math.sin(f*Math.PI)*12);
          if(f<0.65){obj(c,l=>breadShape(l,x,y,B,toastCol(fly.b.p),toastCol(fly.b.p,2)));breadDots(c,x,y,B,fly.b.p);}
          else{const k=(f-0.65)/0.35,h=Math.max(3,Math.round(B.h*(1-k)+3*k)),w=Math.round(B.w+(28-B.w)*k);obj(c,l=>rr(l,x+B.w/2-w/2,y+B.h-h,w,h,toastCol(fly.b.p),2));}}
        else{const k=(fly.t-0.55)/0.2,h=Math.max(3,Math.round(7-backOut(k)*4)),y=TOP-8-stack.length*3+3-h;obj(c,l=>{rr(l,246,y,28,h,toastCol(fly.b.p),1);});}}
      for(const s of smoke){const a=Math.max(0,0.7-s.t*0.5);dith(c,s.x,s.y,4,3,'rgba(120,110,130,'+a+')',Math.floor(s.t*8));}
      // pedido
      if(b){obj(c,l=>{rr(l,196,72,30,40,C.paper,2);});
        R(c,200,76,22,2,C.pinkD);const B=b.B;
        c.save();c.translate(199,82);c.scale(0.9,0.9);const BB2={...B,w:Math.min(24,B.w),h:Math.min(22,B.h)};breadShape(c,0,0,BB2,toastCol(b.target),toastCol(b.target,2));breadDots(c,0,0,BB2,b.target);c.restore();
        R(c,200,107,22,1,C.lavD);}
      if(phase===2)draw2(c);
    }
  };
}

