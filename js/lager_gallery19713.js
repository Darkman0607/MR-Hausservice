'use strict';
/* MR Hausservice 1.9.7.13 – Anzeige vorhandener Bilder, keine Bearbeitung der Daten. */
(function(){
  let overlay=null, entries=[], index=0, scale=1, angle=0, panX=0, panY=0;
  let previousFocus=null, savedBodyOverflow='', stage=null, picture=null, counter=null, title=null, sub=null, strip=null, errorMessage=null;
  const pointers=new Map();
  let pinchStartDistance=0, pinchStartScale=1, primaryStart=null, primaryMove=null, wasPinching=false;
  const current=()=>entries[index];
  const sanitize=e=>typeof e==='string'?{src:e,title:'Lagerfoto',subtitle:'',photoLabel:''}:e;
  const getDistance=()=>{const a=[...pointers.values()];return a.length<2?0:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)};
  function control(text,label,handler,cls=''){
    const b=document.createElement('button');b.type='button';b.textContent=text;b.setAttribute('aria-label',label||text);
    if(cls)b.className=cls;b.addEventListener('click',handler);return b;
  }
  function transform(){if(!picture||!stage)return;const quarter=Math.abs(angle%180)===90;
    let rotatedFit=1;
    if(quarter&&picture.offsetWidth&&picture.offsetHeight){rotatedFit=Math.min(1,stage.clientWidth/picture.offsetHeight,stage.clientHeight/picture.offsetWidth)}
    picture.style.transform=`translate(${panX}px, ${panY}px) rotate(${angle}deg) scale(${scale*rotatedFit})`;
  }
  function resetView(){scale=1;angle=0;panX=0;panY=0;transform()}
  function changeScale(v){scale=Math.max(1,Math.min(6,v));if(scale===1){panX=0;panY=0}transform()}
  function rotate(){angle=(angle+90)%360;panX=0;panY=0;transform()}
  function go(to){if(!entries.length)return;index=(to+entries.length)%entries.length;render()}
  function renderThumbs(){strip.replaceChildren();if(entries.length<2){strip.hidden=true;return}strip.hidden=false;
    const lo=Math.max(0,Math.min(index-3,entries.length-7)),hi=Math.min(entries.length,Math.max(index+4,7));
    for(let i=lo;i<hi;i++){
      const thumb=control('','Bild '+(i+1)+' öffnen',()=>go(i),'mrg-thumb'+(i===index?' active':''));
      const image=document.createElement('img');image.src=entries[i].src;image.alt='Vorschau '+(i+1);image.loading='lazy';thumb.append(image);strip.append(thumb);
    }
  }
  function render(){const item=current();if(!item)return;resetView();title.textContent=item.title||'Lagerfoto';sub.textContent=[item.subtitle,item.photoLabel].filter(Boolean).join(' · ');
    counter.textContent=`${index+1} / ${entries.length}`;errorMessage.hidden=true;picture.hidden=false;
    picture.onload=()=>{errorMessage.hidden=true;transform()};
    picture.onerror=()=>{picture.hidden=true;errorMessage.textContent='Dieses Foto konnte nicht geöffnet werden.';errorMessage.hidden=false};
    picture.src=item.src;picture.alt=`${item.title||'Lagerfoto'} – Foto ${index+1} von ${entries.length}`;
    renderThumbs();
  }
  function onKey(e){if(!overlay)return;
    if(e.key==='Escape'){e.preventDefault();close()}
    else if(e.key==='ArrowRight'){e.preventDefault();go(index+1)}
    else if(e.key==='ArrowLeft'){e.preventDefault();go(index-1)}
    else if(e.key==='+'||e.key==='='){e.preventDefault();changeScale(scale+0.5)}
    else if(e.key==='-'){e.preventDefault();changeScale(scale-0.5)}
    else if(e.key==='0'){e.preventDefault();resetView()}
    else if(e.key==='Tab'){
      const f=overlay.querySelectorAll('button:not([disabled])');if(!f.length)return;
      if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f[f.length-1].focus()}
      else if(!e.shiftKey&&document.activeElement===f[f.length-1]){e.preventDefault();f[0].focus()}
    }
  }
  function onPointerDown(e){if(e.button!==0)return;stage.setPointerCapture?.(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pointers.size===1){primaryStart={x:e.clientX,y:e.clientY};primaryMove={x:e.clientX,y:e.clientY};wasPinching=false}
    if(pointers.size===2){wasPinching=true;pinchStartDistance=getDistance();pinchStartScale=scale}
  }
  function onPointerMove(e){if(!pointers.has(e.pointerId))return;const old=pointers.get(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pointers.size===2){if(pinchStartDistance>4)changeScale(pinchStartScale*getDistance()/pinchStartDistance);e.preventDefault();return}
    if(scale>1){panX=Math.max(-stage.clientWidth,Math.min(stage.clientWidth,panX+e.clientX-old.x));panY=Math.max(-stage.clientHeight,Math.min(stage.clientHeight,panY+e.clientY-old.y));transform()}
    primaryMove={x:e.clientX,y:e.clientY};e.preventDefault();
  }
  function onPointerUp(e){if(!pointers.has(e.pointerId))return;const end=pointers.get(e.pointerId);pointers.delete(e.pointerId);
    if(pointers.size===0&&!wasPinching&&scale===1&&primaryStart){const dx=end.x-primaryStart.x,dy=end.y-primaryStart.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.25)go(index+(dx<0?1:-1))}
    if(!pointers.size){primaryStart=null;primaryMove=null;pinchStartDistance=0;wasPinching=false}
  }
  function close(){if(!overlay)return;document.removeEventListener('keydown',onKey,true);overlay.remove();overlay=null;pointers.clear();entries=[];document.body.style.overflow=savedBodyOverflow;
    if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});previousFocus=null;
  }
  function open(items,startIndex=0){const filtered=Array.isArray(items)?items.map(sanitize).filter(i=>i&&typeof i.src==='string'&&i.src.trim()):[];if(!filtered.length)return false;
    if(overlay)close();entries=filtered;index=Math.max(0,Math.min(filtered.length-1,Number(startIndex)||0));previousFocus=document.activeElement;savedBodyOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';overlay=document.createElement('section');overlay.id='mr-lager-gallery';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Lagerfotos vergrößern');
    const head=document.createElement('div');head.className='mrg-head';const nameBlock=document.createElement('div');nameBlock.className='mrg-title';title=document.createElement('strong');sub=document.createElement('small');nameBlock.append(title,sub);
    const closeButton=control('✕','Bildergalerie schließen',close,'mrg-close');head.append(nameBlock,closeButton);
    stage=document.createElement('div');stage.className='mrg-body';stage.setAttribute('aria-label','Großes Lagerfoto – wischen für nächstes Bild');
    picture=document.createElement('img');picture.className='mrg-image';picture.draggable=false;
    errorMessage=document.createElement('div');errorMessage.className='mrg-empty';errorMessage.hidden=true;stage.append(picture,errorMessage);
    stage.addEventListener('pointerdown',onPointerDown);stage.addEventListener('pointermove',onPointerMove);stage.addEventListener('pointerup',onPointerUp);stage.addEventListener('pointercancel',onPointerUp);
    stage.addEventListener('dblclick',()=>changeScale(scale>1?1:2));stage.addEventListener('wheel',e=>{if(e.ctrlKey){e.preventDefault();changeScale(scale+(e.deltaY<0?.25:-.25))}},{passive:false});
    const actions=document.createElement('div');actions.className='mrg-controls';const prev=control('‹','Vorheriges Foto',()=>go(index-1));counter=document.createElement('span');counter.className='mrg-counter';counter.setAttribute('aria-live','polite');const next=control('›','Nächstes Foto',()=>go(index+1));
    actions.append(prev,counter,next,control('−','Verkleinern',()=>changeScale(scale-.5)),control('+','Vergrößern',()=>changeScale(scale+.5)),control('⤾','90 Grad drehen',rotate),control('⛶','Ansicht zurücksetzen',resetView));
    const hint=document.createElement('p');hint.className='mrg-tip';hint.textContent='Wischen: nächstes Bild · Zwei Finger: Zoom · ⤾: drehen';
    strip=document.createElement('div');strip.className='mrg-thumbs';overlay.append(head,stage,actions,strip,hint);document.body.append(overlay);
    document.addEventListener('keydown',onKey,true);render();closeButton.focus({preventScroll:true});return true;
  }
  window.MRLagerGallery=Object.freeze({open,close,isOpen:()=>Boolean(overlay)});
})();
