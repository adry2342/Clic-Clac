/* ---------- Minijuego 5: Fotos a coches ---------- */
const VFX=160,ROADF=122,ROADN=138,FCY=124;
const RING=(()=>{const r=[],seen=new Set();for(let a=0;a<360;a+=2){const t=a*Math.PI/180,x=Math.round(Math.cos(t)*11),y=Math.round(Math.sin(t)*11),k=x+','+y;if(!seen.has(k)){seen.add(k);r.push([x,y]);}}return r;})();
// máscara del visor (precalculada): todo oscuro salvo un agujero de esquinas muy redondeadas
const VIEW=(()=>{const v=mk(W,H),x=v.getContext('2d');const L=34,T=20,Rr=W-34,B=H-12,r=22;
  for(let y=0;y<H;y++){let a=L,b=Rr;if(y<T||y>=B){a=W;b=0;}else{const dy=y<T+r?T+r-y:(y>=B-r?y-(B-r)+1:0);if(dy>0){const dx=r-Math.round(Math.sqrt(Math.max(0,r*r-dy*dy)));a=L+dx;b=Rr-dx;}}
    x.fillStyle='#2a2036';if(a>b){x.fillRect(0,y,W,1);}else{x.fillRect(0,y,a,1);x.fillRect(b,y,W-b,1);x.fillStyle='#4a3a5e';x.fillRect(a,y,1,1);x.fillRect(b-1,y,1,1);
      x.fillStyle='rgba(42,32,54,0.22)';x.fillRect(a+1,y,3,1);x.fillRect(b-4,y,3,1);}}
  x.fillStyle='rgba(42,32,54,0.22)';x.fillRect(L,T,Rr-L,2);x.fillRect(L,B-2,Rr-L,2);return v;})(); // centro del visor, suelo del carril lejano y del cercano
const CARS={
  mini:{w:28,v:92,weight:3},
  coche:{w:38,v:84,weight:4},
  furgo:{w:44,v:74,weight:2},
  helados:{w:46,v:66,weight:1},
  bus:{w:72,v:56,weight:1},
  bici:{w:24,v:100,weight:2}
};
// Cómo se mueve cada vehículo alrededor del centro (τ=0 cuando pasa por el centro del visor):
// normal, frena (pasa despacito), acelera (pasa de un acelerón) o para (se detiene antes para dejar cruzar a unos patitos).
const MOVES=(()=>{const sp={normal:()=>1,frena:t=>1-0.62*Math.exp(-Math.pow(t/0.5,2)),acelera:t=>1+0.65*Math.exp(-Math.pow(t/0.42,2)),
    para:t=>{const a=-1.25,b=-0.5,e=0.28;if(t<a-e||t>b+e)return 1;if(t>=a&&t<=b)return 0;return t<a?1-smooth((t-(a-e))/e):smooth((t-b)/e);}};
  const out={},dt=1/240,n=8*240;
  for(const k in sp){const f=new Float32Array(2*n+1);f[n]=0;for(let i=1;i<=n;i++){f[n+i]=f[n+i-1]+sp[k]((i-0.5)*dt)*dt;f[n-i]=f[n-i+1]-sp[k](-(i-0.5)*dt)*dt;}out[k]=f;}
  out.off=(k,t)=>{const f=out[k],x=Math.max(-n,Math.min(n,t*240))+n,i=Math.floor(x),u=x-i;return f[i]+(f[Math.min(2*n,i+1)]-f[i])*u;};
  return out;})();
