/* =====================================================================
   MINIJUEGO 1 · BOTELLAS EN LA CINTA
   ===================================================================== */
const FX=160,BELT=132,NOZ=60;
// Perfil de cada recipiente: semi-anchura por fila, de abajo arriba.
function profile(segs){const p=[];for(const s of segs){const [n,a,b,curve]=s;for(let k=0;k<n;k++){const t=n>1?k/(n-1):0;const e=curve?smooth(t):t;p.push(Math.round(a+(b-a)*e));}}return p;}
const LIQ={
  agua:['rgba(118,196,255,0.88)','rgba(78,160,235,0.92)','rgba(214,240,255,0.95)','#bfe4ff'],
  naranja:['rgba(255,184,96,0.93)','rgba(242,146,66,0.95)','rgba(255,226,170,0.96)','#ffd29a'],
  fresa:['rgba(255,152,194,0.92)','rgba(232,112,160,0.94)','rgba(255,216,232,0.96)','#ffc2da'],
  limon:['rgba(198,236,124,0.92)','rgba(152,204,84,0.94)','rgba(238,255,198,0.96)','#dff5a8'],
  leche:['rgba(255,252,246,0.98)','rgba(226,218,232,0.98)','#ffffff','#ffffff']
};
// botella redonda: perfil circular con base plana
const ROUNDP=(()=>{const p=[];for(let i=0;i<24;i++){const t=(i+0.5)/24;p.push(Math.max(i<3?8:3,Math.round(13*Math.sqrt(1-Math.pow(2*t-1,2)))));}return p.concat([4,4,4,4,4,4,5,5]);})();
const CONTAINERS={
  botellin:{name:'Botellín',prof:profile([[1,4,4],[1,5,5],[15,6,6],[6,6,3,1],[6,2,2],[2,3,3]]),lip:2,time:1.9,glass:'rgba(214,245,226,0.62)',tint:'#c3ebd2',weight:1,cap:3,liq:'limon',floor:0.4},
  leche:{name:'Botella de leche',prof:profile([[1,6,6],[1,7,7],[24,8,8],[7,8,5,1],[6,5,5],[2,6,6]]),lip:2,time:2.4,glass:'rgba(240,246,255,0.6)',tint:'#e3ecf7',weight:2,cap:6,liq:'leche',floor:0.4},
  pet:{name:'Botella de agua',prof:profile([[1,7,7],[1,8,8],[6,9,9],[1,8,8],[10,9,9],[1,8,8],[13,9,9],[10,9,3,1],[7,3,3],[2,4,4]]),lip:2,time:2.7,glass:'rgba(222,240,255,0.55)',tint:'#d5e8fa',weight:2,cap:4,label:[9,19],liq:'agua',floor:0.4},
  refresco:{name:'Refresco con cintura',prof:profile([[1,7,7],[1,8,8],[8,9,9],[7,9,4,1],[3,4,4],[7,4,9,1],[6,9,9],[8,9,3,1],[5,3,3],[2,4,4]]),lip:2,time:2.6,glass:'rgba(255,236,214,0.5)',tint:'#ffe3c6',weight:3,cap:4,liq:'naranja',floor:0.1,tmax:34},
  garrafa:{name:'Garrafa con asa',prof:profile([[1,10,10],[1,11,11],[8,11,11],[4,11,16,1],[18,16,16],[8,16,5,1],[4,4,4],[2,5,5]]),lip:2,time:3.4,glass:'rgba(226,238,255,0.5)',tint:'#d7e4f8',weight:3,cap:5,handle:[16,31],liq:'agua',floor:0.3},
  matraz:{name:'Matraz',prof:profile([[1,15,15],[1,16,16],[24,16,5,0],[7,4,4],[2,5,5]]),lip:2,time:2.5,glass:'rgba(255,228,240,0.5)',tint:'#ffdcea',weight:2,cap:4,liq:'fresa',floor:0.06,tmax:21},
  redonda:{name:'Botella redonda',prof:ROUNDP,lip:2,time:2.6,glass:'rgba(236,250,222,0.5)',tint:'#e2f5cf',weight:2,cap:5,liq:'limon',floor:0.08,tmax:23}
};
for(const k in CONTAINERS){
  const T=CONTAINERS[k];T.key=k;T.h=T.prof.length;T.cav=T.h-T.lip;T.hw=Math.max(...T.prof);T.L=LIQ[T.liq];
  const mx=Math.pow(T.hw-1,2);T.V=[0];
  for(let i=0;i<T.cav+3;i++){const hw=T.prof[Math.min(i,T.h-1)]-1;let a=Math.max(hw*hw,T.floor*mx);if(T.handle&&i>=T.handle[0]&&i<=T.handle[1])a+=0.7*mx;T.V.push(T.V[i]+a);}
  T.vol=T.V[T.cav];
}
function levelFromVol(T,v){const V=T.V;for(let i=0;i<V.length-1;i++){if(v<V[i+1])return i+(v-V[i])/(V[i+1]-V[i]);}return V.length-1;}

