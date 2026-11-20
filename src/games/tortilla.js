/* ---------- Minijuego 4: Tortilla de patatas ----------
   Una cocina larga con tres puestos; la cámara se desliza de uno a otro.
   Cada paso tiene su propio gesto:
   · Pelar: la patata gira sola sobre sí misma y el pelador está quieto delante; cada toque
     arranca una tira de piel. Toca cuando una franja de piel quede justo en la línea del pelador
     (si te adelantas o te retrasas, la tira sale torcida y queda un trozo de piel).
   · Cortar: la receta pide 3, 4, 5 o 6 trozos; la mano empuja la patata y tocas
     para cortar a ojo trozos lo más iguales posible (el último es lo que sobra).
   Las guías rosas de pelar y cortar solo se ven la primera vez; luego se desvanecen.
   · Cascar: mantén para apretar el huevo contra el borde y suelta con la grieta justa.
   · Batir: toca a ritmo para que la aguja se quede dentro de la zona que se mueve.
   · Voltear: mantén para coger impulso (sube y baja) y suelta en la marca. */
const EGG={raw:'#ffd34d',beat:'#ffe07a',cook:['#ffe58a','#ffd36b','#f7bf55','#e8a245','#c9803a']};
const TCT=128,TKX=146,TBW=146,TPN=144,TPL=284,TGA=216;
const POT={a:'#fff0b8',b:'#f2d58a',c:'#fffbe2',d:'#f7e3a0'},SKIN={a:'#dcae78',d:'#c08f5c',s:'#9c6d45',l:'#ecc897'};
const TCUE={pelar:'Pela: toca cuando la piel pase por la línea del pelador',cortar:'Corta en trozos iguales: toca a ojo',huevo:'Casca el huevo: mantén para apretar y suelta en la marca',
  batir:'Bate a ritmo: toca para que la aguja no salga de la zona rosa',vuelta:'Dale la vuelta: mantén para coger impulso y suelta en la marca',servir:''};