const CARCOL=[[C.pink,C.pinkD,C.pinkL],[C.sky,C.skyD,C.skyL],[C.mint,C.mintD,C.mintL],[C.butter,C.butterD,'#fff8d0'],['#ff8f80','#e0645a','#ffc6bc'],[C.peach,C.peachD,C.peachL]];
function drawStreetBg(c){
  // cielo en bandas con difuminado
  R(c,0,0,W,40,C.skyD);dith(c,0,38,W,4,C.sky);R(c,0,42,W,30,C.sky);dith(c,0,70,W,4,C.skyL);R(c,0,74,W,40,C.skyL);
  for(const [x,y,s] of [[40,22,1],[132,14,0.8],[236,26,1.1],[300,12,0.7]]){
    ell(c,x,y,Math.round(9*s),Math.round(4*s),C.white);ell(c,x+8*s,y-3,Math.round(7*s),Math.round(5*s),C.white);ell(c,x+16*s,y+1,Math.round(6*s),3,C.white);R(c,x-8*s,y+3,30*s,1,C.skyL);}
  // fila de casas pastel
  const houses=[[0,42,C.peach,C.pinkD],[42,50,C.mintL,C.lavD],[92,40,C.butter,C.peachDD],[132,56,C.pinkL,C.mintDD],[188,44,C.lavL,C.pinkD],[232,46,C.peachL,C.skyD],[278,44,C.mint,C.butterDD]];
  houses.forEach(([x,w,col,roof],k)=>{
    const top=40+((k*17)%14);
    obj(c,l=>{rr(l,x+1,top,w-2,112-top,col,1);l.fillStyle=roof;for(let i=0;i<7;i++)l.fillRect(x-1+i,top-7+i,w+2-2*i,1);});
    for(let wy=top+8;wy<96;wy+=16)for(let wx=x+6;wx<x+w-10;wx+=13){
      obj(c,l=>{rr(l,wx,wy,8,9,C.skyL,1);});R(c,wx+1,wy+1,6,1,C.sky);R(c,wx+4,wy+1,1,8,C.white);R(c,wx,wy+9,8,1,C.creamD);
      if((wx+wy)%3===0){R(c,wx+1,wy+2,2,6,C.pinkL);R(c,wx+5,wy+2,2,6,C.pinkL);}}
    if(k%2===0){obj(c,l=>{rr(l,x+w/2-5,98,10,14,C.woodD,2);});px(c,x+w/2+2,105,C.butter);}
    else{R(c,x+4,95,w-8,1,'rgba(150,140,180,0.5)');for(let i=0;i<w-8;i+=4)rr(c,x+4+i,94,3,3,i%8?C.white:C.pinkL,1);}
    dith(c,x+w-4,top,3,112-top,'rgba(80,60,120,0.18)');
  });
  // árboles y farolas por delante de las casas
  for(const x of [66,206,300]){obj(c,l=>{rr(l,x-1,92,3,20,C.woodDD,1);ell(l,x,84,10,10,C.greenD);ell(l,x-6,90,6,5,C.greenD);ell(l,x+6,89,6,6,C.greenD);});
    ell(c,x-3,80,4,3,C.green);ell(c,x+3,86,3,2,C.green);px(c,x-4,78,'#e6ffd8');}
  for(const x of [20,150,256]){obj(c,l=>{R(l,x,70,2,42,'#9a93b8');rr(l,x-3,66,8,5,C.lavD,2);});R(c,x,70,1,42,'#c8c2e0');R(c,x-2,70,6,1,C.butter);}
  // acera del fondo, calzada y acera delantera
  R(c,0,110,W,4,C.creamD);R(c,0,110,W,1,C.cream);for(let x=0;x<W;x+=16)R(c,x,111,1,3,C.peachD);
  R(c,0,114,W,30,'#b8b0cc');dith(c,0,114,W,2,'#a49bbd');
  for(let x=4;x<W;x+=24)rr(c,x,129,12,2,C.white,0);
  R(c,0,144,W,2,C.lavDD);R(c,0,146,W,20,C.creamD);R(c,0,146,W,1,C.cream);for(let x=8;x<W;x+=22)R(c,x,147,1,19,C.peachD);
  dith(c,0,164,W,2,C.peachD);
}
// coche de perfil: coordenadas locales desde el centro, positivas hacia el frente
function drawCar(l,c,car,detail){
  const T=car.t,cx=Math.round(car.x),gy=car.gy,dir=car.dir,[col,colD,colL]=car.col;
  const X=(a,w)=>dir>0?cx+a:cx-a-w;
  const RR=(a,y,w,h,cc,r)=>rr(l,X(a,w),gy+y,w,h,cc,r);
  const P=(a,y,cc)=>px(c,X(a,1),gy+y,cc);const Rc=(a,y,w,h,cc)=>R(c,X(a,w),gy+y,w,h,cc);
  const k=car.key,hw=T.w/2,CX=a=>dir>0?cx+a:cx-a;
  if(k==='bici'){
    // bicicleta con ciclista: ruedas grandes, cuadro fino y casco del color del "coche"
    if(!detail){for(const wx of car.wheels)ell(l,CX(wx),gy-5,5,5,'#6e5f8a');
      RR(-8,-8,16,2,col,1);RR(-3,-12,2,5,col,0);RR(6,-14,2,7,C.metalD,0);
      RR(-5,-21,8,11,col,3);ell(l,CX(0),gy-25,4,4,'#ffe1cc');RR(1,-17,7,2,'#ffe1cc',1);RR(-2,-11,3,6,C.lavD,1);RR(-3,-29,8,4,colD,2);return;}
    for(const wx of car.wheels){const xx=CX(wx);ell(c,xx,gy-5,3,3,'#efeaf8');px(c,xx,gy-5,C.metalD);const a=car.spin*0.8+wx;px(c,xx+Math.round(Math.cos(a)*2),gy-5+Math.round(Math.sin(a)*2),C.metalDD);}
    px(c,CX(2),gy-26,C.out);Rc(-4,-20,6,1,colL);Rc(-2,-28,5,1,colL);return;
  }
  if(!detail){
    if(k==='bus'){RR(-hw,-28,T.w,25,col,4);}
    else if(k==='furgo'){RR(-hw,-20,T.w,17,col,3);RR(hw-14,-14,14,11,col,3);}
    else if(k==='helados'){RR(-hw,-22,T.w-6,19,col,3);RR(hw-12,-14,12,11,col,3);const xx=X(-6,1);l.fillStyle=C.peachD;for(let i=0;i<6;i++)l.fillRect(xx-3+Math.floor(i/2),gy-27+i,7-2*Math.floor(i/2),1);ell(l,xx,gy-29,4,3,C.pinkL);}
    else if(k==='mini'){RR(-hw,-11,T.w,8,col,3);RR(-hw+5,-17,T.w-12,8,col,3);}
    else{RR(-hw,-11,T.w,8,col,3);RR(-hw+7,-18,T.w-18,9,col,3);}
    for(const wx of car.wheels){ell(l,X(wx,1),gy-3,3,3,'#6e5f8a');}
    return;
  }
  // detalles sobre el objeto ya contorneado
  const hB=k==='bus'?28:k==='furgo'?20:k==='helados'?22:11;
  Rc(-hw+2,-hB+1,T.w-4,1,colL);           // luz superior
  Rc(-hw+1,-5,T.w-2,1,colD);Rc(-hw+1,-4,T.w-2,1,colD); // banda de sombra inferior
  if(k==='bus'){for(let i=0;i<5;i++){Rc(-hw+4+i*13,-24,10,9,C.skyL);Rc(-hw+4+i*13,-24,10,1,C.sky);Rc(-hw+6+i*13,-23,1,7,C.white);}Rc(hw-6,-24,4,14,C.skyL);Rc(-hw+2,-12,T.w-4,2,C.white);}
  else if(k==='furgo'){Rc(hw-12,-12,8,6,C.skyL);Rc(hw-11,-11,1,4,C.white);Rc(-hw+4,-17,22,9,colL);Rc(-hw+6,-15,18,1,colD);Rc(-hw+6,-12,14,1,colD);}
  else if(k==='helados'){Rc(hw-10,-12,6,6,C.skyL);Rc(hw-9,-11,1,4,C.white);Rc(-hw+5,-18,18,8,C.cream);for(let i=0;i<4;i++)Rc(-hw+5+i*5,-18,2,8,C.pinkL);Rc(-hw+3,-8,T.w-12,1,C.white);}
  else{const s=k==='mini'?5:7,cw=T.w-(k==='mini'?12:18);Rc(-hw+s+2,-16,Math.floor(cw/2)-3,6,C.skyL);Rc(-hw+s+Math.floor(cw/2)+1,-16,Math.floor(cw/2)-3,6,C.skyL);Rc(-hw+s+3,-15,1,4,C.white);Rc(-hw+s+Math.floor(cw/2)-1,-16,2,6,colD);}
  // faro y piloto (el piloto se enciende cuando frena)
  const tau=car.tau||0,braking=(car.mode==='frena'&&Math.abs(tau)<0.7)||(car.mode==='para'&&tau>-1.7&&tau<-0.45);
  Rc(hw-2,-9,2,2,C.butter);P(hw-1,-9,C.white);Rc(-hw,-9,2,2,braking?'#ff5c7a':C.pinkDD);if(braking){P(-hw-1,-9,'#ffb3c4');P(-hw-1,-8,'#ffb3c4');}
  // conductor asomando por la ventanilla delantera
  if(k!=='bus'&&k!=='helados'){const wx=k==='furgo'?hw-9:k==='mini'?hw-14:hw-17,wy=k==='furgo'?-11:-15;Rc(wx,wy,3,3,'#ffe1cc');Rc(wx,wy-1,3,1,C.woodDD);}
  // tirador de la puerta
  Rc(-2,-8,4,1,colD);
  // ruedas que giran
  for(const wx of car.wheels){const xx=X(wx,1);ell(c,xx,gy-3,1,1,C.metal);const a=car.spin+wx;px(c,xx+Math.round(Math.cos(a)*2),gy-3+Math.round(Math.sin(a)*2),C.metalD);}
}
function drawCameraHands(c,press){
  // cuerpo de la cámara asomando abajo; dos manos lo agarran por los lados y el índice derecho dispara
  const SK='#ffe1cc',SKD='#f2b9a0',SKL='#fff3ea',d=press?2:0;
  obj(c,l=>{rr(l,62,164,196,22,C.mint,6);rr(l,222,159+d,14,7,C.pinkD,2);},{sel:true});
  R(c,66,166,188,1,C.mintL);R(c,66,171,188,1,C.mintD);rr(c,146,169,28,9,C.out,2);rr(c,147,170,26,7,'#5b4a6b',2);R(c,149,171,8,1,C.lavD);px(c,170,171,C.pinkL);
  R(c,224,160+d,8,1,C.pinkL);
  // mangas
  obj(c,l=>{rr(l,22,162,26,22,C.lavD,4);rr(l,272,162,26,22,C.lavD,4);},{sel:true});
  R(c,24,164,20,1,C.lav);R(c,274,164,20,1,C.lav);
  // mano izquierda: palma y cuatro dedos que rodean el borde
  obj(c,l=>{rr(l,42,160,20,22,SK,5);for(let k=0;k<4;k++)rr(l,56,163+k*4,16-(k===3?3:0),5,SK,2);rr(l,54,154,14,7,SK,3);},{sel:true});
  for(let k=0;k<3;k++)R(c,57,167+k*4,13,1,SKD);R(c,45,162,10,1,SKL);R(c,56,155,8,1,SKL);
  // mano derecha: el índice se estira hasta el botón
  obj(c,l=>{rr(l,258,160,20,22,SK,5);for(let k=1;k<4;k++)rr(l,248+(k===3?3:0),163+k*4,16-(k===3?3:0),5,SK,2);rr(l,226,162+d,30,5,SK,2);rr(l,252,154,14,7,SK,3);},{sel:true});
  for(let k=1;k<3;k++)R(c,250,167+k*4,13,1,SKD);R(c,228,166+d,24,1,SKD);R(c,261,162,10,1,SKL);R(c,256,155,8,1,SKL);R(c,228,163+d,8,1,SKL);
}
// línea de píxeles (Bresenham)
function pline(c,x0,y0,x1,y1,col){x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);c.fillStyle=col;
  const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;
  for(let i=0;i<400;i++){c.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}}
