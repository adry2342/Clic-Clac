/* =====================================================================
   MINIJUEGO 2 · GRAPADORA
   Fase 1 · Grapar: cada montón cae sobre una cinta transportadora que pasa
     por debajo de la grapadora. Todos se grapan: pulsa cuando cada marca
     rosa quede bajo la cabeza. Lo difícil es que nada es igual: grosor,
     número y sitio de las marcas, y la cinta acelera, frena o va a tirones.
   Fase 2 · Apilar: un compañero en silla de oficina cruza de lado a lado con
     el montón en la cabeza (el pistón de gas sube con la torre). Toca para
     soltarlo encima de la torre: si la torre se inclina demasiado, gira entera
     sobre la esquina, se cae y se acaba la fase.
   ===================================================================== */
const SHX=164,SBASE=146,SSD=34,SSW=92,SDEP=14,SAY=SBASE-SSD+SDEP,SHL=70,SSTART=12,SREST=24;
const BLT0=106,BLT1=148,BLT2=154;// cinta: borde de atrás, canto delantero y suelo
const SW2=64,SGY=160,SL2=118,SBG2=330;
const SPAPER=[['#fffdf7','#efe9f3','#d6cce3'],['#fbf8ff','#ebe5f6','#d2c8e4'],['#fffaf0','#f3e9da','#dccbb8']];
const STINT=[[C.pinkL,C.pink,C.pinkD],[C.mintL,C.mint,C.mintD],[C.skyL,C.sky,C.skyD],['#fff6c8',C.butter,C.butterD],[C.lavL,C.lav,C.lavD]];
function leaf(l,cx,cy,a,len,wd,col){for(let t=0;t<=1;t+=0.08){const r=Math.max(1,Math.round(wd*Math.sin(Math.PI*Math.min(1,t*1.1+0.05))));ell(l,cx+Math.cos(a)*len*t,cy+Math.sin(a)*len*t,r,r,col);}}
// dibuja en un lienzo aparte (0..H de alto) y lo pega en dst a la altura oy: así el compositor sirve para fondos altos
function objAt(dst,oy,fn,o){const t=mk(W,H);obj(t.getContext('2d'),fn,o);dst.drawImage(t,0,oy);}
function line(c,x0,y0,x1,y1,col,alt){x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);
  const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy,i=0;
  for(;;){px(c,x0,y0,alt&&(i++>>1)%2?alt:col);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}}

/* ---------- fondo de la fase 1: escritorio visto en 3/4 ---------- */
function drawDesk3(c){
  // pared con papel pintado de rayas
  R(c,0,0,W,46,'#f3edff');
  for(let x=0;x<W;x+=12){R(c,x,0,4,46,C.lavL);dith4(c,x+4,0,1,46,C.lav);}
  for(let x=6;x<W;x+=12)for(let y=5;y<44;y+=10)px(c,x,y+((x/12)%2?5:0),C.lav);
  dith(c,0,40,W,6,C.lav);
  // corcho con notas
  obj(c,l=>{rr(l,8,4,86,36,C.woodD,2);});
  R(c,11,7,80,30,'#e6b98f');const g=mulberry32(4);for(let i=0;i<70;i++)px(c,11+g()*80,7+g()*30,i%2?'#d29f75':'#f0caa4');
  obj(c,l=>{R(l,16,10,20,18,C.butter);R(l,40,9,22,25,C.white);R(l,66,12,20,16,C.pink);});
  R(c,19,15,13,1,C.butterDD);R(c,19,19,10,1,C.butterDD);R(c,19,23,12,1,C.butterDD);
  R(c,42,11,18,15,C.sky);R(c,42,20,18,6,C.green);ell(c,55,15,2,2,C.butter);R(c,43,29,12,1,C.lavD);
  for(const [x,y] of [[71,16],[72,15],[74,15],[75,16],[73,17],[71,17],[75,17],[72,18],[74,18],[73,19]])px(c,x,y,C.pinkDD);R(c,69,23,14,1,C.pinkD);
  for(const [x,y,col] of [[26,10,C.pinkDD],[51,9,C.mintDD],[76,12,C.lavDD]]){ell(c,x,y,1,1,col);px(c,x-1,y-1,C.white);}
  // ventana con cielo y una nube
  obj(c,l=>{rr(l,198,2,104,40,C.cream,2);});
  R(c,202,6,96,32,C.sky);dith(c,202,22,96,16,C.skyL);R(c,202,32,96,6,C.skyL);
  ell(c,226,16,8,3,C.white);ell(c,232,14,6,4,C.white);ell(c,272,24,7,2,C.white);R(c,249,6,2,32,C.cream);R(c,202,21,96,1,C.cream);
  ell(c,214,36,12,3,C.green);ell(c,284,37,14,2,C.greenD);
  obj(c,l=>{rr(l,196,40,108,3,C.wood,1);});
  // reloj de pared (las agujas se dibujan aparte para que se muevan)
  obj(c,l=>{ell(l,140,21,13,13,C.mint);});ell(c,140,21,10,10,C.cream);
  for(let k=0;k<12;k++){const a=k/12*Math.PI*2;px(c,140+Math.round(Math.cos(a)*8),21+Math.round(Math.sin(a)*8),k%3?C.lavD:C.lavDD);}
  px(c,134,14,C.white);px(c,133,15,C.white);
  // borde de atrás de la mesa
  R(c,0,46,W,2,C.woodDD);R(c,0,48,W,1,C.woodL);
  // tablones en perspectiva: las juntas se separan hacia delante
  R(c,0,49,W,124,C.wood);
  const ys=[49,54,60,67,75,84,94,105,117,130,144,159,173];const gw=mulberry32(9);
  for(let i=0;i<ys.length-1;i++){const y=ys[i],h=ys[i+1]-y;R(c,0,y,W,1,C.woodD);R(c,0,y+1,W,1,C.woodL);
    let x=-gw()*80;while(x<W){const len=60+gw()*110;R(c,Math.round(x),y,1,h,C.woodDD);x+=len;}
    for(let k=0;k<3;k++){const gx=gw()*W,gl=20+gw()*60;R(c,gx,y+2+Math.floor(gw()*(h-3)),gl,1,C.woodD);}}
  // luz cálida de la ventana sobre la mesa
  for(let y=49;y<172;y++){const s=(y-49)*0.7;dith4(c,190-s,y,70,1,C.woodL);dith4(c,268-s,y,26,1,C.woodL);}
  // cinta transportadora de lado a lado (la banda que se mueve se pinta en cada fotograma)
  dith(c,0,BLT2,W,4,C.woodDD);
  obj(c,l=>{R(l,-4,BLT0-3,W+8,BLT2-BLT0+3,C.beltD);},{sel:true});
  R(c,0,BLT0-3,W,1,C.beltL);R(c,0,BLT0-2,W,1,C.belt);R(c,0,BLT0-1,W,1,C.beltD);
  R(c,0,BLT0,W,BLT1-BLT0,C.belt);dith4(c,0,BLT0,W,8,C.beltD);
  R(c,0,BLT1,W,1,C.beltL);R(c,0,BLT1+1,W,BLT2-BLT1-2,C.beltD);R(c,0,BLT2-1,W,1,'#8a7cb0');
  // patas de la cinta
  for(const x of [24,140,292]){R(c,x,BLT2,4,6,'#8a7cb0');R(c,x,BLT2,1,6,C.beltD);R(c,x-2,BLT2+5,8,2,'#8a7cb0');}
  // taza de café al fondo
  dith(c,24,70,24,6,C.woodDD);
  obj(c,l=>{rr(l,22,52,20,22,C.cream,4);rr(l,40,57,8,11,C.cream,3);l.clearRect(42,60,3,5);});
  ell(c,32,54,8,2,C.coffeeD);ell(c,32,54,7,1,C.coffee);R(c,24,58,2,12,C.white);R(c,26,64,12,4,C.pinkL);px(c,31,65,C.pinkD);px(c,33,65,C.pinkD);px(c,32,66,C.pinkD);
  for(let k=0;k<2;k++)for(let y=0;y<4;y++)px(c,29+k*5+((y%2)?1:0),46+y,'rgba(255,255,255,0.7)');
  // bote de lápices
  dith(c,104,72,22,5,C.woodDD);
  obj(c,l=>{R(l,108,42,2,14,C.butter);R(l,112,38,2,18,C.pink);R(l,116,44,2,12,C.sky);R(l,119,40,2,16,C.mintDD);rr(l,104,52,20,22,C.lav,3);});
  px(c,108,41,C.out);px(c,112,37,C.out);px(c,116,43,C.out);px(c,119,39,C.out);R(c,106,56,16,1,C.lavL);R(c,106,60,16,2,C.lavD);R(c,106,54,2,18,C.lavL);
  // caja de grapas
  dith(c,268,74,40,6,C.woodDD);
  obj(c,l=>{rr(l,264,60,40,14,C.pinkD,2);R(l,264,56,40,5,C.pink);});
  R(c,266,57,36,1,C.pinkL);R(c,270,64,14,6,C.white);for(let k=0;k<4;k++)R(c,271+k*3,66,2,2,C.metalD);R(c,288,64,12,2,C.white);R(c,288,68,9,1,C.white);
  // cosas de la parte de delante
  dith(c,24,170,50,3,C.woodDD);
  obj(c,l=>{l.fillStyle=C.out;l.fillRect(20,166,2,2);R(l,22,165,2,4,C.woodL);R(l,24,164,3,6,C.woodL);R(l,27,164,30,6,C.butter);R(l,57,164,5,6,C.metal);R(l,62,164,5,6,C.pink);});
  R(c,27,165,30,1,'#fff8cf');R(c,27,168,30,1,C.butterD);R(c,58,164,1,6,C.metalD);R(c,60,164,1,6,C.metalD);
  dith(c,76,170,16,3,C.woodDD);
  obj(c,l=>{rr(l,74,162,15,9,C.lavL,2);R(l,74,162,7,9,C.sky);});R(c,75,163,5,1,C.skyL);
  dith(c,104,170,76,3,C.woodDD);
  obj(c,l=>{rr(l,100,162,76,9,C.butter,1);});
  for(let x=103;x<174;x+=3)R(c,x,163,1,(x-103)%15===0?4:2,C.butterDD);R(c,100,169,76,1,C.butterD);
  dith(c,196,170,36,3,C.woodDD);
  obj(c,l=>{rr(l,192,160,34,11,C.pink,1);});R(c,194,161,30,1,C.pinkL);R(c,196,164,22,1,C.pinkD);R(c,196,167,16,1,C.pinkD);
  for(const [x,y] of [[246,165],[256,167],[266,164]]){R(c,x,y,8,1,C.metalD);R(c,x,y+3,8,1,C.metalD);R(c,x,y,1,4,C.metalD);R(c,x+7,y+1,1,3,C.metalD);R(c,x+2,y+1,4,1,C.metalL);}
  // canto de la mesa
  R(c,0,173,W,7,C.woodDD);R(c,0,173,W,1,C.woodD);R(c,0,174,W,1,C.woodL);
}