function drawTortillaPanel(c,k){
  // pared de azulejos tipo metro (lavanda) continua entre paneles
  R(c,0,0,W,TCT,C.lavL);
  for(let y=0;y<TCT;y+=8){R(c,0,y+7,W,1,C.lav);const o=(y/8)%2?8:0;for(let x=o;x<W;x+=16)R(c,x+15,y,1,7,C.lav);}
  for(let y=0;y<TCT;y+=8){const o=(y/8)%2?8:0;for(let x=o-16;x<W;x+=16)R(c,x+1,y,13,1,'#f8f5ff');}
  R(c,0,92,W,10,C.mintL);for(let x=0;x<W;x+=12)R(c,x+11,92,1,10,C.mintD);R(c,0,92,W,1,C.mintD);R(c,0,101,W,1,C.mintD);
  for(let x=4;x<W;x+=24)R(c,x+2,95,4,4,C.mint);
  dith(c,0,0,W,3,C.lav);
  if(k===0){
    // ventana con cortina corta
    obj(c,l=>{rr(l,22,12,64,52,C.cream,2);});
    R(c,26,16,56,44,C.skyD);dith(c,26,28,56,3,C.sky);R(c,26,31,56,29,C.sky);dith(c,26,48,56,3,C.skyL);R(c,26,51,56,9,C.skyL);
    ell(c,40,27,6,2,C.white);ell(c,46,25,5,3,C.white);R(c,53,16,2,44,C.cream);R(c,26,37,56,1,C.cream);
    ell(c,36,58,12,4,C.green);ell(c,66,59,14,3,C.greenD);
    obj(c,l=>{l.fillStyle=C.butter;for(let x=20;x<88;x++){const h=10+Math.round(Math.sin((x-20)/67*Math.PI*5)*1.5);l.fillRect(x,12,1,h);}rr(l,18,10,72,3,C.woodD,1);});
    for(let x=23;x<88;x+=6)R(c,x,14,1,7,C.butterD);
    // receta clavada en la pared
    obj(c,l=>{rr(l,196,12,36,40,C.paper,1);});
    R(c,200,17,20,2,C.pinkD);for(const [y,w] of [[23,26],[27,20],[31,24],[35,14]])R(c,200,y,w,1,'#ddd4ee');
    obj(c,l=>{ell(l,220,43,7,3,EGG.cook[2]);});ell(c,218,42,3,1,EGG.cook[1]);
    obj(c,l=>{ell(l,214,12,2,2,C.pinkD);});px(c,213,11,C.white);
    // maceta de albahaca en la repisa
    obj(c,l=>{rr(l,236,70,72,4,C.wood,1);R(l,244,74,3,6,C.woodD);R(l,296,74,3,6,C.woodD);rr(l,250,58,14,12,C.peachD,2);rr(l,248,56,18,4,C.peach,1);
      ell(l,253,50,5,5,C.greenD);ell(l,262,49,5,6,C.greenD);ell(l,257,46,4,6,C.green);rr(l,280,56,12,14,C.skyL,3);rr(l,281,53,10,4,C.pinkD,1);});
    R(c,257,42,1,12,C.greenDD);px(c,255,47,'#e6ffd8');R(c,282,60,8,4,C.white);
  }
  if(k===1){
    // estante con especias y un paño colgado
    obj(c,l=>{rr(l,6,62,96,4,C.wood,1);R(l,14,66,3,6,C.woodD);R(l,90,66,3,6,C.woodD);});
    for(const [x,col,h] of [[12,C.pinkD,14],[28,C.butterD,18],[44,C.greenD,12],[60,C.peachD,16],[76,C.lavD,20]]){
      obj(c,l=>{rr(l,x,62-h,11,h,'rgba(240,246,255,0.85)',2);rr(l,x+1,62-h+4,9,h-5,col,1);rr(l,x+1,62-h-3,9,4,C.metalD,1);});
      R(c,x+2,62-h+2,1,h-5,'rgba(255,255,255,0.85)');}
    obj(c,l=>{R(l,276,30,40,2,C.woodD);rr(l,282,32,24,34,C.pinkL,2);});
    for(let y=36;y<64;y+=6)R(c,284,y,20,2,C.pink);R(c,282,32,24,1,C.white);
    obj(c,l=>{rr(l,162,10,36,36,C.cream,18);});ell(c,180,28,13,13,C.peachL);ell(c,180,28,9,9,C.peach);ell(c,176,24,3,2,C.white);
  }
  if(k===2){
    // barra con utensilios colgados y campana extractora
    obj(c,l=>{R(l,226,18,80,2,C.metalD);R(l,236,20,2,14,C.woodD);rr(l,233,33,8,16,C.woodD,3);
      R(l,258,20,1,10,C.metalD);ell(l,262,40,9,8,C.pinkD);R(l,288,20,2,20,C.metal);ell(l,289,43,4,3,C.metal);});
    ell(c,262,40,6,5,C.pink);ell(c,259,37,2,1,C.pinkL);
    obj(c,l=>{rr(l,96,0,108,14,C.metal,2);l.fillStyle=C.metal;for(let i=0;i<14;i++)l.fillRect(96-i,14+i,108+2*i,1);});
    R(c,92,26,116,1,C.metalD);for(let x=100;x<200;x+=10)R(c,x,4,1,8,C.metalD);R(c,98,15,100,1,C.metalL);
  }
  // encimera de madera y muebles
  obj(c,l=>{rr(l,-2,TCT,W+4,7,C.wood,1);},{aa:false});
  R(c,0,TCT+1,W,1,C.woodL);R(c,0,TCT+5,W,1,C.woodD);
  R(c,0,TCT+7,W,H-TCT-7,C.pinkL);dith(c,0,TCT+7,W,2,C.pink);
  obj(c,l=>{for(let x=4;x<W;x+=80)rr(l,x,TCT+11,72,36,C.pinkL,3);},{out:false});
  for(let x=4;x<W;x+=80){R(c,x+2,TCT+12,68,1,C.white);rr(c,x+31,TCT+17,10,3,C.peachD,1);}
  if(k===0){dith(c,34,TCT,250,2,C.woodDD);obj(c,l=>{rr(l,30,TCT-10,254,11,C.woodL,4);});R(c,33,TCT-9,248,1,'#fff3e2');R(c,32,TCT-5,250,4,C.wood);R(c,32,TCT-5,250,1,C.woodD);
    for(let x=40;x<280;x+=23)R(c,x,TCT-3,6,1,C.woodD);ell(c,272,TCT-8,5,1,C.woodD);R(c,268,TCT-9,8,1,C.woodDD);}
  if(k===2){obj(c,l=>{rr(l,TPN-62,TCT-4,124,5,C.metalDD,2);});R(c,TPN-60,TCT-4,120,1,C.metalD);
    for(let x=TPN-40;x<=TPN+40;x+=40){ell(c,x,TCT-2,6,1,C.out);}
    dith(c,TPL-26,TCT,52,1,C.lavD);obj(c,l=>{ell(l,TPL,TCT-2,26,3,C.white);});ell(c,TPL,TCT-2,18,1,C.metal);}
}
function drawPotato(l,x0,y,len,tip,col){
  // patata pelada tumbada: punta redonda o cara cortada a la izquierda, culo redondo a la derecha
  // contorno orgánico: bultitos fijos respecto al culo de la patata, para que no bailen al moverse
  const h=30,cy=y+15,e=x0+len,co=col||POT.a;l.fillStyle=co;
  for(let d=12;d<=len-(tip?12:4);d+=5){const ry=13+Math.round(Math.sin(d*0.11)),dy=0;ell(l,e-d,cy+dy,6,ry,co);}
  ell(l,e-12,cy,12,14,co);
  if(tip)ell(l,x0+12,cy,12,13,co);else rr(l,x0,y+2,10,27,co,3);
}
function drawGauge(c,x,y,h,val,zc,zw,opts){
  // medidor vertical: marco crema, relleno de color, zona rosa y flecha
  opts=opts||{};
  obj(c,l=>rr(l,x-6,y-4,13,h+8,C.cream,5),{sel:true});
  rr(c,x-3,y,7,h,'#e9e0f6',3);
  const vy=v=>y+h-Math.round(v*h);
  if(zw>0){const a=Math.max(y,vy(zc+zw)),b=Math.min(y+h,vy(zc-zw));R(c,x-3,a,7,b-a,C.pink);const a2=Math.max(y,vy(zc+zw*0.35)),b2=Math.min(y+h,vy(zc-zw*0.35));R(c,x-3,a2,7,b2-a2,C.pinkD);}
  if(opts.fill!=null){const f=Math.max(0,Math.min(1,opts.fill)),fy=vy(f);c.save();c.globalAlpha=0.55;R(c,x-2,fy,5,y+h-fy,opts.col||C.butterD);c.restore();}
  const ny=vy(Math.max(0,Math.min(1.04,val)));
  obj(c,l=>{l.fillStyle=C.lavDD;for(let k=0;k<4;k++)l.fillRect(x+7+k,ny-3+k,1,7-2*k);l.fillRect(x-4,ny-1,9,3);},{sel:true});
  R(c,x-3,ny,7,1,C.white);
}
function Tortilla(rng,preview){
  // receta: dos tortillas; cada una con sus rodajas, huevos, batido y vuelta
  const ph=[];let TOTAL=0;
  // cada patata se corta en N trozos (3 a 6, distintos en cada tortilla): N-1 cortes y el último trozo es lo que sobra
  const Ns=[3,4,5,6].sort(()=>rng()-0.5);
  for(let k=0;k<2;k++){
    const N=Ns[k],len=72+Math.round(rng()*26),T=len/N,pv=(44+rng()*12)*(1+k*0.15);
    // pelar: la patata gira; tiene n franjas de piel alrededor y cada toque arranca una
    {const n=3+k,off=rng()*6.28;ph.push({k:'pelar',st:0,tort:k,len,n,sk:Array.from({length:n},(_,i)=>({a:off+i*2*Math.PI/n,done:false})),
      om:(1.2+rng()*0.4)*(1+k*0.2),rot:-off+1.3,
      // entre franja y franja ya asoma un poco de carne: así se ve dónde empieza y acaba cada tira
      cuts:Array.from({length:n},(_,i)=>{const g=off+(i+0.5)*2*Math.PI/n,h=0.42*Math.PI/n;return [g-h,g+h];})});TOTAL+=n;}
    ph.push({k:'cortar',st:0,tort:k,n:N-1,N,T,len,base:T*(1.05+rng()*0.35)*(1+k*0.12)});TOTAL+=N;
    const ne=2+(k===1&&rng()<0.6?1:0);
    for(let e=0;e<ne;e++){ph.push({k:'huevo',st:1,egg:e,r:(0.5+rng()*0.25)*(1+k*0.18),f:1.1+rng()*0.9,pp:rng()*6,target:0.5+rng()*0.3});TOTAL++;}
    ph.push({k:'batir',st:1,dur:3.4+k*0.6,zp:rng()*6,zf:0.9+rng()*0.4+k*0.25});TOTAL++;
    ph.push({k:'vuelta',st:2,period:(1.3-k*0.18-rng()*0.1)*1.1,target:0.55+rng()*0.3});TOTAL++;
    ph.push({k:'servir',st:2,tort:k});
  }
  let pi=0,camX=0,cam=null,wait=0.3,endT=0,ended=false,done=0;
  const HP=Core.hint(),HC=Core.hint();// guías de pelar y de cortar: solo la primera vez
  const A={peels:[],kin:1,pot:null,knife:0,chopX:0,slices:[],pile:0,scoop:0,bowlSl:0,eggs:0,yolks:[],beat:0,wa:0,pan:0,cook:0,flip:null,plate:0,serve:null,splat:0,shells:[],mess:0,steam:[],bob:0};
  const bgc=mk(W*3,H),bx=bgc.getContext('2d');for(let k=0;k<3;k++){const p=mk(W,H);drawTortillaPanel(p.getContext('2d'),k);bx.drawImage(p,k*W,0);}
  const P=()=>ph[pi];
  const J=(a,p,b,r)=>a<=p?'P':a<=b?'B':a<=r?'R':'F';
  const wrapA=a=>{a=(a+Math.PI)%(2*Math.PI);if(a<0)a+=2*Math.PI;return a-Math.PI;};
  const potC=mk(W,H),potX=potC.getContext('2d');
  const tolC=T=>[Math.max(1.6,T*0.1),Math.max(3,T*0.2),Math.max(5,T*0.36)];
  function judge(j,det,x,y){done++;Core.judge(j,x,y,false,j==='P'?'':det);}
  function enter(){
    const p=P();if(!p){return;}
    p.t=0;p.init=true;
    if(p.k==='pelar'){A.pot={x0:TKX+20,len:p.len,tip:true,push:0,rem:[0,0],rolled:true,hop:0,peel:true};A.peels=[];A.slices=[];A.pile=0;A.scoop=0;
      p.got=0;p.sw=null;p.endT=0;A.kin=0;
      p.bn=p.tort===0?null:['Otra tortilla','¡A pelar!','Más franjas y gira más deprisa.',1.6];}
    if(p.k==='cortar'){if(!A.pot||!A.pot.peeled)A.pot={x0:TKX+20,len:p.len,tip:true,push:0,rem:[0,0],rolled:true,hop:0,peeled:true};
      A.pot.push=0;A.kin=0;p.cuts=0;A.pile=0;A.scoop=0;A.slices=[];p.hint=HC;
      p.bn=p.tort===0?['Paso 2','¡En '+p.N+' trozos!','Toca para cortar: '+p.N+' trozos lo más iguales posible, a ojo. La primera vez verás unas marcas rosas.',2.4,'cortar']:['Paso 2','¡En '+p.N+' trozos!',p.tort===0?'Toca para cortar: '+p.N+' trozos lo más iguales posible. Las marcas rosas solo salen esta vez.':'Ahora a ojo, sin marcas: '+p.N+' trozos iguales.',2.4];}
    if(p.k==='huevo'){p.c=0;p.hold=false;p.open=null;if(p.egg===0&&!ph.some(q=>q.k==='huevo'&&q.bnDone))p.bn=['Paso 3','¡Casca los huevos!','Mantén para apretar el huevo contra el bol y suelta cuando la aguja llegue a la marca.',2,'huevo'];}
    if(p.k==='batir'){if(!ph.some(q=>q.k==='batir'&&q.bnDone))p.bn=['Paso 4','¡A batir!','Toca a ritmo para que la aguja no se salga de la zona rosa, que se mueve.',2,'batir'];p.s=0;p.inz=0;p.cnt=0;p.lo=0;p.hi=0;p.z=0.5;}
    if(p.k==='vuelta'){if(!ph.some(q=>q.k==='vuelta'&&q.bnDone))p.bn=['Paso 5','¡Dale la vuelta!','Mantén para coger impulso y suelta cuando la aguja esté en la marca.',2,'vuelta'];p.pre=1.5;p.p=0;p.hold=false;p.ht=0;A.pan=0;A.cook=0;A.flip=null;A.burn=0;}
    if(p.k==='servir'){A.serve={t:0};}
    const to=p.st*W;if(Math.abs(to-camX)>1){cam={from:camX,to,t:0,d:0.55+Math.abs(to-camX)*0.0011};wait=0.25;}else wait=p.k==='servir'?0:0.15;
  }
  function next(){pi++;if(pi<ph.length)enter();}
  enter();
  if(TDEMO){const k=ph.findIndex(q=>q.k===TDEMO);if(k>0){pi=k;enter();camX=ph[pi].st*W;cam=null;wait=0.1;if(TDEMO==='batir'){A.bowlSl=3;A.eggs=2;A.yolks=[{t:1,x:TBW-20},{t:1,x:TBW-4}];}}TDEMO=null;}
  if(preview){const p=P();p.sk[0].done=true;p.got=1;p.cuts.push([-p.rot-0.8,-p.rot+0.8]);p.rot+=1.2;for(let k=0;k<5;k++)A.peels.push({x:TKX+18-k*9,y:TCT-12,vx:0,vy:0,t:1,rest:true,s:k%2});}
  const active=()=>!cam&&wait<=0;
  const self={_A:A,_flip:()=>A.flip,_dbg:()=>{const p=P()||{};return {k:p.k,ready:active(),p,past:A.pot?TKX-A.pot.x0:0,pend:A.pot?A.pot.x0+A.pot.len-4:0,z:p.z};},unit:'Paso',total:TOTAL,mood:'tortilla',hold:true,
    inPractice(){return false;},progress(){return done;},
    cue(){const p=P();return p?(p.k==='cortar'?'Corta en '+p.N+' trozos iguales: toca a ojo':TCUE[p.k]):'';},
    update(dt){
      if(cam){cam.t+=dt;const f=inout(Math.min(1,cam.t/cam.d));camX=cam.from+(cam.to-cam.from)*f;if(cam.t>=cam.d){camX=cam.to;cam=null;}}
      else if(wait>0)wait-=dt;
      A.knife=Math.max(0,A.knife-dt);A.splat=Math.max(0,A.splat-dt);A.bob+=dt;
      for(const s of A.slices){s.t+=dt;}
      for(const s of A.shells){s.t+=dt;s.x+=s.vx*dt;s.y+=s.vy*dt;s.vy+=260*dt;}A.shells=A.shells.filter(s=>s.t<0.9);
      for(const y of A.yolks){y.t+=dt;}
      for(const s of A.steam){s.t+=dt;s.y-=dt*12;s.x+=Math.sin(s.t*3+s.k)*dt*5;}A.steam=A.steam.filter(s=>s.t<1.3);
      if(A.pan>0&&Math.random()<dt*5)A.steam.push({x:TPN-30+Math.random()*60,y:108,t:0,k:Math.random()*6});
      A.kin=Math.min(1,A.kin+dt/0.35);HP.step(dt);
      for(const q of A.peels){if(q.rest)continue;q.t+=dt;q.vy+=320*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;if(q.y>=TCT-12){q.y=TCT-12;q.rest=true;}}
      const p=P();
      if(!p){endT+=dt;if(endT>0.8&&!ended){ended=true;Core.finish();}return;}
      // cartel de cada paso nuevo (al llegar, no al crear el juego); el paso espera a que se lea
      if(!cam&&p.bn&&!p.bnDone){p.bnDone=1;if(!Core.banner(p.bn[0],p.bn[1],p.bn[2],p.bn[3],p.bn[4])&&!DEMO)wait=Math.max(wait,p.bn[3]+0.05);}
      if(!cam&&p.note&&!DEMO){Core.note(TKX+40,24,p.note);p.note=null;}
      if(p.hint)p.hint.step(dt);
      p.t+=dt;
      if(p.k==='pelar'){
        if(p.sw){p.sw.t+=dt;const u=Math.min(1,p.sw.t/0.24),xx=A.pot.x0+4+u*(A.pot.len-8);
          if(p.sw.skin&&Math.floor(xx/6)!==Math.floor((p.sw.lx||xx-6)/6))A.peels.push({x:xx,y:TCT-28,vx:-10-Math.random()*30,vy:-50-Math.random()*30,t:0,rest:false,s:Math.random()<0.5?1:0});
          p.sw.lx=xx;if(A.peels.length>60)A.peels.shift();if(p.sw.t>0.32)p.sw=null;}
        p.rot+=p.om*dt*(p.got>=p.n?Math.max(0,1-p.endT*2):1);
        if(p.got>=p.n&&!p.sw){p.endT+=dt;if(p.endT>0.7){A.pot.peeled=true;A.pot.peel=false;next();}}
        return;
      }
      if(p.k==='cortar'){
        const pot=A.pot;
        if(p.cuts>=p.n){
          // el último trozo es lo que sobra: también cuenta
          if(!p.lastDone){p.lw=(p.lw||0)+dt;if(p.lw>0.35){p.lastDone=1;const e=pot.len-p.T,t=tolC(p.T);judge(J(Math.abs(e),t[0],t[1],t[2]),e<0?'▼ Último trozo pequeño':'▲ Último trozo grande',TKX+pot.len/2,58);Snd.tone(660,.05,'triangle',.03);}return;}
          A.scoop+=dt;if(A.scoop>0.75){A.bowlSl+=p.N;pot.gone=true;next();}return;}
        if(!active())return;
        const v=p.base;pot.x0-=v*dt;pot.push=v;
        if(TKX-pot.x0>Math.min(p.T*1.8,pot.len-3))cut('F','▲ Muy grande: corta antes');
      }
      else if(p.k==='huevo'){
        if(p.open){p.open.t+=dt;if(p.open.t>0.75)next();return;}
        if(p.hold&&active()){p.ht+=dt;p.c+=dt*p.r*(0.3+1.4*Math.max(0,Math.sin(p.pp+p.ht*Math.PI*2*p.f)))/0.75;
          if(p.c>=1){p.hold=false;p.c=1;crack('F','▲ ¡Plaf! Mucha fuerza',true);}}
      }
      else if(p.k==='batir'){
        if(p.fin!=null){p.fin+=dt;A.wa+=dt*p.s*28;p.s=Math.max(0,p.s-dt*0.8);if(p.fin>0.5)next();return;}
        if(!active())return;
        p.bt=(p.bt||0)+dt;p.s=Math.max(0,p.s-dt*(0.14+0.22*p.s));A.wa+=dt*(2+p.s*30);
        p.z=0.5+0.13*Math.sin(p.zp+p.bt*p.zf)+0.05*Math.sin(p.bt*2.7+1);
        if(p.bt>0.9){p.cnt+=dt;const d=p.s-p.z;if(Math.abs(d)<=0.12)p.inz+=dt;else if(d<0)p.lo+=dt;else p.hi+=dt;A.beat=Math.min(1,A.beat+dt*0.12);}
        if(p.bt>=0.9+p.dur){const f=p.inz/p.cnt,j=f>=0.85?'P':f>=0.7?'B':f>=0.5?'R':'F';p.fin=0;A.beat=1;
          judge(j,p.lo>=p.hi?'▼ Muy despacio':'▲ Muy deprisa',TBW,58);}
      }
      else if(p.k==='vuelta'){
        if(cam)return;
        if(p.pre>0){p.pre-=dt;const t=1-(p.pre)/1.5;A.pan=Math.max(A.pan,Math.min(1,(t-0.25)/0.55));if(t>0.6)A.cook=Math.min(1,A.cook+dt*1.4);return;}
        if(A.flip){const f=A.flip;f.t+=dt;if(f.t>f.d+0.45)next();return;}
        if(p.hold&&active()){p.ht+=dt;const u=(p.ht/p.period)%1;p.p=u<0.5?u*2:2-u*2;}
      }
      else if(p.k==='servir'){A.serve.t+=dt;if(A.serve.t>0.85){A.plate++;A.pan=0;A.flip=null;A.serve=null;A.bowlSl=0;A.eggs=0;A.yolks=[];A.beat=0;next();}}
    },
    press(){
      const p=P();if(!p||!active())return;
      if(p.k==='pelar'&&p.got<p.n&&!p.sw){
        // franja pendiente más cercana a la línea del pelador (ángulo 0 = de frente)
        let best=null,bd=9;for(const q of p.sk){if(q.done)continue;const d=wrapA(q.a+p.rot);if(Math.abs(d)<Math.abs(bd)){bd=d;best=q;}}
        const cutA=-p.rot,h=Math.PI/p.n;p.cuts.push([cutA-h,cutA+h]);p.sw={t:0,skin:true};Snd.burst(3200,.05,.12,2);
        if(!best||Math.abs(bd)>0.75){p.sw.skin=false;Core.waste(TKX+60,58,'Ahí ya no había piel');return;}
        best.done=true;p.got++;if(HP.a>0)HP.fade();
        const j=J(Math.abs(bd),0.16,0.3,0.45);judge(j,bd>0?'▲ Tarde: la piel ya había pasado':'▼ Pronto: la piel aún no llegaba',TKX+60,58);}
      else if(p.k==='cortar'&&p.cuts<p.n){const e=TKX-A.pot.x0-p.T,t=tolC(p.T);cut(J(Math.abs(e),t[0],t[1],t[2]),e<0?'▼ Pequeño: espera más':'▲ Grande: corta antes');}
      else if(p.k==='huevo'&&!p.open){p.hold=true;p.ht=0;}
      else if(p.k==='batir'&&p.fin==null){p.s=Math.min(1.05,p.s+0.12*(1-0.35*p.s));Snd.burst(4200,.05,.1,1.5);}
      else if(p.k==='vuelta'&&p.pre<=0&&!A.flip){p.hold=true;p.ht=0;p.p=0;}
    },
    release(){
      const p=P();if(!p)return;
      if(p.k==='huevo'&&p.hold){p.hold=false;if(p.c<0.08){p.c=0;Snd.tone(900,.03,'sine',.02);return;}
        const e=p.c-p.target,j=J(Math.abs(e),0.04,0.085,0.15);crack(j,e<0?'▼ Poca fuerza':'▲ Mucha fuerza: cáscara',false);}
      else if(p.k==='vuelta'&&p.hold){p.hold=false;if(p.ht<0.06){p.p=0;return;}
        const e=p.p-p.target,j=J(Math.abs(e),0.035,0.075,0.13);
        const rot=Math.PI*Math.max(0.35,Math.min(1.9,p.p/p.target));A.flip={t:0,d:0.55+0.25*Math.min(1.3,p.p/p.target),rot,h:20+30*Math.min(1.3,p.p/p.target),j};
        Snd.boing();judge(j,e<0?'▼ Poco impulso':'▲ Demasiado impulso',TPN,50);}
    }
  };
  function cut(j,det){
    const p=P(),pot=A.pot,wf=Math.max(2,Math.min(pot.len-2,TKX-pot.x0)),w=Math.round(wf);// el largo exacto, para que el último trozo no arrastre redondeos
    if(p.cuts===0&&p.hint&&p.hint.a>0){p.hint.fade();Core.note(TKX-30,24,'Ahora a ojo: sin marcas');}
    A.slices.push({w,t:0,x:TKX-w,tip:pot.tip,i:p.cuts,j});pot.len-=wf;pot.x0=TKX;pot.tip=false;p.cuts++;A.knife=0.24;
    Snd.burst(1500,.05,.28,3);Snd.tone(170,.06,'triangle',.05);judge(j,det,TKX-62,66);
  }
  function crack(j,det,squash){
    const p=P();p.open={t:0,j,squash};A.eggs++;
    if(squash){A.splat=0.7;for(let k=0;k<6;k++)A.shells.push({x:TBW-22,y:TCT-50,vx:-40+Math.random()*80,vy:-60-Math.random()*40,t:0});}
    else if(j==='R'||(j==='F'&&det.indexOf('cáscara')>=0)){for(let k=0;k<3;k++)A.shells.push({x:TBW-20,y:TCT-48,vx:-10+Math.random()*30,vy:-30,t:0});}
    A.yolks.push({t:0,x:TBW-26+((A.eggs*13)%34),bits:j==='R'||(j==='F'&&!squash&&det.indexOf('cáscara')>=0)});
    Snd.burst(2600,.03,.3,3);Snd.tone(900,.05,'sine',.03,.08,500);judge(j,det,TBW,52);
  }
  self.draw=function(c){
    const cx=Math.round(camX);c.drawImage(bgc,cx,0,W,H,0,0,W,H);
    const p=P()||{};
    /* puesto 1: tabla de cortar */
    const o0=-cx;
    if(o0>-W){
      const kx=o0+TKX;
      // rodajas: caen de lado y se tumban en un abanico a la izquierda
      const sc=A.scoop>0?inout(Math.min(1,A.scoop/0.6)):0;
      for(const s of A.slices){const k=ease(Math.min(1,s.t/0.28)),tx=o0+96-s.i*13+sc*150,x=Math.round((o0+s.x)+(tx-(o0+s.x))*k),hh=Math.round(30*(1-k)+7*k),ww=Math.round(s.w*(1-k)+22*k);
        if(sc<1)obj(c,l=>{if(k<1)rr(l,x,TCT-10-hh,ww,hh,POT.a,2);else ell(l,x+11,TCT-14+(s.t<0.36?1:0),11+(s.t<0.36?1:0),4-(s.t<0.36?1:0),POT.a);},{sel:true});
        if(k>=1&&sc<1){ell(c,Math.round(x+10),TCT-15,6,2,POT.c);px(c,x+7,TCT-16,C.white);R(c,x+2,TCT-12,18,1,POT.d);}}
      // mondas de piel caídas en la tabla
      for(const q of A.peels){const x=Math.round(o0+q.x),y=Math.round(q.y);if(q.rest){R(c,x,y,4,2,SKIN.d);R(c,x+1,y,2,1,SKIN.l);if(q.s)px(c,x+4,y-1,SKIN.d);}else{R(c,x,y,3,2,SKIN.a);px(c,x+1,y-1,SKIN.d);}}
      if(A.pot&&!A.pot.gone&&!(p.k==='cortar'&&p.cuts>=p.n&&sc>0.98)){
        const pot=A.pot,x0=Math.round(o0+pot.x0+(p.k==='cortar'&&p.cuts>=p.n?sc*160:0)),y=TCT-10-30-Math.round(pot.hop||0);
        // piel y carne: la banda de arriba y la de abajo se pelan por separado (tras girar la patata se intercambian)
        const anySkin=pot.rem[0]>0||pot.rem[1]>0,tb=pot.rolled?1:0,bb=1-tb;
        obj(c,l=>drawPotato(l,x0,y,pot.len,pot.tip,anySkin?SKIN.a:POT.a),{sel:true});
        if(anySkin){c.save();c.beginPath();c.rect(x0-2,y-2,pot.len-pot.rem[tb]+2,17);c.rect(x0-2,y+15,pot.len-pot.rem[bb]+2,18);c.clip();drawPotato(c,x0,y,pot.len,pot.tip,POT.a);c.restore();}
        let skinAt=(xx,yy)=>xx>=x0+pot.len-pot.rem[yy<y+15?tb:bb];
        const PL=pot.peel&&p.k==='pelar'?p:null,cyP=y+15;
        // pelando: la patata gira sobre su eje largo; cada fila de la cara visible es un ángulo de la superficie
        const skinA=al=>!PL.cuts.some(([a0,a1])=>{const m=(a0+a1)/2,h=(a1-a0)/2;return Math.abs(wrapA(al-m))<=h;});
        if(PL){potX.clearRect(0,0,W,H);drawPotato(potX,x0,y,pot.len,pot.tip,POT.a);potX.globalCompositeOperation='source-atop';
          for(let r=y-1;r<y+31;r++){const f=Math.max(-1,Math.min(1,(r+0.5-cyP)/14.5)),al=Math.asin(f)-PL.rot;if(skinA(al)){potX.fillStyle=Math.abs(f)>0.8?SKIN.d:SKIN.a;potX.fillRect(x0-3,r,pot.len+6,1);}
            else if(Math.abs(f)<0.95&&(skinA(al-0.14)||skinA(al+0.14))){potX.fillStyle=SKIN.l;potX.fillRect(x0-3,r,pot.len+6,1);}}
          potX.globalCompositeOperation='source-over';c.drawImage(potC,0,0);
          skinAt=null;}
        // brillo, sombra suave y ojitos de la patata
        c.save();c.globalAlpha=0.6;R(c,x0+5,y+4,Math.max(0,pot.len-20),2,C.white);c.globalAlpha=0.22;R(c,x0+4,y+23,Math.max(0,pot.len-14),4,'#b0763e');c.restore();px(c,x0+8,y+8,C.white);
        if(PL){for(let k=0;k<9;k++){const al=k*2.1+0.4,v=al+PL.rot;if(Math.cos(v)<0.2)continue;const xx=x0+pot.len-10-((k*13)%Math.max(10,pot.len-18)),yy=Math.round(cyP+13*Math.sin(v));const sk=skinA(al);px(c,xx,yy,sk?SKIN.s:'#d9b77a');px(c,xx+1,yy,sk?SKIN.d:POT.d);}}
        else for(const [dx,dy] of [[14,12],[26,18],[22,7],[38,10],[46,20],[54,8],[62,15],[72,11],[80,19]]){const xx=x0+pot.len-dx;if(xx>x0+4){const sk=skinAt(xx,y+dy);px(c,xx,y+dy,sk?SKIN.s:'#d9b77a');px(c,xx+1,y+dy,sk?SKIN.d:POT.d);}}
        if(!pot.tip){ell(c,x0+2,y+15,2,12,POT.c);R(c,x0,y+4,1,22,POT.d);}
        // mano que empuja la patata (solo al cortar; rebota un poco al empujar)
        if(p.k!=='pelar'){const hx=x0+pot.len+1,hy=y+6-Math.round(Math.min(2,pot.push/12));
          obj(c,l=>{rr(l,hx+10,hy-3,16,13,C.pink,4);rr(l,hx-2,hy,15,16,'#ffe1cc',5);rr(l,hx-5,hy+4,6,8,'#ffe1cc',3);},{sel:true});
          R(c,hx+11,hy-2,14,1,C.pinkL);for(const k of [4,8,12])R(c,hx-4,hy+k,3,1,'#f2b9a0');R(c,hx+1,hy+1,9,1,'#fff3ea');}
        if(PL){
          // guía rosa: la línea del pelador (de frente). Solo con la primera patata; luego se desvanece
          if(HP.a>0){const a=HP.a,gc=Math.sin(Core.time*5)>0?C.pinkDD:C.pinkD;c.save();c.globalAlpha=a;
            for(let k=0;k<3;k++){R(c,x0+pot.len+4+k,cyP-2+k,1,5-2*k,gc);}
            for(let xx=x0+4;xx<x0+pot.len-4;xx+=6)R(c,xx,cyP,3,1,gc);
            if(a<1)for(let k=0;k<6;k++)px(c,x0+10+k*12,cyP-4-Math.round((1-a)*16)-(k%3)*3,k%2?C.white:C.pinkL);c.restore();}
          // pelador de mango: mango rosa con agujero, cuello de metal y horquilla que sujeta la cuchilla contra la piel.
          // Descansa a la izquierda de la patata y al tocar barre la tira de delante de punta a punta
          const u=PL.sw?Math.min(1,PL.sw.t/0.24):0,back=PL.sw&&PL.sw.t>0.24?ease(Math.min(1,(PL.sw.t-0.24)/0.08)):0,
            ex=Math.round(x0-3+(u*(pot.len-4))*(1-back)),ey=cyP;
          obj(c,l=>{rr(l,ex-24,ey-3,15,7,C.pinkD,3);R(l,ex-10,ey-1,5,3,C.metalD);R(l,ex-6,ey-5,2,11,C.metal);R(l,ex-5,ey-5,5,2,C.metal);R(l,ex-5,ey+4,5,2,C.metal);R(l,ex,ey-5,2,11,C.metal);},{sel:true});
          R(c,ex-22,ey-2,10,1,C.pinkL);R(c,ex-20,ey,3,1,C.pinkDD);R(c,ex-20,ey+1,3,1,C.pinkDD);R(c,ex-10,ey-1,5,1,C.metalL);
          R(c,ex+1,ey-4,1,9,C.white);R(c,ex,ey-4,1,9,C.metalL);R(c,ex-6,ey-4,1,9,C.metalL);
          if(PL.sw&&u<1&&PL.sw.skin){px(c,ex+3,ey-3,C.white);R(c,ex+2,ey-7,3,2,SKIN.l);R(c,ex+4,ey-9,2,2,SKIN.a);}
        }
      }
      if(p.k==='cortar'&&p.cuts<p.n&&p.hint&&p.hint.a>0&&A.pot){
        // marcas rosas que dividen la patata en N trozos iguales (solo la primera vez; luego se desvanecen)
        const pot=A.pot,end=o0+pot.x0+pot.len,a=p.hint.a,lift=Math.round((1-a)*8),gc=Math.sin(Core.time*5)>0?C.pinkDD:C.pinkD;c.save();c.globalAlpha=a;
        for(let i=1;i<p.N;i++){const g=Math.round(end-p.len+i*p.T);if(g<=kx-1)continue;
          for(let k=0;k<3;k++)R(c,g-2+k,TCT-54+k-lift,5-2*k,1,gc);
          for(let yy=TCT-50;yy<TCT-10;yy+=4)R(c,g,yy-lift,2,3,gc);
          if(a<1)for(let k=0;k<4;k++)px(c,g-2+((k*5+Math.floor(Core.time*20))%5),TCT-16-k*9-Math.round((1-a)*16),k%2?C.white:C.pinkL);}
        c.restore();
      }
      if(p.k==='cortar'){
        // cartelito de la receta con el número de trozos (cifra pixel 3x5 a doble tamaño)
        const tx=o0+TKX-118,ty=TCT-62,DIG={3:'111001111001111',4:'101101111001001',5:'111100111001111',6:'111100111101111'},g=DIG[p.N];
        obj(c,l=>{rr(l,tx,ty,34,24,C.paper,2);},{sel:true});R(c,tx+3,ty+3,28,2,C.pinkD);
        for(let i=0;i<15;i++)if(g[i]==='1')R(c,tx+5+(i%3)*2,ty+8+Math.floor(i/3)*2,2,2,C.lavDD);
        // y N trocitos dibujados al lado
        for(let i=0;i<p.N;i++){const xx=tx+14+(i%3)*6,yy=ty+9+Math.floor(i/3)*6;R(c,xx,yy,5,4,POT.b);R(c,xx,yy,5,1,POT.c);}
      }
      if(p.k!=='pelar'){
      // cuchillo (sube y baja de golpe al cortar) con la mano encima
      const kd=A.knife>0?(A.knife>0.16?ease((0.24-A.knife)/0.08):1-inout((0.16-A.knife)/0.16)):0,ky=Math.round(TCT-88+kd*36-(p.k==='cortar'?(1-Ease.outBack(A.kin))*90:0));
      // cuchillo vertical (como en el boceto): mango oscuro arriba, virola y hoja de metal que acaba en punta justo sobre la línea de corte
      const tipY=ky+41,cx_=kx;
      const bw=yy=>{const t=yy/30;return Math.max(1,Math.round(3.6*Math.sin(Math.PI*Math.min(1,0.15+t*0.85))));};// media anchura de la hoja
      obj(c,l=>{l.fillStyle=C.metal;for(let yy=0;yy<=30;yy++){const w=bw(yy);l.fillRect(cx_-w,tipY-30+yy,w*2+1,1);}
        rr(l,cx_-3,tipY-44,7,13,'#4a3646',2);R(l,cx_-3,tipY-32,7,2,C.metalD);},{sel:true});
      for(let yy=1;yy<30;yy++){const w=bw(yy),y_=tipY-30+yy;px(c,cx_-w+1,y_,C.metalL);if(w>1)px(c,cx_+w-1,y_,C.metalD);if(w>2)px(c,cx_,y_,'#eef0f8');}
      R(c,cx_-2,tipY-43,1,10,'#6e5a70');px(c,cx_+1,tipY-41,C.metalL);px(c,cx_+1,tipY-36,C.metalL);
      if(A.knife>0.12){R(c,kx-8,TCT-11,3,1,C.white);R(c,kx+4,TCT-11,3,1,C.white);px(c,kx-10,TCT-13,C.white);px(c,kx+7,TCT-13,C.white);}
      }
    }
    /* puesto 2: bol, huevos y varillas */
    const o1=W-cx;
    if(o1>-W&&o1<W){
      const bxx=o1+TBW,rim=TCT-34;
      dith(c,bxx-50,TCT-1,100,2,C.lavD);
      obj(c,l=>{l.fillStyle=C.sky;for(let dy=0;dy<31;dy++){const w=Math.round(52*Math.sqrt(1-Math.pow(dy/32,2)));l.fillRect(bxx-w,rim+dy,w*2+1,1);}rr(l,bxx-34,rim+30,69,4,C.skyD,2);},{sel:true});
      for(let dy=3;dy<29;dy++){const w=Math.round(52*Math.sqrt(1-Math.pow(dy/32,2)));R(c,bxx+w-9,rim+dy,7,1,C.skyD);px(c,bxx+w-2,rim+dy,C.skyL);}
      R(c,bxx-47,rim+6,2,11,C.white);R(c,bxx-42,rim+4,14,1,'rgba(255,255,255,0.85)');for(let k=0;k<6;k++){px(c,bxx-26+k*10,rim+17,C.white);px(c,bxx-21+k*10,rim+22,'#e9f5ff');}
      // boca del bol y contenido
      obj(c,l=>{ell(l,bxx,rim,53,6,C.skyL);},{sel:true});ell(c,bxx,rim,49,4,'#b9dcf6');R(c,bxx-40,rim-5,30,1,C.white);
      if(A.bowlSl>0||A.eggs>0){const col=A.beat>0?(A.beat>0.6?'#fff1b0':EGG.beat):'#fff3c8';if(A.eggs>0||A.beat>0)ell(c,bxx,rim+1,Math.min(45,26+A.eggs*8+Math.round(A.beat*10)),3,col);
        if(A.beat<0.5)for(let k=0;k<A.bowlSl;k++){ell(c,bxx-32+((k*17)%64),rim+1-(k%2),4,1,POT.a);px(c,bxx-33+((k*17)%64),rim-(k%2),C.white);}
        for(const y of A.yolks){if(y.t>0.3&&A.beat<0.4){ell(c,y.x+o1,rim+1,4,2,'#ffb53a');px(c,y.x+o1-1,rim,'#fff1c2');if(y.bits)px(c,y.x+o1+4,rim,C.white);}}
        if(A.beat>0){const n=Math.round(A.beat*10);for(let k=0;k<n;k++){const a=A.wa*0.6+k*0.8;px(c,bxx+Math.round(Math.cos(a)*(10+k*3.4)),rim+1+Math.round(Math.sin(a)*2),C.white);}}}
      if(p.k==='huevo'||(ph[pi-1]&&ph[pi-1].k==='huevo'&&p.k!=='batir'&&o1<W)){
        const q=p.k==='huevo'?p:null,ex=bxx-22,press=q&&q.hold?Math.min(4,1+q.c*4):0,trem=q&&q.hold?Math.round(Math.sin(Core.time*60)*0.6):0,ey=rim-17+Math.round(press)+(q?0:-2);
        if(q&&!q.open){
          obj(c,l=>{ell(l,ex+trem,ey,9,12,C.cream);},{sel:true});ell(c,ex-3+trem,ey-5,2,4,C.white);R(c,ex+4+trem,ey-3,2,9,C.creamD);
          // grieta que crece en zigzag
          const len=Math.round(q.c*17);for(let k=0;k<len;k++){px(c,ex-8+k+trem,ey+2+((k%3)===1?-1:(k%3)===2?1:0),C.peachDD);}
          // mano que sujeta el huevo por arriba
          obj(c,l=>{rr(l,ex-3+trem,ey-22,17,12,'#ffe1cc',5);rr(l,ex+10+trem,ey-28,16,12,C.pink,4);rr(l,ex-6+trem,ey-15,6,8,'#ffe1cc',3);},{sel:true});
          R(c,ex+11+trem,ey-27,14,1,C.pinkL);R(c,ex+trem,ey-20,9,1,'#fff3ea');R(c,ex+1+trem,ey-12,9,1,'#f2b9a0');
        }
        else if(q&&q.open){const t=q.open.t,k=ease(Math.min(1,t/0.3));
          if(q.open.squash){obj(c,l=>{ell(l,ex,ey+4,11-Math.round(k*2),5,C.cream);ell(l,ex,ey+8,9,3,'#ffb53a');},{sel:true});}
          else{const sp=Math.round(k*9);c.save();c.beginPath();c.rect(0,0,W,ey+2);c.clip();
            obj(c,l=>{ell(l,ex-sp,ey-Math.round(k*3),9,12,C.cream);},{sel:true});c.restore();
            c.save();c.beginPath();c.rect(0,ey+2,W,40);c.clip();obj(c,l=>{ell(l,ex+sp,ey+Math.round(k*1),9,12,C.cream);},{sel:true});c.restore();
            if(t<0.45){const fy=ey+2+Math.round(Math.pow(t/0.45,2)*16);obj(c,l=>{ell(l,ex,fy,4,4,'#ffb53a');},{sel:true});px(c,ex-1,fy-2,'#fff1c2');px(c,ex-2,fy-1,'#fff1c2');}
            else if(t<0.7){const r=Math.round(4+(t-0.45)*30);R(c,ex-r,rim-1,2,1,C.white);R(c,ex+r-1,rim-1,2,1,C.white);}}}
      }
      for(const s of A.shells){R(c,Math.round(s.x+o1),Math.round(s.y),2,2,C.cream);px(c,Math.round(s.x+o1),Math.round(s.y),C.creamD);}
      if(A.splat>0){const a=Math.min(1,A.splat/0.3);c.save();c.globalAlpha=a;ell(c,bxx-22,rim-5,8,3,'#ffcf5a');px(c,bxx-32,rim-10,'#ffcf5a');px(c,bxx-12,rim-11,'#ffcf5a');R(c,bxx-26,rim-7,4,1,'#fff1c2');c.restore();}
      if(p.k==='batir'||(p.k==='vuelta'&&o1>-W&&ph[pi-1]&&ph[pi-1].k==='batir'&&cam)){
        // varillas que giran dentro del bol; la mano marca el ritmo
        const s=p.k==='batir'?p.s:0,a=A.wa,wx=bxx+Math.round(Math.sin(a)*8*Math.min(1,0.3+s)),wy=rim-3;
        obj(c,l=>{for(let k=0;k<30;k++)l.fillRect(wx+2+Math.round(k*0.6),wy-26-k,3,1);},{sel:true});
        for(let i=0;i<4;i++){const rx=Math.max(1,Math.round(Math.abs(Math.cos(a*1.3+i*0.8))*8));c.save();c.strokeStyle=i%2?C.metalL:C.metalDD;c.lineWidth=1;c.beginPath();c.ellipse(wx+1.5,wy-11.5,rx,13,0,0,Math.PI*2);c.stroke();c.restore();}
        R(c,wx,wy-27,3,4,C.metalD);
        obj(c,l=>{rr(l,wx+16,wy-62,16,14,'#ffe1cc',5);rr(l,wx+26,wy-69,16,12,C.pink,4);},{sel:true});R(c,wx+27,wy-68,14,1,C.pinkL);R(c,wx+17,wy-59,9,1,'#fff3ea');R(c,wx+17,wy-53,8,1,'#f2b9a0');
        if(s>0.2&&p.k==='batir'){const n=Math.round(s*4);for(let k=0;k<n;k++){const t=(Core.time*3+k*0.37)%1;px(c,bxx-20+k*13+Math.round(Math.sin(t*6)*3),rim-2-Math.round(t*8),C.butter);}}
      }
      // medidores a la derecha del bol
      if(p.k==='huevo'&&!p.open&&!cam){drawGauge(c,o1+TGA,44,60,p.c,p.target,0.085,{fill:p.c,col:C.peachD});}
      if(p.k==='batir'&&!cam){drawGauge(c,o1+TGA,44,60,p.s,p.z,0.12);
        const left=p.bt>0.9?1-Math.min(1,(p.bt-0.9)/p.dur):1;rr(c,o1+TGA-8,112,17,5,C.cream,2);R(c,o1+TGA-7,113,Math.round(15*left),3,C.mintDD);}
    }
    /* puesto 3: sartén al fuego y plato */
    const o2=2*W-cx;
    if(o2>-W&&o2<W){
      const px0=o2+TPN,py=TCT-15;
      // llamas suaves
      if(A.pan>0){for(let k=0;k<8;k++){const h=3+((Math.floor(Core.time*12)+k*3)%4);R(c,px0-42+k*12,TCT-4-h,3,h,k%2?C.butterD:'#ff9d6e');px(c,px0-41+k*12,TCT-5-h,C.butter);}}
      const q=p.k==='vuelta'?p:null,charge=q&&q.hold?q.p:0,jerk=A.flip&&A.flip.t<0.12?-3:0,pdy=Math.round(charge*3)+jerk;
      // tortilla dentro de la sartén o volando
      const cooked=EGG.cook[Math.min(4,1+Math.round(A.cook*2))],raw=A.cook>0.3?EGG.cook[0]:EGG.beat;
      const drawTop=(x,y,rx,ry,col)=>{obj(c,l=>{ell(l,x,y,rx,ry,col);},{sel:true});};
      ell(c,px0,py+1+pdy,47,4,'#7d6ea6');ell(c,px0,py+2+pdy,44,2,'#6f6096');
      if(A.pan>0&&!A.serve){
        if(A.flip){const f=A.flip,u=Math.min(1,f.t/f.d),a=f.rot*inout(u),hgt=Math.round(Math.sin(u*Math.PI)*f.h),y=py-2-hgt+pdy,ry=Math.max(1,Math.round(Math.abs(Math.cos(a))*5));
          const showBottom=Math.cos(a)<0,col=showBottom?cooked:raw,off=f.j==='F'&&u>=1?(f.rot>Math.PI?10:-6):0;
          if(u<1){drawTop(px0,y,38,ry+1,col);if(ry>2)R(c,px0-22,y-ry,16,1,'rgba(255,255,255,0.5)');}
          else{const fin=Math.cos(f.rot)<0?cooked:raw;drawTop(px0+off,py+pdy,38,4,fin);if(f.j!=='F'||f.rot<Math.PI)R(c,px0-24+off,py-4+pdy,18,1,'rgba(255,255,255,0.5)');
            if(Math.cos(f.rot)<0)for(let k=0;k<6;k++)px(c,px0-28+off+k*11,py-2+pdy+(k%2),EGG.cook[4]);
            if(f.j==='P'&&f.t<f.d+0.4){const k=(f.t-f.d)/0.4;for(let i=0;i<8;i++){const ang=i/8*Math.PI*2;px(c,px0+Math.round(Math.cos(ang)*(38+k*12)),py-6+Math.round(Math.sin(ang)*(5+k*8)),i%2?C.white:C.butter);}}}}
        else{const rx=Math.round(16+A.pan*22);drawTop(px0,py+pdy,rx,3,raw);R(c,px0-rx+7,py-4+pdy,Math.round(rx*0.6),1,'rgba(255,255,255,0.5)');
          if(A.cook>0.4)for(let k=0;k<5;k++)px(c,px0-rx+6+k*Math.round(rx/2.6),py-2+pdy+(k%2),EGG.cook[2]);}
      }
      obj(c,l=>{l.fillStyle='#a194c8';for(let dy=0;dy<11;dy++){const ins=dy<2?0:Math.floor((dy-1)/1.4);l.fillRect(px0-50+ins,py+dy+pdy,100-2*ins,1);}rr(l,px0+48,py+1+pdy,9,5,'#a194c8',1);rr(l,px0+55,py+pdy-1+Math.round(charge*2),40,7,C.woodDD,3);},{sel:true});
      R(c,px0-48,py+1+pdy,96,1,'#c2b6e2');R(c,px0-44,py+4+pdy,3,5,'#b3a6d6');R(c,px0+30,py+4+pdy,8,1,'#b3a6d6');R(c,px0+57,py+pdy+Math.round(charge*2),36,1,'#b98d68');
      // mano en el mango
      const hx=px0+72,hy=py-5+pdy+Math.round(charge*2);
      obj(c,l=>{rr(l,hx-6,hy,14,12,'#ffe1cc',4);rr(l,hx+6,hy-2,14,11,C.pink,3);},{sel:true});R(c,hx+7,hy-1,12,1,C.pinkL);for(const k of [2,5,8])R(c,hx-5,hy+k,3,1,'#f2b9a0');
      // vertido desde el bol al empezar
      if(q&&q.pre>0.15&&q.pre<1.5&&!cam){
        // el bol entra por la izquierda, se inclina y vierte la mezcla
        const t=1-(q.pre-0.15)/1.35,inn=ease(Math.min(1,t/0.25)),out=inout(Math.max(0,(t-0.8)/0.2)),ang=0.8*inout(Math.min(1,Math.max(0,(t-0.15)/0.2)))*(1-out),
          bcx=Math.round(px0-38-(1-inn)*90-out*70),bcy=60;
        const ca=Math.cos(ang),sa=Math.sin(ang);
        obj(c,l=>{for(let dy=-26;dy<=26;dy++)for(let dx=-28;dx<=28;dx++){const u=dx*ca+dy*sa,v=-dx*sa+dy*ca;
          if(v>=-1&&(u*u)/(24*24)+(v*v)/(17*17)<=1){l.fillStyle=v<1.5?C.skyL:C.sky;l.fillRect(bcx+dx,bcy+dy,1,1);}}},{sel:true});
        obj(c,l=>{rr(l,bcx-38,bcy-8,15,14,'#ffe1cc',5);rr(l,bcx-52,bcy-10,16,13,C.pink,4);},{sel:true});R(c,bcx-36,bcy-6,8,1,'#fff3ea');
        const lx=Math.round(bcx+24*ca),ly=Math.round(bcy+24*sa);
        if(t>0.3&&t<0.82){const w=t<0.4||t>0.75?2:4;R(c,lx-1,ly,w,py-ly,EGG.beat);R(c,lx,ly,1,py-ly,'#fff3b0');px(c,lx-2,py-2,C.white);px(c,lx+w+1,py-3,C.white);}
      }
      // vapor
      for(const s of A.steam){const a=Math.max(0,0.6-s.t*0.45);c.save();c.globalAlpha=a;R(c,Math.round(o2+s.x),Math.round(s.y),3,2,C.white);c.restore();}
      // plato con las tortillas servidas
      const stackY=TCT-4;
      for(let k=0;k<A.plate;k++){obj(c,l=>{ell(l,o2+TPL,stackY-2-k*5,23,4,EGG.cook[3]);ell(l,o2+TPL,stackY-3-k*5,21,3,EGG.cook[2]);},{sel:true});R(c,o2+TPL-14,stackY-5-k*5,12,1,'rgba(255,255,255,0.6)');px(c,o2+TPL+6,stackY-3-k*5,EGG.cook[4]);px(c,o2+TPL-4,stackY-2-k*5,EGG.cook[4]);}
      if(A.serve){const t=inout(Math.min(1,A.serve.t/0.7)),x=px0+(o2+TPL-px0)*t,y=py-3-Math.sin(t*Math.PI)*22+(stackY-4-A.plate*5-(py-3))*t;
        const rxs=Math.round(38-15*t);obj(c,l=>{ell(l,Math.round(x),Math.round(y)+2,rxs,4,EGG.cook[3]);ell(l,Math.round(x),Math.round(y)+1,rxs-2,3,EGG.cook[2]);},{sel:true});R(c,Math.round(x)-rxs+6,Math.round(y)-1,12,1,'rgba(255,255,255,0.6)');}
      if(q&&q.pre<=0&&!A.flip&&!cam){drawGauge(c,o2+TPN+60,36,52,q.p,q.target,0.075,{fill:q.p,col:C.peachD});}
    }
  };
  return self;
}