const wheelsOf=k=>k==='bus'?[-26,24]:k==='mini'?[-8,8]:k==='furgo'?[-14,14]:k==='helados'?[-15,15]:k==='bici'?[-8,8]:[-12,12];
// bichitos que cruzan la calle mientras un coche espera (u: 0 acera de delante → 1 acera del fondo)
function drawCritter(c,kind,sx,u,dir){
  if(kind==='patos'){
    for(let k=0;k<3;k++){const yy=Math.round(156-u*48+k*8),bob=Math.floor(Core.time*8+k)%2,big=k===0;if(yy<106||yy>160)continue;
      obj(c,l=>{ell(l,sx,yy-bob,big?4:3,big?3:2,big?C.white:C.butter);ell(l,sx+dir*(big?3:2),yy-(big?4:3)-bob,2,2,big?C.white:C.butter);},{sel:true});
      px(c,sx+dir*(big?5:4),yy-(big?4:3)-bob,'#ffa64d');px(c,sx+dir*(big?3:2),yy-(big?5:4)-bob,C.out);}
    return;}
  const yy=Math.round(156-u*48);if(yy<104||yy>162)return;
  const step=Math.floor(Core.time*7)%2;
  if(kind==='gato'){
    // gatito naranja que cruza con la cola en alto
    obj(c,l=>{ell(l,sx,yy-4,5,3,C.peach);ell(l,sx+dir*5,yy-8,3,3,C.peach);
      l.fillStyle=C.peach;l.fillRect(sx+dir*4-1,yy-12,1,2);l.fillRect(sx+dir*6,yy-12,1,2);
      l.fillRect(sx-dir*5,yy-9,1,4);l.fillRect(sx-dir*6,yy-11,1,3);
      l.fillRect(sx-3,yy-2,1,2+step);l.fillRect(sx+3,yy-2,1,3-step);},{sel:true});
    R(c,sx-2,yy-6,1,2,C.peachDD);R(c,sx,yy-6,1,3,C.peachDD);R(c,sx+2,yy-6,1,2,C.peachDD);
    px(c,sx+dir*6,yy-9,C.out);px(c,sx+dir*7,yy-7,C.pinkD);px(c,sx+dir*4,yy-7,C.pinkL);
    return;}
  if(kind==='perro'){
    // perrito blanco con una oreja marrón, la cola no para
    const wag=Math.floor(Core.time*12)%2;
    obj(c,l=>{ell(l,sx,yy-5,6,3,C.white);ell(l,sx+dir*6,yy-9,3,3,C.white);
      l.fillStyle=C.white;l.fillRect(sx-4,yy-3,2,3+step);l.fillRect(sx+3,yy-3,2,4-step);l.fillRect(sx-dir*7,yy-9+wag,1,3);},{sel:true});
    R(c,sx+dir*4,yy-11,2,4,C.woodDD);ell(c,sx-1,yy-6,2,1,C.woodD);px(c,sx+dir*7,yy-10,C.out);px(c,sx+dir*9,yy-8,C.out);
    R(c,sx+dir*3-1,yy-7,3,1,C.pinkD);
  }
}
// algo se posa delante del objetivo y tapa medio visor (desenfocado, muy cerca)
function drawLensBuddy(c,b,t){
  const a=t-b.t0;if(a<0||a>b.dur)return;
  const kin=Math.min(1,a/0.35),kout=Math.max(0,(a-(b.dur-0.4))/0.4),side=b.side;
  const cx=side<0?72:248;let cy=134+Math.round((1-ease(kin))*72)-Math.round(ease(kout)*110);
  const S=(f)=>{c.save();c.globalAlpha=0.3;f(5);c.restore();f(0);};
  if(b.kind==='hoja'){
    const sw=Math.round(Math.sin(a*3)*3),lx=cx+sw;cy-=22;
    S(g=>{ell(c,lx,cy,40+g,20+g,C.greenD);ell(c,lx-side*30,cy+10,12+g,8+g,C.greenD);});
    ell(c,lx,cy-4,34,12,C.green);pline(c,lx-36,cy+6,lx+36,cy-6,C.greenDD);
    for(let k=-2;k<=2;k++){pline(c,lx+k*12,cy+6-k*2,lx+k*12+8,cy-8-k*2,C.greenDD);}
    ell(c,lx+side*10,cy-10,4,2,'#e6ffd8');ell(c,lx-side*14,cy+14,3,4,C.water);px(c,lx-side*15,cy+12,C.white);
    return;}
  // pajarito: cuerpo enorme y suave, la cabeza mira hacia el centro
  const flap=a<0.35||kout>0?Math.floor(Core.time*16)%2:0,hx=cx-side*16,hy=cy-34,bob=Math.round(Math.sin(a*5)*1.5);
  S(g=>{ell(c,cx+side*6,cy+4,42+g,38+g,'#b39283');ell(c,hx,hy+bob,22+g,20+g,'#b39283');});
  ell(c,cx+side*10,cy+12,30,28,'#ecd8c8');                                  // pechuga
  ell(c,cx+side*22,cy-2-flap*8,22,26-flap*6,'#8e6f62');                       // ala
  for(let k=0;k<3;k++)R(c,cx+side*14+(side<0?0:-18)+k*0,cy+4+k*7-flap*8,18,2,'#6f544b');
  ell(c,hx,hy+bob,18,16,'#9b7c6e');ell(c,hx-side*4,hy+8+bob,12,8,'#ecd8c8');   // cabeza y carita
  ell(c,hx-side*7,hy-2+bob,4,5,C.out);px(c,hx-side*8,hy-5+bob,C.white);px(c,hx-side*6,hy-4+bob,C.white);
  ell(c,hx-side*2,hy+6+bob,3,2,C.pink);
  for(let k=0;k<4;k++)R(c,hx-side*(19+k)-(side<0?0:0),hy+1+bob+(k>>1),1,4-k,C.butterDD);
  R(c,hx-side*18,hy+bob,side<0?-5:5,3,C.butterD);
}
// cuarto oscuro: tonos, fondo y piezas
const TONE=['#fbf1ec','#efdcd4','#ddc0b6','#c49c92','#a77c75','#86595a','#633c41','#432630'];
const DR={tray:[96,108,128,68],fix:[232,130,82,40],box:[10,130,80,34],strip:[112,90,96,9],lamp:[36,20],line:40,slots:[72,128,184,240],L:38};
// revelado de verdad: la foto empieza en blanco y van saliendo primero las sombras y luego los claros.
// Si te pasas, todo se oscurece a manchas hasta que la imagen se pierde.
const DEVN=(()=>{const g=mulberry32(77),a=new Float32Array(64*40);for(let i=0;i<a.length;i++)a[i]=g();
  // ruido suave (manchas): media de vecinos
  const b=new Float32Array(a.length);for(let y=0;y<40;y++)for(let x=0;x<64;x++){let s=0,n=0;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=64||yy>=40)continue;s+=a[yy*64+xx];n++;}b[y*64+x]=s/n;}
  let lo=1,hi=0;for(const v of b){lo=Math.min(lo,v);hi=Math.max(hi,v);}for(let i=0;i<b.length;i++)b[i]=(b[i]-lo)/(hi-lo);return b;})();