function curtW(y){return y<44?Math.round(13-(y-8)/36*6):Math.round(7+smooth((y-44)/33)*8);}
function drawBottlesBg(c){
  // pared de azulejos
  R(c,0,0,W,100,C.mint);
  for(let y=0,row=0;y<100;y+=10,row++){R(c,0,y+9,W,1,C.mintD);for(let x=(row%2)*8;x<W;x+=16)R(c,x,y,1,9,C.mintD);}
  for(let y=0,row=0;y<100;y+=10,row++)for(let x=(row%2)*8;x<W;x+=16)R(c,x+1,y,15,1,C.mintL);
  dith(c,0,0,W,3,C.mintD);
  // haz de luz de la ventana sobre la pared
  for(let y=74;y<100;y++){const x0=206-(y-74)*1.2,x1=302-(y-74)*1.2;dith(c,x0,y,x1-x0,1,C.mintL,y);}
  // zócalo
  // zócalo suave, sin contorno oscuro (no se confunde con la marca de llenado)
  R(c,0,96,W,6,C.cream);R(c,0,96,W,1,'#f6fff9');R(c,0,101,W,1,C.creamD);
  R(c,0,102,W,64,C.lavL);
  for(let y=102;y<132;y++){const x0=176-(y-74)*1.2,x1=272-(y-74)*1.2;dith(c,x0,y,x1-x0,1,'#f8f5ff',y);}
  obj(c,l=>{for(let x=6;x<W;x+=44)rr(l,x,108,36,52,C.lav,2);},{out:false});
  for(let x=6;x<W;x+=44){R(c,x+3,111,30,1,C.lavL);}
  dith(c,0,102,W,2,C.lavD);
  // rodapié y suelo de madera
  obj(c,l=>{R(l,-2,161,W+4,5,C.cream);},{aa:false});
  R(c,0,166,W,14,C.peach);R(c,0,166,W,1,C.peachDD);R(c,0,167,W,1,C.peachL);
  for(let x=0,k=0;x<W;x+=26,k++){R(c,x,168+(k%2)*6,1,6,C.peachD);}
  R(c,0,173,W,1,C.peachD);dith(c,0,167,W,2,C.peachD);
  // ventana con cortinas
  obj(c,l=>{rr(l,206,12,96,62,C.cream,2);});
  const sx=210,sy=16,sw=88,sh=54;
  R(c,sx,sy,sw,sh,C.skyD);dith(c,sx,sy+14,sw,4,C.sky);R(c,sx,sy+18,sw,18,C.sky);dith(c,sx,sy+36,sw,4,C.skyL);R(c,sx,sy+40,sw,14,C.skyL);
  c.save();c.beginPath();c.rect(sx,sy,sw,sh);c.clip();
  ell(c,236,74,34,12,C.green);ell(c,284,76,30,10,C.greenD);dith(c,sx,sy+sh-6,sw,2,C.greenD,1);R(c,sx,sy+sh-4,sw,4,C.greenD);
  c.restore();
  R(c,sx,sy+sh,sw,1,C.creamD);
  R(c,253,sy,2,sh,C.cream);R(c,sx,41,sw,2,C.cream);
  obj(c,l=>{
    rr(l,198,5,112,3,C.woodD,1);rr(l,195,4,5,5,C.pinkD,2);rr(l,308,4,5,5,C.pinkD,2);
    // cortinas
    l.fillStyle=C.pink;for(let y=8;y<78;y++){const w=curtW(y);l.fillRect(200,y,w,1);l.fillRect(308-w,y,w,1);}
    rr(l,202,72,104,5,C.cream,1);
  });
  for(let y=9;y<77;y++){const w=curtW(y);px(c,200+Math.round(w*0.35),y,C.pinkD);px(c,200+Math.round(w*0.7),y,C.pinkL);px(c,307-Math.round(w*0.35),y,C.pinkD);px(c,307-Math.round(w*0.7),y,C.pinkL);}
  rr(c,199,44,10,3,C.butterD,1);rr(c,299,44,10,3,C.butterD,1);
  // reloj
  c.save();c.translate(0,10);
  obj(c,l=>{ell(l,38,34,14,14,C.pink);});
  ell(c,38,34,11,11,C.cream);dith(c,29,40,19,4,C.creamD);
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2;px(c,38+Math.round(Math.sin(a)*9),34-Math.round(Math.cos(a)*9),i%3?C.lavD:C.pinkDD);}
  R(c,38,27,1,7,C.out);R(c,38,34,5,1,C.out);px(c,38,34,C.pinkDD);px(c,32,28,C.white);px(c,33,27,C.white);
  c.restore();
  // cartel
  obj(c,l=>{rr(l,66,14,32,40,C.pinkL,2);});
  R(c,70,18,24,32,C.pink);dith(c,70,44,24,6,C.pinkD);
  [1,1,3,3,5,7,9,11,11,11,11,9,7].forEach((w,k)=>{R(c,82-(w>>1),24+k,w,1,C.skyD);if(w>4)R(c,82-(w>>1)+1,24+k,w-3,1,C.sky);});px(c,79,32,C.white);px(c,79,33,C.white);px(c,80,31,C.white);
  R(c,73,21,18,2,C.pinkDD);
  rr(c,64,12,6,3,C.butter,1);rr(c,94,12,6,3,C.butter,1);
  // estante con planta
  obj(c,l=>{
    rr(l,108,48,44,4,C.wood,1);R(l,114,52,3,6,C.woodD);R(l,143,52,3,6,C.woodD);
    rr(l,116,36,13,12,C.peachD,2);rr(l,114,34,17,4,C.peach,1);
    ell(l,118,28,4,6,C.greenD);ell(l,127,27,4,6,C.greenD);ell(l,122,24,3,8,C.green);
  });
  R(c,122,20,1,12,C.greenDD);R(c,117,26,1,5,C.greenDD);R(c,128,25,1,5,C.greenDD);
  // cinta transportadora
  obj(c,l=>{
    rr(l,-4,132,W+8,12,C.belt,1);
    for(const lx of [16,108,206,298]){R(l,lx,144,6,22,C.metal);rr(l,lx-2,163,10,3,C.metalD,1);}
    R(l,-4,152,W+8,3,C.metalD);
  });
  R(c,0,135,W,1,C.beltD);R(c,0,143,W,1,C.beltD);
}
// máquina llenadora (se dibuja aparte para poder retirarla al cambiar de fase)
// llenadora: depósito con el líquido, manómetro, engranaje y llave; todo se anima mientras sale líquido
function drawFiller(c,oy,S){
  S=S||{};const T=Core.time,on=!!S.on,L=S.L||[C.sky,C.skyD,C.skyL,C.skyD],hum=on&&Math.floor(T*28)%2?1:0,y=oy+hum;
  obj(c,l=>{R(l,155,-2,10,18+y,C.metal);rr(l,136,14+y,58,36,C.lav,6);rr(l,150,48+y,20,6,C.metalD,2);R(l,155,53+y,10,4,C.metal);rr(l,156,56+y,8,4,C.metal,1);
    rr(l,188,34+y,10,10,C.metalD,5);},{sel:true});
  // tubo de entrada: flechitas de líquido bajando cuando está abierto
  R(c,157,0,2,14+y,C.metalL);R(c,163,0,1,14+y,C.metalD);
  if(on){for(let k=0;k<4;k++){const yy=Math.round((T*40+k*5)%18)-2;if(yy+y<14+y&&yy>=0){px(c,159,yy+y,L[0]);px(c,160,yy+y+1,L[0]);px(c,161,yy+y,L[0]);}}}
  // cuerpo: brillo arriba, sombra abajo, tornillos
  R(c,139,17+y,52,1,C.lavL);R(c,139,46+y,52,2,C.lavD);for(const [x,yy] of [[139,17],[190,17],[139,46],[190,46]])px(c,x,yy+y,C.lavDD);
  // depósito de cristal con el líquido de la botella que toca
  rr(c,140,20+y,14,24,'#eef3ff',3);const lvl=Math.round(15+Math.sin(T*0.7)*2-(on?((T*3)%4):0)),top=42+y-lvl;
  R(c,141,top,12,42+y-top,L[0]);R(c,151,top,2,42+y-top,L[1]);
  for(let x=141;x<153;x++)px(c,x,top+(Math.sin(T*(on?9:3)+x*0.8)>0.3?0:-1),L[2]);
  if(on)for(let k=0;k<4;k++){const by=42+y-Math.round(((T*14+k*6)%lvl));if(by>top)px(c,143+((k*5)%8),by,'rgba(255,255,255,0.85)');}
  R(c,141,21+y,1,22,'rgba(255,255,255,0.9)');R(c,140,30+y,3,1,C.lavDD);R(c,140,36+y,3,1,C.lavDD);
  // manómetro: la aguja tiembla con el chorro
  ell(c,180,25+y,6,6,C.out);ell(c,180,25+y,5,5,C.cream);
  const ang=-2.4+(on?1.6+Math.sin(T*23)*0.18+(S.mul||1)*0.6:0.2+Math.sin(T*1.5)*0.05);
  for(let r=1;r<=4;r++)px(c,180+Math.round(Math.cos(ang)*r),25+y+Math.round(Math.sin(ang)*r),C.pinkDD);px(c,180,25+y,C.out);
  for(let k=0;k<5;k++){const a=-2.6+k*0.95;px(c,180+Math.round(Math.cos(a)*4),25+y+Math.round(Math.sin(a)*4),C.lavD);}
  // luz de estado
  const blink=Math.floor(T*6)%2;ell(c,186,16+y,2,2,on?(blink?'#7fe0a8':C.mintDD):C.pinkD);if(on&&blink){c.save();c.globalAlpha=0.35;ell(c,186,16+y,4,4,'#bff5d6');c.restore();}
  // engranaje lateral
  const ga=on?T*6:T*0.4;ell(c,193,39+y,3,3,C.metal);for(let k=0;k<6;k++){const a=ga+k*Math.PI/3;px(c,193+Math.round(Math.cos(a)*4),39+y+Math.round(Math.sin(a)*4),C.metalDD);}px(c,193,39+y,C.metalDD);
  // llave del grifo: gira al abrir
  const va=on?T*5:0;R(c,152,51+y,16,1,C.metalL);for(let k=0;k<4;k++){const a=va+k*Math.PI/2;px(c,160+Math.round(Math.cos(a)*3),51+y+Math.round(Math.sin(a)*1),C.metalDD);}
  R(c,158,59+y,4,2,C.metalDD);
  // gotita al cerrar
  if(S.stopT!=null&&S.stopT<0.7){const k=S.stopT/0.7;const dy=Math.round(k*k*40);if(k<0.85){px(c,160,61+y+dy,L[0]);px(c,160,62+y+dy,L[1]);}}
  // vaho de la bomba
  if(on)for(let k=0;k<3;k++){const ph=(T*1.2+k/3)%1;c.save();c.globalAlpha=0.6*(1-ph);ell(c,196+Math.round(ph*8),30+y-Math.round(ph*10),1+Math.round(ph*2),1+Math.round(ph*2),C.white);c.restore();}
}
// taponadora: tubo con tapones de colores, cuerpo rosa y boquilla que suelta el tapón
const CAPY=66,CAPG=760;
function drawCapper(c,oy,cols,load,kick,S){
  S=S||{};const T=Core.time,sh=S.shift||0,ready=load;
  obj(c,l=>{rr(l,150,-4+oy,20,26,'rgba(236,244,255,0.9)',4);rr(l,136,20+oy,58,30,C.pink,6);rr(l,152,49+oy,16,5,C.metalD,2);rr(l,152,52+oy+kick,16,6,C.metal,2);rr(l,148,57+oy+kick,24,5,C.metalD,2);
    rr(l,188,26+oy,10,18,C.pinkD,3);},{sel:true});
  // tubo de cristal con los tapones: bajan un hueco cada vez que sueltas uno
  c.save();c.beginPath();c.rect(151,-4+oy,18,26);c.clip();
  for(let k=0;k<6;k++){const col=cols[k%cols.length],yy=Math.round(18+oy-k*5+ (1-ease(Math.min(1,sh)))*-5*0);const dropY=Math.round((1-ease(Math.min(1,sh)))*-5);
    rr(c,153,yy+dropY,14,4,col,1);R(c,154,yy+dropY,12,1,'rgba(255,255,255,0.6)');R(c,154,yy+dropY+3,12,1,'rgba(60,40,90,0.18)');}
  c.restore();R(c,152,-2+oy,1,24,'rgba(255,255,255,0.9)');R(c,167,-2+oy,1,24,'rgba(150,170,210,0.5)');
  R(c,139,23+oy,52,1,C.pinkL);R(c,139,46+oy,52,2,C.pinkDD);for(const [x,y] of [[139,23],[190,23],[139,46],[190,46]])px(c,x,y+oy,C.pinkDD);
  // rueda clasificadora: gira un cuarto de vuelta por tapón
  const wa=(S.turns||0)*Math.PI/2+(1-ease(Math.min(1,sh)))*-Math.PI/2;
  ell(c,147,35+oy,8,8,C.pinkD);ell(c,147,35+oy,7,7,C.pinkL);
  for(let k=0;k<4;k++){const a=wa+k*Math.PI/2,x=147+Math.round(Math.cos(a)*4),y=35+oy+Math.round(Math.sin(a)*4);rr(c,x-2,y-1,4,3,cols[(k+1)%cols.length],1);}
  ell(c,147,35+oy,2,2,C.cream);px(c,147,35+oy,C.pinkDD);
  // panel con lucecitas: verde = listo, ámbar = recargando
  rr(c,162,28+oy,22,10,C.pinkL,2);
  for(let k=0;k<3;k++){const on=ready?(Math.floor(T*4)%3===k):k===0;ell(c,166+k*7,33+oy,2,2,on?(ready?'#7fe0a8':C.butterD):'#e7b9cb');}
  // muelle del pistón y su resorte al disparar
  const cz=Math.max(0,kick);for(let k=0;k<4;k++)R(c,190,29+oy+k*(3+Math.round(cz/2)),6,1,C.metalD);R(c,192,27+oy,2,16,'rgba(255,255,255,0.4)');
  if(ready){const col=cols[0];rr(c,155,62+oy+kick,10,4,col,1);R(c,156,62+oy+kick,8,1,'rgba(255,255,255,0.6)');}
  R(c,153,53+oy+kick,14,1,C.metalL);
  // bufido de aire al soltar
  if(S.puff!=null&&S.puff<0.35){const k=S.puff/0.35;c.save();c.globalAlpha=0.8*(1-k);for(const d of [-1,1])ell(c,160+d*Math.round(10+k*10),62+oy,2+Math.round(k*3),1+Math.round(k*2),C.white);c.restore();}
}
function sqOf(b){if(b.an==null)return 1;const t=b.an;return 1-0.13*Math.exp(-7*t)*Math.cos(20*t);}
// saltitos de alegría al acertar de lleno: dos botes con aplastamiento suave al caer
function hopOf(b){if(b.hop==null||b.hop>0.72)return 0;const t=b.hop,k=Math.floor(t/0.36),f=(t%0.36)/0.36;return Math.round(Math.sin(f*Math.PI)*(k===0?7:4));}
function drawContainer(l,b){
  const T=b.t,cx=Math.round(b.x),P=T.prof,lv=b.level,wr=Math.floor(lv+0.5),sy=sqOf(b),sx=1+(1-sy)*0.9,B0=(b.ground||BELT)-1-hopOf(b);
  const Y=i=>B0-Math.round(i*sy),HW=i=>Math.round(P[Math.min(i,T.h-1)]*sx);
  const rows=Math.round(T.h*sy);
  for(let k=0;k<rows;k++){
    const i=Math.min(T.h-1,Math.floor(k/sy)),y=B0-k,hw=Math.round(P[i]*sx),x0=cx-hw,w=hw*2;
    l.fillStyle=T.glass;l.fillRect(x0,y,w,1);
    if(i<wr&&hw>1){
      const L=T.L;l.fillStyle=L[0];l.fillRect(x0+1,y,w-2,1);l.fillStyle=L[1];l.fillRect(x0+w-3,y,2,1);
      if(i===wr-1){l.fillStyle=L[2];l.fillRect(x0+1,y,w-2,1);}
      if(i<2){l.fillStyle=L[1];l.fillRect(x0+1,y,w-2,1);}
    }
    if(hw>3){l.fillStyle='rgba(120,140,190,0.28)';l.fillRect(x0+w-3,y,2,1);l.fillStyle='rgba(255,255,255,0.7)';l.fillRect(x0+w-1,y,1,1);}
    if(i<wr&&hw>4&&i>2&&i<wr-1){l.fillStyle='rgba(225,245,255,0.75)';l.fillRect(x0+2,y,1,1);}
    if(i>1&&i<T.cav-1&&hw>2){l.fillStyle='rgba(255,255,255,0.85)';l.fillRect(x0+1,y,1,1);if(hw>6&&i>3&&i<T.cav*0.55){l.fillRect(x0+3,y,1,1);}}
  }
  if(T.label){
    const [a,z]=T.label;for(let i=a;i<z;i++){if(i<wr)continue;const y=Y(i),hw=HW(i);l.fillStyle=(i===a||i===z-1)?'rgba(243,154,192,0.7)':'rgba(255,194,216,0.45)';l.fillRect(cx-hw,y,hw*2,2);}
    const ym=Y(Math.round((a+z)/2));l.fillStyle=Math.round((a+z)/2)<wr?'rgba(255,255,255,0.5)':C.white;for(let x=-6;x<6;x++){l.fillRect(cx+x,ym+(Math.floor((x+20)/3)%2),1,1);}
  }
  if(T.handle){
    // asa hueca: un tubo de cristal unido al cuerpo arriba y abajo; el agua también entra por él
    const [ha,hb]=T.handle;
    for(let i=ha;i<=hb;i++){const y=Y(i),E=cx+HW(i),conn=i<ha+3||i>hb-3,sh=Math.round(sy)>0?Math.max(1,Math.round(1*sy)):1;
      const x0=conn?E-1:E+4,x1=E+7;l.fillStyle=T.glass;l.fillRect(x0,y,x1-x0,sh);
      if(i<wr){l.fillStyle=T.L[0];l.fillRect(conn?E-1:E+4,y,(conn?E+6:E+6)-(conn?E-1:E+4),sh);if(i===wr-1){l.fillStyle=T.L[2];l.fillRect(conn?E-1:E+4,y,conn?7:2,1);}}
      else if(!conn){l.fillStyle='rgba(255,255,255,0.7)';l.fillRect(E+4,y,1,1);}
    }
  }
  if(b.cap){const cw=Math.round(T.cap*sx),ty=Y(T.h-1)-4,cxx=cx+(b.capDx||0);rr(l,cxx-cw,ty,cw*2,4,b.cap,1);l.fillStyle='rgba(60,40,90,0.22)';l.fillRect(cxx-cw+1,ty+3,cw*2-2,1);l.fillRect(cxx+cw-2,ty+1,1,2);}
  if(!b.j||b.st==='stop'||b.st==='spill'){
    const ty=Y(b.target)+1,hwT=HW(b.target),xl=cx-hwT,xr=cx+hwT;
    l.fillStyle='#ff9cc4';l.fillRect(xl-4,ty-1,1,3);l.fillRect(xl-3,ty,1,1);l.fillRect(xl-5,ty-1,1,3);
    l.fillRect(xr+3,ty-1,1,3);l.fillRect(xr+2,ty,1,1);l.fillRect(xr+4,ty-1,1,3);
  }
}
function drawContainerTop(c,b){
  const T=b.t,cx=Math.round(b.x),sy=sqOf(b),sx=1+(1-sy)*0.9,B0=(b.ground||BELT)-1-hopOf(b),Y=i=>B0-Math.round(i*sy);
  const ty=Y(b.target)+1,hw=Math.round(T.prof[Math.min(b.target,T.h-1)]*sx);
  c.save();c.globalAlpha=0.75+0.25*Math.sin(Core.time*3.8);R(c,cx-hw+1,ty,hw*2-2,1,'#ff7fb0');R(c,cx-hw+1,ty-1,hw*2-2,1,'rgba(255,209,226,0.8)');c.restore();
  if(b.cap){const cw=Math.round(T.cap*sx),y=Y(T.h-1)-4;R(c,cx-cw+1,y+1,cw*2-2,1,'rgba(255,255,255,0.6)');
    if(b.j==='P'){px(c,cx,y-3,C.butter);px(c,cx-1,y-2,C.butter);px(c,cx+1,y-2,C.butter);px(c,cx,y-2,C.white);px(c,cx,y-1,C.butter);}}
}
function Bottles(rng,preview){
  // Fase 1: llenar hasta la línea. Fase 2: las mismas botellas vuelven y hay que taparlas
  // soltando el tapón con antelación (cae, y cada botella tiene su altura).
  const N1=9,N2=9,TOTAL=N1+N2,PRACTICE=0,N=N1;
  const pool=[];for(const k in CONTAINERS)for(let i=0;i<CONTAINERS[k].weight;i++)pool.push(CONTAINERS[k]);
  const bs=[];let px0=-20,prev=null;
  for(let i=0;i<N;i++){
    let t=pool[Math.floor(rng()*pool.length)];if(i===0)t=CONTAINERS.pet;if(prev&&t===prev&&rng()<0.7)t=pool[Math.floor(rng()*pool.length)];
    if(prev)px0-=prev.hw+t.hw+(t.handle?8:0)+14+Math.floor(rng()*24);
    const prog=i/(N-1);
    const hi=Math.min(t.cav-1,t.tmax||t.cav-1),lo=Math.max(4,Math.round(t.cav*0.4));
    let target=Math.round(lo+rng()*(hi-lo));
    if(t.key==='refresco'&&rng()<0.45)target=17+Math.floor(rng()*4);
    if(t.handle&&rng()<0.5)target=t.handle[0]+3+Math.floor(rng()*(t.handle[1]-t.handle[0]-5));
    const fr=rng(),flow=i<2?'steady':fr<0.2+prog*0.25?'pulse':fr<0.38+prog*0.35?'surge':'steady';
    const rate=t.vol/t.time*(1+prog*0.45)*(0.9+rng()*0.2);
    bs.push({x:px0,t,target,vol:0,level:0,st:'wait',time:0,rate,flow,ph:rng()*6,mul:1,delay:0.08+rng()*0.2,practice:false,j:null,cap:null,bub:[],
      capCol:[C.pink,C.mintDD,C.butterD,C.lavD,C.skyD,C.peachD][Math.floor(rng()*6)],cj:null});
    prev=t;
  }
  let cur=0,belt=0,bv=0,endT=0,ended=false,phase=1,swapT=0,v2=60,cap=null,reload=0,kick=0,done=0,shiftT=9,turns=0,puffT=9;const fly=[];
  const bg=mk(W,H);drawBottlesBg(bg.getContext('2d'));grain(bg.getContext('2d'),11,4);
  if(preview){const b=bs[0];b.x=FX;b.st='fill';b.vol=b.t.V[Math.max(0,b.target-3)];b.level=levelFromVol(b.t,b.vol);bs[1].x=FX-b.t.hw-bs[1].t.hw-16;}
  function moveAll(mv){for(const o of bs)o.x+=mv;belt+=mv;}
  function lineUp(){ // las botellas llenas vuelven por la izquierda, en otro orden y más juntas
    let x=60;const order=bs.slice();for(let i=order.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
    order.forEach((b,i)=>{if(i>0)x-=order[i-1].t.hw+b.t.hw+(b.t.handle?8:0)+26+Math.floor(rng()*30);b.x=x;b.st='done';b.hop=null;b.an=null;b.bub=[];
      if(b.j==='F'&&b.level>b.t.cav)b.level=b.t.cav;b.cap=null;b.cj=null;});
  }
  function goPhase2(){phase=2;lineUp();v2=58+rng()*6;reload=0;}
  if(TDEMO==='cap'){for(const b of bs){b.level=b.target;b.vol=b.t.V[b.target];b.j='P';}cur=N;goPhase2();}TDEMO=null;
  const topY=b=>BELT-b.t.h-hopOf(b);
  const landT=b=>Math.sqrt(2*Math.max(1,topY(b)-CAPY)/CAPG);
  const capJ=(b,j,det)=>{b.cj=j;done++;Core.judge(j,FX,topY(b)-14,false,det);};
  return {_bs:bs,_ph:()=>({phase,v:v2,cap,reload,landT,topY}),unit:'Botella',total:TOTAL,mood:'botellas',
    inPractice(){return false;},
    progress(){return done;},
    cue(){return phase===1?'Fase 1 · Llena hasta la línea rosa':phase===2?'Fase 2 · Suelta el tapón con antelación: cae un poquito':'';},
    update(dt){
      for(const o of bs){if(o.an!=null)o.an+=dt;if(o.hop!=null)o.hop+=dt;for(const q of o.bub){q.y+=q.v*dt;}o.bub=o.bub.filter(q=>q.y<o.level-1);}
      if(phase===2){
        if(swapT<1.9){swapT+=dt;return;}
        moveAll(v2*dt);reload=Math.max(0,reload-dt);kick=Math.max(0,kick-dt);shiftT+=dt;puffT+=dt;
        if(cap){cap.vy+=CAPG*dt;cap.y+=cap.vy*dt;
          if(cap.b&&cap.y>=topY(cap.b)){const b=cap.b,dx=FX-b.x,a=Math.abs(dx);
            const ta=a/v2,j=a<=1.1||ta<=0.05?'P':a<=2.3||ta<=0.1?'B':a<=3.7||ta<=0.16?'R':'F'; // mismo margen en tiempo que el resto de juegos
            if(j==='F'){fly.push({x:FX,y:topY(b),vx:(dx>0?40:-40)+v2,vy:-90,t:0,col:cap.col,w:b.t.cap});capJ(b,'F',dx>0?'◀ Pronto: rebotó':'Tarde ▶: rebotó');}
            else{b.cap=cap.col;b.capDx=j==='P'?0:Math.round(Math.max(-2,Math.min(2,-dx)));b.an=0;Snd.cap();if(j==='P')b.hop=0;capJ(b,j,j==='P'?'':(dx>0?'◀ Pronto':'Tarde ▶'));}
            cap=null;}
          else if(!cap.b&&cap.y>=BELT-6){fly.push({x:FX,y:BELT-6,vx:v2+30,vy:-60,t:0,col:cap.col,w:4});cap=null;}}
        for(const f of fly){f.t+=dt;f.x+=f.vx*dt;f.y+=f.vy*dt;f.vy+=500*dt;}while(fly.length&&fly[0].t>1.2)fly.shift();
        for(const b of bs){if(!b.cj&&!(cap&&cap.b===b)&&b.x>FX+b.t.hw+8)capJ(b,'F','Se fue sin tapón');}
        if(done>=TOTAL&&!cap){endT+=dt;if(endT>1&&!ended){ended=true;Core.finish();}}
        return;
      }
      const b=bs[cur];
      if(!b){bv+=(140-bv)*Math.min(1,dt*4);moveAll(bv*dt);endT+=dt;
        if(endT>0.9){endT=0;bv=0;swapT=0;goPhase2();Core.banner('Fase 2','¡Tapones!','Toca para soltar el tapón. Cae un poquito: adelántate al cuello de la botella.',2,'cap');Snd.waterStop();}return;}
      if(b.st==='wait'){const dist=FX-b.x,tv=Math.min(170,26+dist*3.4);bv+=(tv-bv)*Math.min(1,dt*7);let mv=bv*dt;if(dist<=0.4||b.x+mv>=FX){mv=Math.max(0,FX-b.x);b.st='pre';b.time=0;bv=0;}moveAll(mv);}
      else if(b.st==='pre'){b.time+=dt;if(b.time>=b.delay){b.st='fill';b.time=0;Snd.waterStart();}}
      else if(b.st==='fill'){
        b.time+=dt;
        const m=b.flow==='pulse'?(0.22+1.6*Math.max(0,Math.sin(b.ph+b.time*Math.PI*2*1.7)))/0.73:b.flow==='surge'?0.45+1.05*smooth(Math.min(1,b.time/2.4)):1;
        b.mul+=(m-b.mul)*Math.min(1,dt*14);
        b.vol+=b.rate*b.mul*dt*(1.45-0.7*Math.min(1,b.level/Math.max(1,b.target)));b.level=levelFromVol(b.t,b.vol);Snd.waterLevel(b.level/b.t.cav);
        if(Math.random()<dt*3&&b.level>3&&b.bub.length<4)b.bub.push({x:(Math.random()-.5)*(b.t.prof[0]-2)*1.6,y:0,v:8+Math.random()*10});
        if(b.level>=b.t.cav+1.5){b.level=b.t.cav+1.5;b.st='spill';b.time=0;b.j='F';b.an=0;Snd.waterStop();done++;
          Core.judge('F',FX,BELT-b.t.h-10,false,'▲ ¡Te pasaste! Rebosó');Core.drops(FX,BELT-b.t.h,12);}
      }
      else{b.time+=dt;if(b.st==='stop'&&b.j==='P'&&b.hop==null&&b.time>0.08){b.hop=0;b.an=0;}
        if(b.time>(b.j==='P'?0.75:0.4))cur++;}
    },
    press(){
      if(phase===2){
        if(swapT<1.9||cap||reload>0)return;
        reload=0.32;kick=0.12;shiftT=0;turns++;puffT=0;Snd.burst(1200,.04,.2,2);
        let best=null,bd=1e9;
        for(const b of bs){if(b.cj||b.x>FX+4)continue;const px=b.x+v2*landT(b),d=Math.abs(FX-px);if(d<bd){bd=d;best=b;}}
        const col=best?best.capCol:C.pink;
        if(!best||bd>14){cap={x:FX,y:CAPY,vy:0,col,b:null};Core.waste(FX+40,70,'Tapón al aire');return;}
        cap={x:FX,y:CAPY,vy:0,col,b:best};return;
      }
      const b=bs[cur];if(!b||b.st!=='fill')return;
      const d=Math.abs(b.level-b.target);const j=d<=1.2?'P':d<=2.8?'B':d<=5.5?'R':'F';
      b.st='stop';b.time=0;b.j=j;Snd.waterStop();done++;
      const det=j==='P'?'':(b.level<b.target?'▼ Te quedaste corto':'▲ Te pasaste');
      Core.judge(j,FX,BELT-b.t.h-10,false,det);
    },
    draw(c){
      c.drawImage(bg,0,0);
      c.save();c.beginPath();for(let y=16;y<56;y++){const w=curtW(y);c.rect(Math.max(210,200+w),y,Math.min(298,308-w)-Math.max(210,200+w),1);}c.clip();
      for(const [ox,y,sz] of [[0,30,1],[52,44,0.8],[105,24,0.9]]){const x=210+((ox+Core.time*3)%130)-20;
        ell(c,x,y,Math.round(7*sz),Math.round(3*sz),C.white);ell(c,x+7*sz,y-2,Math.round(6*sz),Math.round(4*sz),C.white);ell(c,x+14*sz,y+1,Math.round(5*sz),2,C.white);R(c,x-6*sz,y+2,22*sz,1,C.skyL);}
      c.restore();
      R(c,253,16,2,40,C.cream);R(c,200+curtW(41),41,108-2*curtW(41),2,C.cream);
      for(let k=0;k<9;k++){const t=(Core.time*0.05+k*0.137)%1;const y=78+t*50,x=200-(y-74)*1.2+((k*37)%90)+Math.sin(Core.time*0.8+k)*3;px(c,x,y,(k%3)?'rgba(255,255,255,0.75)':'rgba(255,248,220,0.9)');}
      // máquinas: la llenadora sube y baja la taponadora en el cambio de fase
      const sw=phase===2?inout(Math.min(1,swapT/1.3)):0;
      if(sw<1){const fb=bs[cur],L=fb?fb.t.L:null;drawFiller(c,-Math.round(sw*80),{on:!!(fb&&fb.st==='fill'),L:L||undefined,mul:fb?fb.mul:1,stopT:fb&&fb.st==='stop'?fb.time:null});}
      if(sw>0)drawCapper(c,Math.round((1-sw)*-80),[...new Set(bs.filter(b=>!b.cj).map(b=>b.capCol).concat([C.pink]))],!cap&&reload<=0.1,kick>0?Math.round(3*Math.sin(kick/0.12*Math.PI)+1):0,{shift:shiftT/0.3,turns,puff:puffT});
      const bvis=belt+Core.time*6,off=((bvis%10)+10)%10;for(let x=off-10;x<W;x+=10){R(c,x,133,5,1,C.beltL);R(c,x+1,134,5,1,C.beltD);}
      const ro=Math.floor(bvis/3)%4;
      for(let x=10;x<W;x+=24){ell(c,x,139,3,3,C.beltD);ell(c,x,139,2,2,C.metal);const a=ro*Math.PI/4;px(c,x+Math.round(Math.cos(a)*2),139+Math.round(Math.sin(a)*2),C.metalDD);px(c,x,139,C.metalDD);}
      const cb=phase===1?bs[cur]:null;
      for(const b of bs){if(b.x>-40&&b.x<W+40){const hw=b.t.prof[0];dith(c,b.x-hw-1,BELT,hw*2+3,2,C.beltD);R(c,b.x-hw,BELT,hw*2+1,1,C.beltD);}}
      obj(c,l=>{
        for(const b of bs){if(b.x>-40&&b.x<W+40)drawContainer(l,b);}
        if(cb&&cb.st==='fill'){const sy=BELT-Math.round(cb.level),sw2=cb.mul<0.55?1:cb.mul<1.25?2:3;l.fillStyle=cb.t.L[0];l.fillRect(FX-1-(sw2>2?1:0),NOZ+1,sw2,sy-NOZ-1);
          if(cb.mul<0.55){l.fillStyle=cb.t.L[0];for(let k=0;k<3;k++){const yy=NOZ+4+((Core.time*90+k*9)%(sy-NOZ-4));l.fillRect(FX-1,yy,2,2);}}}
      },{rim:false,sel:true});
      if(cb&&cb.st==='fill'){
        const sy=BELT-Math.round(cb.level);R(c,FX-1,NOZ+1,1,sy-NOZ-1,'rgba(255,255,255,0.75)');
        const k=Math.floor(Core.time*12)%3,sp=cb.mul>1.25?2:1;for(let s=0;s<sp;s++){px(c,FX-2-k-s*2,sy-1-s,C.white);px(c,FX+1+k+s*2,sy-2+s,C.white);}
      }
      if(cb){const on=cb.st==='fill',col=cb.t.L[3];rr(c,163,27,13,6,on?col:C.lavL,1);
        if(cb.flow==='pulse'){for(let k=0;k<3;k++)px(c,165+k*3,29+(k%2),on?C.out:C.lavD);}
        else if(cb.flow==='surge'){for(let k=0;k<4;k++)R(c,165+k*2,31-k,1,k+1,on?C.out:C.lavD);}
        else R(c,165,29,9,1,on?C.out:C.lavD);}
      for(const b of bs){if(b.x>-40&&b.x<W+40){const ph=(Core.time*0.7+b.x*0.013)%3;if(ph<0.35){const gx=b.x-b.t.prof[8]+2,gy=BELT-Math.round(b.t.cav*0.7);const k=ph<0.12||ph>0.23?1:2;px(c,gx,gy,C.white);for(let d=1;d<=k;d++){px(c,gx-d,gy,C.white);px(c,gx+d,gy,C.white);px(c,gx,gy-d,C.white);px(c,gx,gy+d,C.white);}}}}
      for(const b of bs){if(b.x>-40&&b.x<W+40){if(phase===1)drawContainerTop(c,b);else if(b.cap)drawCapShine(c,b);for(const q of b.bub)px(c,b.x+q.x,BELT-1-q.y,'rgba(255,255,255,0.9)');}}
      // fase 2: guía punteada bajo la boquilla y tapón cayendo
      if(phase===2&&sw>=1){for(let y=CAPY+4;y<BELT-4;y+=4)px(c,FX,y,'rgba(243,154,192,0.55)');}
      if(cap){const w=cap.b?cap.b.t.cap:4;obj(c,l=>rr(l,Math.round(cap.x-w),Math.round(cap.y)-4,w*2,4,cap.col,1));R(c,Math.round(cap.x-w)+1,Math.round(cap.y)-4,w*2-2,1,'rgba(255,255,255,0.6)');}
      for(const f of fly){const a=f.t*10;obj(c,l=>rr(l,Math.round(f.x-f.w),Math.round(f.y)-2-Math.round(Math.abs(Math.sin(a))*2),f.w*2,3+Math.round(Math.abs(Math.cos(a))),f.col,1));}
    }
  };
}
function drawCapShine(c,b){const T=b.t,cx=Math.round(b.x)+(b.capDx||0),sy=sqOf(b),sx=1+(1-sy)*0.9,B0=BELT-1-hopOf(b),y=B0-Math.round((T.h-1)*sy)-4,cw=Math.round(T.cap*sx);
  R(c,cx-cw+1,y+1,cw*2-2,1,'rgba(255,255,255,0.6)');if(b.cj==='P'&&b.an!=null&&b.an<0.6){const k=b.an/0.6;for(let i=0;i<4;i++){const ang=i*Math.PI/2+0.6;px(c,cx+Math.round(Math.cos(ang)*(4+k*8)),y+1+Math.round(Math.sin(ang)*(3+k*6)),i%2?C.white:C.butter);}}}

