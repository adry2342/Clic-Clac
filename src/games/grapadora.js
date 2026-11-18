/* =====================================================================
   MINIJUEGO 2 · GRAPADORA (vista cenital)
   ===================================================================== */
const HX=160,PY=98,PW=38,PH=30,MARK=9;
function leaf(l,cx,cy,a,len,wd,col){for(let t=0;t<=1;t+=0.08){const r=Math.max(1,Math.round(wd*Math.sin(Math.PI*Math.min(1,t*1.1+0.05))));ell(l,cx+Math.cos(a)*len*t,cy+Math.sin(a)*len*t,r,r,col);}}
function drawPencil(l,x,y){
  // lápiz de 48x6 con caras hexagonales
  l.fillStyle=C.out;l.fillRect(x,y+2,2,2);
  l.fillStyle=C.woodL;l.fillRect(x+2,y+1,2,4);l.fillRect(x+4,y,3,6);
  l.fillStyle=C.butter;l.fillRect(x+7,y,30,6);
  l.fillStyle=C.metal;l.fillRect(x+37,y,5,6);
  l.fillStyle=C.pink;l.fillRect(x+42,y,5,6);
}
function pencilDetail(c,x,y){
  R(c,x+7,y+1,30,1,'#fff8cf');R(c,x+7,y+3,30,1,C.butterD);R(c,x+7,y+4,30,1,C.butterD);
  for(let i=0;i<3;i++)R(c,x+3+i,y+2+(i%2),1,1,C.woodD);
  R(c,x+38,y,1,6,C.metalD);R(c,x+40,y,1,6,C.metalD);R(c,x+43,y+1,3,1,C.pinkL);
}
function drawDeskBg(c){
  // tablones de madera
  R(c,0,0,W,H,C.wood);
  const g=mulberry32(11);
  for(let y=0;y<H;y+=20){R(c,0,y,W,1,C.woodDD);R(c,0,y+1,W,1,C.woodL);
    let x=-10+g()*30;while(x<W){const len=24+g()*70;R(c,x,y+4+Math.floor(g()*13),len,1,C.woodD);x+=len+16+g()*50;}
    const sx=Math.floor(g()*W);R(c,sx,y+2,1,18,C.woodDD);
    const kx=20+g()*280,ky=y+8+g()*6;ell(c,kx,ky,3,1,C.woodD);px(c,kx,ky,C.woodDD);}
  // luz cálida de ventana sobre la mesa
  for(let y=0;y<86;y++){const x0=150+y*0.9,x1=250+y*0.9;dith4(c,x0,y,x1-x0,1,C.woodL);}
  // alfombrilla de fieltro
  dith(c,4,92,W-6,48,C.woodDD);
  obj(c,l=>{rr(l,2,88,W-4,48,C.felt,3);});
  for(let x=8;x<W-8;x+=4){px(c,x,91,C.feltL);px(c,x,132,C.feltD);}
  for(let y=94;y<131;y+=4){px(c,5,y,C.feltL);px(c,W-6,y,C.feltD);}
  for(let y=PY+3;y<PY+PH;y+=3)px(c,HX,y,C.feltD);
  // taza
  c.save();c.translate(6,12);
  ell(c,42,42,12,12,'rgba(176,122,90,0.2)');ell(c,52,43,5,5,'rgba(176,122,90,0.2)');
  obj(c,l=>{ell(l,40,40,12,12,C.cream);rr(l,50,34,9,12,C.cream,3);l.clearRect(53,37,3,6);});
  ell(c,40,40,9,9,C.creamD);ell(c,40,40,8,8,C.coffee);for(let a=3.4;a<4.9;a+=0.15)px(c,40+Math.cos(a)*7,40+Math.sin(a)*7,'#dcb48f');ell(c,41,41,6,6,C.coffeeD);ell(c,38,38,3,2,C.coffee);px(c,36,36,'#e6c6a5');px(c,37,36,'#e6c6a5');
  R(c,32,30,3,1,C.white);R(c,31,31,1,2,C.white);
  c.restore();
  // pósits
  rr(c,252,22,26,26,'rgba(176,122,90,0.2)',2);rr(c,270,36,26,26,'rgba(176,122,90,0.2)',2);
  obj(c,l=>{rr(l,250,20,26,26,C.butter,1);});
  R(c,254,27,16,1,C.butterDD);R(c,254,31,12,1,C.butterDD);R(c,254,35,18,1,C.butterDD);R(c,250,20,26,4,'#ffe98a');
  obj(c,l=>{rr(l,268,34,26,26,C.pink,1);l.clearRect(289,55,5,5);l.fillStyle=C.pink;for(let k=0;k<5;k++)l.fillRect(289,55+k,4-k,1);});
  R(c,268,34,26,4,'#ffb2cc');
  for(let k=0;k<4;k++)R(c,289+(4-k),55+k,1,1,C.pinkDD);R(c,290,56,2,1,C.pinkL);R(c,290,57,1,1,C.pinkL);
  // corazón garabateado
  for(const [x,y] of [[276,44],[277,43],[279,43],[280,44],[278,44],[276,45],[280,45],[277,46],[279,46],[278,47]])px(c,x,y,C.pinkDD);
  R(c,272,51,12,1,C.pinkD);R(c,272,40,8,1,C.pinkD);
  // lápiz
  dith(c,26,154,50,4,C.woodDD);
  obj(c,l=>drawPencil(l,22,148));
  pencilDetail(c,22,148);
  // goma de borrar
  dith(c,86,150,16,8,C.woodDD);
  obj(c,l=>{rr(l,84,146,15,9,C.lavL,2);R(l,84,146,7,9,C.sky);});
  R(c,85,147,5,1,C.skyL);
  // regla
  dith(c,112,156,74,9,C.woodDD);
  obj(c,l=>{rr(l,108,150,74,10,C.mint,1);});
  for(let x=111;x<180;x+=3)R(c,x,151,1,(x-111)%15===0?4:2,C.mintDD);R(c,108,158,74,1,C.mintD);
  // cuaderno con espiral
  dith(c,204,148,46,28,C.woodDD);
  obj(c,l=>{rr(l,200,144,46,30,C.lav,2);});
  R(c,206,146,38,26,C.lavL);R(c,210,152,28,6,C.white);R(c,212,154,20,1,C.lavD);
  for(let y=147;y<172;y+=4){R(c,199,y,4,2,C.metalD);px(c,200,y,C.metalL);}
  dith(c,206,168,38,3,C.lavD);
  // planta en maceta (vista desde arriba: roseta de hojas)
  ell(c,288,155,20,19,'rgba(176,122,90,0.2)');
  obj(c,l=>{ell(l,286,152,13,13,C.peachD);});
  ell(c,286,152,10,10,C.peachDD);ell(c,286,153,9,9,'#b98262');for(const [x,y] of [[281,149],[290,155],[285,158],[292,148]])px(c,x,y,'#a46f52');
  const leaves=[[-2.2,20,C.greenD],[-0.9,21,C.greenD],[0.5,19,C.greenD],[1.7,20,C.greenD],[2.9,18,C.greenD],[-1.5,13,C.green],[1.1,13,C.green]];
  for(const [a,len,col] of leaves){
    obj(c,l=>leaf(l,286+Math.cos(a)*2,152+Math.sin(a)*2,a,len,len>15?5:4,col));
    for(let t=0.15;t<0.8;t+=0.1)px(c,286+Math.cos(a)*(2+len*t),152+Math.sin(a)*(2+len*t),len>15?C.greenDD:C.greenD);
    const hx=286+Math.cos(a-0.25)*(len*0.45),hy=152+Math.sin(a-0.25)*(len*0.45);px(c,hx,hy,'#e2f7d6');
  }
  // hoja suelta arriba
  dith(c,92,22,46,36,C.woodDD);
  obj(c,l=>{R(l,88,18,44,34,C.paper);});
  for(let i=0;i<5;i++)R(c,93,25+i*5,34-(i%3)*7,1,'#e2dcef');R(c,93,22,12,1,C.pinkD);
}
function drawStaplerBody(l,pressed){
  const d=Math.round((+pressed)*4);
  rr(l,151,8,18,16,C.pinkD,3);
  rr(l,152,12+d,16,78,C.pink,3);
  rr(l,154,82+d,12,12,C.pink,3);rr(l,155,92+d,10,6,C.metalD,2);
}
function drawStaplerDetail(c,pressed){
  const d=Math.round((+pressed)*4);pressed=pressed>0.6;
  R(c,151,14,18,1,C.pinkDD);ell(c,160,16,2,2,C.metalD);px(c,160,16,C.metalL);
  rr(c,155,26+d,10,56,C.metal,1);R(c,155,26+d,1,56,C.metalL);R(c,164,26+d,1,56,C.metalD);R(c,158,29+d,4,50,C.metalD);R(c,159,30+d,2,48,C.metalL);R(c,159,30+d,2,1,C.white);R(c,156,27+d,1,3,C.white);
  R(c,153,24+d,1,60,C.pinkL);R(c,154,22+d,1,2,C.white);
  R(c,165,24+d,2,58,C.pinkD);R(c,167,26+d,1,54,C.pinkL);dith(c,164,24+d,1,58,C.pinkD);
  R(c,156,10,6,1,C.pinkL);px(c,155,11,C.white);px(c,154,12,C.white);R(c,152,20,16,1,C.pinkD);
  R(c,156,93+d,8,1,C.metal);R(c,157,97+d,6,1,C.out);
  if(pressed){R(c,154,82,12,10,C.pinkD);for(let k=0;k<3;k++){px(c,150-k,97+k,C.lavDD);px(c,170+k,97+k,C.lavDD);}R(c,143,102,4,1,C.lavDD);R(c,173,102,4,1,C.lavDD);}
}
function drawStaple(c,sx,j){
  sx=Math.round(sx);const y=PY+5;const M=C.metalDD,L=C.metalL;
  if(j==='P'){R(c,sx-4,y-1,8,3,M);R(c,sx-3,y,6,1,C.white);}
  else if(j==='B'){R(c,sx-3,y-1,3,1,M);R(c,sx,y,3,1,M);px(c,sx-3,y,M);px(c,sx+2,y+1,M);}
  else if(j==='R'){R(c,sx-3,y,3,1,M);px(c,sx,y+1,M);px(c,sx+1,y+2,M);}
  else{px(c,sx-2,y-1,M);px(c,sx-1,y,M);px(c,sx,y-1,M);px(c,sx+1,y,M);}
}
// contenido de cada folio: documentos de varios formatos (con o sin marca) y dibujos o fotos para despistar
function drawPaperArt(c,x,p){
  const y=PY,L='#e2dcef',sd=p.seed||0,w=p.w;
  const lines=(x0,ys,ws)=>{ys.forEach((yy,i)=>R(c,x0,y+yy,ws[i%ws.length],1,L));};
  if(p.art){const cx=x+19,cy=y+15;
    if(p.art==='gato'){for(const [dx,dy] of [[-6,-6],[-5,-7],[-4,-6],[4,-6],[5,-7],[6,-6]])px(c,cx+dx,cy+dy,C.lavDD);
      c.save();c.strokeStyle=C.lavDD;c.lineWidth=1;c.beginPath();c.ellipse(cx+0.5,cy+0.5,7,6,0,0,Math.PI*2);c.stroke();c.restore();
      px(c,cx-3,cy-1,C.out);px(c,cx+3,cy-1,C.out);px(c,cx,cy+1,C.pinkDD);R(c,cx-10,cy+1,4,1,C.lavD);R(c,cx+7,cy+1,4,1,C.lavD);ell(c,cx-4,cy+2,1,1,C.pinkL);ell(c,cx+4,cy+2,1,1,C.pinkL);}
    else if(p.art==='flor'){R(c,cx,cy+2,1,10,C.greenDD);ell(c,cx-3,cy+8,3,1,C.greenD);ell(c,cx+3,cy+6,3,1,C.greenD);
      for(let k=0;k<5;k++){const a=k/5*Math.PI*2;ell(c,cx+Math.round(Math.cos(a)*4),cy-3+Math.round(Math.sin(a)*4),2,2,k%2?C.pinkD:C.pink);}ell(c,cx,cy-3,2,2,C.butterD);}
    else if(p.art==='casa'){R(c,x+4,y+25,30,1,C.greenD);rr(c,cx-7,cy-1,15,11,C.peach,1);for(let k=0;k<7;k++)R(c,cx-8+k,cy-2-k,17-2*k,1,C.pinkD);R(c,cx-1,cy+4,4,6,C.woodDD);R(c,cx+4,cy+1,3,3,C.skyD);R(c,cx-6,cy+1,3,3,C.skyD);}
    else if(p.art==='sol'){ell(c,cx,cy,5,5,C.butterD);ell(c,cx,cy,4,4,C.butter);for(let k=0;k<8;k++){const a=k/8*Math.PI*2;px(c,cx+Math.round(Math.cos(a)*8),cy+Math.round(Math.sin(a)*8),C.butterDD);px(c,cx+Math.round(Math.cos(a)*7),cy+Math.round(Math.sin(a)*7),C.butterD);}
      px(c,cx-2,cy-1,C.out);px(c,cx+2,cy-1,C.out);R(c,cx-1,cy+2,3,1,C.peachDD);}
    else if(p.art==='corazon'){ell(c,cx-3,cy-2,4,4,C.pinkD);ell(c,cx+3,cy-2,4,4,C.pinkD);for(let k=0;k<7;k++)R(c,cx-7+k,cy+k,15-2*k,1,C.pinkD);px(c,cx-4,cy-4,C.white);R(c,x+5,y+26,10,1,L);}
    else if(p.art==='pez'){ell(c,cx-1,cy,7,4,C.skyD);ell(c,cx-1,cy-1,6,2,C.sky);for(let k=0;k<5;k++)R(c,cx+6+k,cy-k,1,2*k+1,C.skyD);px(c,cx-5,cy-1,C.out);for(let k=0;k<3;k++)ell(c,cx-11+k*2,cy-6-k*3,1,1,C.skyL);}
    else if(p.art==='estrella'){for(let k=0;k<6;k++)R(c,cx-k,cy-6+k,2*k+1,1,C.butterD);R(c,cx-8,cy,17,2,C.butterD);for(let k=0;k<5;k++){R(c,cx-6+k,cy+2+k,4,1,C.butterD);R(c,cx+3-k,cy+2+k,4,1,C.butterD);}px(c,cx-1,cy-2,C.out);px(c,cx+1,cy-2,C.out);}
    else if(p.art==='foto'){R(c,x+3,y+3,32,24,C.skyL);R(c,x+3,y+3,32,8,C.sky);ell(c,x+27,y+9,3,3,C.butter);ell(c,x+12,y+26,14,7,C.green);ell(c,x+28,y+27,10,5,C.greenD);ell(c,x+10,y+9,4,1,C.white);}
    return;}
  const f=p.fmt||'carta';
  if(f==='carta'){R(c,x+w-22,y+4,14,2,p.hd||C.lavD);const LS=[[[13,30],[17,24],[21,30],[25,18]],[[13,28],[17,30],[21,14]],[[13,22],[17,30],[21,26],[25,30]]][p.ln||0];for(const [dy,lw] of LS){R(c,x+5,y+dy,Math.min(lw,w-10),1,L);if(w>PW)R(c,x+35,y+dy,Math.min(lw,w-40),1,L);}}
  else if(f==='tabla'){R(c,x+w-22,y+4,14,2,p.hd);R(c,x+5,y+12,w-10,2,p.hd);for(let r=0;r<4;r++)R(c,x+5,y+14+r*4,w-10,1,L);for(let k=1;k<(w>PW?6:3);k++)R(c,x+5+k*11,y+12,1,15,L);}
  else if(f==='grafica'){R(c,x+6,y+12,1,14,C.lavD);R(c,x+6,y+26,w-12,1,C.lavD);const cols=[C.pinkD,C.mintDD,C.skyD,C.butterD,C.lavD,C.peachD];for(let k=0;k<(w>PW?7:4);k++){const h=4+((sd*7+k*13)%9);R(c,x+9+k*7,y+26-h,4,h,cols[k%cols.length]);}R(c,x+w-22,y+4,14,2,p.hd);}
  else if(f==='lista'){R(c,x+w-22,y+4,14,2,p.hd);for(let r=0;r<4;r++){const yy=y+12+r*4;R(c,x+6,yy-1,3,3,C.lavD);R(c,x+7,yy,1,1,(sd+r)%3?C.paper:C.mintDD);R(c,x+11,yy,Math.min(w-16,14+((sd+r*5)%12)),1,L);}}
  else{// recibo
    R(c,x+12,y+4,14,2,p.hd);for(let r=0;r<4;r++){R(c,x+8,y+11+r*3,12,1,L);R(c,x+w-12,y+11+r*3,5,1,L);}for(let k=x+6;k<x+w-6;k+=3)px(c,k,y+24,C.lavD);R(c,x+8,y+26,10,1,C.lavDD);R(c,x+w-13,y+26,6,1,C.lavDD);}
}
// impresora: escupe los folios ya de camino; tapa la cola para que no se vea lo que viene
const PRX=104;
function drawPrinter(c,busy,left){
  const T=Core.time,j=busy&&Math.floor(T*30)%2?1:0,L=left==null?1:left;
  // bandeja de entrada con el taco de folios (baja según se gastan)
  const stack=Math.max(1,Math.round(L*8));
  obj(c,l=>{rr(l,-8,74+j,PRX+8,74,C.lav,8);rr(l,10,46+j,PRX-34,26,C.lavL,4);rr(l,6,66+j,PRX-26,12,C.lavL,4);
    rr(l,16,62+j-stack*2,PRX-50,stack*2+4,C.paper,1);},{sel:true});
  R(c,13,49+j,PRX-40,1,C.white);R(c,13,52+j,2,14,C.lavD);R(c,PRX-29,52+j,2,14,C.lavD);for(let k=0;k<stack;k++)R(c,17,63+j-stack*2+k*2+1,PRX-52,1,'#e6e0ef');R(c,20,63+j-stack*2,20,1,C.lavD);
  R(c,-4,78+j,PRX,1,C.lavL);R(c,-4,140+j,PRX+2,3,C.lavD);
  // ventanita con el cabezal que va y viene mientras imprime
  rr(c,8,82+j,PRX-26,8,'#5b4a6b',3);R(c,10,83+j,PRX-30,1,'#7a6890');
  const hx=busy?Math.round(12+(PRX-40)*(0.5+0.5*Math.sin(T*9))):12;
  rr(c,hx,83+j,12,6,C.metal,1);R(c,hx+1,84+j,10,1,C.metalL);for(let k=0;k<4;k++)R(c,hx+1+k*3,87+j,2,2,[C.skyD,C.pinkD,C.butterD,C.out][k]);
  // rodillos de salida: giran mientras sale papel
  rr(c,PRX-7,PY-5,7,PH+10,'#7d6ea6',2);
  for(const yy of [PY-3,PY+PH+1]){ell(c,PRX-4,yy,2,2,C.metalD);const a=busy?T*16:0;px(c,PRX-4+Math.round(Math.cos(a)*1),yy+Math.round(Math.sin(a)*1),C.metalL);}
  R(c,PRX-4,PY-1,2,PH+2,C.out);
  // pantalla: barra de progreso y ondita
  rr(c,10,94+j,52,22,C.lavL,4);rr(c,13,97+j,46,16,'#d6f2e6',2);
  if(busy){const w=Math.round(((T*1.6)%1)*40);R(c,16,108+j,40,2,C.mintD);R(c,16,108+j,w,2,C.mintDD);for(let x=0;x<40;x+=2)px(c,16+x,101+j+Math.round(Math.sin(T*8+x*0.4)*2),C.mintDD);}
  else{R(c,16,104+j,24,1,C.mintD);R(c,16,107+j,16,1,C.mintD);}
  // botones y luz
  ell(c,76,100+j,5,5,C.pinkD);ell(c,76,100+j,3,3,C.pink);px(c,75,99+j,C.white);
  const led=busy&&Math.floor(T*6)%2;ell(c,76,114+j,3,3,led?'#7fe0a8':C.mint);if(led){c.save();c.globalAlpha=0.35;ell(c,76,114+j,5,5,'#bff5d6');c.restore();}
  R(c,4,128+j,PRX-14,1,C.lavD);for(let k=0;k<5;k++)R(c,10+k*16,132+j,8,2,C.lavD);
  // aire caliente de la rejilla
  if(busy)for(let k=0;k<3;k++){const ph=(T*1.3+k/3)%1;c.save();c.globalAlpha=0.55*(1-ph);R(c,14+k*20+Math.round(Math.sin(T*3+k)*2),126-Math.round(ph*14),6,1,C.white);c.restore();}
}
function Stapler(rng,preview){
  // Los folios salen de la impresora ya de camino a la grapadora: no hay cola a la vista.
  // Solo se grapa donde hay marca rosa; dibujos, fotos y documentos sin marca se dejan pasar.
  const FMT=['carta','tabla','grafica','lista','recibo'],ART=['gato','flor','casa','sol','corazon','pez','foto','estrella'];
  const papers=[];let units=0;
  for(let i=0;units<26;i++){
    const r=rng(),kind=i<2?'normal':r<0.26?'no':r<0.44&&units<24?'doble':'normal';
    const marks=kind==='doble'?[{o:MARK+30,j:null,rel:null},{o:MARK,j:null,rel:null}]:[{o:MARK,j:null,rel:null}];
    const fmt=FMT[Math.floor(rng()*FMT.length)],art=kind==='no'&&rng()<0.6?ART[Math.floor(rng()*ART.length)]:null;
    papers.push({kind,fmt,art,w:kind==='doble'?PW+30:PW,marks,j:null,hd:[C.pinkD,C.mintDD,C.lavD,C.butterD,C.skyD][Math.floor(rng()*5)],ln:Math.floor(rng()*3),seed:Math.floor(rng()*99)});
    units+=kind==='doble'?2:1;
  }
  const TOTAL=units,N=papers.length;
  const gaps=[];let cl=false;
  for(let i=0;i<N;i++){const r=rng();if(cl&&rng()<0.5){gaps.push(46+rng()*10);continue;}cl=r<0.22;gaps.push(cl?46+rng()*10:(r<0.74?68+rng()*32:96+rng()*30));}
  const ps=[];let spawned=0,pressT=0,endT=0,ended=false,T=0,done=0;const air=[];
  const bg=mk(W,H);drawDeskBg(bg.getContext('2d'));grain(bg.getContext('2d'),14,5);
  const pressK=()=>{if(pressT<=0)return 0;const k=1-pressT/0.26;return k<0.27?ease(k/0.27):1-Ease.outElastic((k-0.27)/0.73);}; // baja de golpe y rebota al subir
  // la cinta va un poco a oleadas cuando avanzas: acelera y frena suavemente
  const speed=()=>{const pr=done/TOTAL;return (58+50*pr)*(1+0.22*pr*Math.sin(T*1.25));};
  function spawn(){
    while(spawned<N){const last=ps[ps.length-1],P=papers[spawned],mo=P.marks[0].o;
      const x=last?last.x+MARK-gaps[spawned]-mo:-44;if(last&&x+P.w<-4)break;
      P.x=x;ps.push(P);spawned++;if(!last)break;}
  }
  function units0(){return ps.flatMap(p=>p.kind==='no'?(p.j?[]:[{p,o:MARK,no:true}]):p.marks.filter(m=>!m.j).map(m=>({p,o:m.o,m})));}
  if(preview){papers[0].x=HX-MARK-22;papers[1].x=HX-MARK+64;papers[1].marks[0].j='P';papers[1].marks[0].rel=MARK;ps.push(papers[0],papers[1]);spawned=N;}
  else spawn();
  function mark(u,j,det){
    done++;if(u.no){u.p.j=j;}else{u.m.j=j;}
    Core.judge(j,HX+48,PY-26,false,det);
  }
  return {_ps:ps,_units:units0,unit:'Grapa',total:TOTAL,mood:'grapadora',
    inPractice(){return false;},
    progress(){return done;},
    update(dt){
      T+=dt;const v=speed();for(const p of ps)p.x+=v*dt;spawn();
      for(const u of units0()){const d=(u.p.x+u.o)-HX;
        if(u.no&&d>v*0.2){mark(u,'P','Bien: sin marca no se grapa');Snd.cap();}
        else if(!u.no&&d>v*0.16)mark(u,'F','Se fue sin grapa');}
      pressT=Math.max(0,pressT-dt*0.62);for(const a of air)a.t+=dt;for(const p of ps)if(p.sq)p.sq=Math.max(0,p.sq-dt);
      if(spawned>=N&&done>=TOTAL&&ps.every(p=>p.x>W+6)){endT+=dt;if(endT>0.2&&!ended){ended=true;Core.finish();}}
    },
    press(){
      pressT=0.26;Snd.staple();
      const v=speed();let best=null,bd=1e9;
      for(const u of units0()){const d=Math.abs(u.p.x+u.o-HX);if(d<bd){bd=d;best=u;}}
      const dt=bd/v;
      if(!best||dt>0.3){air.push({x:HX,t:0});Core.waste(HX+48,PY-26,'Grapa al aire');return;}
      best.p.sq=0.14;
      if(best.no){best.p.rel=HX-best.p.x;mark(best,'F','¡Ese no se grapa!');return;}
      const j=dt<=0.05?'P':dt<=0.1?'B':dt<=0.16?'R':'F';
      best.m.rel=HX-best.p.x;mark(best,j,j==='P'?'':(best.p.x+best.o<HX?'◀ Pronto':'Tarde ▶'));
    },
    draw(c){
      c.drawImage(bg,0,0);
      const vis=p=>p.x>-p.w-6&&p.x<W+4;
      for(const p of ps){if(vis(p))dith(c,p.x+2,PY+2,p.w,PH,C.feltD);}
      dith(c,152,12,20,82,C.woodDD,1);
      obj(c,l=>{
        for(const p of ps){if(!vis(p))continue;const x=Math.round(p.x),q=p.sq>0?1:0,w=p.w,col=C.paper;
          R(l,x-q,PY+q,w+2*q,PH-q,col);l.clearRect(x+w-5+q,PY+q,5,5);l.fillStyle=col;for(let k=0;k<5;k++)l.fillRect(x+w-5,PY+k,k+1,1);}
        drawStaplerBody(l,pressK());
      },{sel:true});
      for(const p of ps){
        if(!vis(p))continue;const x=Math.round(p.x),w=p.w;
        for(let k=0;k<5;k++){R(c,x+w-5,PY+k,k+1,1,C.paperD);}px(c,x+w-5,PY+4,C.metalD);
        drawPaperArt(c,x,p);
        if(p.kind==='no'){if(p.rel!=null)drawStaple(c,p.x+p.rel,'F');continue;}
        for(const m of p.marks){const mx=x+m.o-5;
          if(!m.j){R(c,mx,PY+2,3,1,C.pinkD);R(c,mx,PY+2,1,3,C.pinkD);R(c,mx+8,PY+2,3,1,C.pinkD);R(c,mx+10,PY+2,1,3,C.pinkD);
            R(c,mx,PY+8,3,1,C.pinkD);R(c,mx,PY+6,1,3,C.pinkD);R(c,mx+8,PY+8,3,1,C.pinkD);R(c,mx+10,PY+6,1,3,C.pinkD);}
          if(m.j&&m.rel!=null)drawStaple(c,p.x+m.rel,m.j);}
      }
      drawPrinter(c,ps.some(p=>p.x+p.w>PRX-2&&p.x<PRX),1-spawned/N);
      drawStaplerDetail(c,pressK());
      for(let k=0;k<3;k++){const t=(Core.time*0.6+k/3)%1;const y=46-t*22,x=44+k*3+Math.round(Math.sin(t*6+k)*2);if(t<0.85){dith(c,x,y,3,4,'rgba(255,255,255,'+(0.9-t)+')',k);}}
      for(const a of air){if(a.t<0.45){const y=PY+5+a.t*50;R(c,a.x-2,Math.round(y),4,1,C.metalDD);}}
    }
  };
}