/* ---------- montones en 3/4 ---------- */
// contenido de la hoja de arriba (se pinta sobre la cara de arriba del montón: SSW x SSD)
function drawTopSheet(c,x,y,s){
  const w=SSW,L='#ddd5ea',sd=s.seed;
  const f=s.fmt,hd=s.hd,lw=w-30;
  if(f==='carta'){R(c,x+6,y+4,24,2,hd);ell(c,x+w-26,y+5,2,1,hd);
    [[10,lw],[14,lw-8],[18,lw-2],[22,lw-14],[26,lw-5]].forEach(([dy,ww],i)=>R(c,x+6,y+dy,ww-((sd*3+i*7)%10),1,L));
    for(let i=0;i<9;i++)px(c,x+w-40+i,y+30-(i%3===1?1:0),C.lavDD);}
  else if(f==='tabla'){R(c,x+6,y+4,24,2,hd);R(c,x+6,y+9,lw,3,hd);for(let r=0;r<5;r++)R(c,x+6,y+14+r*4,lw,1,L);for(let q=1;q<4;q++)R(c,x+6+q*Math.floor(lw/4),y+9,1,21,L);}
  else if(f==='grafica'){R(c,x+6,y+4,24,2,hd);R(c,x+7,y+9,1,22,C.lavD);R(c,x+7,y+30,lw,1,C.lavD);const cols=[C.pinkD,C.mintDD,C.skyD,C.butterD,C.lavD,C.peachD];
    for(let q=0;q<7;q++){const h=5+((sd*7+q*13)%15);R(c,x+11+q*8,y+30-h,5,h,cols[q%cols.length]);}}
  else if(f==='lista'){R(c,x+6,y+4,24,2,hd);for(let r=0;r<5;r++){const yy=y+10+r*4;R(c,x+6,yy-1,3,3,C.lavD);if((sd+r)%3)R(c,x+7,yy,1,1,C.paper);else{px(c,x+7,yy,C.mintDD);}R(c,x+11,yy,Math.min(lw-6,20+((sd+r*5)%24)),1,L);}}
  else{R(c,x+w/2-20,y+4,22,2,hd);for(let r=0;r<4;r++){R(c,x+14,y+10+r*4,28,1,L);R(c,x+w-40,y+10+r*4,10,1,L);}for(let q=x+10;q<x+w-26;q+=3)px(c,q,y+26,C.lavD);R(c,x+14,y+29,16,1,C.lavDD);R(c,x+w-40,y+29,10,1,C.lavDD);}
}
// marca rosa (esquina doblada + diana donde va la grapa)
function drawMarks(c,x,y,s){
  if(!s.marks.length)return;
  for(let k=0;k<7;k++)R(c,x+SSW-7+k,y,7-k,1,k<2?C.pinkD:C.pink);for(let k=0;k<6;k++)px(c,x+SSW-7+k,y+6-k,C.pinkDD);
  for(const m of s.marks){if(m.j)continue;const mx=x+m.o,my=y+SDEP,pl=0.5+0.5*Math.sin(Core.time*7+m.o);
    ell(c,mx,my,5,3,C.pinkL);ell(c,mx,my,3,2,C.pink);px(c,mx,my,C.pinkDD);px(c,mx-1,my,C.pinkD);px(c,mx+1,my,C.pinkD);
    for(const [a,b] of [[-6,0],[6,0],[0,-4],[0,4]])px(c,mx+a,my+b,C.pinkD);
    if(pl>0.5){R(c,mx-8,my,1,1,C.pinkD);R(c,mx+8,my,1,1,C.pinkD);R(c,mx-4,my-5,9,1,'rgba(243,154,192,0.55)');R(c,mx-4,my+5,9,1,'rgba(243,154,192,0.55)');}}
}
// grapa clavada vista desde arriba (va en el sentido del fondo)
function drawStaple3(c,sx,sy,j){
  sx=Math.round(sx);sy=Math.round(sy);
  R(c,sx-1,sy-3,3,7,'rgba(86,62,120,0.18)');
  if(j==='F'){R(c,sx,sy-3,2,3,C.metalDD);R(c,sx+1,sy,2,3,C.metalDD);px(c,sx,sy-3,C.metalL);}
  else{R(c,sx,sy-3,2,6,C.metalDD);R(c,sx,sy-2,1,4,C.metalL);px(c,sx+1,sy-3,C.white);if(j==='P'){px(c,sx-1,sy-4,C.butter);px(c,sx+2,sy+3,C.butter);}}
}
function mkSheets(rng,n){
  const sh=[];for(let k=0;k<n;k++){const tint=rng()<0.13;const p=tint?STINT[Math.floor(rng()*STINT.length)]:SPAPER[Math.floor(rng()*SPAPER.length)];
    sh.push({dx:Math.round((rng()-0.5)*3.6),col:p[0],e1:p[1],e2:p[2],off:0});}
  const top=sh[n-1];top.dx=Math.round((rng()-0.5)*3);
  top.col=SPAPER[0][0];top.e1=SPAPER[0][1];top.e2=SPAPER[0][2];
  return sh;
}
function drawStack3(c,s,x0,yo){
  // cada folio es su cara de arriba y dos filas de canto: al apilarlos se ven todas las hojas
  const n=s.n,sq=s.sq>0?1:0,lg=k=>n>1?Math.round(s.lag.x*k/(n-1)):0;yo=yo||0;
  dith(c,Math.round(x0)+3,SBASE-SSD+2+yo,SSW+1,SSD,C.beltD);
  obj(c,l=>{for(let k=0;k<n;k++){const h=s.sh[k],x=Math.round(x0+h.dx)+lg(k),y=Math.round(SBASE-SSD-2*(k+1)-h.off+yo+(k>0?sq:0));
    R(l,x,y,SSW,SSD,h.col);R(l,x,y+SSD,SSW,1,h.e1);R(l,x,y+SSD+1,SSW,1,h.e2);}},{sel:true});
  // sombrita entre hojas en el canto derecho e izquierdo para que se lean como láminas
  for(let k=0;k<n-1;k++){const h=s.sh[k],hn=s.sh[k+1],x=Math.round(x0+h.dx)+lg(k),y=Math.round(SBASE-SSD-2*(k+1)-h.off+yo+(k>0?sq:0));
    if(h.dx>hn.dx)px(c,x+SSW-1,y+SSD-1,h.e2);if(h.dx<hn.dx)px(c,x,y+SSD-1,h.e2);}
  {const t=s.sh[n-1],cx=Math.round(x0+t.dx)+lg(n-1),cy=Math.round(SBASE-SSD-2*n-t.off+yo+sq)+SSD;
    for(let k=0;k<4;k++)R(c,cx+1,cy-1-k,4-k,1,t.e1);px(c,cx,cy-1,t.e2);R(c,cx+1,cy,4,1,C.lavD);}
  const t=s.sh[n-1],tx=Math.round(x0+t.dx)+lg(n-1),ty=Math.round(SBASE-SSD-2*n-t.off+yo+sq);
  return [tx,ty];
}

