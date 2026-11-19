/* =====================================================================
   MINIJUEGO 2 · GRAPADORA
   Fase 1 · Grapar: llega un montón de folios cada vez. Cae sobre la mesa,
     tienes un momento para mirarlo y luego una mano lo empuja hacia la
     grapadora. Grapa solo los montones con marca rosa; los dibujos, las
     fotos, los que no tienen marca y los que ya llevan clip se dejan pasar.
   Fase 2 · Apilar: los montones grapados cuelgan de una pinza que se
     balancea. Suéltalos encima de la torre: si quedan torcidos la torre se
     inclina y, si se pasa, se cae.
   ===================================================================== */
const SHX=164,SBASE=146,SSD=34,SSW=92,SDEP=14,SAY=SBASE-SSD+SDEP,SHL=70,SSTOP=SHX+46,SSTART=12,SREST=24;
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
  // alfombrilla de corte (menta, con cuadrícula)
  dith(c,6,90,248,72,C.woodDD);
  obj(c,l=>{rr(l,2,84,248,74,C.mint,3);});
  for(let x=10;x<248;x+=10)R(c,x,86,1,70,C.mintD);for(let y=90;y<156;y+=5)R(c,4,y,244,1,C.mintD);
  for(let x=10;x<248;x+=50)R(c,x,86,1,70,C.mintDD);R(c,4,86,244,1,C.mintL);R(c,4,155,244,1,C.mintDD);
  for(let x=14;x<240;x+=10)R(c,x,86,1,2,C.mintDD);
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
  // bandeja de los montones grapados
  dith(c,260,124,58,30,C.woodDD);
  obj(c,l=>{rr(l,256,100,60,50,C.lavD,3);});
  R(c,259,103,54,36,C.lav);dith(c,259,103,54,10,C.lavDD);for(let x=262;x<313;x+=6)R(c,x,139,1,10,C.lavDD);R(c,256,138,60,1,C.lavL);R(c,258,148,56,1,C.lavDD);
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
function drawDoodle(c,cx,cy,art){
  if(art==='gato'){for(const [dx,dy] of [[-6,-6],[-5,-7],[-4,-6],[4,-6],[5,-7],[6,-6]])px(c,cx+dx,cy+dy,C.lavDD);
    c.save();c.strokeStyle=C.lavDD;c.lineWidth=1;c.beginPath();c.ellipse(cx+0.5,cy+0.5,7,6,0,0,Math.PI*2);c.stroke();c.restore();
    px(c,cx-3,cy-1,C.out);px(c,cx+3,cy-1,C.out);px(c,cx,cy+1,C.pinkDD);R(c,cx-10,cy+1,4,1,C.lavD);R(c,cx+7,cy+1,4,1,C.lavD);ell(c,cx-4,cy+2,1,1,C.pinkL);ell(c,cx+4,cy+2,1,1,C.pinkL);}
  else if(art==='flor'){R(c,cx,cy+2,1,10,C.greenDD);ell(c,cx-3,cy+8,3,1,C.greenD);ell(c,cx+3,cy+6,3,1,C.greenD);
    for(let k=0;k<5;k++){const a=k/5*Math.PI*2;ell(c,cx+Math.round(Math.cos(a)*4),cy-3+Math.round(Math.sin(a)*4),2,2,k%2?C.pinkD:C.pink);}ell(c,cx,cy-3,2,2,C.butterD);}
  else if(art==='casa'){rr(c,cx-7,cy-1,15,11,C.peach,1);for(let k=0;k<7;k++)R(c,cx-8+k,cy-2-k,17-2*k,1,C.pinkD);R(c,cx-1,cy+4,4,6,C.woodDD);R(c,cx+4,cy+1,3,3,C.skyD);R(c,cx-6,cy+1,3,3,C.skyD);}
  else if(art==='sol'){ell(c,cx,cy,5,5,C.butterD);ell(c,cx,cy,4,4,C.butter);for(let k=0;k<8;k++){const a=k/8*Math.PI*2;px(c,cx+Math.round(Math.cos(a)*8),cy+Math.round(Math.sin(a)*8),C.butterDD);px(c,cx+Math.round(Math.cos(a)*7),cy+Math.round(Math.sin(a)*7),C.butterD);}
    px(c,cx-2,cy-1,C.out);px(c,cx+2,cy-1,C.out);R(c,cx-1,cy+2,3,1,C.peachDD);}
  else if(art==='corazon'){ell(c,cx-3,cy-2,4,4,C.pinkD);ell(c,cx+3,cy-2,4,4,C.pinkD);for(let k=0;k<7;k++)R(c,cx-7+k,cy+k,15-2*k,1,C.pinkD);px(c,cx-4,cy-4,C.white);}
  else if(art==='pez'){ell(c,cx-1,cy,7,4,C.skyD);ell(c,cx-1,cy-1,6,2,C.sky);for(let k=0;k<5;k++)R(c,cx+6+k,cy-k,1,2*k+1,C.skyD);px(c,cx-5,cy-1,C.out);for(let k=0;k<3;k++)ell(c,cx-11+k*2,cy-6-k*3,1,1,C.skyL);}
  else{for(let k=0;k<6;k++)R(c,cx-k,cy-6+k,2*k+1,1,C.butterD);R(c,cx-8,cy,17,2,C.butterD);for(let k=0;k<5;k++){R(c,cx-6+k,cy+2+k,4,1,C.butterD);R(c,cx+3-k,cy+2+k,4,1,C.butterD);}px(c,cx-1,cy-2,C.out);px(c,cx+1,cy-2,C.out);}
}
function drawTopSheet(c,x,y,s){
  const w=SSW,L='#ddd5ea',k=s.kind,sd=s.seed;
  if(k==='dibujo'){
    // dibujo con ceras: garabatos de colores y un sol o un gato en el centro
    const arts=s.arts;for(let i=0;i<arts.length;i++)drawDoodle(c,x+20+i*30,y+16+((i+sd)%2?2:-1),arts[i]);
    R(c,x+4,y+30,w-8,1,C.greenD);for(let xx=x+5;xx<x+w-5;xx+=3)px(c,xx,y+29-((xx+sd)%2),C.greenDD);
    return;}
  if(k==='foto'){
    R(c,x+3,y+2,w-6,SSD-5,C.skyL);R(c,x+3,y+2,w-6,10,C.sky);ell(c,x+w-20,y+9,4,3,C.butter);
    ell(c,x+24,y+28,26,9,C.green);ell(c,x+62,y+29,22,7,C.greenD);ell(c,x+18,y+8,6,1,C.white);ell(c,x+44,y+6,5,1,C.white);
    R(c,x+3,y+30,w-6,1,C.greenDD);
    for(let i=0;i<10;i++)px(c,x+w-26+i*2,y+3+i,'rgba(255,255,255,0.75)');
    return;}
  const f=s.fmt,hd=s.hd,lw=w-30;
  if(f==='carta'){R(c,x+6,y+4,24,2,hd);ell(c,x+w-26,y+5,2,1,hd);
    [[10,lw],[14,lw-8],[18,lw-2],[22,lw-14],[26,lw-5]].forEach(([dy,ww],i)=>R(c,x+6,y+dy,ww-((sd*3+i*7)%10),1,L));
    for(let i=0;i<9;i++)px(c,x+w-40+i,y+30-(i%3===1?1:0),C.lavDD);}
  else if(f==='tabla'){R(c,x+6,y+4,24,2,hd);R(c,x+6,y+9,lw,3,hd);for(let r=0;r<5;r++)R(c,x+6,y+14+r*4,lw,1,L);for(let q=1;q<4;q++)R(c,x+6+q*Math.floor(lw/4),y+9,1,21,L);}
  else if(f==='grafica'){R(c,x+6,y+4,24,2,hd);R(c,x+7,y+9,1,22,C.lavD);R(c,x+7,y+30,lw,1,C.lavD);const cols=[C.pinkD,C.mintDD,C.skyD,C.butterD,C.lavD,C.peachD];
    for(let q=0;q<7;q++){const h=5+((sd*7+q*13)%15);R(c,x+11+q*8,y+30-h,5,h,cols[q%cols.length]);}}
  else if(f==='lista'){R(c,x+6,y+4,24,2,hd);for(let r=0;r<5;r++){const yy=y+10+r*4;R(c,x+6,yy-1,3,3,C.lavD);if((sd+r)%3)R(c,x+7,yy,1,1,C.paper);else{px(c,x+7,yy,C.mintDD);}R(c,x+11,yy,Math.min(lw-6,20+((sd+r*5)%24)),1,L);}}
  else{R(c,x+w/2-20,y+4,22,2,hd);for(let r=0;r<4;r++){R(c,x+14,y+10+r*4,28,1,L);R(c,x+w-40,y+10+r*4,10,1,L);}for(let q=x+10;q<x+w-26;q+=3)px(c,q,y+26,C.lavD);R(c,x+14,y+29,16,1,C.lavDD);R(c,x+w-40,y+29,10,1,C.lavDD);}
  if(k==='clip'){// ya va sujeto con un clip: no se grapa
    const cx=x+w-16;R(c,cx,y-3,10,1,C.metalDD);R(c,cx,y+9,10,1,C.metalDD);R(c,cx-1,y-2,1,11,C.metalDD);R(c,cx+10,y-2,1,10,C.metalDD);
    R(c,cx+2,y-1,7,1,C.metalD);R(c,cx+2,y+6,7,1,C.metalD);R(c,cx+2,y,1,6,C.metalD);R(c,cx+1,y-2,8,1,C.metalL);}
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
function mkSheets(rng,n,kind){
  const sh=[];for(let k=0;k<n;k++){const tint=rng()<0.13;const p=tint?STINT[Math.floor(rng()*STINT.length)]:SPAPER[Math.floor(rng()*SPAPER.length)];
    sh.push({dx:Math.round((rng()-0.5)*3.6),col:p[0],e1:p[1],e2:p[2],off:0});}
  const top=sh[n-1];top.dx=Math.round((rng()-0.5)*3);
  if(kind==='dibujo'){const p=STINT[Math.floor(rng()*STINT.length)];top.col=p[0];top.e1=p[1];top.e2=p[2];}
  else{top.col=SPAPER[0][0];top.e1=SPAPER[0][1];top.e2=SPAPER[0][2];}
  return sh;
}
function drawStack3(c,s,x0,yo){
  // cada folio es su cara de arriba y dos filas de canto: al apilarlos se ven todas las hojas
  const n=s.n,sq=s.sq>0?1:0,lg=k=>n>1?Math.round(s.lag.x*k/(n-1)):0;yo=yo||0;
  dith(c,Math.round(x0)+3,SBASE-SSD+2+yo,SSW+1,SSD,C.mintDD);
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
function drawHand(c,x,y,push){
  // mano con manga de jersey que empuja el montón desde la izquierda
  x=Math.round(x);y=Math.round(y);
  obj(c,l=>{
    R(l,x-90,y-5,78,12,C.lav);rr(l,x-16,y-6,6,14,C.mint,2);
    rr(l,x-12,y-4,11,10,C.peach,3);rr(l,x-3,y-4,4,3,C.peach,1);rr(l,x-3,y-1,3,3,C.peach,1);rr(l,x-4,y+2,3,3,C.peach,1);
  },{sel:true});
  for(let k=x-88;k<x-16;k+=4)R(c,k,y-4,2,10,C.lavL);R(c,x-90,y+5,74,1,C.lavD);
  R(c,x-15,y-5,4,1,C.mintL);R(c,x-15,y-2,4,1,C.mintD);R(c,x-15,y+1,4,1,C.mintD);R(c,x-15,y+4,4,1,C.mintD);
  R(c,x-11,y-3,6,1,C.peachL);R(c,x-2,y-4,2,1,C.peachL);px(c,x-3,y-2,C.peachD);px(c,x-3,y+1,C.peachD);R(c,x-10,y+4,7,1,C.peachD);
  if(push)px(c,x+1,y-5,C.white);
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
  if(s.hd&&!s.trap)R(x,X0+SW2-20+dx(n-1),Y0,12,1,s.hd);
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
  // mesa con la bandeja
  const gy=o+SGY;
  R(c,0,gy,W,HT-gy,C.wood);R(c,0,gy,W,1,C.woodL);R(c,0,gy+1,W,1,C.woodL);R(c,0,gy+6,W,1,C.woodD);R(c,0,gy+12,W,HT-gy-12,C.woodDD);R(c,0,gy+12,W,1,C.woodD);
  for(let x=20;x<W;x+=70)R(c,x,gy+2,30,1,C.woodD);
  objAt(c,o,l=>{rr(l,112,SGY-8,96,10,C.lavD,2);});
  R(c,114,gy-7,92,2,C.lav);for(let x=118;x<204;x+=6)R(c,x,gy-5,2,4,C.lavDD);R(c,113,gy-8,94,1,C.lavL);
  // planta en el suelo de la mesa a la izquierda y taza a la derecha
  objAt(c,o,l=>{rr(l,24,SGY-16,18,16,C.peachD,3);ell(l,28,SGY-22,6,8,C.greenD);ell(l,38,SGY-24,6,9,C.green);ell(l,33,SGY-30,4,8,C.greenD);});
  objAt(c,o,l=>{rr(l,262,SGY-18,18,18,C.cream,4);rr(l,278,SGY-14,7,10,C.cream,3);l.clearRect(280,SGY-12,3,6);});R(c,264,gy-12,14,4,C.pinkL);
}
function drawClip(c,x,y,open){
  // pinza de oficina (binder clip) que sujeta el montón por arriba
  x=Math.round(x);y=Math.round(y);const o=Math.round(open*3);
  obj(c,l=>{rr(l,x-7,y-1,15,6,'#5b4a6b',1);},{sel:true});
  R(c,x-6,y,13,1,'#7a6890');R(c,x-6,y+4+0,13,1,'#3d3150');
  // asas de alambre: al abrir se juntan
  line(c,x-5,y-1,x-2+o,y-7,C.metalD);line(c,x+5,y-1,x+2-o,y-7,C.metalD);R(c,x-2+o,y-8,5-2*o>0?5-2*o:1,1,C.metal);
  px(c,x-4,y-2,C.metalL);px(c,x+4,y-2,C.metalL);
  if(open>0){R(c,x-8,y+5,2,o+1,'#5b4a6b');R(c,x+7,y+5,2,o+1,'#5b4a6b');}
}

function Stapler(rng,preview){
  const N1=11,N2=10;
  // Fase 1: lista de montones. Los dos primeros siempre llevan marca; después hay trampas y montones de dos grapas.
  const KINDS=['dibujo','foto','sinmarca','clip'],FMT=['carta','tabla','grafica','lista','recibo'],ART=['gato','flor','casa','sol','corazon','pez','estrella'];
  const stacks=[];let U1=0;
  for(let i=0;i<N1;i++){
    const r=rng();let kind=i<2?'normal':r<0.32?KINDS[Math.floor(rng()*KINDS.length)]:r<0.5?'doble':'normal';
    if(i>=2&&stacks[i-1].trap&&stacks[i-2].trap&&kind!=='normal'&&kind!=='doble')kind='normal';
    const trap=KINDS.indexOf(kind)>=0,n=kind==='foto'?3+Math.floor(rng()*3):4+Math.floor(rng()*(i<3?3:6));
    const marks=kind==='doble'?[{o:SSW-10,j:null,rel:null},{o:SSW-34,j:null,rel:null}]:trap?[]:[{o:SSW-10,j:null,rel:null}];
    const prog=i/(N1-1);
    stacks.push({kind,trap,n,sh:mkSheets(rng,n,kind),marks,staples:[],fmt:FMT[Math.floor(rng()*FMT.length)],hd:[C.pinkD,C.mintDD,C.lavD,C.butterD,C.skyD][Math.floor(rng()*5)],
      arts:[ART[Math.floor(rng()*ART.length)],ART[Math.floor(rng()*ART.length)],ART[Math.floor(rng()*ART.length)]],seed:Math.floor(rng()*99),
      v:(44+30*prog)*(0.92+rng()*0.16),look:0.95-0.35*prog,st:'drop',t:0,x:SSTART,yo:0,sq:0,hitch:0,hand:-1,judged:false,
      lag:Spring(0,140,9),tab:rng()<0.6?[Math.floor(rng()*n),[C.pinkD,C.mintDD,C.butterD,C.skyD][Math.floor(rng()*4)]]:null});
    U1+=trap?1:marks.length;
  }
  const TOTAL=U1+N2;
  let phase=1,si=0,cur=null,spawnT=0.2,done=0,T=0,endT=0,ended=false,swapT=9;const leaving=[],air=[];
  const arm={t:-1,from:SREST,contact:0,flash:0};
  const tray=[];// montones grapados (pasan a la fase 2)
  const bg=mk(W,H);drawDesk3(bg.getContext('2d'));grain(bg.getContext('2d'),14,4);
  // el brazo baja de golpe (la parada de impacto lo congela abajo) y sube con un rebote
  const lift=()=>{const a=arm,t=a.t;if(t<0)return SREST;if(t<0.11)return a.contact;
    if(t<0.5)return a.contact+(SREST-a.contact)*Ease.outBack((t-0.11)/0.39);return SREST;};
  function judge(j,det,x,y){done++;Core.judge(j,x,y,false,det);}
  function spawn(){const s=stacks[si++];s.st='drop';s.t=0;s.x=SSTART;s.sh.forEach((h,k)=>{h.off=70+k*7;});cur=s;Snd.tone(700,.05,'sine',.02);}
  function under(s){return s&&(s.st==='slide'||s.st==='hit')&&s.x<=SHX-2&&s.x+SSW>=SHX+2;}
  function leave(s){s.st='out';s.t=0;leaving.push(s);if(cur===s)cur=null;spawnT=0.45;}

  /* ---------- fase 2 ---------- */
  const tower=[],deb=[];let pcx=160,k2=0,st2='load',t2=0,swT=0,hang=null,fall=null,camY=0,pivY=0,clipOpen=0,wob=Spring(0,90,5),danger=0,creakT=0,goal=0;
  const sprCache=new Map();const sprOf=s=>{if(!sprCache.has(s))sprCache.set(s,sideSprite(s));return sprCache.get(s);};
  const bg2=mk(W,H+SBG2);drawTower2Bg(bg2.getContext('2d'));
  const towerTop=()=>{let y=SGY-2;for(const b of tower)y-=b.spr.hh;return y;};
  const topX=()=>tower.length?tower[tower.length-1].x:160;
  const amp=()=>34+2.2*k2,omega=()=>Math.PI*2/(2.3-0.05*k2);
  const swingX=()=>pcx+amp()*Math.sin(omega()*swT),swingV=()=>amp()*omega()*Math.cos(omega()*swT);
  function nextHang(){
    const pool=tray.length?tray:stacks.filter(s=>!s.trap);const s=pool[k2%pool.length];
    const spr=sprOf(s);hang={s,spr};pcx=Math.max(80,Math.min(240,topX()));/* la pinza se recoloca sobre la torre */pivY=towerTop()-26-spr.hh-SL2;st2='load';t2=0;
  }
  function hangPos(){
    const x=swingX(),dx=x-pcx,yEnd=pivY+Math.sqrt(Math.max(0,SL2*SL2-dx*dx));
    const drop=st2==='load'?(1-Ease.outBack(Math.min(1,t2/0.6)))*-110:0;
    return {x,clipY:yEnd+drop,top:yEnd+drop+4};
  }
  function stability(){
    // de abajo arriba: si el centro de masas de lo que queda encima se sale del montón (o de la bandeja), se cae
    let worst=0,fail=-2;
    for(let k=-1;k<tower.length-1;k++){let m=0,sx=0;for(let q=k+1;q<tower.length;q++){m+=tower[q].spr.hh;sx+=tower[q].x*tower[q].spr.hh;}
      const com=sx/m,base=k<0?160:tower[k].x,half=k<0?40:SW2*0.38,r=Math.abs(com-base)/half;worst=Math.max(worst,r);if(r>1&&fail<-1)fail=k;}
    return {fail,worst};
  }
  function topple(k,dir){
    const fallen=tower.splice(k+1);let y=towerTop();
    fallen.forEach((b,i)=>{deb.push({spr:b.spr,x:b.x,y:y-b.spr.hh/2,vx:dir*(26+i*14)+(Math.random()-0.5)*10,vy:-30-i*6,a:0,va:dir*(1.6+i*0.5+Math.random()),t:0});y-=b.spr.hh;});
    Core.shake=0.35;Snd.burst(700,.35,.3,1.2);Snd.burst(2600,.2,.12,2);Snd.tone(160,.3,'sine',.12,0,70);
  }
  function land(){
    const f=fall,b=f.s,spr=f.spr,dx=f.x-topX(),a=Math.abs(dx),edge=tower.length?SW2/2:44,vm=amp()*omega();
    const sy=towerTop()-camY;
    k2++;
    if(a>edge){deb.push({spr,x:f.x,y:towerTop()-spr.hh/2,vx:(dx>0?1:-1)*40,vy:-50,a:0,va:(dx>0?1:-1)*3,t:0});
      Snd.burst(900,.12,.18,2);judge('F',f.e<0?'◀ Pronto: se cayó por el borde':'Tarde ▶: se cayó por el borde',f.x,sy-10);fall=null;return;}
    tower.push({x:f.x,s:b,spr,land:0});wob.kick(-dx*7);
    Snd.burst(500,.08,.3,1.4);Snd.tone(140,.08,'sine',.12,0,90);Feel.puff(f.x-SW2/2+4,sy+1,3,C.white);Feel.puff(f.x+SW2/2-4,sy+1,3,C.white);
    const st=stability();
    if(st.fail>-2){const lean=tower.slice(st.fail+1).reduce((q,t)=>q+t.x,0)/(tower.length-st.fail-1)-(st.fail<0?160:tower[st.fail].x);
      topple(st.fail,lean>0?1:-1);judge('F','¡La torre se inclinó y se cayó!',160,Math.max(50,sy-20));fall=null;return;}
    const ta=a/vm,j=a<=2.5||ta<=0.05?'P':a<=5||ta<=0.1?'B':a<=9||ta<=0.16?'R':'F';
    judge(j,j==='P'?'':(f.e<0?'◀ Pronto':'Tarde ▶'),f.x,Math.max(50,sy-12));
    if(j==='P'){Feel.ring(f.x,sy,C.butter,22);}
    fall=null;
  }
  function goPhase2(){phase=2;swapT=0;k2=0;st2='load';t2=0;camY=0;swT=0;nextHang();}
  if(TDEMO==='apilar'){for(const s of stacks)if(!s.trap)tray.push(s);si=N1;goPhase2();swapT=2;}TDEMO=null;
  if(preview){spawn();cur.st='slide';cur.sh.forEach(h=>h.off=0);cur.x=SHX-cur.marks[0].o-14;cur.hand=1;}

  const self={_ph:()=>({phase,cur,st2,sx:hang?swingX():0,vx:hang?swingV():0,topX:topX()}),unit:'Paso',total:TOTAL,mood:'grapadora',
    inPractice(){return false;},progress(){return done;},
    cue(){return phase===1?'Fase 1 · Grapa en la marca rosa; si no tiene marca, déjalo pasar':'Fase 2 · Suelta el montón justo encima de la torre';},
    update(dt){
      T+=dt;if(arm.t>=0){arm.t+=dt;if(arm.t>0.6)arm.t=-1;}arm.flash=Math.max(0,arm.flash-dt);
      for(const a of air){a.t+=dt;}while(air.length&&air[0].t>0.6)air.shift();
      if(phase===2)return upd2(dt);
      if(!cur&&si<N1){spawnT-=dt;if(spawnT<=0)spawn();}
      const s=cur;
      if(s){s.t+=dt;s.sq=Math.max(0,s.sq-dt);s.lag.step(dt);
        if(s.st==='drop'){let all=true;s.sh.forEach((h,k)=>{const t0=k*0.045,u=(s.t-t0)/0.24;if(u<1){all=false;h.off=Math.max(0,(70+k*7)*(1-u*u));}else{const b=u-1;h.off=b<0.35?Math.max(0,Math.sin(b/0.35*Math.PI)*2.2*(k===s.n-1?1:0.6)):0;if(b<0.35)all=false;}});
          if(!s.thud&&s.t>0.24+0.045*(s.n-1)){s.thud=1;Snd.burst(1800,.07,.14,1.5);Snd.tone(220,.06,'sine',.04,0,140);Feel.puff(s.x+8,SBASE+1,3,C.white);Feel.puff(s.x+SSW-8,SBASE+1,3,C.white);}
          if(all){s.st='look';s.t=0;}}
        else if(s.st==='look'){s.hand=Math.min(1,s.t/s.look);if(s.t>=s.look){s.st='slide';s.t=0;s.lag.kick(-26);Snd.burst(900,.08,.05,1);}}
        else if(s.st==='slide'){
          if(s.hitch>0)s.hitch-=dt;else s.x+=s.v*dt;
          for(const m of s.marks){if(m.j)continue;if(s.x+m.o-SHX>s.v*0.16){m.j='F';judge('F','Se pasó sin grapa',SHX+44,64);}}
          if(s.x+SSW>=SSTOP){s.x=SSTOP-SSW;s.lag.kick(34);Snd.tone(320,.06,'triangle',.06);Snd.burst(1200,.04,.12,2);
            if(s.trap&&!s.judged){s.judged=true;judge('P','Bien: ese no se grapa',SHX+44,64);Snd.cap();}
            leave(s);}
        }
        else if(s.st==='hit'){if(s.t>0.3)leave(s);}
      }
      for(const s of leaving){s.t+=dt;s.sq=Math.max(0,s.sq-dt);s.lag.step(dt);
        if(s.t<0.22){s.x-=110*dt;s.hand=1;}
        else if(s.trap||!s.marks.some(m=>m.j&&m.j!=='F')){s.x-=(160+s.t*500)*dt;}
        else{s.yo-=(120+s.t*700)*dt;s.hand=0;if(s.yo<-150&&!s.gone){s.gone=true;tray.push(s);Snd.tone(520,.06,'sine',.04);}}}
      for(let i=leaving.length-1;i>=0;i--){const s=leaving[i];if(s.x+SSW<-100||s.yo<-160)leaving.splice(i,1);}
      if(si>=N1&&!cur&&!leaving.length){endT+=dt;if(endT>0.6){endT=0;goPhase2();Core.banner('Fase 2','¡A apilar!','Los montones grapados cuelgan de la pinza. Toca para soltarlos encima de la torre: si quedan torcidos, se inclina y se cae.',2.3);}}
    },
    press(){
      if(phase===2){
        if(swapT<2||st2!=='swing'||fall)return;
        const p=hangPos(),v=swingV(),e=(p.x-topX())*Math.sign(v||1);
        fall={x:p.x,yb:p.top+hang.spr.hh,vy:0,s:hang.s,spr:hang.spr,e};hang=null;clipOpen=0.3;st2='fall';Snd.burst(3000,.03,.15,3);Snd.tone(600,.05,'square',.02);return;}
      arm.t=0;arm.flash=0;Snd.staple();
      const s=cur;
      if(!under(s)){arm.contact=0;arm.flash=0.12;air.push({x:SHX,t:0});Core.waste(SHX+44,64,'Grapa al aire');return;}
      arm.contact=Math.max(0,s.n*2-4);s.lag.kick(12);arm.flash=0.16;s.sq=0.14;/* la cabeza baja hasta la hoja de arriba y aplasta un pelín */
      const sy=SBASE-SSD-2*s.n+SDEP;
      if(s.trap){s.staples.push({rel:SHX-s.x,j:'F'});if(!s.judged){s.judged=true;judge('F','¡Ese no se grapa!',SHX+44,64);}s.st='hit';s.t=0;return;}
      let best=null,bd=1e9;for(const m of s.marks){if(m.j)continue;const d=Math.abs(s.x+m.o-SHX);if(d<bd){bd=d;best=m;}}
      if(!best){s.staples.push({rel:SHX-s.x,j:'F'});Core.waste(SHX+44,64,'Ya estaba grapado');return;}
      const ta=bd/s.v,j=ta<=0.05?'P':ta<=0.1?'B':ta<=0.16?'R':'F';
      best.j=j;best.rel=SHX-s.x;judge(j,j==='P'?'':(s.x+best.o<SHX?'◀ Pronto':'Tarde ▶'),SHX+44,64);
      if(j==='P')Feel.ring(SHX,sy,C.butter,14);
      if(s.marks.every(m=>m.j))s.st='hit',s.t=0;else s.hitch=0.14;
    },
    draw(c){
      if(phase===2)return draw2(c);
      c.drawImage(bg,0,0);
      // agujas del reloj
      const hA=Core.time*0.05-1.2,mA=Core.time*0.6;line(c,140,21,140+Math.cos(hA)*4,21+Math.sin(hA)*4,C.out);line(c,140,21,140+Math.cos(mA)*7,21+Math.sin(mA)*7,C.lavDD);px(c,140,21,C.pinkDD);
      // bandeja: pila de montones ya grapados
      for(let i=0;i<tray.length;i++){const y=134-i*3,x=264+((i*3)%5)-2;R(c,x,y,42,6,i%2?C.paper:'#fbf8ff');R(c,x,y+6,42,1,'#e3dcee');R(c,x,y+7,42,1,'#cfc4e0');R(c,x+35,y+1,1,4,C.metalDD);R(c,x,y,1,8,'#cfc4e0');R(c,x+41,y,1,8,'#bdb0d2');}
      const L=lift();
      drawStaplerBase(c,L);
      const all=leaving.concat(cur?[cur]:[]);
      for(const s of all){
        if(s.x>W||s.x+SSW<-4)continue;
        const [tx,ty]=drawStack3(c,s,s.x,s.yo);
        drawTopSheet(c,tx,ty,s);drawMarks(c,tx,ty,s);
        for(const m of s.marks)if(m.rel!=null)drawStaple3(c,tx+m.rel,ty+SDEP,m.j);
        for(const q of s.staples)drawStaple3(c,tx+q.rel,ty+SDEP,'F');
        if(s.hand>=0&&s.yo>-2){const hx=s.x-2-(1-ease(s.hand))*80,hy=SBASE-SSD/2-2*s.n+s.yo;if(hx>-30)drawHand(c,hx,hy,s.st==='slide');}
      }
      drawStaplerArm(c,L,arm.flash);
      // aviso de que el montón va a arrancar
      if(cur&&cur.st==='look'){const k=cur.t/cur.look,y=SBASE-SSD-2*cur.n-8+Math.round(Math.sin(Core.time*10)*1);if(k>0.45){for(let i=0;i<3;i++)if(k>0.45+i*0.17)R(c,cur.x+SSW+6+i*5,y+20,3,1,C.lavDD);}}
      for(const a of air){const y=SAY-2+a.t*40;R(c,a.x-1,Math.round(y),1,3,C.metalDD);R(c,a.x+1,Math.round(y)+1,1,3,C.metalDD);}
    }
  };
  function upd2(dt){
    if(swapT<2){swapT+=dt;}
    swT+=dt;t2+=dt;clipOpen=Math.max(0,clipOpen-dt);
    wob.step(dt);
    for(const d of deb){d.t+=dt;d.vy+=520*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;d.a+=d.va*dt;}
    for(let i=deb.length-1;i>=0;i--)if(deb[i].y-camY>H+60)deb.splice(i,1);
    for(const b of tower)b.land+=dt;
    const st=tower.length>1?stability().worst:0;danger+=((st>0.62?(st-0.62)/0.38:0)-danger)*Math.min(1,dt*4);
    if(danger>0.2){creakT-=dt;if(creakT<=0){creakT=0.9;Snd.tone(180+Math.random()*40,.18,'sawtooth',.012,0,150);}}
    const target=Math.min(0,towerTop()-112);camY+=(target-camY)*Math.min(1,dt*3);
    if(st2==='load'){if(t2>=0.6)st2='swing';}
    else if(st2==='fall'&&fall){fall.vy+=900*dt;fall.yb+=fall.vy*dt;if(fall.yb>=towerTop()){fall.yb=towerTop();land();st2='settle';t2=0;}}
    else if(st2==='settle'){if(t2>0.4){if(k2<N2)nextHang();else st2='end';}}
    else if(st2==='end'){endT+=dt;if(endT>0.3&&!goal){goal=1;if(tower.length>=N2*0.7){Feel.confetti(topX(),towerTop()-camY,26);Snd.fanfare('S');}}
      if(endT>1.6&&!deb.length&&!ended){ended=true;Core.finish();}}
  }
  function draw2(c){
    const cy=Math.round(camY);
    c.drawImage(bg2,0,SBG2+cy,W,H,0,0,W,H);
    // torre: cada nivel se desplaza con el bamboleo (más arriba, más se mueve)
    const n=tower.length,sway=wob.x+danger*Math.sin(Core.time*8)*3;
    let y=SGY-2;
    for(let i=0;i<n;i++){const b=tower[i],sp=b.spr,f=(i+1)/n,ox=Math.round(sway*f*f),sq=b.land<0.08&&i===n-1?1:0;
      y-=sp.hh;c.drawImage(sp,Math.round(b.x-SW2/2-sp.ax+ox),Math.round(y-cy-sp.ay+sq));}
    // cuerda y pinza
    if(phase===2&&(hang||clipOpen>0||st2==='settle'||st2==='fall')){
      const p=hangPos(),cx=p.x;const top=Math.max(-2,pivY-cy);
      const ropeX0=pcx+(cx-pcx)*((top-(pivY-cy))/Math.max(1,p.clipY-pivY));
      line(c,ropeX0,top,cx,p.clipY-cy-8,C.woodDD,C.woodD);
      if(hang){const sp=hang.spr;c.drawImage(sp,Math.round(cx-SW2/2-sp.ax),Math.round(p.top-cy-sp.ay));}
      drawClip(c,cx,p.clipY-cy-2,clipOpen>0?Math.min(1,clipOpen/0.1):0);
      // sombra guía sobre la torre: dónde caería
      if(hang&&st2==='swing'){const ty=towerTop()-cy;c.save();c.globalAlpha=0.35;R(c,Math.round(cx-SW2/2+2),ty-1,SW2-4,1,C.lavDD);c.restore();}
    }
    if(fall){const sp=fall.spr;c.drawImage(sp,Math.round(fall.x-SW2/2-sp.ax),Math.round(fall.yb-sp.hh-cy-sp.ay));}
    for(const d of deb){c.save();c.translate(Math.round(d.x),Math.round(d.y-cy));c.rotate(d.a);c.drawImage(d.spr,-Math.round(d.spr.width/2),-Math.round(d.spr.height/2));c.restore();}
    if(danger>0.25&&n){const ty=towerTop()-cy-14,tx=topX()+Math.round(sway)+SW2/2+6;if(Math.floor(Core.time*4)%2){R(c,tx,ty,2,6,C.pinkDD);R(c,tx,ty+8,2,2,C.pinkDD);}}
  }
  return self;
}
