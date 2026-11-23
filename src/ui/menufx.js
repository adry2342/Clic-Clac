function iconBottle(l,x,y){rr(l,x-5,y-4,10,18,C.sky,3);rr(l,x-3,y-9,6,6,C.sky,1);rr(l,x-3,y-12,6,3,C.pink,1);rr(l,x-5,y+3,10,5,C.pink,0);}
function iconStapler(l,x,y){rr(l,x-13,y+5,27,4,C.lavD,2);rr(l,x-13,y-1,6,8,C.metalD,2);for(let k=0;k<22;k++){const yy=y-4+Math.floor(k/9);l.fillStyle=C.pink;l.fillRect(x-12+k,yy,1,6-(k>18?k-18:0));}l.fillStyle=C.metal;l.fillRect(x-9,y-2,16,1);}
function iconToast(l,x,y){ell(l,x-4,y-5,5,4,C.peachD);ell(l,x+4,y-5,5,4,C.peachD);rr(l,x-9,y-5,18,15,C.peachD,2);ell(l,x-4,y-4,4,3,C.peachL);ell(l,x+4,y-4,4,3,C.peachL);rr(l,x-7,y-4,14,12,C.peachL,2);}
function iconPan(l,x,y){rr(l,x-12,y-3,20,7,'#a194c8',3);rr(l,x+7,y-2,10,3,C.woodDD,1);ell(l,x-2,y-3,8,2,EGG.cook[2]);}
function iconCamera(l,x,y){rr(l,x-11,y-6,22,15,C.mint,3);rr(l,x-6,y-9,8,4,C.mintD,1);ell(l,x,y+1,5,5,C.metal);ell(l,x,y+1,3,3,C.lavDD);rr(l,x+6,y-4,3,2,C.butter,0);}
/* Menú: el fondo es un patrón CSS que se desliza muy suave (subpíxel); en el lienzo solo aparece,
   de vez en cuando y al azar, un objeto de los niveles que hace algo y se va. */
const MenuFx={a:null,wait:2.6,last:'',bg:null,T:0,clouds:null,pet:null,enter:-1};
// fondo del menú por capas (cielo, colinas lejanas, colinas cercanas con arbolitos, repisa) para que al entrar
// cada una suba a su ritmo; el sol se dibuja aparte y sale despacio
function menuBg(){
  const sky=mk(W,H),c=sky.getContext('2d');
  const band=['#f0ebff','#f3eaff','#f7e9fb','#fbe8f4','#ffe7ee','#ffe8e6','#ffeadf','#ffecda'];
  for(let i=0;i<band.length;i++){const y0=Math.round(i*150/band.length),y1=Math.round((i+1)*150/band.length);R(c,0,y0,W,y1-y0,band[i]);
    if(i>0)for(let x=(i%2)*2;x<W;x+=4)px(c,x,y0,band[i-1]);}
  R(c,0,150,W,H-150,band[band.length-1]);
  const far=mk(W,H),f=far.getContext('2d');
  f.fillStyle='#e3dafb';for(let x=0;x<W;x++){const h=Math.round(16+7*Math.sin(x*0.021+1)+4*Math.sin(x*0.057));f.fillRect(x,158-h,1,h+30);}
  const near=mk(W,H),n=near.getContext('2d');
  n.fillStyle=C.mintD;for(let x=0;x<W;x++){const h=Math.round(9+5*Math.sin(x*0.033+2.4)+2*Math.sin(x*0.11));n.fillRect(x,163-h,1,h+30);}
  n.fillStyle=C.mint;for(let x=0;x<W;x++){const h=Math.round(9+5*Math.sin(x*0.033+2.4)+2*Math.sin(x*0.11));n.fillRect(x,164-h,1,2);}
  const trees=[];
  for(const x of [22,58,104,214,248,296]){const h=Math.round(9+5*Math.sin(x*0.033+2.4)+2*Math.sin(x*0.11));trees.push({x,gy:163-h});}
  const shelf=mk(W,H),s=shelf.getContext('2d');
  R(s,0,164,W,16,C.wood);R(s,0,164,W,1,C.woodL);R(s,0,165,W,1,'#fff3e2');R(s,0,170,W,1,C.woodD);for(let x=7;x<W;x+=29)R(s,x,171,1,9,C.woodD);dith(s,0,176,W,4,C.woodDD);
  return {sky,far,near,trees,shelf};}
