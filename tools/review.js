// Revisión automática de Clic Clac (necesita Node y Playwright: npm i -D playwright && npx playwright install chromium)
//   node tools/review.js [juego|all] [carpeta]
// Para cada juego: lo juega un bot, captura cada fase en una hoja de fotogramas (contact sheet),
// mide el tiempo por fotograma y comprueba que pulsar tarde se marca como "tarde/te pasaste".
const { chromium } = require('playwright');const fs=require('fs');const path=require('path');
const ALL=['botellas','grapadora','tostadora','tortilla','fotos'];
const which=process.argv[2]&&process.argv[2]!=='all'?[process.argv[2]]:ALL,out=process.argv[3]||'review';
const URL='file://'+path.resolve(__dirname,'..','index.html');
fs.mkdirSync(out,{recursive:true});
const BOT=(id,delay)=>{const G=__cc.GAMES[id],D={dt:0.002};let held=false,busy=false;window.__log=[];
  const J=__cc.Core.judge.bind(__cc.Core);__cc.Core.judge=(j,x,y,p,d)=>{__log.push([j,d||'']);return J(j,x,y,p,d);};
  setInterval(()=>{const C=__cc.Core;if(C.scene!=='play'||C.ready>0||busy)return;const a=G.bot(C.game,D);if(!a)return;
    if(a==='down'){if(!held){__cc.press();held=true;}return;}
    const go=()=>{if(a==='tap'){__cc.press();__cc.release();}else{__cc.release();held=false;}};
    if(delay){busy=true;setTimeout(()=>{go();setTimeout(()=>busy=false,250);},delay);}else go();},2);};
async function run(id,delay,film){
  const b=await chromium.launch();const p=await b.newPage({viewport:{width:700,height:400}});const errs=[];
  p.on('pageerror',e=>errs.push(String(e)));
  await p.goto(URL);await p.waitForTimeout(300);await p.evaluate(g=>__cc.openGame(g),id);await p.waitForTimeout(150);await p.keyboard.press('Space');
  await p.evaluate(`(${BOT.toString()})(${JSON.stringify(id)},${delay})`);
  // tiempos de fotograma
  await p.evaluate(()=>{window.__ft=[];let l=performance.now();const f=t=>{__ft.push(t-l);l=t;requestAnimationFrame(f);};requestAnimationFrame(f);});
  const seen=new Set(),sheets=[];const T0=Date.now();
  while(Date.now()-T0<90000){const sc=await p.evaluate(()=>__cc.Core.scene);if(sc!=='play')break;
    if(film){const cue=await p.evaluate(()=>document.getElementById('hCue').textContent||'');const k=(cue.match(/^[^·]*/)||[''])[0].trim()||'fase';
      if(!seen.has(k)){seen.add(k);await p.waitForTimeout(2600);const shots=[];
        for(let i=0;i<12;i++){shots.push((await p.screenshot({clip:await (await p.$('#stage')).boundingBox()})).toString('base64'));await p.waitForTimeout(170);}
        sheets.push([k,shots]);continue;}}
    await p.waitForTimeout(250);}
  const res=await p.evaluate(()=>({log:__log,ft:__ft,rank:document.getElementById('rRank').textContent}));
  if(film)for(const [k,shots] of sheets){const png=await p.evaluate(async(sh)=>{const ims=await Promise.all(sh.map(s=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.src='data:image/png;base64,'+s;})));
      const w=ims[0].width/2,h=ims[0].height/2,cv=document.createElement('canvas');cv.width=w*4;cv.height=h*3;const x=cv.getContext('2d');
      ims.forEach((im,i)=>x.drawImage(im,(i%4)*w,Math.floor(i/4)*h,w,h));return cv.toDataURL().split(',')[1];},shots);
    fs.writeFileSync(path.join(out,`${id}-${k.replace(/[^a-z0-9]+/gi,'_').toLowerCase()}.png`),Buffer.from(png,'base64'));}
  await b.close();return {...res,errs};
}
(async()=>{const report=[];
  for(const id of which){
    const a=await run(id,0,true),late=await run(id,75,false);
    const ft=a.ft.slice(30).sort((x,y)=>x-y),p95=ft[Math.floor(ft.length*0.95)]||0;
    const lateDet=[...new Set(late.log.filter(l=>l[0]!=='P').map(l=>l[1]))];
    const wrong=lateDet.filter(d=>/Pronto|corto|clara|antes/i.test(d));
    report.push(`${id}: nota ${a.rank} · fallos del bot ${a.log.filter(l=>l[0]!=='P').length} · fotograma p95 ${p95.toFixed(1)} ms · errores JS ${a.errs.length+late.errs.length}`+
      `\n   tarde (+75 ms) se marca como: ${lateDet.join(' | ')||'—'}${wrong.length?'\n   ⚠ avisos de "pronto" al llegar tarde: '+wrong.join(' | '):''}`);
    console.log(report[report.length-1]);}
  fs.writeFileSync(path.join(out,'informe.txt'),report.join('\n')+'\n');})();