/* ---------- grapadora (vista lateral, brazo con bisagra a la derecha) ---------- */
// El brazo se dibuja una vez, cerrado, como sprite con contorno; al abrirlo cada columna baja o sube
// en proporción a su distancia a la bisagra (cizalla vertical): el pixel art no se emborrona.
const ARM=(()=>{
  const AW=SHL+26,AH=34,Y=29,X=u=>u+11;// Y: fila del borde de abajo del brazo cerrado
  const t=mk(W,H),tc=t.getContext('2d');
  const top=u=>u<8?-19:-16-Math.round(2.5*Math.sin(Math.PI*Math.min(1,(u-8)/(SHL-2))));
  obj(tc,l=>{
    // tapa de plástico: cabeza alta y redondeada delante, lomo con joroba y culo redondeado
    for(let u=-9;u<=SHL+12;u++){let tp=top(u),bt=-5;
      if(u<-6)tp+=(-6-u)*2;if(u>SHL+8){tp+=(u-SHL-8);bt-=Math.max(0,u-SHL-9);}
      if(u<=6)bt=0;// la cabeza baja hasta la grapa
      R(l,X(u),Y+tp,1,bt-tp,C.pink);}
    R(l,X(-6),Y-6,SHL+10,6,C.metal);// cargador metálico bajo la tapa
  },{sel:true});
  const P=(u,y,col)=>px(tc,X(u),Y+y,col),Rr=(u,y,w,h,col)=>R(tc,X(u),Y+y,w,h,col);
  for(let u=-7;u<=SHL+9;u++){let tp=top(u);if(u<-6)tp+=(-6-u)*2;
    P(u,tp+1,u%9===3?C.white:C.pinkL);if(u>-5&&u<SHL+7)P(u,tp+2,'#ffd6e5');}
  for(let u=10;u<40;u++)if(u%4)P(u,top(u)+1,C.white);
  // sombra del labio de la tapa sobre el cargador y brillos del metal
  for(let u=7;u<=SHL+8;u++){P(u,-6,C.pinkDD);P(u,-5,C.metalL);P(u,-4,C.metal);P(u,-3,C.metal);P(u,-2,C.metalD);}
  for(let u=7;u<=SHL+4;u+=1)if(u%6===0)P(u,-4,C.white);
  for(const u of [14,SHL-4]){P(u,-3,C.metalDD);}
  // cabeza: almohadilla para el dedo con estrías, cara delantera más clara y chapa del empujador
  for(let u=-4;u<5;u++)P(u,-16,C.pinkD);for(let k=0;k<3;k++)Rr(-3+k*3,-15,2,1,C.pinkDD);
  for(let y=-15;y<-1;y++)P(-8,y,C.pinkL);
  Rr(-6,-6,13,1,C.pinkDD);Rr(-6,-5,13,4,C.metal);Rr(-6,-5,13,1,C.metalL);Rr(-6,-2,13,1,C.metalD);Rr(-2,-1,5,1,C.out);
  // corazoncito en el costado
  for(const [dx,dy] of [[0,0],[2,0],[-1,1],[0,1],[1,1],[2,1],[3,1],[0,2],[1,2],[2,2],[1,3]])P(30+dx,-12+dy,C.pinkDD);P(30,-12,C.pinkD);
  for(let u=40;u<SHL-2;u+=3)P(u,-10,C.pinkD);
  const sp=mk(AW,AH);sp.getContext('2d').drawImage(t,0,0,AW,AH,0,0,AW,AH);
  return {sp,AW,AH,Y,X};
})();
const PIV=SHL+3;
const armDy=(u,lift)=>-lift*(PIV-u)/(PIV+1);
function drawStaplerBase(c,lift){
  obj(c,l=>{
    rr(l,SHX-13,SAY-2,SHL+27,9,C.pinkD,3);
    R(l,SHX-10,SAY-4,24,3,C.metal);
    rr(l,SHX+SHL-9,SAY-13,22,13,C.pinkD,4);
  },{sel:true});
  R(c,SHX-11,SAY-1,SHL+23,1,C.pink);R(c,SHX-11,SAY,SHL+23,1,C.pink);R(c,SHX-11,SAY+1,SHL+23,1,C.pinkL);
  R(c,SHX-11,SAY+5,SHL+23,1,C.pinkDD);
  R(c,SHX-10,SAY-4,24,1,C.metalL);R(c,SHX-10,SAY-2,24,1,C.metalD);R(c,SHX-2,SAY-3,5,1,C.metalDD);px(c,SHX-2,SAY-3,C.metalD);px(c,SHX+2,SAY-3,C.metalD);
  for(let k=0;k<3;k++)px(c,SHX+16+k*4,SAY+3,C.pinkDD);
  R(c,SHX-12,SAY+7,SHL+25,1,'#6f5b80');R(c,SHX-9,SAY+7,8,1,'#4c3c5c');R(c,SHX+SHL+2,SAY+7,8,1,'#4c3c5c');
  R(c,SHX+SHL-7,SAY-12,16,1,C.pink);R(c,SHX+SHL-8,SAY-11,1,8,C.pink);
  // muelle entre base y brazo (se estira al abrir)
  const u=SHL-18,top=Math.round(SAY-3+armDy(u,lift))-2,bot=SAY-2;
  for(let y=top,i=0;y<bot;y+=2,i++){R(c,SHX+u-2+(i%2),y,4,1,C.metalD);px(c,SHX+u-2+(i%2)+(i%2?3:0),y,C.metalL);}
}
function drawStaplerArm(c,lift,flash){
  const A=ARM,base=SAY-3-A.Y;
  for(let x=0;x<A.AW;x++){const u=x-11;c.drawImage(A.sp,x,0,1,A.AH,SHX+u,base+Math.round(armDy(u,lift)),1,A.AH);}
  // pasador de la bisagra
  ell(c,SHX+PIV,SAY-8,3,3,C.metalD);ell(c,SHX+PIV,SAY-8,2,2,C.metal);px(c,SHX+PIV-1,SAY-9,C.white);px(c,SHX+PIV,SAY-8,C.metalDD);
  if(flash>0){const y=SAY-3-Math.round(lift);c.save();c.globalAlpha=Math.min(1,flash*6);
    for(const [a,b,w] of [[-17,-3,6],[-16,1,5],[10,-3,6],[10,1,5]])R(c,SHX+a,y+b,w,1,C.white);px(c,SHX-19,y-7,C.butter);px(c,SHX+16,y-7,C.butter);px(c,SHX-18,y-8,C.white);c.restore();}
}
/* ---------- fase 2: montones vistos de lado para la torre ---------- */
function sideSprite(s){
  // de lado cada hoja ocupa 3 filas (canto claro, medio y sombra): el montón se ve gordito
  const t=mk(W,H),x=t.getContext('2d'),n=s.n,X0=10,Y0=10,hh=3*n,dx=k=>Math.round(s.sh[k].dx*0.8);
  obj(x,l=>{
    for(let k=0;k<n;k++){const h=s.sh[k],y=Y0+3*(n-1-k);R(l,X0+dx(k),y,SW2,1,h.col);R(l,X0+dx(k),y+1,SW2,1,h.e1);R(l,X0+dx(k),y+2,SW2,1,h.e2);}
    R(l,X0+5+dx(n-1),Y0-2,7,2,C.metal);R(l,X0+5+dx(0),Y0+hh,7,1,C.metalD);
    if(s.tab){const k=s.tab[0];R(l,X0+SW2-1+dx(k),Y0+3*(n-1-k),5,3,s.tab[1]);}
  },{sel:true});
  for(let k=0;k<n;k++){const y=Y0+3*(n-1-k)+1;px(x,X0+5+dx(k),y,C.metalDD);px(x,X0+11+dx(k),y,C.metalDD);}
  R(x,X0+6+dx(n-1),Y0-2,5,1,C.metalL);R(x,X0+3+dx(n-1),Y0,SW2-6,1,'rgba(255,255,255,0.7)');
  if(s.hd)R(x,X0+SW2-20+dx(n-1),Y0,12,1,s.hd);
  const sp=mk(SW2+14,hh+8),sx=sp.getContext('2d');sx.drawImage(t,X0-4,Y0-4,SW2+14,hh+8,0,0,SW2+14,hh+8);
  sp.ax=4;sp.ay=4;sp.hh=hh;return sp;
}
function drawTower2Bg(c){
  // pared alta (la cámara sube con la torre): papel pintado, ventana, estantería, reloj y una cinta métrica
  const HT=H+SBG2;R(c,0,0,W,HT,'#f3edff');
  for(let x=0;x<W;x+=12){R(c,x,0,4,HT,C.lavL);dith4(c,x+4,0,1,HT,C.lav);}
  for(let x=6;x<W;x+=12)for(let y=5;y<HT;y+=10)px(c,x,y+((x/12)%2?5:0),C.lav);
  const o=SBG2;
  // moldura del techo
  R(c,0,0,W,6,C.cream);R(c,0,6,W,2,C.creamD);for(let x=0;x<W;x+=8)R(c,x,2,4,2,C.creamD);
  // cuadro con una grapadora
  objAt(c,40,l=>{rr(l,22,10,62,46,C.woodD,2);});
  R(c,26,54,54,38,C.pinkL);ell(c,52,68,12,8,C.butter);R(c,32,78,44,6,C.pinkD);R(c,32,74,40,4,C.pink);R(c,34,74,36,1,C.white);R(c,68,72,6,6,C.metalD);
  // reloj
  objAt(c,140,l=>{ell(l,52,20,13,13,C.mint);});ell(c,52,160,10,10,C.cream);
  for(let k=0;k<12;k++){const a=k/12*Math.PI*2;px(c,52+Math.round(Math.cos(a)*8),160+Math.round(Math.sin(a)*8),C.lavDD);}R(c,52,153,1,7,C.out);R(c,52,160,5,1,C.out);
  // ventana
  objAt(c,o-8,l=>{rr(l,14,20,74,84,C.cream,3);});
  R(c,18,o+16,66,76,C.sky);dith(c,18,o+56,66,36,C.skyL);ell(c,36,o+34,9,3,C.white);ell(c,44,o+31,6,3,C.white);ell(c,70,o+60,8,2,C.white);
  R(c,50,o+16,2,76,C.cream);R(c,18,o+52,66,2,C.cream);ell(c,30,o+90,16,4,C.green);ell(c,70,o+91,18,3,C.greenD);
  objAt(c,o-8,l=>{rr(l,10,102,82,4,C.wood,1);});
  // estantería alta con archivadores
  objAt(c,o-80,l=>{rr(l,236,0,72,180,C.woodD,2);});objAt(c,o+20,l=>{rr(l,236,0,72,140,C.woodD,2);},{out:false});
  for(let y=o-76;y<o+156;y+=38){R(c,240,y,64,34,C.woodDD);R(c,238,y+34,68,3,C.wood);R(c,238,y+34,68,1,C.woodL);
    const g=mulberry32(y);let x=242;while(x<298){const w=6+Math.floor(g()*5),h=22+Math.floor(g()*10),cols=[C.pink,C.mintD,C.sky,C.butter,C.lav,C.peach];const col=cols[Math.floor(g()*cols.length)];
      if(g()<0.15){x+=4;continue;}R(c,x,y+34-h,w,h,col);R(c,x,y+34-h,1,h,'rgba(255,255,255,0.45)');R(c,x+w-1,y+34-h,1,h,'rgba(86,62,120,0.18)');R(c,x+1,y+38-h,w-2,3,C.white);ell(c,x+w/2,y+28,1,1,C.out);x+=w+1;}}
  // cinta métrica en la pared, al lado de la torre
  R(c,212,10,7,HT-30,C.butter);R(c,218,10,1,HT-30,C.butterDD);
  for(let y=HT-21;y>12;y-=4){const big=(HT-21-y)%20===0;R(c,212,y,big?5:2,1,C.butterDD);if(big)R(c,212,y-1,2,1,C.pinkD);}
}
function drawTower2Desk(c){
  // mesa con la bandeja, en su propia capa: tapa la parte de abajo de la silla del compañero
  const HT=H+SBG2,o=SBG2,gy=o+SGY;
  R(c,0,gy,W,HT-gy,C.wood);R(c,0,gy,W,1,C.woodL);R(c,0,gy+1,W,1,C.woodL);R(c,0,gy+6,W,1,C.woodD);R(c,0,gy+12,W,HT-gy-12,C.woodDD);R(c,0,gy+12,W,1,C.woodD);
  for(let x=20;x<W;x+=70)R(c,x,gy+2,30,1,C.woodD);
  objAt(c,o,l=>{rr(l,112,SGY-8,96,10,C.lavD,2);});
  R(c,114,gy-7,92,2,C.lav);for(let x=118;x<204;x+=6)R(c,x,gy-5,2,4,C.lavDD);R(c,113,gy-8,94,1,C.lavL);
  // planta en el suelo de la mesa a la izquierda y taza a la derecha
  objAt(c,o,l=>{rr(l,24,SGY-16,18,16,C.peachD,3);ell(l,28,SGY-22,6,8,C.greenD);ell(l,38,SGY-24,6,9,C.green);ell(l,33,SGY-30,4,8,C.greenD);});
  objAt(c,o,l=>{rr(l,262,SGY-18,18,18,C.cream,4);rr(l,278,SGY-14,7,10,C.cream,3);l.clearRect(280,SGY-12,3,6);});R(c,264,gy-12,14,4,C.pinkL);
}
/* ---------- fase 2: el compañero de la silla de oficina ---------- */
// Vista de frente. sb = fila de arriba de la cabeza (donde se apoya el montón). La silla tiene un pistón
// de gas cromado que se estira cuando la torre crece: cuanto más alta la torre, más larguísimo.
function drawCoworker(c,x,sb,o){
  x=Math.round(x);sb=Math.round(sb);const SK='#ffe1cc',SKD='#f2b9a0',HAIR=C.coffeeD,PANT='#6f5b8a';
  const lg=o.legs||0,up=Math.round(o.up||0),hop=o.hop>0?1:0,rod=o.rod||8;
  // pistón de gas: cromo arriba, funda oscura abajo, palanquita bajo el asiento
  const pt=sb+26;R(c,x-2,pt+rod,5,Math.max(0,H-pt-rod),'#5b4a6b');R(c,x-1,pt,3,rod,C.metal);
  R(c,x-1,pt,1,rod,C.metalL);R(c,x+1,pt,1,rod,C.metalD);R(c,x-3,pt+rod,7,2,'#4a3c5c');
  // respaldo, asiento y patas colgando
  obj(c,l=>{rr(l,x-9,sb+5,19,18,C.lavD,4);rr(l,x-11,sb+21,23,5,C.lavD,2);R(l,x+4,sb+26,6,1,C.metalD);R(l,x+9,sb+25,2,3,C.pinkD);},{sel:true});
  R(c,x-8,sb+6,17,1,C.lavL);R(c,x-10,sb+22,21,1,C.lavL);
  obj(c,l=>{R(l,x-5+lg,sb+24,3,8,PANT);R(l,x+3-lg,sb+24,3,8,PANT);R(l,x-6+lg,sb+31,4,2,C.out);R(l,x+3-lg,sb+31,4,2,C.out);},{sel:true});
  // cuerpo: camisa con corbata
  obj(c,l=>{rr(l,x-6,sb+10,13,13,C.sky,3);},{sel:true});
  R(c,x-5,sb+11,3,1,C.skyL);px(c,x,sb+11,C.pinkDD);R(c,x,sb+12,1,6,C.pinkD);px(c,x,sb+18,C.pinkDD);px(c,x-1,sb+11,C.white);px(c,x+1,sb+11,C.white);
  // brazos finos levantados que sujetan el montón por debajo
  const hy=sb-1-up;
  for(const s of [-1,1]){line(c,x+s*5,sb+12,x+s*9,hy+3,C.skyD);line(c,x+s*6,sb+12,x+s*10,hy+3,C.sky);R(c,x+s*9+(s<0?-1:0),hy,2,2,SK);}
  // cabeza
  obj(c,l=>{ell(l,x,sb+5,5,5,SK);ell(l,x,sb+2,5,3,HAIR);R(l,x-5,sb+3,2,3,HAIR);R(l,x+4,sb+3,2,3,HAIR);},{sel:true});
  R(c,x-2,sb+1,3,1,C.coffee);
  if(o.blink){R(c,x-3,sb+6,2,1,C.out);R(c,x+2,sb+6,2,1,C.out);}else{px(c,x-2,sb+6,C.out);px(c,x+2,sb+6,C.out);}
  px(c,x-4,sb+7,C.pinkD);px(c,x+4,sb+7,C.pinkD);
  if(hop)R(c,x,sb+8,1,2,C.pinkDD);else if(o.worry){R(c,x-1,sb+8,3,1,SKD);}else px(c,x,sb+8,SKD);
  // gotita de sudor cuando la torre se tambalea
  if(o.worry){const k=Math.floor(Core.time*3)%2;px(c,x+6,sb+2+k,C.skyD);R(c,x+6,sb+3+k,2,2,C.sky);px(c,x+6,sb+3+k,C.white);}
}
function drawGasPuff(c,x,y,t){if(t<=0||t>=1)return;for(let k=0;k<3;k++){const a=t*10+k*2.1,r=Math.round(1+t*3);c.save();c.globalAlpha=0.8*(1-t);ell(c,Math.round(x+(k-1)*(4+t*8)),Math.round(y-t*4+Math.sin(a)),r,r,C.white);c.restore();}}