// un arbolito que brota: el tronco sube y la copa se hincha con un pequeño rebote
function drawTree(c,x,gy,k){if(k<=0)return;const tk=Math.min(1,k/0.4),ck=backOut(Math.max(0,(k-0.25)/0.75));
  const th=Math.round(4*tk);R(c,x,gy-th,1,th,C.woodD);if(ck>0){const r=Math.max(1,Math.round(4*ck));ell(c,x,gy-3-r,r,r,C.greenD);if(ck>0.6)ell(c,x-1,gy-4-r,2,2,C.green);}}
// paso de la entrada (0..1) para algo que empieza en a y dura d segundos
function ent(a,d){const e=MenuFx.enter;if(e<0)return 0;return Math.min(1,Math.max(0,(e-a)/d));}
function sun(c,y){for(const [r,a] of [[30,0.18],[22,0.3],[15,0.9]]){c.save();c.globalAlpha=a;ell(c,262,y,r,r,'#fff3c4');c.restore();}ell(c,262,y,12,12,'#fff7d8');}
function drawCloud(c,x,y,s,col){ell(c,x,y,9*s,4*s,col);ell(c,x+7*s,y-2*s,7*s,5*s,col);ell(c,x-7*s,y+1*s,6*s,3*s,col);R(c,x-12*s,y+2*s,26*s,2,col);}
function menuSpawn(){
  const kinds=['tostada','coche','botella','grapadora','tortilla','foto'].filter(k=>k!==MenuFx.last);
  const k=kinds[Math.floor(Math.random()*kinds.length)];MenuFx.last=k;
  const side=Math.random()<0.5?-1:1,x=side<0?40+Math.random()*80:200+Math.random()*80;
  const a={k,t:0,x,side,dur:{tostada:2.4,coche:5,botella:4.2,grapadora:2.6,tortilla:2.8,foto:3.6}[k]};
  if(k==='coche'){a.car={key:'coche',t:CARS.coche,dir:side<0?1:-1,col:CARCOL[Math.floor(Math.random()*CARCOL.length)],wheels:[-12,12],spin:0,gy:172,x:0};}
  if(k==='botella'){const T=CONTAINERS[['botellin','leche','pet'][Math.floor(Math.random()*3)]];a.b={t:T,x:0,level:0,vol:0,target:0,ground:176,j:'P',st:'done',bub:[]};}
  MenuFx.a=a;
}
function drawMenuFx(c,dt){
  const M=MenuFx;if(!M.bg)M.bg=menuBg();const B=M.bg;
  if(reduce){c.drawImage(B.sky,0,0);sun(c,46);c.drawImage(B.far,0,0);c.drawImage(B.near,0,0);for(const t of B.trees)drawTree(c,t.x,t.gy,1);c.drawImage(B.shelf,0,0);return;}
  M.T+=dt;const T=M.T;if(M.enter>=0)M.enter+=dt;
  // entrada con calma: el sol sale, las colinas suben una detrás de otra, los árboles brotan y la repisa se asienta
  c.drawImage(B.sky,0,0);
  sun(c,Math.round(46+(1-ease(ent(0.1,1.8)))*70));
  c.drawImage(B.far,0,Math.round((1-ease(ent(0.15,1.3)))*34));
  const ny=Math.round((1-ease(ent(0.35,1.2)))*30);c.drawImage(B.near,0,ny);
  B.trees.forEach((t,i)=>drawTree(c,t.x,t.gy+ny,ent(0.9+((i*3)%6)*0.12,0.7)));
  const sk=ent(0.25,1.0);c.drawImage(B.shelf,0,Math.round((1-backOut(sk))*20));
  // nubes que se mueven muy despacio (dos capas); al entrar llegan desde los lados
  if(!M.clouds)M.clouds=[[20,22,1,3],[140,14,0.8,3],[230,30,1.1,3],[80,64,0.7,6],[200,74,0.9,6],[300,58,0.6,6]];
  M.clouds.forEach(([x0,y,s,v],i)=>{let x=((x0+T*v)%(W+60))-30;const k=ease(ent(0.2+i*0.12,1.6));x+=(1-k)*(x<W/2?-90:90);
    drawCloud(c,Math.round(x),y+Math.round(Math.sin(T*0.4+x0)*1),s,v>4?'#fffaff':'#fbf6ff');});
  // pétalos que caen meciéndose y destellos que parpadean (aparecen poco a poco)
  if(!M.pet){M.pet=[];for(let i=0;i<16;i++)M.pet.push({x:Math.random()*W,y:Math.random()*H,v:5+Math.random()*7,ph:Math.random()*6,sw:4+Math.random()*6,c:i%3});}
  const pn=Math.round(16*ent(1.0,1.6));
  M.pet.forEach((p,i)=>{p.y+=p.v*dt;if(p.y>166){p.y=-4;p.x=Math.random()*W;}if(i>=pn)return;const x=Math.round(p.x+Math.sin(T*0.8+p.ph)*p.sw),y=Math.round(p.y),fl=Math.sin(T*2+p.ph)>0;
    const col=p.c===0?C.pink:p.c===1?C.pinkD:'#ffd6e6';if(fl){R(c,x,y,3,2,col);px(c,x,y,C.pinkL);px(c,x+3,y+1,col);}else{R(c,x,y,2,3,col);px(c,x+1,y,C.pinkL);px(c,x+2,y+1,col);}});
  if(ent(1.4,0.1)>=1)for(let i=0;i<7;i++){const k=(T*0.35+i*0.37)%1;if(k<0.25){const x=(i*47+13)%W,y=12+(i*29)%60,a=Math.sin(k/0.25*Math.PI);c.save();c.globalAlpha=a;R(c,x-1,y,3,1,C.white);R(c,x,y-1,1,3,C.white);c.restore();}}
  if(M.enter<2.4)return; // los objetos de los niveles esperan a que el menú haya terminado de entrar
  if(!M.a){M.wait-=dt;if(M.wait<=0)menuSpawn();return;}
  const a=M.a;a.t+=dt*0.75;const t=a.t,u=t/a.dur;
  if(t>=a.dur){M.a=null;M.wait=2.2+Math.random()*2.4;return;}
  if(a.k==='tostada'){ // salta desde abajo como de una tostadora, da un bote y vuelve a bajar
    const up=t<0.5?backOut(t/0.5):t<1.7?1:1-inout((t-1.7)/0.6),y=Math.round(196-up*56+Math.sin(Math.min(1,Math.max(0,(t-0.5)/1.2))*Math.PI*2)*-3);
    dith(c,a.x-8,178,16,1,C.lavD);obj(c,l=>iconToast(l,a.x,y),{sel:true});
    if(t>0.45&&t<0.9)for(let i=0;i<3;i++){const k=(t-0.45)/0.45;px(c,a.x-12+i*12,y-14-Math.round(k*6),C.butter);}}
  else if(a.k==='coche'){ // cruza de lado a lado con un traqueteo suave
    const car=a.car,p=inout(u);car.x=car.dir>0?-30+p*(W+60):W+30-p*(W+60);car.spin=car.x/3*car.dir;
    car.gy=172-((Math.floor(t*10)%2)&&u>0.05&&u<0.95?1:0);
    dith(c,car.x-17,173,34,2,C.lavD);obj(c,l=>drawCar(l,c,car,false),{sel:true});drawCar(null,c,car,true);}
  else if(a.k==='botella'){ // entra, se llena, da saltitos de alegría y se va
    const b=a.b,T=b.t,inP=ease(Math.min(1,t/0.7)),outP=inout(Math.max(0,(t-3.4)/0.8));
    b.x=a.x+a.side*(1-inP)*90+a.side*outP*110;
    const f=Math.min(1,Math.max(0,(t-0.8)/1.4));b.vol=T.V[Math.round(T.cav*0.82)]*f;b.level=levelFromVol(T,b.vol);
    if(t>2.25&&b.hop==null){b.hop=0;b.cap=C.pink;}if(b.hop!=null)b.hop+=dt;
    dith(c,b.x-T.prof[0],176,T.prof[0]*2,1,C.lavD);obj(c,l=>drawContainer(l,b),{rim:false,sel:true});}
  else if(a.k==='grapadora'){ // sube, grapa dos veces y baja
    const up=t<0.45?backOut(t/0.45):t<2.1?1:1-inout((t-2.1)/0.5),y=Math.round(196-up*38);
    const cl=(t>0.8&&t<0.95)||(t>1.3&&t<1.45);dith(c,a.x-13,178,27,1,C.lavD);
    obj(c,l=>{if(cl){l.save();l.translate(0,2);}iconStapler(l,a.x,y);if(cl)l.restore();},{sel:true});
    if(cl){R(c,a.x-18,y+2,3,1,C.lavDD);R(c,a.x+17,y+2,3,1,C.lavDD);}}
  else if(a.k==='tortilla'){ // la sartén asoma, la tortilla da la vuelta en el aire y cae
    const up=t<0.45?backOut(t/0.45):t<2.3?1:1-inout((t-2.3)/0.5),y=Math.round(194-up*30);
    const ft=Math.min(1,Math.max(0,(t-0.7)/0.9)),ang=ft*Math.PI,ty=y-3-Math.round(Math.sin(ang)*26),ry=Math.max(1,Math.round(Math.abs(Math.cos(ang))*2));
    obj(c,l=>{rr(l,a.x-12,y-3,20,7,'#a194c8',3);rr(l,a.x+7,y-2,10,3,C.woodDD,1);},{sel:true});
    obj(c,l=>ell(l,a.x-2,ty,8,ry,EGG.cook[ft>0.5?3:2]));}
  else if(a.k==='foto'){ // una polaroid cae balanceándose y se revela
    const y=Math.round(100+ease(Math.min(1,t/1.6))*52),x=Math.round(a.x+Math.sin(t*3)*6*(1-Math.min(1,t/1.6))),out=inout(Math.max(0,(t-2.9)/0.7));
    if(out<1){const yy=y+Math.round(out*40);obj(c,l=>rr(l,x-12,yy,24,28,C.paper,2));R(c,x-9,yy+3,18,17,C.skyL);R(c,x-9,yy+14,18,6,C.mint);ell(c,x-2,yy+8,3,2,C.white);
      const dev=Math.max(0,1-t/1.8);if(dev>0){c.fillStyle='rgba(236,232,244,'+dev.toFixed(2)+')';c.fillRect(x-9,yy+3,18,17);}}}
}
function drawParts(c,dt){
  for(const p of Core.parts){p.t+=dt;p.vy+=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;}
  Core.parts=Core.parts.filter(p=>p.t<p.life);
  for(const p of Core.parts){if(p.kind==='star'){R(c,p.x-1,p.y,3,1,p.col);R(c,p.x,p.y-1,1,3,p.col);}else R(c,p.x,p.y,1,2,p.col);}
}

// fondo de la pantalla de precarga: cuadraditos rosas y lilas que se deslizan en diagonal, despacio
function drawIntroBg(c){const t=Core.time*10;R(c,0,0,W,H,C.lavL);
  for(let y=-16;y<H+16;y+=16)for(let x=-16;x<W+16;x+=16){const xx=Math.round(x+(t%16)),yy=Math.round(y+(t%16)),k=((x+y)/16)&1,b=Math.sin(Core.time*1.5+(x+y)*0.03);
    const sz=8+Math.round(b*2);rr(c,xx+8-sz/2,yy+8-sz/2,sz,sz,k?C.pinkL:C.lav,3);}}
