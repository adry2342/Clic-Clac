const GAMES={
  botellas:{name:'Botellas en la cinta',hint:'Fase 1: el grifo se abre solo; pulsa para cerrarlo cuando el líquido llegue a la línea rosa (cada forma se llena a su ritmo). Fase 2: las botellas vuelven y hay que taparlas; el tapón tarda en caer, así que suéltalo un pelín antes.',make:Bottles,crop:[96,66],gesture:'tap',lag:0.55,warm:1.2,view:[96,62],loopT:7.4,
    seq:[['bien','fill'],['bien','cap'],['mal','fill'],['mal','cap']],
    bot(g){const P=g._ph();if(P.phase===2){if(P.cap||P.reload>0)return;for(const b of g._bs){if(b.cj||b.x>FX)continue;if(b.x+P.v*P.landT(b)>=FX-0.4)return 'tap';}return;}
      const b=g._bs.find(b=>b.st==='fill');if(b&&b.level>=b.target-0.15)return 'tap';}},
  grapadora:{name:'Grapadora',hint:'Fase 1: llega un montón de folios cada vez. Míralo bien antes de que la mano lo empuje: grapa solo si tiene la marca rosa y pulsa cuando la marca pase justo bajo la grapadora (algunos llevan dos). Los dibujos, las fotos, los que no tienen marca y los que ya llevan clip se dejan pasar. Fase 2: los montones grapados cuelgan de una pinza que se balancea; toca para soltarlos encima de la torre. Si quedan torcidos, la torre se inclina y se cae.',make:Stapler,crop:[96,58],gesture:'tap',warm:0.4,view:[96,62],loopT:7,
    seq:[['bien','grapar'],['bien','apilar'],['mal','grapar'],['mal','apilar']],
    bot(g){const P=g._ph();
      if(P.phase===2){if(P.st2!=='swing')return;const e=(P.sx-P.topX)*Math.sign(P.vx||1);if(e>=-Math.abs(P.vx)*0.018&&e<=0.6)return 'tap';return;}
      const s=P.cur;if(!s||s.st!=='slide'||s.trap||s.hitch>0)return;for(const m of s.marks){if(m.j)continue;const d=s.x+m.o-SHX;if(d>=0&&d<3)return 'tap';}}},
  tostadora:{name:'Tostadora',hint:'Fase 1: mantén pulsado para bajar la palanca y suelta cuando la aguja llegue a la marca rosa (el color del pedido). Fase 2: unta todas las tostadas; la espátula cruza una sola vez de izquierda a derecha: mantén justo cuando entre en la tostada y suelta justo cuando salga.',make:Toaster,crop:[86,48],gesture:'hold',lag:0.3,lagDown:true,view:[86,52],loopT:7.6,
    seq:[['bien','tostar'],['bien','untar'],['mal','tostar'],['mal','untar']],
    bot(g,D){const d=g._dbg();if(d.phase===2){if(d.swapT<2||!d.u||d.u.st!=='pass')return;if(d.u.sx==null&&d.kx>=d.e[0])return 'down';if(d.h2&&d.kx>=d.e[1])return 'up';return;}if(!d.b)return;if(d.st==='ready'){D.rt=(D.rt||0)+D.dt;if(D.rt>0.5){D.rt=0;return 'down';}}if(d.st==='toast'&&d.b.p>=d.b.target)return 'up';}},
  tortilla:{name:'Tortilla de patatas',hint:'Cuatro gestos distintos: corta rodajas iguales tocando cuando la patata llegue a la guía, casca los huevos manteniendo y soltando en la marca, bate a ritmo sin salirte de la zona y dale la vuelta soltando con el impulso justo.',make:Tortilla,crop:[86,56],gesture:'mix',warm:0.5,view:D=>{const k=D.g._dbg().k;return k==='cortar'?[86,58]:k==='vuelta'?[86,36]:[98,36];},loopT:7,
    bot(g,D){const d=g._dbg(),p=d.p;if(!d.ready)return;
      if(d.k==='cortar'&&p.cuts<p.n&&d.past>=p.T-0.1)return 'tap';
      if(d.k==='huevo'&&!p.open){if(!p.hold)return 'down';if(p.c>=p.target-0.004)return 'up';}
      if(d.k==='batir'&&p.fin==null){D.cd=(D.cd||0)-(D.dt||0.016);if(p.s<p.z-0.03&&D.cd<=0){D.cd=0.09;return 'tap';}}
      if(d.k==='vuelta'&&p.pre<=0&&!g._flip()){if(!p.hold)return 'down';const u=(p.ht/p.period)%1;if(u<0.5&&p.p>=p.target-0.004)return 'up';}}},
  fotos:{name:'Fotos a coches',hint:'Fase 1: miras por el visor de una cámara de carrete. Toca cuando el coche quede centrado; el carrete es limitado y cada coche solo admite una foto (ojo con los patitos, los gatos y los pájaros que se posan en el objetivo). Fase 2: en el cuarto oscuro mantén para mecer la cubeta y suelta cuando la foto tenga el tono de la muestra. Fase 3: cuelga cada foto tocando cuando pase bajo la pinza.',make:Fotos,crop:[96,80],gesture:'mix',
    chips:'<b style="background:var(--pink)">Toca</b> <b style="background:var(--mint)">Mantén y suelta</b> <b>Toca</b>',
    view:D=>{const P=D.g._ph();return P.phase===1?[96,88]:P.phase===2?[96,100]:[Math.max(0,Math.min(192,(DR.slots[Math.min(P.hi,3)])-64)),6];},warm:0.6,loopT:8,
    seq:[['bien','calle'],['bien','revelar'],['bien','tender'],['mal','calle'],['mal','revelar'],['mal','tender']],
    bot(g,D){const P=g._ph();
      if(P.phase===2){if(P.dst==='ready'){D.rt=(D.rt||0)+(D.dt||0.016);if(D.rt>0.4){D.rt=0;return 'down';}}if(P.dst==='dev'&&P.p.d>=0.999)return 'up';return;}
      if(P.phase===3){if(P.hst!=='swing')return;const s=P.sw,v=s.A*s.w*Math.cos(s.w*s.t+s.ph);if(Math.abs(P.th)<0.012*Math.abs(v)&&P.th*v<=0)return 'tap';return;}
      for(const c of g._cars){if(c.j||!c.on)continue;const e=(c.dir>0?VFX-c.x:c.x-VFX)/c.v;if(e<=0.01&&e>-0.02)return 'tap';}}}
};
const SOON=[];

