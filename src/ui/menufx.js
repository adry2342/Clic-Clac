function iconBottle(l,x,y){rr(l,x-5,y-4,10,18,C.sky,3);rr(l,x-3,y-9,6,6,C.sky,1);rr(l,x-3,y-12,6,3,C.pink,1);rr(l,x-5,y+3,10,5,C.pink,0);}
function iconStapler(l,x,y){rr(l,x-13,y+5,27,4,C.lavD,2);rr(l,x-13,y-1,6,8,C.metalD,2);for(let k=0;k<22;k++){const yy=y-4+Math.floor(k/9);l.fillStyle=C.pink;l.fillRect(x-12+k,yy,1,6-(k>18?k-18:0));}l.fillStyle=C.metal;l.fillRect(x-9,y-2,16,1);}
function iconToast(l,x,y){ell(l,x-4,y-5,5,4,C.peachD);ell(l,x+4,y-5,5,4,C.peachD);rr(l,x-9,y-5,18,15,C.peachD,2);ell(l,x-4,y-4,4,3,C.peachL);ell(l,x+4,y-4,4,3,C.peachL);rr(l,x-7,y-4,14,12,C.peachL,2);}
function iconPan(l,x,y){rr(l,x-12,y-3,20,7,'#a194c8',3);rr(l,x+7,y-2,10,3,C.woodDD,1);ell(l,x-2,y-3,8,2,EGG.cook[2]);}
function iconCamera(l,x,y){rr(l,x-11,y-6,22,15,C.mint,3);rr(l,x-6,y-9,8,4,C.mintD,1);ell(l,x,y+1,5,5,C.metal);ell(l,x,y+1,3,3,C.lavDD);rr(l,x+6,y-4,3,2,C.butter,0);}
/* Menú: el fondo es un patrón CSS que se desliza muy suave (subpíxel); en el lienzo solo aparece,
   de vez en cuando y al azar, un objeto de los niveles que hace algo y se va. */
const MenuFx={a:null,wait:1.2,last:''};
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
  c.clearRect(0,0,W,H);
  if(reduce)return;
  const M=MenuFx;if(!M.a){M.wait-=dt;if(M.wait<=0)menuSpawn();return;}
  const a=M.a;a.t+=dt;const t=a.t,u=t/a.dur;
  if(t>=a.dur){M.a=null;M.wait=1.6+Math.random()*2.2;return;}
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
