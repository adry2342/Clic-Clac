/* =====================================================================
   Clic Clac · prototipo 1.1
   Mundo de 320x180 píxeles. Todo el arte se dibuja con primitivas
   redondeadas + un compositor que añade contorno, luz y sombra.
   ===================================================================== */
const W=320,H=180;
const C={
  out:'#3a2b4c',
  cream:'#fff8ec',creamD:'#f1e2cf',paper:'#fffdf7',paperD:'#ece6f3',white:'#ffffff',
  mint:'#cdf3e3',mintD:'#b0e4cf',mintDD:'#92d2bb',mintL:'#e6fbf2',
  pink:'#ffc2d8',pinkD:'#f39ac0',pinkDD:'#d97aa6',pinkL:'#ffe2ee',
  lav:'#ddd2ff',lavD:'#c0b0f2',lavDD:'#9f8cdb',lavL:'#f0ebff',
  peach:'#ffd8bc',peachD:'#f2b994',peachDD:'#d9997a',peachL:'#ffeadb',
  sky:'#c8e6ff',skyD:'#a5d3fb',skyL:'#e4f3ff',
  butter:'#fff0a6',butterD:'#f3d36c',butterDD:'#dcb04f',
  metal:'#e0e3ef',metalD:'#b5b9cf',metalDD:'#8d92ad',metalL:'#f7f8fd',
  water:'rgba(118,196,255,0.88)',waterD:'rgba(78,160,235,0.92)',waterL:'rgba(214,240,255,0.95)',
  wood:'#f6d6b6',woodD:'#ebc29b',woodDD:'#d9a77f',woodL:'#fbe5cf',
  green:'#bfe9a9',greenD:'#94d283',greenDD:'#6fb766',
  coffee:'#c79a73',coffeeD:'#a87b56',
  belt:'#bdb2d8',beltD:'#a194c4',beltL:'#dcd4f0',
  felt:'#c9ecd9',feltD:'#addcc4',feltL:'#e0f6ea'
};
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=id=>document.getElementById(id);

/* ---------- primitivas ---------- */
function mk(w,h){const cv=document.createElement('canvas');cv.width=w;cv.height=h;const x=cv.getContext('2d',{willReadFrequently:true});x.imageSmoothingEnabled=false;return cv;}
function R(c,x,y,w,h,col){if(w<=0||h<=0)return;c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
const INS={1:[1],2:[2,1],3:[3,1,1],4:[4,2,1,1],5:[5,3,2,1,1],6:[6,4,2,2,1,1]};
function rr(c,x,y,w,h,col,r){
  r=Math.min(r||1,6,Math.floor(Math.min(w,h)/2));x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);
  c.fillStyle=col;if(r<=0){c.fillRect(x,y,w,h);return;}
  const ins=INS[r];for(let k=0;k<r;k++){c.fillRect(x+ins[k],y+k,w-2*ins[k],1);c.fillRect(x+ins[k],y+h-1-k,w-2*ins[k],1);}
  c.fillRect(x,y+r,w,h-2*r);
}
function ell(c,cx,cy,rx,ry,col){
  c.fillStyle=col;
  for(let dy=-ry;dy<=ry;dy++){const t=dy/(ry+0.5);const dx=Math.round(rx*Math.sqrt(Math.max(0,1-t*t)));c.fillRect(Math.round(cx-dx),Math.round(cy+dy),dx*2+1,1);}
}
function dith(c,x,y,w,h,col,ph){c.save();c.globalAlpha*=0.42;c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));c.restore();}
function dith4(c,x,y,w,h,col,ph){c.save();c.globalAlpha*=0.2;c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));c.restore();}
function i0(y,ph){return ((y>>1)+(ph||0))&1;}
function px(c,x,y,col){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),1,1);}
function hex(h){const n=parseInt(h.slice(1),16);return[n>>16&255,n>>8&255,n&255];}