function Stapler(rng,preview){
  const N1=11,N2=10;
  // Fase 1: todos los montones se grapan. Cada uno es distinto: grosor, cuántas marcas y dónde,
  // velocidad de la cinta y su forma de moverse (suave, acelera, frena, a tirones u ola).
  const FMT=['carta','tabla','grafica','lista','recibo'],MOT=['acelera','frena','tirones','ola','suave'];
  const stacks=[];let U1=0;
  for(let i=0;i<N1;i++){
    const prog=i/(N1-1),r=rng();
    const n=i<2?3+Math.floor(rng()*3):2+Math.floor(rng()*9);
    const nm=i<2?1:r<0.42?1:r<0.86?2:3;
    // marcas en sitios al azar (separadas al menos 18 px); la de más a la derecha llega antes
    const os=[];for(let tries=0;os.length<nm&&tries<80;tries++){const o=10+Math.round(rng()*(SSW-20));if(os.every(q=>Math.abs(q-o)>=18))os.push(o);}
    if(i<2)os[0]=SSW-14-Math.round(rng()*20);
    os.sort((a,b)=>b-a);const marks=os.map(o=>({o,j:null,rel:null}));
    const v=(40+34*prog)*(0.86+rng()*0.28),mot=i<2?'suave':MOT[Math.floor(rng()*MOT.length)];
    const arrive=(SHX-SSTART-os[0])/v;
    stacks.push({n,sh:mkSheets(rng,n),marks,fmt:FMT[Math.floor(rng()*FMT.length)],hd:[C.pinkD,C.mintDD,C.lavD,C.butterD,C.skyD][Math.floor(rng()*5)],seed:Math.floor(rng()*99),
      v,mot,t0:arrive*(0.15+rng()*0.55),f:0.8+rng()*0.6,ph:rng()*6,mt:0,vn:0,
      look:0.8-0.3*prog,st:'drop',t:0,x:SSTART,yo:0,sq:0,hitch:0,
      lag:Spring(0,140,9),tab:rng()<0.6?[Math.floor(rng()*n),[C.pinkD,C.mintDD,C.butterD,C.skyD][Math.floor(rng()*4)]]:null});
    U1+=marks.length;
  }
  const TOTAL=U1+N2;
  let phase=1,si=0,cur=null,spawnT=0.2,done=0,T=0,endT=0,ended=false,swapT=9,belt=0,bvNow=0;const leaving=[],air=[];
  const arm={t:-1,from:SREST,contact:0,flash:0};
  const tray=[];// montones grapados (pasan a la fase 2)
  const bg=mk(W,H);drawDesk3(bg.getContext('2d'));grain(bg.getContext('2d'),14,4);
  // el brazo baja de golpe (la parada de impacto lo congela abajo) y sube con un rebote
  const lift=()=>{const a=arm,t=a.t;if(t<0)return SREST;if(t<0.11)return a.contact;
    if(t<0.5)return a.contact+(SREST-a.contact)*Ease.outBack((t-0.11)/0.39);return SREST;};
  // velocidad de la cinta para cada montón según su forma de moverse
  function speed(s){const t=s.mt,k=Math.min(1,Math.max(0,(t-s.t0)/0.45)),sm=k*k*(3-2*k);
    switch(s.mot){case 'acelera':return s.v*(0.6+0.9*sm);case 'frena':return s.v*(1.4-0.85*sm);
      case 'tirones':return s.v*(0.18+1.45*Math.max(0,Math.sin(s.ph+t*Math.PI*2*s.f)));
      case 'ola':return s.v*(1+0.5*Math.sin(s.ph+t*Math.PI*2*s.f*0.8));default:return s.v;}}
  const tol=s=>Math.max(40,s.vn);// para medir en tiempo cuánto te has desviado
  function judge(j,det,x,y){done++;Core.judge(j,x,y,false,det);}
  function spawn(){const s=stacks[si++];s.st='drop';s.t=0;s.x=SSTART;s.sh.forEach((h,k)=>{h.off=70+k*7;});cur=s;Snd.tone(700,.05,'sine',.02);}
  function under(s){return s&&(s.st==='slide'||s.st==='hit')&&s.x<=SHX-2&&s.x+SSW>=SHX+2;}
  // cuando ya no le quedan marcas, la cinta se lo lleva deprisa por la derecha
  function leave(s){s.st='out';s.t=0;leaving.push(s);if(cur===s)cur=null;spawnT=0.25;}

  /* ---------- fase 2 ---------- */
  const tower=[],deb=[];let pcx=160,k2=0,st2='load',t2=0,swT=0,hang=null,fall=null,camY=0,wob=Spring(0,90,5),danger=0,creakT=0,goal=0;
  let chX=-40,chSb=0,exitX=0,hopT=0,puffT=1;// el compañero de la silla
  let col=null,owed=0,owedT=0,owedQ=0;// derrumbe de la torre entera
  const sprCache=new Map();const sprOf=s=>{if(!sprCache.has(s))sprCache.set(s,sideSprite(s));return sprCache.get(s);};
  const bg2=mk(W,H+SBG2);drawTower2Bg(bg2.getContext('2d'));const bg2d=mk(W,H+SBG2);drawTower2Desk(bg2d.getContext('2d'));
  const towerTop=()=>{let y=SGY-2;for(const b of tower)y-=b.spr.hh;return y;};
  const topX=()=>tower.length?tower[tower.length-1].x:160;
  const GAP=24;
  // la silla va y viene de lado a lado (sale del extremo izquierdo parada); cada montón con su amplitud y su ritmo
  const swingX=()=>pcx-hang.A*Math.cos(hang.w*swT),swingV=()=>hang.A*hang.w*Math.sin(hang.w*swT);
  function nextHang(){
    const pool=tray.length?tray:stacks;const s=pool[k2%pool.length];
    const spr=sprOf(s),A=32+rng()*14+2*k2,P=(2.3-0.06*k2)*(0.85+rng()*0.3);
    hang={s,spr,A,w:Math.PI*2/P};pcx=Math.max(70,Math.min(250,topX()));st2='load';t2=0;swT=0;chX=-40;
    if(k2>0){puffT=0;Snd.burst(5200,.3,.06,0.7);}
  }
  function stability(){
    // de abajo arriba: si el centro de masas de lo que queda encima se sale del montón (o de la bandeja), se cae
    let worst=0,fail=-2;
    for(let k=-1;k<tower.length-1;k++){let m=0,sx=0;for(let q=k+1;q<tower.length;q++){m+=tower[q].spr.hh;sx+=tower[q].x*tower[q].spr.hh;}
      const com=sx/m,base=k<0?160:tower[k].x,half=k<0?40:SW2*0.38,r=Math.abs(com-base)/half;worst=Math.max(worst,r);if(r>1&&fail<-1)fail=k;}
    return {fail,worst};
  }
  // la torre entera se inclina sobre la esquina de la base y luego se desparrama
  function collapse(dir){
    col={t:0,dir,ang:0,av:0.4,px:160+dir*44,py:SGY-2};st2='collapse';owed=N2-k2;
    Snd.tone(150,.5,'sawtooth',.03,0,90);Core.shake=0.2;
  }
  function scatter(){
    const c0=col;let y=SGY-2;
    tower.forEach((b,i)=>{const cy=y-b.spr.hh/2,r=rot(b.x,cy);deb.push({spr:b.spr,x:r[0],y:r[1],vx:c0.dir*(30+i*16)+(Math.random()-0.5)*24,vy:-40-Math.random()*50+i*2,a:c0.ang*c0.dir,va:c0.dir*(2+Math.random()*3),t:0});y-=b.spr.hh;});
    tower.length=0;Core.shake=0.45;Feel.puff(c0.px,SGY-camY,6,C.white);
    Snd.burst(700,.4,.32,1.2);Snd.burst(2600,.25,.14,2);Snd.tone(160,.35,'sine',.12,0,60);Snd.burst(400,.3,.2,1);
  }
  function rot(x,y){const c0=col,a=c0.ang*c0.dir,dx=x-c0.px,dy=y-c0.py,ca=Math.cos(a),sa=Math.sin(a);return [c0.px+dx*ca-dy*sa,c0.py+dx*sa+dy*ca];}
  function land(){
    const f=fall,b=f.s,spr=f.spr,dx=f.x-topX(),a=Math.abs(dx),edge=tower.length?SW2/2:44,vm=hang.A*hang.w;
    const sy=towerTop()-camY;
    k2++;
    if(a>edge){deb.push({spr,x:f.x,y:towerTop()-spr.hh/2,vx:(dx>0?1:-1)*40,vy:-50,a:0,va:(dx>0?1:-1)*3,t:0});
      Snd.burst(900,.12,.18,2);judge('F',f.e<0?'◀ Pronto: se cayó por el borde':'Tarde ▶: se cayó por el borde',f.x,sy-10);fall=null;return;}
    tower.push({x:f.x,s:b,spr,land:0});wob.kick(-dx*7);
    Snd.burst(500,.08,.3,1.4);Snd.tone(140,.08,'sine',.12,0,90);Feel.puff(f.x-SW2/2+4,sy+1,3,C.white);Feel.puff(f.x+SW2/2-4,sy+1,3,C.white);
    const st=stability();
    if(st.fail>-2){let m=0,sx=0;for(const t of tower){m+=t.spr.hh;sx+=t.x*t.spr.hh;}
      judge('F','¡La torre se inclinó y se cayó entera!',160,Math.max(50,sy-20));fall=null;collapse(sx/m>=160?1:-1);return;}
    const ta=a/vm,j=a<=2.5||ta<=0.05?'P':a<=5||ta<=0.1?'B':a<=9||ta<=0.16?'R':'F';
    judge(j,j==='P'?'':(f.e<0?'◀ Pronto':'Tarde ▶'),f.x,Math.max(50,sy-12));
    if(j==='P'){Feel.ring(f.x,sy,C.butter,22);}
    fall=null;
  }
  function goPhase2(){phase=2;swapT=0;k2=0;camY=0;nextHang();chSb=towerTop()-GAP;}
  if(TDEMO==='apilar'){for(const s of stacks)tray.push(s);si=N1;goPhase2();swapT=2;}TDEMO=null;
  if(preview){spawn();cur.st='slide';cur.sh.forEach(h=>h.off=0);cur.x=SHX-cur.marks[0].o-14;}

  const self={_ph:()=>({phase,cur,st2,sx:hang?swingX():0,vx:hang?swingV():0,topX:topX()}),unit:'Paso',total:TOTAL,mood:'grapadora',
    inPractice(){return false;},progress(){return done;},
    cue(){return phase===1?'Fase 1 · Grapa cada marca rosa justo bajo la grapadora':'Fase 2 · Suelta el montón justo encima de la torre';},
    update(dt){
      T+=dt;if(arm.t>=0){arm.t+=dt;if(arm.t>0.6)arm.t=-1;}arm.flash=Math.max(0,arm.flash-dt);
      for(const a of air){a.t+=dt;}while(air.length&&air[0].t>0.6)air.shift();
      if(phase===2)return upd2(dt);
      if(!cur&&si<N1&&!leaving.some(s=>s.x<200)){spawnT-=dt;if(spawnT<=0)spawn();}
      const s=cur;let bv=0;
      if(s){s.t+=dt;s.sq=Math.max(0,s.sq-dt);s.lag.step(dt);
        if(s.st==='drop'){let all=true;s.sh.forEach((h,k)=>{const t0=k*0.045,u=(s.t-t0)/0.24;if(u<1){all=false;h.off=Math.max(0,(70+k*7)*(1-u*u));}else{const b=u-1;h.off=b<0.35?Math.max(0,Math.sin(b/0.35*Math.PI)*2.2*(k===s.n-1?1:0.6)):0;if(b<0.35)all=false;}});
          if(!s.thud&&s.t>0.24+0.045*(s.n-1)){s.thud=1;Snd.burst(1800,.07,.14,1.5);Snd.tone(220,.06,'sine',.04,0,140);Feel.puff(s.x+8,SBASE+1,3,C.white);Feel.puff(s.x+SSW-8,SBASE+1,3,C.white);}
          if(all){s.st='look';s.t=0;}}
        else if(s.st==='look'){if(s.t>=s.look){s.st='slide';s.t=0;s.lag.kick(-26);Snd.burst(900,.08,.05,1);Snd.tone(330,.08,'triangle',.03,0,440);}}
        else if(s.st==='slide'){
          if(s.hitch>0){s.hitch-=dt;s.vn=0;}else{const v0=s.vn;s.vn=speed(s);s.mt+=dt;s.x+=s.vn*dt;if(s.vn-v0>dt*160)s.lag.kick(-(s.vn-v0)*0.25);else if(v0-s.vn>dt*160)s.lag.kick((v0-s.vn)*0.25);}
          bv=s.vn;
          for(const m of s.marks){if(m.j)continue;if(s.x+m.o-SHX>tol(s)*0.16+1){m.j='F';judge('F','Tarde ▶: se pasó sin grapa',SHX+44,64);}}
          if(s.marks.every(m=>m.j))leave(s);
        }
        else if(s.st==='hit'){if(s.t>0.25)leave(s);}
      }
      for(const q of leaving){q.t+=dt;q.sq=Math.max(0,q.sq-dt);q.lag.step(dt);const v=Math.min(260,80+q.t*420);q.x+=v*dt;bv=Math.max(bv,v);
        if(q.x>W+4&&!q.gone){q.gone=true;if(q.marks.some(m=>m.j&&m.j!=='F')){tray.push(q);Snd.tone(520,.06,'sine',.04);}}}
      for(let i=leaving.length-1;i>=0;i--){if(leaving[i].x>W+20)leaving.splice(i,1);}
      belt+=bv*dt;bvNow=bv;
      if(si>=N1&&!cur&&!leaving.length){endT+=dt;if(endT>0.6){endT=0;goPhase2();Core.banner('Fase 2','¡A apilar!','Tu compañero cruza en su silla con el montón en la cabeza. Toca para soltarlo encima de la torre. Si se inclina demasiado, se cae entera.',2.4,'apilar');}}
    },
    press(){
      if(phase===2){
        if(swapT<2||st2!=='swing'||fall)return;
        const x=swingX(),v=swingV(),e=(x-topX())*Math.sign(v||1);
        fall={x,yb:chSb,vy:0,s:hang.s,spr:hang.spr,e};hang.gone=true;hopT=0.25;exitX=x;st2='fall';t2=0;Snd.burst(3000,.03,.15,3);Snd.tone(600,.05,'square',.02);return;}
      arm.t=0;arm.flash=0;Snd.staple();
      const s=cur;
      if(!under(s)){arm.contact=0;arm.flash=0.12;air.push({x:SHX,t:0});Core.waste(SHX+44,64,'Grapa al aire');return;}
      arm.contact=Math.max(0,s.n*2-4);s.lag.kick(12);arm.flash=0.16;s.sq=0.14;/* la cabeza baja hasta la hoja de arriba y aplasta un pelín */
      const sy=SBASE-SSD-2*s.n+SDEP;
      let best=null,bd=1e9;for(const m of s.marks){if(m.j)continue;const d=Math.abs(s.x+m.o-SHX);if(d<bd){bd=d;best=m;}}
      if(!best){Core.waste(SHX+44,64,'Ya estaba grapado');return;}
      const ta=bd/tol(s),j=ta<=0.05?'P':ta<=0.1?'B':ta<=0.16?'R':'F';
      best.j=j;best.rel=SHX-s.x;judge(j,j==='P'?'':(s.x+best.o<SHX?'◀ Pronto':'Tarde ▶'),SHX+44,64);
      if(j==='P')Feel.ring(SHX,sy,C.butter,14);
      if(s.marks.every(m=>m.j))s.st='hit',s.t=0;else s.hitch=0.14;
    },
    draw(c){
      if(phase===2)return draw2(c);
      c.drawImage(bg,0,0);
      // agujas del reloj
      const hA=Core.time*0.05-1.2,mA=Core.time*0.6;line(c,140,21,140+Math.cos(hA)*4,21+Math.sin(hA)*4,C.out);line(c,140,21,140+Math.cos(mA)*7,21+Math.sin(mA)*7,C.lavDD);px(c,140,21,C.pinkDD);
      drawBelt(c);
      const L=lift();
      drawStaplerBase(c,L);
      const all=leaving.concat(cur?[cur]:[]);
      for(const s of all){
        if(s.x>W||s.x+SSW<-4)continue;
        const [tx,ty]=drawStack3(c,s,s.x,s.yo);
        drawTopSheet(c,tx,ty,s);drawMarks(c,tx,ty,s);
        for(const m of s.marks)if(m.rel!=null)drawStaple3(c,tx+m.rel,ty+SDEP,m.j);
        // rayitas de velocidad cuando la cinta corre
        if(s.st==='slide'&&s.vn>s.v*1.12||s.st==='out'){for(let k=0;k<3;k++)R(c,Math.round(s.x)-8-k*3-(Math.floor(Core.time*20)+k)%3,SBASE-10-k*8-2*s.n,5+k,1,C.lavD);}
      }
      drawStaplerArm(c,L,arm.flash);
      // aviso de que la cinta va a arrancar
      if(cur&&cur.st==='look'){const k=cur.t/cur.look,y=SBASE-SSD-2*cur.n+12;if(k>0.35){for(let i=0;i<3;i++)if(k>0.35+i*0.2)R(c,cur.x+SSW+6+i*5,y,3,1,C.lavDD);}}
      for(const a of air){const y=SAY-2+a.t*40;R(c,a.x-1,Math.round(y),1,3,C.metalDD);R(c,a.x+1,Math.round(y)+1,1,3,C.metalDD);}
    }
  };
  function drawBelt(c){
    // banda con listones que avanzan a la velocidad real de la cinta y rodillos que giran en el canto
    const o=belt%14;
    for(let x=-o;x<W;x+=14){const xx=Math.round(x);c.save();c.globalAlpha=0.55;R(c,xx,BLT0,1,BLT1-BLT0,C.beltD);c.restore();R(c,xx+1,BLT0+1,1,BLT1-BLT0-2,'#e4def4');}
    const a=belt/3;for(let x=10;x<W;x+=22){ell(c,x,BLT1+3,2,2,'#8a7cb0');px(c,x+Math.round(Math.cos(a)*1.6),BLT1+3+Math.round(Math.sin(a)*1.6),C.beltL);}
    // piloto del motor: verde si corre, amarillo que parpadea antes de arrancar
    const on=bvNow>1,warn=cur&&cur.st==='look'&&cur.t>cur.look*0.35&&Math.floor(Core.time*8)%2;
    R(c,4,BLT1+1,4,3,on?C.mintDD:warn?C.butterD:'#8a7cb0');px(c,4,BLT1+1,on?C.mintL:warn?'#fff8d0':C.beltD);
  }
  function upd2(dt){
    if(swapT<2){swapT+=dt;}
    t2+=dt;hopT=Math.max(0,hopT-dt);puffT=Math.min(1,puffT+dt*1.6);
    wob.step(dt);
    for(const d of deb){d.t+=dt;d.vy+=520*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;d.a+=d.va*dt;}
    for(let i=deb.length-1;i>=0;i--)if(deb[i].y-camY>H+60)deb.splice(i,1);
    for(const b of tower)b.land+=dt;
    const st=tower.length>1&&!col?stability().worst:0;danger+=((st>0.62?(st-0.62)/0.38:0)-danger)*Math.min(1,dt*4);
    if(danger>0.2&&!col){creakT-=dt;if(creakT<=0){creakT=0.9;Snd.tone(180+Math.random()*40,.18,'sawtooth',.012,0,150);}}
    const target=col&&col.t>0.6?0:Math.min(0,towerTop()-112);camY+=(target-camY)*Math.min(1,dt*3);
    // la silla sube con el pistón hasta la altura de la torre (psss), entra por la izquierda y, al soltar, se va por la derecha
    if(hang&&!hang.gone){const tgt=towerTop()-GAP;chSb+=(tgt-chSb)*Math.min(1,dt*5);}
    if(hang&&hang.gone){const k=t2;chX=exitX+60*k+420*k*k;}
    if(st2==='load'){const k=Ease.outCubic(Math.min(1,t2/0.7));chX=-40+(pcx-hang.A+40)*k;if(t2>=0.7){st2='swing';swT=0;}}
    else if(st2==='swing'){swT+=dt;chX=swingX();}
    else if(st2==='fall'&&fall){fall.vy+=900*dt;fall.yb+=fall.vy*dt;if(fall.yb>=towerTop()){fall.yb=towerTop();land();if(st2==='fall')st2='settle';}}
    else if(st2==='settle'){if(t2>0.45&&chX>W+30){if(k2<N2)nextHang();else{st2='end';endT=0;}}}
    else if(st2==='collapse'){col.t+=dt;
      if(tower.length){col.av+=(3+col.ang*9)*dt;col.ang+=col.av*dt;if(col.ang>0.42)scatter();}
      // los montones que quedaban ya no se pueden apilar: cuentan como fallo, de uno en uno
      if(owed>0&&col.t>0.9){owedT-=dt;if(owedT<=0){owedT=0.14;const q=++owedQ;owed--;k2++;
        judge('F',q===1?'Sin torre: '+(owed?(owed+1)+' montones sin apilar':'1 montón sin apilar'):'',q===1?160:44+((q-2)%8)*33,q===1?128:q%2?84:104);}}
      if(owed<=0&&!tower.length&&!deb.length&&col.t>1.6&&!ended){ended=true;Core.finish();}}
    else if(st2==='end'){endT+=dt;if(endT>0.3&&!goal){goal=1;if(tower.length>=N2*0.7){Feel.confetti(topX(),towerTop()-camY,26);Snd.fanfare('S');}}
      if(endT>1.6&&!deb.length&&!ended){ended=true;Core.finish();}}
  }
  function draw2(c){
    const cy=Math.round(camY);
    c.drawImage(bg2,0,SBG2+cy,W,H,0,0,W,H);
    // compañero en la silla (detrás de la mesa y de la torre)
    if(hang&&chX>-30&&chX<W+30){const v=st2==='swing'?swingV():st2==='load'?120:200,lg=Math.max(-1,Math.min(1,Math.round(-v/40)));
      const sb=Math.round(chSb-cy),rod=8+Math.max(0,Math.round((SGY-2-GAP)-chSb));
      drawCoworker(c,chX,sb,{legs:lg,up:hopT>0?Math.sin(hopT/0.25*Math.PI)*3:0,hop:hopT,rod,blink:Core.time%3.1<0.12,worry:danger>0.3||!!col});
      if(!hang.gone){const sp=hang.spr;c.drawImage(sp,Math.round(chX-SW2/2-sp.ax),Math.round(sb-sp.hh-sp.ay));}
      drawGasPuff(c,chX,sb+28,puffT);
      // sombra guía sobre la torre: dónde caería
      if(!hang.gone&&st2==='swing'){const ty=towerTop()-cy;c.save();c.globalAlpha=0.35;R(c,Math.round(chX-SW2/2+2),ty-1,SW2-4,1,C.lavDD);c.restore();}
    }
    c.drawImage(bg2d,0,SBG2+cy,W,H,0,0,W,H);
    // torre: cada nivel se desplaza con el bamboleo (más arriba, más se mueve); al derrumbarse gira entera sobre la esquina
    const n=tower.length,sway=col?0:wob.x+danger*Math.sin(Core.time*8)*3;
    let y=SGY-2;
    for(let i=0;i<n;i++){const b=tower[i],sp=b.spr,f=(i+1)/n,ox=Math.round(sway*f*f),sq=b.land<0.08&&i===n-1?1:0;
      y-=sp.hh;
      if(col){const [rx,ry]=rot(b.x,y+sp.hh/2);c.save();c.translate(Math.round(rx),Math.round(ry-cy));c.rotate(col.ang*col.dir);c.drawImage(sp,-Math.round(SW2/2+sp.ax),-Math.round(sp.hh/2+sp.ay));c.restore();}
      else c.drawImage(sp,Math.round(b.x-SW2/2-sp.ax+ox),Math.round(y-cy-sp.ay+sq));}
    if(fall){const sp=fall.spr;c.drawImage(sp,Math.round(fall.x-SW2/2-sp.ax),Math.round(fall.yb-sp.hh-cy-sp.ay));}
    for(const d of deb){c.save();c.translate(Math.round(d.x),Math.round(d.y-cy));c.rotate(d.a);c.drawImage(d.spr,-Math.round(d.spr.width/2),-Math.round(d.spr.height/2));c.restore();}
    if(danger>0.25&&n&&!col){const ty=towerTop()-cy-14,tx=topX()+Math.round(sway)+SW2/2+6;if(Math.floor(Core.time*4)%2){R(c,tx,ty,2,6,C.pinkDD);R(c,tx,ty+8,2,2,C.pinkDD);}}
  }
  return self;
}