function devSrc(p){if(p.src)return p.src;const k=mk(64,40),x=k.getContext('2d');x.drawImage(p.img,0,0);const d=x.getImageData(0,0,64,40).data,lum=new Float32Array(64*40);
  for(let i=0;i<lum.length;i++)lum[i]=(d[i*4]*0.3+d[i*4+1]*0.55+d[i*4+2]*0.15)/255;return p.src={d,lum};}
function develop(c,p,d,w,h){
  const S=devSrc(p),im=c.createImageData(64,40),o=im.data,PW=[251,244,240],DK=[42,20,24];
  const over=Math.max(0,Math.min(1,(d-1)/0.45));
  for(let i=0;i<S.lum.length;i++){const l=S.lum[i],st=0.05+0.4*l,v=Math.max(0,Math.min(1,(d-st)/0.55)),e=v*v*(3-2*v);
    let r=PW[0]+(S.d[i*4]-PW[0])*e,g=PW[1]+(S.d[i*4+1]-PW[1])*e,b=PW[2]+(S.d[i*4+2]-PW[2])*e;
    if(over>0){const k=Math.max(0,Math.min(1,over*(1.25+0.6*(1-l))-0.25+(DEVN[i]-0.5)*0.7*over));r+=(DK[0]-r)*k;g+=(DK[1]-g)*k;b+=(DK[2]-b)*k;}
    o[i*4]=r;o[i*4+1]=g;o[i*4+2]=b;o[i*4+3]=255;}
  if(w&&w!==64){const t=mk(64,40);t.getContext('2d').putImageData(im,0,0);const x=c;x.save();x.imageSmoothingEnabled=true;x.drawImage(t,0,0,w,h);x.restore();}
  else c.putImageData(im,0,0);
}
const mixc=(a,b,t)=>{const A=hex(a),B=hex(b);return 'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')+')';};
function drawDarkroomBg(c){
  const WA='#8a4456',WD='#743849',WL='#9c5266',BN='#5a2c38',BL='#7a3c4a',BD='#45212b';
  R(c,0,0,W,126,WA);
  for(let y=6;y<92;y+=12)for(let x=((y/12)%2)*20;x<W;x+=40){R(c,x,y,40,1,WD);R(c,x,y+1,40,1,WL);R(c,x,y,1,12,WD);}
  R(c,0,92,W,34,WD);R(c,0,92,W,1,WL);R(c,0,93,W,1,BD);
  for(let x=4;x<W;x+=26){R(c,x,98,20,24,WA);R(c,x,98,20,1,WL);R(c,x,121,20,1,BD);}
  // ganchos de la cuerda
  for(const x of [8,312]){obj(c,l=>{rr(l,x-3,DR.line-4,6,8,C.metalD,2);});px(c,x-1,DR.line-3,C.metalL);}
  // estante con botellas de químicos (ámbar) y un reloj de cocina
  obj(c,l=>{R(l,236,88,78,3,BL);for(let i=0;i<4;i++)rr(l,240+i*17,70+(i%2)*3,11,18-(i%2)*3,i===2?'#7a6aa8':'#c4743f',3);rr(l,206,74,22,22,C.cream,11);});
  for(let i=0;i<4;i++){const h=18-(i%2)*3;R(c,242+i*17,76+(i%2)*3,7,6,C.creamD);R(c,243+i*17,78+(i%2)*3,5,1,C.peachDD);R(c,242+i*17,70+(i%2)*3,7,2,C.out);R(c,248+i*17,72+(i%2)*3,1,h-4,'rgba(255,230,200,0.5)');}
  ell(c,217,85,8,8,C.paper);R(c,217,79,1,6,C.out);R(c,217,85,5,1,C.out);px(c,217,85,C.pinkD);
  // fotitos de práctica en la pared (pinchadas)
  // mesa
  R(c,0,126,W,54,BN);R(c,0,126,W,2,BL);R(c,0,128,W,1,BD);for(let x=0;x<W;x+=34)R(c,x,130,1,50,BD);dith(c,0,168,W,12,BD);
  // caja de papel fotográfico
  const [bx,by,bw,bh]=DR.box;
  obj(c,l=>{rr(l,bx,by,bw,bh,'#3b3346',3);rr(l,bx-2,by-6,bw+4,9,'#4a4058',3);});
  R(c,bx+4,by+10,bw-8,9,C.butter);R(c,bx+8,by+13,30,1,C.butterDD);R(c,bx+8,by+15,22,1,C.butterDD);ell(c,bx+bw-14,by+14,3,3,C.pinkD);
  R(c,bx+6,by-9,bw-14,3,C.paper);R(c,bx+6,by-9,bw-14,1,C.white);
  // cubetas
  for(const [x,y,w,h] of [DR.tray,DR.fix]){obj(c,l=>{rr(l,x,y,w,h,'#f4dadf',4);});R(c,x+3,y+1,w-6,1,C.white);R(c,x+2,y+h-3,w-4,2,'#d9b3bb');}
  // pinzas de bambú apoyadas
  for(let k=0;k<2;k++)pline(c,268+k*3,176,300+k*3,170,k?'#d8b678':'#ecd29a');
}
function Fotos(rng,preview){
  const N1=10,N2=4,TOTAL=N1+2*N2,FILM=N1+3;
  const pool=[];for(const k in CARS)for(let i=0;i<CARS[k].weight;i++)pool.push(k);
  const CRIT=['patos','gato','perro'];
  const cars=[];let tArr=1.9;
  for(let i=0;i<N1;i++){
    const key=pool[Math.floor(rng()*pool.length)],T=CARS[key],prog=i/(N1-1);
    const dir=i===0?1:i===1?-1:(rng()<0.5?1:-1),v=T.v*(1+prog*0.4)*(0.92+rng()*0.16);
    if(i>0){const r=rng();tArr+=r<0.2?0.75+rng()*0.2:r<0.72?1.4+rng()*0.8:2.2+rng()*0.9;}
    const dist=VFX+T.w/2+10;
    // a partir de la cuarta foto aparecen conductores con carácter
    const mr=rng(),mode=i<3?'normal':key==='bici'?(mr<0.5?'acelera':'normal'):key==='bus'?(mr<0.5?'frena':'normal'):mr<0.2?'frena':mr<0.38?'acelera':mr<0.56?'para':'normal';
    if(mode==='para')tArr+=0.7;
    cars.push({key,t:T,dir,v,mode,crit:CRIT[Math.floor(rng()*3)],gy:dir>0?ROADF:ROADN,arrive:tArr,spawn:tArr-4.5,x:VFX-dir*dist,col:CARCOL[Math.floor(rng()*CARCOL.length)],wheels:wheelsOf(key),spin:0,j:null,on:false});
  }
  // a veces algo se posa delante del objetivo (casi siempre por el lado de donde viene el coche)
  const buddies=[];{const idx=[];for(let i=3;i<N1;i++)idx.push(i);for(let i=idx.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[idx[i],idx[j]]=[idx[j],idx[i]];}
    for(const i of idx.slice(0,3).sort((a,b)=>a-b)){const car=cars[i],t0=car.arrive-1.5-rng()*0.5;if(buddies.length&&t0<buddies[buddies.length-1].t0+buddies[buddies.length-1].dur+0.6)continue;
      buddies.push({t0,dur:2.1+rng()*0.7,side:rng()<0.75?-car.dir:car.dir,kind:rng()<0.7?'pajaro':'hoja'});}}
  const balloons=[];for(let k=0;k<2;k++)balloons.push({t0:3+k*9+rng()*4,x:60+rng()*200,col:[C.pink,C.sky,C.butter][Math.floor(rng()*3)]});
  let time=0,flash=0,pressT=0,shotPending=null,endT=0,ended=false,film=FILM,emptyT=0,done=0;
  const roll=[];
  const bg=mk(W,H);drawStreetBg(bg.getContext('2d'));grain(bg.getContext('2d'),12,4);
  const room=mk(W,H);drawDarkroomBg(room.getContext('2d'));grain(room.getContext('2d'),13,6);
  const tone=mk(64,40),toneX=tone.getContext('2d');
  if(preview){time=cars[2].arrive-0.25;}
  const err=car=>(car.dir>0?VFX-car.x:car.x-VFX)/car.v; // >0: todavía no ha llegado al centro
  const J=a=>a<=0.05?'P':a<=0.1?'B':a<=0.16?'R':'F';
  function place(){for(const car of cars){car.on=time>=car.spawn;const tau=time-car.arrive;car.tau=tau;car.x=VFX+car.dir*car.v*MOVES.off(car.mode,tau);car.spin=car.x/3*car.dir;}}
  place();
  function negative(img){const n=mk(14,8),x=n.getContext('2d');x.imageSmoothingEnabled=true;x.drawImage(img,0,0,14,8);
    x.globalCompositeOperation='difference';x.fillStyle='#fff';x.fillRect(0,0,14,8);x.globalCompositeOperation='multiply';x.fillStyle='#f0a868';x.fillRect(0,0,14,8);return n;}
  function crop(src,sx,sy){const k=mk(64,40);k.getContext('2d').drawImage(src,sx,sy,64,40,0,0,64,40);return k;}
  function fakeShot(i){const cv=mk(W,H),x=cv.getContext('2d');x.drawImage(bg,0,0);const key=['coche','helados','furgo','mini','bus','bici'][i%6];
    const car={key,t:CARS[key],dir:i%2?-1:1,x:VFX+(i%3-1)*2,gy:i%2?ROADN:ROADF,col:CARCOL[(i*2+1)%CARCOL.length],wheels:wheelsOf(key),spin:i,mode:'normal',tau:1};
    obj(x,l=>drawCar(l,x,car,false),{sel:true});drawCar(null,x,car,true);return crop(cv,VFX-32,FCY-22);}
  // --- fase 2 y 3 ---
  let phase=1,swapT=0;const dev=[],hung=[];let di=0,dst='wait',dT=0,holding=false,rockT=0,hi=0,hst='wait',hT=0,sw=null;
  // cada foto se revela a su ritmo: unas tardan más y otras menos (de 1,1 a 2,6 s hasta el punto justo)
  const rate0=()=>1.059/(1.1+rng()*1.5);
  function setupDev(list){
    list.forEach((img,k)=>dev.push({img,d:0,rate:rate0(),j:null,print:null}));
  }
  let stripA=1;
  function goPhase2(){
    // las mejores fotos del carrete (en el orden en que se hicieron) pasan al cuarto oscuro
    const rk={P:0,B:1,R:2,F:3,E:4};const best=roll.map((r,i)=>({r,i})).sort((a,b)=>rk[a.r.j]-rk[b.r.j]||a.i-b.i).slice(0,N2).sort((a,b)=>a.i-b.i).map(o=>o.r.img);
    while(best.length<N2)best.push(crop(bg,VFX-32+Math.round((rng()-0.5)*120),FCY-22));
    setupDev(best);phase=2;swapT=0;dst='wait';
  }
  function goPhase3(){phase=3;swapT=0;hst='wait';hi=0;}
  function newSwing(){const P=1.15+rng()*0.4-hi*0.06;sw={A:0.42+rng()*0.16,w:2*Math.PI/P,t:0,ph:Math.PI/2,L:0};}
  const theta=()=>sw.A*Math.sin(sw.w*sw.t+sw.ph);
  function bake(p){const k=mk(64,40),x=k.getContext('2d');develop(x,p,p.d);
    const h=mk(32,20),hx=h.getContext('2d');hx.imageSmoothingEnabled=true;hx.drawImage(k,0,0,32,20);p.print=k;p.half=h;}
  const st=TDEMO;TDEMO=null;
  if(st==='revelar'||st==='tender'){for(const c of cars)c.j='P';const imgs=[0,1,2,3].map(fakeShot);setupDev(imgs);phase=2;swapT=9;dst='in';dT=0;
    if(st==='tender'){for(const p of dev){p.d=1;p.j='P';bake(p);}di=N2;phase=3;hst='in';hT=0;hi=0;newSwing();}}
  function judge2(j,det){const p=dev[di];p.j=j;done++;Core.judge(j,160,116,false,det);bake(p);dst='out';dT=0;holding=false;}
  const self={_cars:cars,_ph:()=>({phase,dst,hst,p:dev[di],sw,th:sw?theta():0,hi}),unit:'Paso',total:TOTAL,mood:'fotos',hold:true,
    inPractice(){return false;},
    progress(){return done;},
    cue(){return phase===1?'Fase 1 · Foto cuando el coche esté en el centro · carrete: '+film:phase===2?'Fase 2 · Mantén para revelar; suelta cuando la foto se vea bien':'Fase 3 · Toca cuando la foto pase justo bajo la pinza';},
    update(dt){
      swapT+=dt;flash=Math.max(0,flash-dt);pressT=Math.max(0,pressT-dt);emptyT=Math.max(0,emptyT-dt);
      for(const r of roll)r.t+=dt;
      if(phase===1){
        time+=dt;place();
        for(const car of cars){if(!car.j&&car.on&&err(car)<-0.16){car.j='F';done++;Core.judge('F',VFX,150,false,film>0?'Se escapó':'Sin carrete');}}
        if(cars.every(c=>c.j)){endT+=dt;if(endT>0.9){endT=0;goPhase2();Core.banner('Fase 2','Cuarto oscuro','Mantén para mecer la cubeta: la foto irá apareciendo. Suelta cuando se vea bien; si te pasas, se quema. Solo la primera trae indicador.',2.4);}}
        return;}
      if(phase===2){
        rockT+=dt*(holding?1:0.25);if(di>=1||(di===0&&dst==='out'))stripA=Math.max(0,stripA-dt*1.5);
        const p=dev[di];
        if(dst==='wait'){if(swapT>2.2){dst='in';dT=0;}return;}
        dT+=dt;
        if(dst==='in'){if(dT>0.7){dst='ready';dT=0;}}
        else if(dst==='dev'&&p){p.d+=p.rate*(0.6+0.8*Math.min(1.3,p.d))*dt;if(p.d>=1.45)judge2('F','▲ Te pasaste: se quemó');}
        else if(dst==='out'&&dT>0.75){di++;dT=0;dst=di<N2?'in':'end';if(di===1&&dst==='in')Core.note(160,62,'Ahora sin guía: suelta cuando se vea bien');}
        else if(dst==='end'&&dT>0.6){goPhase3();Core.banner('Fase 3','¡A tender!','La foto se balancea colgando del hilo. Toca cuando pase justo bajo la pinza rosa.',2.1);}
        return;}
      // fase 3
      if(sw)sw.t+=dt;
      for(const h of hung){h.t+=dt;h.sp&&h.sp.step(dt);}
      if(hst==='wait'){if(swapT>2.1){hst='in';hT=0;newSwing();}return;}
      hT+=dt;
      if(hst==='in'){sw.L=DR.L*ease(Math.min(1,hT/0.6));if(hT>0.6){hst='swing';hT=0;}}
      else if(hst==='clip'&&hT>0.55){hi++;if(hi<N2){hst='in';hT=0;newSwing();}else{hst='end';hT=0;sw=null;}}
      else if(hst==='end'&&hT>1.2&&!ended){ended=true;Core.finish();}
    },
    press(){
      if(phase===1){
        if(film<=0){emptyT=0.35;return;}
        film--;flash=0.16;pressT=0.14;Snd.shutter();
        let best=null,be=1e9;for(const car of cars){if(car.j||!car.on)continue;const e=err(car);if(Math.abs(e)<Math.abs(be)){be=e;best=car;}}
        shotPending={j:null};
        if(!best||Math.abs(be)>0.3){shotPending.j='E';Core.waste(VFX,150,'Foto movida: no había coche');return;}
        const j=J(Math.abs(be));best.j=j;shotPending.j=j;done++;
        Core.judge(j,VFX,150,false,j==='P'?'':(be>0?'◀ Pronto':'Tarde ▶'));
        return;}
      if(phase===2){if(dst==='ready'){dst='dev';holding=true;dT=0;Snd.burst(700,.06,.2);}return;}
      if(phase===3&&hst==='swing'){
        const th=theta(),w=sw.w,A=sw.A,vel=A*w*Math.cos(sw.w*sw.t+sw.ph);
        const a=Math.asin(Math.min(1,Math.abs(th)/A))/w,j=J(a),late=th*vel>0;
        const p=dev[hi];hung.push({p,x:DR.slots[hi]+Math.round(DR.L*Math.sin(th)),t:0,j,sp:Spring(0,60,2.2).kick(vel*DR.L*0.5)});done++;hst='clip';hT=0;Snd.cap();
        Core.judge(j,DR.slots[hi],76,false,j==='P'?'':(late?'Tarde ▶':'◀ Pronto'));
      }
    },
    release(){
      if(phase!==2||dst!=='dev')return;holding=false;
      const p=dev[di],d=p.d-1,a=Math.abs(d),j=a<=0.05?'P':a<=0.1?'B':a<=0.17?'R':'F';
      judge2(j,j==='P'?'':(d<0?'▼ Te quedaste corto: no se ve':'▲ Te pasaste: muy oscura'));
    },
    draw(c){
      if(phase===1){drawStreet(c);return;}
      drawRoom(c);
      if(swapT<0.7&&phase===2){c.fillStyle='rgba(42,32,54,'+(1-swapT/0.7).toFixed(2)+')';c.fillRect(0,0,W,H);}
    }
  };
  function drawStreet(c){
      c.drawImage(bg,0,0);
      // globos que se escapan hacia el cielo
      for(const b of balloons){const a=time-b.t0;if(a<0||a>6)continue;const y=Math.round(120-a*24),x=Math.round(b.x+Math.sin(a*2)*5);
        obj(c,l=>{ell(l,x,y,5,6,b.col);px(l,x,y+7,b.col);});px(c,x-2,y-3,C.white);for(let k=0;k<8;k++)px(c,x+Math.round(Math.sin(a*3+k*0.6)),y+8+k,C.lavD);}
      const vis=cars.filter(car=>car.on&&car.x>-60&&car.x<W+60).sort((a,b)=>a.gy-b.gy);
      for(const car of vis){dith(c,car.x-car.t.w/2+2,car.gy-1,car.t.w-2,2,'#8f86ad');obj(c,l=>drawCar(l,c,car,false),{sel:true});drawCar(null,c,car,true);
        if(car.mode==='acelera'&&car.tau>-0.8&&car.tau<0.4){for(let k=0;k<3;k++){const ph=((Core.time*4+k/3)%1),bx=car.x-car.dir*(car.t.w/2+3+ph*12);c.save();c.globalAlpha=0.8*(1-ph);ell(c,Math.round(bx),car.gy-4-Math.round(ph*3),2+Math.round(ph*2),2,C.white);c.restore();}}}
      // patitos, gatito o perrito que cruzan mientras el coche espera
      for(const car of cars){if(car.mode!=='para'||!car.on||car.tau<-1.55||car.tau>-0.3)continue;
        const u=(car.tau+1.55)/1.25,sx=Math.round(VFX+car.dir*car.v*MOVES.off('para',-0.9)+car.dir*(car.t.w/2+12));
        drawCritter(c,car.crit,sx,u,car.dir);}
      if(shotPending){const img=crop(c.canvas,VFX-32,FCY-22);roll.push({img,neg:negative(img),j:shotPending.j,t:0});shotPending=null;}
      for(const b of buddies)drawLensBuddy(c,b,time);
      // obturador de cortinilla y destello
      if(flash>0){const k=1-flash/0.16,cl=Math.sin(Math.min(1,k/0.75)*Math.PI),hh=Math.round(cl*92);R(c,0,0,W,hh,'#2a2036');R(c,0,H-hh,W,hh,'#2a2036');if(k>0.75){c.fillStyle='rgba(255,255,255,'+((1-k)/0.25*0.6).toFixed(2)+')';c.fillRect(0,0,W,H);}}
      c.drawImage(VIEW,0,0);
      const ccol='rgba(255,255,255,0.9)';c.save();c.translate(1,1);c.globalAlpha=0.35;for(const [dx,dy] of RING)px(c,VFX+dx,FCY+dy,'#2a2036');c.restore();
      for(const [dx,dy] of RING)px(c,VFX+dx,FCY+dy,ccol);
      R(c,VFX-11,FCY,7,1,ccol);R(c,VFX+5,FCY,7,1,ccol);R(c,VFX,FCY-11,1,7,ccol);R(c,VFX,FCY+5,1,7,ccol);px(c,VFX,FCY,C.pinkD);
      for(const [x,y,sx,sy] of [[VFX-34,FCY-16,1,1],[VFX+34,FCY-16,-1,1],[VFX-34,FCY+16,1,-1],[VFX+34,FCY+16,-1,-1]]){R(c,sx>0?x:x-5,y,6,1,ccol);R(c,x,sy>0?y:y-5,1,6,ccol);}
      // carrete arriba: cada foto hecha deja su negativo; los huecos vacíos son las que te quedan
      const fw=18,fx0=Math.round((W-FILM*fw)/2),shake=emptyT>0?Math.round(Math.sin(emptyT*60)*2):0;
      R(c,fx0-4+shake,2,FILM*fw+8,16,'#4a3628');R(c,fx0-4+shake,2,FILM*fw+8,1,'#6a4c38');
      for(let i=0;i<FILM;i++){const x=fx0+i*fw+shake;R(c,x+1,3,3,2,'#2a2036');R(c,x+10,3,3,2,'#2a2036');R(c,x+1,15,3,2,'#2a2036');R(c,x+10,15,3,2,'#2a2036');
        const r=roll[i];if(r){c.drawImage(r.neg,x+1,6);if(r.t<0.3){c.fillStyle='rgba(255,255,255,'+(1-r.t/0.3).toFixed(2)+')';c.fillRect(x+1,6,14,8);}if(r.j==='E')R(c,x+1,6,14,8,'rgba(42,32,54,0.45)');}
        else{R(c,x+1,6,14,8,'#c98a52');R(c,x+1,6,14,1,'#e0a670');if(i===roll.length){R(c,x,5,16,1,C.pinkD);R(c,x,14,16,1,C.pinkD);R(c,x,5,1,10,C.pinkD);R(c,x+15,5,1,10,C.pinkD);}}}
      if(film<=0&&Math.floor(Core.time*3)%2)R(c,fx0-4,18,FILM*fw+8,1,C.pinkD);
  }
  function drawRoom(c){
    c.drawImage(room,0,0);
    // bombilla roja de seguridad, colgando
    const [lx,ly]=DR.lamp,fl=0.9+0.1*Math.sin(Core.time*2.3);
    const on=phase===3?Math.max(0,1-swapT/0.6):1;
    c.save();c.globalAlpha=0.18*fl*on;ell(c,lx,ly+4,46,34,'#ff7b86');c.globalAlpha=0.16*fl*on;ell(c,lx,ly+4,28,20,'#ff9aa2');c.restore();
    R(c,lx,0,1,ly-6,C.out);obj(c,l=>{rr(l,lx-8,ly-7,17,7,'#4a3646',3);ell(l,lx,ly+1,6,4,'#ff5c6c');});px(c,lx-2,ly,'#ffd0d4');px(c,lx-3,ly+1,'#ffb3bb');
    // cuerda de tender con sus pinzas
    const LY=DR.line;for(let x=10;x<311;x++)px(c,x,LY,(x>>1)%2?'#f0e0d0':'#cdb4a6');
    DR.slots.forEach((sx,k)=>{const h=hung.find(o=>o.p===dev[k]),cur=phase===3&&k===hi&&hst!=='end'&&!h;
      if(!h){obj(c,l=>{rr(l,sx-2,LY-5,5,10,C.woodD,1);});R(c,sx,LY-4,1,8,C.woodDD);if(cur){const b=Math.floor(Core.time*4)%2;R(c,sx-1,LY-10-b,3,1,C.pinkD);px(c,sx,LY-9-b,C.pinkD);}}});
    // fotos colgadas secándose (gotean un rato)
    for(const h of hung){const x=Math.round(h.x),off=x-DR.slots[dev.indexOf(h.p)],tilt=h.j==='P'?0:Math.max(-3,Math.min(3,Math.round(off/4)));
      drawHanging(c,h.p,x,LY+1,tilt,h.sp?Math.max(-6,Math.min(6,h.sp.x)):0,h.t);
      obj(c,l=>{rr(l,x-2,LY-5,5,10,C.woodD,1);});R(c,x,LY-4,1,8,C.woodDD);
      if(h.t<6){const ph=(h.t*1.4+h.x*0.01)%1;if(ph<0.8){const yy=LY+38+Math.round(ph*ph*60);R(c,x+(h.x%7)-3,yy,1,2,'rgba(255,214,220,0.9)');}}}
    // foto colgando del hilo en fase 3
    if(phase===3&&sw&&hi<N2&&(hst==='in'||hst==='swing')){const th=theta(),sx=DR.slots[hi],L=sw.L,tx=sx+L*Math.sin(th),ty=2+L*Math.cos(th);
      pline(c,sx,11,tx,ty-1,'#f0e0d0');drawHanging(c,dev[hi],Math.round(tx),Math.round(ty),0);
      obj(c,l=>{rr(l,sx-9,-4,19,9,C.lavD,3);rr(l,sx-6,4,13,7,'#ffe1cc',3);rr(l,sx-2,9,5,3,'#ffe1cc',1);},{sel:true});R(c,sx-8,1,17,1,C.lav);R(c,sx-8,4,17,1,C.lavDD);R(c,sx-4,7,9,1,'#f2b9a0');R(c,sx-4,5,3,1,'#fff3ea');}
    // tira de prueba con el tono objetivo
    const [sx,sy,sw2,sh]=DR.strip;const p=dev[Math.min(di,N2-1)];
    // indicador de cuándo soltar: solo con la primera foto; luego se desvanece y toca revelar a ojo
    if(phase===2&&stripA>0){c.save();c.globalAlpha=stripA;
    obj(c,l=>{R(l,sx-2,sy-2,sw2+4,sh+4,C.paper);});
    for(let i=0;i<8;i++)R(c,sx+i*12,sy,12,sh,TONE[i]);
    const tX=sx+Math.round(1/1.5*sw2),tp=Math.sin(Core.time*6)>0?C.white:C.pinkL;
    // tono objetivo: marco blanco que late, bien visible bajo la luz roja
    R(c,tX-4,sy-4,9,2,tp);R(c,tX-4,sy+sh+2,9,2,tp);R(c,tX-4,sy-4,2,sh+8,tp);R(c,tX+3,sy-4,2,sh+8,tp);
    R(c,tX-3,sy-3,7,1,C.pinkD);R(c,tX-3,sy+sh+2,7,1,C.pinkD);
    R(c,sx+4,sy-4,8,3,'rgba(255,248,220,0.8)');R(c,sx+sw2-12,sy-4,8,3,'rgba(255,248,220,0.8)');
    if(p&&(dst==='dev'||dst==='ready'||dst==='out')){const cx=sx+Math.round(Math.min(1.5,p.d)/1.5*sw2);
      // puntero grande con contorno: triángulo debajo de la tira y muestra del tono actual encima
      obj(c,l=>{l.fillStyle=C.butter;for(let k=0;k<6;k++)l.fillRect(cx-5+k,sy+sh+9-k,11-2*k,1);l.fillRect(cx-5,sy+sh+10,11,2);rr(l,cx-7,sy-15,15,11,C.white,2);});
      R(c,cx-4,sy+sh+10,9,1,C.butterL||C.white);const ti=Math.max(0,Math.min(7,Math.round(p.d/1.5*8-0.5)));R(c,cx-5,sy-13,11,7,TONE[ti]);R(c,cx-5,sy-13,11,1,'rgba(255,255,255,0.35)');}
    c.restore();}
    // cubeta de revelado: líquido que se mece mientras mantienes
    const [tx,ty,tw,th2]=DR.tray,rock=holding?Math.sin(rockT*9):Math.sin(rockT*9)*0.25,rx=Math.round(rock*2);
    rr(c,tx+4,ty+3,tw-8,th2-7,'#c97c8a',3);
    // la superficie del líquido se inclina con el vaivén
    for(let i=2;i<tw-10;i++){const yy=ty+5+Math.round(rock*2.2*((i/(tw-12))*2-1));px(c,tx+4+i,yy,'#e3a0ad');}
    // la foto se ve grande (1,5x) para que se note bien cómo va apareciendo
    const PX=tx+16,PY=ty+5;let px0=PX,py0=PY,inTray=false,sc=1.5,shot=null;
    if(phase===2&&p){
      if(dst==='in'){const k=ease(Math.min(1,dT/0.7));px0=Math.round(30+(PX-30)*k);py0=Math.round(116+(PY-116)*k-Math.sin(k*Math.PI)*24);}
      else if(dst==='out'){const k=ease(Math.min(1,dT/0.75)),ex=DR.fix[0]+8+di*12,ey=DR.fix[1]+6+(di%2)*3;px0=Math.round(PX+(ex-PX)*k);py0=Math.round(PY+(ey-PY)*k-Math.sin(k*Math.PI)*28);sc=1.5-k;}
      else inTray=true;
      if(dst==='in'||dst==='ready'||dst==='dev'||dst==='out'){
        const x=px0+(inTray?rx:0),w=Math.round(64*sc),h=Math.round(40*sc);obj(c,l=>{R(l,x-1,py0-1,w+2,h+2,C.paper);});
        shot={x,y:py0,w,h,blank:dst==='in',tong:dst==='in'||dst==='out'};
      }
    }
    // reflejos del líquido
    c.save();c.globalAlpha=0.22;R(c,tx+4,ty+3,tw-8,th2-7,'#e8909e');c.restore();
    // cubeta de fijado con las fotos ya reveladas
    const [fx,fy,fw2,fh]=DR.fix;rr(c,fx+4,fy+3,fw2-8,fh-7,'#b98096',3);
    dev.forEach((q,k)=>{if(!q.half||hung.some(h=>h.p===q)||(phase===3&&k===hi&&hst!=='wait'))return;const x=fx+8+k*12,y=fy+6+(k%2)*3;obj(c,l=>{R(l,x-1,y-1,34,22,C.paper);});c.drawImage(q.half,x,y);});
    c.save();c.globalAlpha=0.2;R(c,fx+4,fy+3,fw2-8,fh-7,'#d898aa');c.restore();
    // luz roja sobre todo
    // en la fase 3 se enciende la luz blanca: las fotos lucen con su color
    const lit=phase===3?Math.min(1,swapT/0.9):0;
    c.save();c.globalCompositeOperation='multiply';c.fillStyle=lit>0?mixc('#ffd2cc','#fff6f0',lit):'#ffd2cc';c.fillRect(0,0,W,H);c.restore();
    if(lit>0&&lit<1){c.save();c.globalAlpha=(1-lit)*0.5;c.fillStyle='#fff8ec';c.fillRect(0,0,W,H);c.restore();}
    if(shot){const {x,y,w,h}=shot;
      if(shot.blank)R(c,x,y,w,h,TONE[0]);
      else{develop(toneX,p,p.d);c.save();c.imageSmoothingEnabled=true;
        // dentro del líquido la imagen ondula un poco al mecer la cubeta
        if(inTray){for(let r=0;r<h;r+=2){const o=Math.round(Math.sin(rockT*9+r*0.35)*(holding?1:0.4));c.drawImage(tone,0,r*40/h,64,2*40/h,x+o,y+r,w,2);}}
        else c.drawImage(tone,0,0,64,40,x,y,w,h);c.restore();}
      // un poco de rojo encima (estamos en el cuarto oscuro) y brillos del líquido
      c.save();c.globalAlpha=0.16;c.fillStyle='#ff8a96';c.fillRect(x,y,w,h);c.restore();
      if(inTray){c.save();c.globalAlpha=0.5;for(let k=0;k<3;k++){const wx=x+((Math.round(rockT*40)+k*37)%(w-14)),wy=y+6+k*18+Math.round(rock*2);R(c,wx,wy,14,1,'#ffe6ea');}c.restore();}
      if(shot.tong){const cx=x+w-4,cy=y+2;for(let k=0;k<2;k++)pline(c,cx+k*3,cy,cx+30+k*3,cy-26,k?'#d8b678':'#ecd29a');}}
    dith(c,0,0,W,6,'#3a1a24');dith(c,0,174,W,6,'#3a1a24');
  }
  // foto colgada por arriba, como una copia de verdad: borde blanco (más ancho abajo), sombra en la pared y brillo de recién revelada.
  // si se balancea (sw = desplazamiento abajo), cada franja se desplaza más cuanto más abajo
  function drawHanging(c,p,x,y,tilt,sw,t){
    sw=sw||0;if(!p.mid){const k=mk(48,30),kx=k.getContext('2d');develop(kx,p,p.d,48,30);p.mid=k;}
    if(!p.half){const k=mk(32,20),kx=k.getContext('2d');develop(kx,p,p.d,32,20);p.half=k;}
    const off=r=>Math.round(sw*r/36);
    c.save();c.globalAlpha=0.28;for(let r=0;r<36;r+=3)R(c,x-24+off(r+1.5)+2,y+r+2,52,3,'#3a1a24');c.restore();
    obj(c,l=>{for(let r=0;r<36;r+=3)R(l,x-26+off(r+1.5),y+r,52,3,C.paper);});
    c.save();c.imageSmoothingEnabled=true;for(let r=0;r<30;r+=2)c.drawImage(p.mid,0,r,48,2,x-24+off(r+3),y+2+r,48,2);c.restore();
    // papel brillante: reflejo fijo arriba a la izquierda y un destello que cruza al colgarla
    R(c,x-23+off(4),y+3,10,1,'rgba(255,255,255,0.55)');R(c,x-23+off(5),y+4,4,1,'rgba(255,255,255,0.4)');
    if(t!=null&&t<0.9){const u=t/0.9,gx=x-30+Math.round(u*64);c.save();c.globalAlpha=0.6*(1-u);for(let r=0;r<30;r++){const xx=gx+Math.round(r*0.5);if(xx>=x-24&&xx<x+22)R(c,xx+off(r),y+2+r,3,1,C.white);}c.restore();}
    if(tilt){R(c,x-26,y+35,52,1,'rgba(58,24,36,0.25)');}
  }
  return self;
}

