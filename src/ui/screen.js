/* ---------- pantalla completa ---------- */
// Móvil: el primer toque pide pantalla completa y gira a horizontal (no hay F11). PC y móvil: botón en la esquina fuera de la partida.
// iPhone no deja poner una web a pantalla completa: el botón explica cómo añadirla a la pantalla de inicio (allí se abre sin barras).
(function(){
  const de=document.documentElement,btn=$('fsBtn'),tip=$('fsTip');
  const fsEl=()=>document.fullscreenElement||document.webkitFullscreenElement;
  const canFs=!!(de.requestFullscreen||de.webkitRequestFullscreen)&&document.fullscreenEnabled!==false;
  const standalone=()=>matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches||navigator.standalone===true;
  const touch=matchMedia('(pointer: coarse)').matches;
  const ios=/iP(hone|od|ad)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  function enter(){
    try{const r=de.requestFullscreen?de.requestFullscreen({navigationUI:'hide'}):de.webkitRequestFullscreen();
      Promise.resolve(r).then(()=>{if(touch&&screen.orientation&&screen.orientation.lock)screen.orientation.lock('landscape').catch(()=>{});}).catch(()=>{});}catch(e){}
  }
  let tipT=0;
  function showTip(t){tip.textContent=t;tip.hidden=false;clearTimeout(tipT);tipT=setTimeout(()=>tip.hidden=true,5000);}
  btn.addEventListener('click',e=>{e.stopPropagation();
    if(fsEl()){(document.exitFullscreen||document.webkitExitFullscreen).call(document);return;}
    if(canFs)enter();
    else showTip(ios?'En iPhone: pulsa Compartir y luego «Añadir a pantalla de inicio». Desde ahí se abre a pantalla completa.':'Tu navegador no deja ponerlo a pantalla completa. Prueba con F11.');
  });
  btn.addEventListener('pointerdown',e=>e.stopPropagation());
  // primer toque en móvil: pantalla completa sin tener que buscar nada
  if(touch&&canFs&&!standalone()){
    const first=()=>{removeEventListener('pointerup',first,true);if(!fsEl())enter();};
    addEventListener('pointerup',first,true);
  }
  // el botón solo se ve fuera de la partida (en juego la esquina es del botón de pausa) y si aún no estás en pantalla completa
  function sync(){btn.hidden=!!fsEl()||standalone()||Core.scene==='play';
    btn.setAttribute('aria-label',fsEl()?'Salir de pantalla completa':'Pantalla completa');}
  document.addEventListener('fullscreenchange',sync);document.addEventListener('webkitfullscreenchange',sync);
  setInterval(sync,300);sync();
})();