/* ---------- compositor: contorno + luz arriba/izquierda + sombra abajo/derecha ---------- */
const LY=mk(W,H),LYc=LY.getContext('2d',{willReadFrequently:true});
const OUT=hex(C.out),SH=[86,62,120],LI=[255,252,236];
const BB=[W,H,-1,-1];
{const fr=LYc.fillRect.bind(LYc);LYc.fillRect=function(x,y,w,h){if(w>0&&h>0){if(x<BB[0])BB[0]=Math.max(0,Math.floor(x));if(y<BB[1])BB[1]=Math.max(0,Math.floor(y));const x2=Math.ceil(x+w)-1,y2=Math.ceil(y+h)-1;if(x2>BB[2])BB[2]=Math.min(W-1,x2);if(y2>BB[3])BB[3]=Math.min(H-1,y2);}fr(x,y,w,h);};}
function obj(target,fn,o){
  o=o||{};const rim=o.rim!==false,line=o.out!==false,oc=o.outCol?hex(o.outCol):OUT;
  // solo se procesa la caja que ocupa lo dibujado (+1 px para el contorno): mucho más rápido en móvil
  BB[0]=W;BB[1]=H;BB[2]=-1;BB[3]=-1;fn(LYc);
  if(BB[2]<0)return;
  const bx=Math.max(0,BB[0]-1),by=Math.max(0,BB[1]-1),bw=Math.min(W,BB[2]+2)-bx,bh=Math.min(H,BB[3]+2)-by;
  if(bw<=0||bh<=0)return;
  const img=LYc.getImageData(bx,by,bw,bh),d=img.data,res=LYc.createImageData(bw,bh),e=res.data,S=bw*4;
  for(let y=0;y<bh;y++){for(let x=0;x<bw;x++){
    const i=y*S+x*4,a=d[i+3];
    const up=y>0?d[i-S+3]:0,dn=y<bh-1?d[i+S+3]:0,lf=x>0?d[i-1]:0,rt=x<bw-1?d[i+7]:0;
    if(a>0){
      let r=d[i],g=d[i+1],b=d[i+2];
      if(rim){
        if(dn===0||rt===0){r=r*0.8+SH[0]*0.2;g=g*0.8+SH[1]*0.2;b=b*0.8+SH[2]*0.2;}
        else if(up===0||lf===0){r=r*0.55+LI[0]*0.45;g=g*0.55+LI[1]*0.45;b=b*0.55+LI[2]*0.45;}
      }
      if(line&&o.aa!==false&&a===255){const n=(up===0)+(dn===0)+(lf===0)+(rt===0);
        if(n>=2&&!((up===0&&dn===0)||(lf===0&&rt===0))){r=r*0.55+oc[0]*0.3+255*0.15*0;g=g*0.55+oc[1]*0.3;b=b*0.55+oc[2]*0.3;r+= (d[i])*0.15;g+=d[i+1]*0.15;b+=d[i+2]*0.15;}}
      e[i]=r;e[i+1]=g;e[i+2]=b;e[i+3]=a;
    }else if(line&&(up|dn|lf|rt)){
      // contorno de color (estilo anime): el trazo es el color del objeto muy oscurecido, no negro plano.
      // Arriba/izquierda, donde da la luz, es más claro; abajo/derecha, más oscuro.
      let nr=0,ng=0,nb=0,nn=0;
      if(up>100){nr+=d[i-S];ng+=d[i-S+1];nb+=d[i-S+2];nn++;}if(dn>100){nr+=d[i+S];ng+=d[i+S+1];nb+=d[i+S+2];nn++;}
      if(lf>100){nr+=d[i-4];ng+=d[i-3];nb+=d[i-2];nn++;}if(rt>100){nr+=d[i+4];ng+=d[i+5];nb+=d[i+6];nn++;}
      const lit=(dn>100||rt>100)&&!(up>0)&&!(lf>0);
      const k=nn===0?1:(lit?(o.sel?0.5:0.6):(o.sel?0.86:0.8));
      if(nn){nr/=nn;ng/=nn;nb/=nn;}
      e[i]=oc[0]*k+nr*(1-k);e[i+1]=oc[1]*k+ng*(1-k);e[i+2]=oc[2]*k+nb*(1-k);e[i+3]=255;}
  }}
  LYc.putImageData(res,bx,by);target.drawImage(LY,bx,by,bw,bh,bx,by,bw,bh);LYc.clearRect(bx,by,bw,bh);
}
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function smooth(t){return t*t*(3-2*t);}
const ease=t=>t<0?0:t>1?1:1-Math.pow(1-t,3),inout=t=>t<0?0:t>1?1:smooth(t);
const backOut=t=>{t=Math.max(0,Math.min(1,t));const k=1.7;return 1+(k+1)*Math.pow(t-1,3)+k*Math.pow(t-1,2);};


