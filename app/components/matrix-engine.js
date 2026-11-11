/* AIWORK Cinematic Matrix. Dependency-free Canvas2D engine.
 * The background and every overlay share the exact same cover transform.
 * No telemetry, network calls, storage access or HTML injection.
 */
(function (global) {
  'use strict';
  const W = 1487, H = 1058;
  const GLYPHS = Array.from('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    '\u30a2\u30a4\u30a6\u30ab\u30ad\u30c4\u30e1\u5929\u4e2d\u6587\u5b57' +
    '\uac00\ub098\ub2e4\ub77c\u0905\u0915\u092e\u0937');
  const PALETTE = Object.freeze({green:'#30ff83',cyan:'#30e8ff',head:'#cefff1',lime:'#b8ff46',mint:'#76ffd1',emerald:'#10de93',teal:'#19bfc2'});
  const GEOMETRY = Object.freeze({
    globe:{x:744,y:438,rx:220,ry:208},
    left:[[68,198],[286,250],[286,480],[68,435]],
    right:[[1250,282],[1436,250],[1436,476],[1250,520]]
  });
  const hash = (a) => { let n=a|0; n=Math.imul(n^(n>>>16),0x45d9f3b); n=Math.imul(n^(n>>>16),0x45d9f3b); return (n^(n>>>16))>>>0; };
  const rand = (a) => hash(a)/4294967295;
  // Stable per-stream size buckets are cached once, never selected per frame.
  // Shrink by at most 20%, stopping at 9.1 scene pixels; smaller originals stay put.
  const RAIN_SIZES = Array.from({length:66},(_,i)=>{
    const original=7+rand(i+305)*9,scale=[1,.9,.8][hash(i+903)%3];
    return Math.min(original,Math.max(9.1,original*scale));
  });
  const glyph = (a) => GLYPHS[hash(a)%GLYPHS.length];
  const fract = (x) => x-Math.floor(x);
  const mix = (a,b,t) => a+(b-a)*t;
  function deviceQuality() {
    const navigator=global.navigator||{}, connection=navigator.connection||{};
    let quality=1;
    if(connection.saveData) quality=.72;
    if(Number.isFinite(navigator.hardwareConcurrency)) {
      if(navigator.hardwareConcurrency<=2) quality=Math.min(quality,.5);
      else if(navigator.hardwareConcurrency<=4) quality=Math.min(quality,.68);
      else if(navigator.hardwareConcurrency<=6) quality=Math.min(quality,.92);
    }
    if(Number.isFinite(navigator.deviceMemory)) {
      if(navigator.deviceMemory<=2) quality=Math.min(quality,.5);
      else if(navigator.deviceMemory<=4) quality=Math.min(quality,.68);
      else if(navigator.deviceMemory<=6) quality=Math.min(quality,.92);
    }
    return quality;
  }
  const qualityTier = (quality) => quality<.6?'lowest':quality<.86?'reduced':'full';
  function sceneTransform(w,h) {
    const scale=Math.max(w/W,h/H);
    return {scale,x:(w-W*scale)/2,y:(h-H*scale)*.46,width:W*scale,height:H*scale};
  }
  function bilinear(q,u,v) {
    return {x:mix(mix(q[0][0],q[1][0],u),mix(q[3][0],q[2][0],u),v),
      y:mix(mix(q[0][1],q[1][1],u),mix(q[3][1],q[2][1],u),v)};
  }
  function mount(canvas, options) {
    if (!canvas || typeof canvas.getContext!=='function') throw new TypeError('A canvas element is required.');
    const ctx=canvas.getContext('2d',{alpha:true});
    if (!ctx) return {destroy(){},pause(){},resume(){},getState(){return {supported:false};}};
    const opts=Object.assign({maxDpr:1.35,mobileMaxDpr:1.1,desktopFps:36,mobileFps:24,intensity:1}, options||{});
    const media=global.matchMedia('(prefers-reduced-motion: reduce)');
    let raf=0,last=0,time=0,width=1,height=1,dpr=1,frame=0,paused=false,dead=false,small=false;
    let baseQuality=deviceQuality(),quality=baseQuality,slowFrames=0,fastFrames=0,lastTier='';
    let transform=sceneTransform(1,1);
    const colors=[PALETTE.green,PALETTE.lime,PALETTE.mint,PALETTE.emerald,PALETTE.teal,PALETTE.cyan];
    // A cached mask of the poster's luminous pixels keeps every original glyph
    // fixed. Only light travels across it; the approved artwork is never moved.
    const poster=opts.posterElement;
    let lightMask=null,lightReady=false;
    function prepareFixedLight() {
      if(dead||!poster?.complete||!poster.naturalWidth||!global.document?.createElement)return;
      try {
        const budget=(small||quality<.86)?960:W;
        const mw=Math.min(poster.naturalWidth,budget),mh=Math.round(mw*H/W);
        if(lightMask?.width===mw&&lightReady)return;
        const mask=global.document.createElement('canvas');mask.width=mw;mask.height=mh;
        const maskContext=mask.getContext('2d',{willReadFrequently:true});
        if(!maskContext)return;
        maskContext.drawImage(poster,0,0,mw,mh);
        const pixels=maskContext.getImageData(0,0,mw,mh),data=pixels.data;
        for(let i=0;i<data.length;i+=4) {
          const red=data[i],green=data[i+1],blue=data[i+2],peak=Math.max(green,blue);
          // Dark pixels are transparent: the sweep lights strokes, not a rectangle.
          const luminance=Math.max(0,Math.min(1,(peak-18)/158));
          const chroma=Math.max(0,Math.min(1,(peak-red+15)/50));
          data[i]=blue>green?170:135;data[i+1]=255;data[i+2]=blue>green?255:222;
          data[i+3]=Math.round(255*luminance*chroma);
        }
        maskContext.putImageData(pixels,0,0);
        lightMask=mask;lightReady=true;
        canvas.dataset.fixedGlyphLight='ready';
      } catch {
        // A missing/undecodable poster leaves the existing Matrix fully usable.
        lightReady=false;canvas.dataset.fixedGlyphLight='unavailable';
      }
    }
    function posterLoaded(){prepareFixedLight();if(!dead)draw(time);}
    poster?.addEventListener('load',posterLoaded);
    function fixedGlyphLight(t) {
      if(!lightReady||media.matches)return;
      const mw=lightMask.width,mh=lightMask.height,maskScale=mw/W;
      const band=240,slices=small||quality<.86?16:24,step=band/slices;
      const posterY=(height-transform.height)*.46;
      ctx.save();ctx.setTransform(dpr,0,0,dpr,0,0);ctx.globalCompositeOperation='screen';
      // Only narrow lit strips are drawn. No full-image compositing, new canvas,
      // per-frame pixel reads or extra animation loop is needed.
      for(let pass=0;pass<2;pass++) {
        const phase=fract(t/11+pass*.5)*(H+band)-band;
        for(let slice=0;slice<slices;slice++) {
          const top=Math.max(0,phase+slice*step),bottom=Math.min(H,phase+(slice+1)*step);
          if(bottom<=top)continue;
          const progress=(slice+.5)/slices;
          const envelope=progress<.78?(progress/.78)**2:((1-progress)/.22)**2;
          ctx.globalAlpha=.94*envelope*opts.intensity;
          ctx.drawImage(lightMask,0,top*maskScale,mw,Math.min(mh-top*maskScale,(bottom-top)*maskScale),
            transform.x,posterY+top*transform.scale,transform.width,(bottom-top)*transform.scale);
        }
      }
      ctx.restore();
    }
    // Glyph glow is rasterized once, never shadow-blurred per animated cell.
    // A bounded viewport cache is refreshed at 8–14 Hz; the main frame only
    // composites it once. Every fixed cell has its own mutation/brightness phase.
    const TILE=32, ATLAS_COLUMNS=16;
    let atlas=null,gridSurface=null,gridContext=null,gridCells=[],gridStamp=-1,gridScale=1;
    let gridRevision=0;
    function prepareAtlas() {
      if(atlas||!global.document?.createElement)return;
      const surface=global.document.createElement('canvas');
      surface.width=ATLAS_COLUMNS*TILE;surface.height=Math.ceil(GLYPHS.length/ATLAS_COLUMNS)*TILE*2;
      const ac=surface.getContext('2d');if(!ac)return;
      ac.textAlign='center';ac.textBaseline='middle';ac.font='700 19px ui-monospace,monospace';
      for(let tone=0;tone<2;tone++)for(let i=0;i<GLYPHS.length;i++) {
        const x=(i%ATLAS_COLUMNS)*TILE+TILE/2,y=(Math.floor(i/ATLAS_COLUMNS)+tone*Math.ceil(GLYPHS.length/ATLAS_COLUMNS))*TILE+TILE/2;
        ac.fillStyle=tone?PALETTE.head:PALETTE.green;ac.shadowColor=PALETTE.green;ac.shadowBlur=7;
        ac.fillText(GLYPHS[i],x,y);ac.shadowBlur=2;ac.fillText(GLYPHS[i],x,y);
      }
      atlas=surface;canvas.dataset.glyphAtlas='ready';
      // ImageBitmap avoids repeated canvas-source snapshots on supporting
      // browsers. Keep the canvas fallback until the one-time bake completes.
      if(typeof global.createImageBitmap==='function') {
        global.createImageBitmap(surface).then(bitmap=>{
          if(dead){bitmap.close?.();return;}
          atlas=bitmap;canvas.dataset.glyphAtlas='bitmap';
        }).catch(()=>{});
      }
    }
    function sprite(target,index,x,y,size,head) {
      if(!atlas)return;
      const i=index%GLYPHS.length,row=Math.floor(i/ATLAS_COLUMNS)+(head?Math.ceil(GLYPHS.length/ATLAS_COLUMNS):0);
      const extent=size*TILE/19;
      target.drawImage(atlas,(i%ATLAS_COLUMNS)*TILE,row*TILE,TILE,TILE,x-extent/2,y-extent/2,extent,extent);
    }
    function prepareGrid() {
      prepareAtlas();if(!atlas)return;
      if(!gridSurface) {gridSurface=global.document.createElement('canvas');gridContext=gridSurface.getContext('2d');}
      if(!gridContext)return;
      const budget=quality<.6?360000:quality<.86?600000:1000000;
      gridScale=Math.min(1,Math.sqrt(budget/(width*height)));
      gridSurface.width=Math.max(1,Math.round(width*gridScale));gridSurface.height=Math.max(1,Math.round(height*gridScale));
      gridCells=[];gridStamp=-1;
      const spacing=quality<.6?34:quality<.86?28:23;
      const left=Math.max(0,-transform.x/transform.scale),right=Math.min(W,(width-transform.x)/transform.scale);
      const top=Math.max(0,-transform.y/transform.scale),bottom=Math.min(H,(height-transform.y)/transform.scale);
      for(let row=Math.floor(top/spacing);row<=Math.ceil(bottom/spacing);row++)for(let col=Math.floor(left/spacing);col<=Math.ceil(right/spacing);col++) {
        const x=col*spacing+spacing*.5,y=row*spacing+spacing*.5,seed=hash(row*4099+col*131),g=GEOMETRY.globe;
        const inGlobe=((x-g.x)/g.rx)**2+((y-g.y)/g.ry)**2<1.15;
        gridCells.push({x,y,seed,phase:rand(seed+23),rate:.8+rand(seed+47)*1.8,size:15+rand(seed+99)*5,attenuation:inGlobe?.42:1});
      }
      // Keep every second original cell, without changing its position, seed,
      // size, local light cycle or mutation rate. Odd totals round up by one.
      gridCells=gridCells.filter((_,index)=>index%2===0);
      // Thin the CURRENT half-density grid by one further third.
      gridCells=gridCells.filter((_,index)=>index%3!==1);
      canvas.dataset.gridCells=String(gridCells.length);
    }
    function codeGrid(t) {
      if(!gridContext||!atlas)return;
      const hz=quality<.6?8:quality<.86?10:14,stamp=Math.floor(t*hz);
      if(stamp!==gridStamp) {
        gridStamp=stamp;gridRevision++;
        gridContext.setTransform(gridScale,0,0,gridScale,0,0);gridContext.clearRect(0,0,width,height);
        gridContext.translate(transform.x,transform.y);gridContext.scale(transform.scale,transform.scale);
        for(const cell of gridCells) {
          const {x,y,seed,phase,rate,size,attenuation}=cell;
          const mutation=Math.floor(t*rate+phase*4);
          // Slow local pulses avoid whole-screen flashing. The bright crest
          // travels down every column, while every cell keeps a visible floor.
          const pulse=.5+.5*Math.sin(t*1.7+phase*Math.PI*2);
          const distance=fract(y/H-t*.095+rand(Math.floor(x/23)+83));
          const crest=Math.max(0,1-distance/.22);
          const brightness=.24+.35*pulse*pulse+.65*crest*crest;
          gridContext.globalAlpha=Math.min(.95,brightness*attenuation*opts.intensity);
          sprite(gridContext,hash(seed+mutation)%GLYPHS.length,x,y,size,crest>.86);
        }
      }
      ctx.save();ctx.setTransform(dpr,0,0,dpr,0,0);ctx.globalAlpha=1;
      ctx.drawImage(gridSurface,0,0,gridSurface.width,gridSurface.height,0,0,width,height);ctx.restore();
    }
    let pointer=null;
    function pointerMove(event){pointer={x:(event.clientX-transform.x)/transform.scale,y:(event.clientY-transform.y)/transform.scale};}
    function pointerLeave(){pointer=null;}
    function glow(x,y,t,seed){
      const near=pointer?Math.max(0,1-Math.hypot(x-pointer.x,y-pointer.y)/180):0;
      return .86+.14*Math.sin(t*.45+seed)+near*.5;
    }
    const rows=[];
    for(let i=0;i<160;i++) rows.push(Array.from({length:34},(_,k)=>glyph(i*79+k*23)).join(''));
    canvas.setAttribute('aria-hidden','true');
    canvas.dataset.scene='cinematic-matrix';
    function reportQuality() {
      const tier=qualityTier(quality);
      canvas.dataset.quality=quality.toFixed(2);canvas.dataset.qualityTier=tier;
      if(tier!==lastTier) {
        lastTier=tier;
        if(opts.onQualityChange)opts.onQualityChange({quality,tier});
      }
    }
    function adaptQuality(cost,interval) {
      if(!Number.isFinite(cost)||cost<0)return;
      if(cost>interval*.72){slowFrames++;fastFrames=0;}
      else if(cost<interval*.3){fastFrames++;slowFrames=Math.max(0,slowFrames-1);}
      else{slowFrames=Math.max(0,slowFrames-1);fastFrames=0;}
      if(slowFrames>=8&&quality>.46){quality=Math.max(.46,quality-.08);slowFrames=0;reportQuality();prepareGrid();}
      else if(fastFrames>=240&&quality<baseQuality){quality=Math.min(baseQuality,quality+.04);fastFrames=0;reportQuality();prepareGrid();}
    }
    function line(path,color,alpha,weight) {
      ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=weight||1;
      ctx.beginPath();path();ctx.stroke();
    }
    function rain(t) {
      const fullCount=small?34:66;
      const count=Math.max(small?18:30,Math.round(fullCount*quality));
      let retainedGlyph=0;
      ctx.textAlign='center';ctx.textBaseline='middle';
      for(let i=0;i<count;i++) {
        const depth=rand(i+305),size=RAIN_SIZES[i];
        const x=(i+.4)*W/count+Math.sin(t*.12+i*.73)*(4+depth*11);
        const speed=14+depth*27,spacing=16+depth*7;
        const y=fract((t*speed+rand(i*37+4)*(H+300))/(H+300))*(H+300)-145;
        ctx.font='500 '+size+'px ui-monospace,monospace';
        const length=9+Math.floor(rand(i+67)*12);
        for(let j=0;j<length;j++) {
          if((i+j)%2)continue;
          // Remove every third surviving rain glyph, keeping its neighbors unchanged.
          if(((i+j)/2)%3===2)continue;
          // Index prior survivors before clipping, so selection never flickers.
          if(retainedGlyph++%3===1)continue;
          // Drop every sixth stream after advancing the prior survivor phase.
          // Keep count unchanged so remaining columns retain positions and speed.
          if(i%6===5)continue;
          // Halve the surviving streams, not the glyph grid or per-stream cells.
          // The surviving-stream ordinal and glyph phase include skipped columns.
          if((i-Math.floor(i/6))%2)continue;
          // A small further trim: remove one in six v9 surviving streams.
          // Advance all prior glyph phases before dropping the complete stream.
          if(((i-Math.floor(i/6))/2)%6===5)continue;
          const py=y-j*spacing;
          if(py<-20 || py>H+20) continue;
          const g=GEOMETRY.globe;
          const inGlobe=((x-g.x)/g.rx)**2+((py-g.y)/g.ry)**2<1.1;
          const alpha=(1-j/length)*(.22+.35*depth)*(inGlobe?.24:1)*opts.intensity;
          ctx.globalAlpha=Math.min(.88,alpha*glow(x,py,t,i));ctx.fillStyle=j===0?PALETTE.head:colors[i%colors.length];
          ctx.shadowBlur=0;
          const tick=Math.floor(t*(j===0?2:.6));
          sprite(ctx,hash(i*409+j*41+tick)%GLYPHS.length,x,py,size,j===0);
        }
      }
      ctx.shadowBlur=0;
    }
    function globe(t) {
      const g=GEOMETRY.globe;
      ctx.save();ctx.beginPath();ctx.ellipse(g.x,g.y,g.rx,g.ry,0,0,Math.PI*2);ctx.clip();
      const yaw=t*.075;
      /* Glyphs follow a rotating spherical projection, not a flat scrolling box. */
      ctx.textAlign='center';ctx.textBaseline='middle';
      const latitudeStep=.175/Math.max(.56,quality), longitudeCount=Math.max(20,Math.round(36*quality));
      let retainedGlyph=0;
      for(let lat=-1.17,li=0;lat<1.21;lat+=latitudeStep,li++) {
        const flowLat=-1.22+fract((lat+1.22)/2.44+t*.032)*2.44;
        const cl=Math.cos(flowLat),sl=Math.sin(flowLat);
        for(let j=0;j<longitudeCount;j++) {
          if((li+j)%2)continue;
          // Keep two of three prior glyphs without changing the projection.
          if(retainedGlyph++%3===1)continue;
          const lon=j/longitudeCount*Math.PI*2+yaw,visible=Math.cos(lon);
          if(visible<.05)continue;
          const x=g.x+g.rx*cl*Math.sin(lon),y=g.y+g.ry*sl;
          const alpha=(.11+visible*.34)*opts.intensity;
          ctx.globalAlpha=Math.min(.85,alpha*glow(x,y,t,j));ctx.fillStyle=colors[(j+li)%colors.length];
          ctx.font=(4.5+visible*4)+'px ui-monospace,monospace';
          ctx.shadowBlur=0;
          sprite(ctx,hash(li*97+j*13+Math.floor(t*.45))%GLYPHS.length,x,y,4.5+visible*4,false);
        }
      }
      ctx.shadowBlur=0;
      const scanY=g.y+Math.sin(t*.26)*g.ry*.87;
      const half=g.rx*Math.sqrt(Math.max(0,1-((scanY-g.y)/g.ry)**2));
      line(()=>{ctx.moveTo(g.x-half,scanY);ctx.lineTo(g.x+half,scanY)},PALETTE.cyan,.35,.8);
      ctx.restore();
      /* Fine HUD arcs sweep while the approved image stays registered. */
      for(let k=0;k<3;k++) {
        const start=t*(k%2?-.045:.065)+k*2.1;
        line(()=>ctx.ellipse(g.x,g.y,g.rx+22+k*11,g.ry+24+k*12,0,start,start+.32),k%2?PALETTE.green:PALETTE.cyan,.6,1.3);
        const x=g.x+(g.rx+24+k*11)*Math.cos(start),y=g.y+(g.ry+24+k*12)*Math.sin(start);
        ctx.fillStyle=PALETTE.head;ctx.globalAlpha=.8;ctx.beginPath();ctx.arc(x,y,1.7,0,Math.PI*2);ctx.fill();
      }
    }
    function panel(q,t,seed,isRight) {
      ctx.save();ctx.beginPath();q.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.clip();
      ctx.globalAlpha=.18;ctx.fillStyle='#00100c';ctx.fillRect(0,0,W,H);
      ctx.textBaseline='middle';ctx.textAlign='left';ctx.shadowBlur=0;
      const rowCount=Math.max(16,Math.round(30*quality));
      let retainedRow=0;
      for(let r=-1;r<rowCount;r++) {
        // Preserve the prior complementary half-density rows, then thin them.
        if((r+(isRight?1:0))%2)continue;
        if(retainedRow++%3===1)continue;
        const v=fract(r/rowCount+t*(isRight?.027:.036));
        const a=bilinear(q,.075,v),b=bilinear(q,.94,v);
        const dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy);
        ctx.save();ctx.translate(a.x,a.y);ctx.rotate(Math.atan2(dy,dx));
        ctx.font=(isRight?5.3:5.1)+'px ui-monospace,monospace';
        ctx.globalAlpha=Math.min(.85,(.3+.3*Math.sin(v*Math.PI))*opts.intensity*glow(a.x,a.y,t,r));
        ctx.fillStyle=colors[(r+seed)%colors.length];
        const tick=Math.floor(t*.7)+r+seed;
        const row=rows[(tick%rows.length+rows.length)%rows.length];
        ctx.fillText(row,0,0,len);ctx.restore();
      }
      const v=fract(t*.065+seed*.1);
      const a=bilinear(q,0,v),b=bilinear(q,1,v);
      line(()=>{ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y)},PALETTE.cyan,.7,1);
      if(isRight) {
        for(let n=0;n<21;n++) {
          const u=.07+n*.04,base=bilinear(q,u,.78);
          const top=bilinear(q,u,.78-(.05+.18*(.5+.5*Math.sin(t*1.35+n*.53))));
          line(()=>{ctx.moveTo(base.x,base.y);ctx.lineTo(top.x,top.y)},PALETTE.green,.7,2);
        }
      }
      ctx.restore();
    }
    function waves(t) {
      const bands=small?2:3;
      for(let band=0;band<bands;band++) {
        const pointCount=Math.max(64,Math.round(130*quality)),points=[];
        for(let i=0;i<=pointCount;i++) {
          const x=i/pointCount*W;
          const y=520+Math.sin(x*.0075+t*.29+band*.12)*42+Math.sin(x*.0022-t*.12)*19+band*5;
          points.push([x,y]);
        }
        line(()=>points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1])),band===0?PALETTE.cyan:PALETTE.green,.11,band===0?1:.55);
        for(let i=0;i<6;i++) {
          const index=Math.floor(fract(t*.018+i/6+band*.07)*pointCount);
          const p=points[index];ctx.fillStyle=PALETTE.cyan;ctx.globalAlpha=.5;ctx.shadowColor=PALETTE.cyan;ctx.shadowBlur=quality<.6?2:8;
          ctx.beginPath();ctx.arc(p[0],p[1],1.6,0,Math.PI*2);ctx.fill();
        }
      }
      ctx.shadowBlur=0;
    }
    function draw(t) {
      ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
      ctx.save();ctx.translate(transform.x,transform.y);ctx.scale(transform.scale,transform.scale);
      ctx.globalCompositeOperation='screen';
      fixedGlyphLight(t);codeGrid(t);rain(t);globe(t);panel(GEOMETRY.left,t,13,false);panel(GEOMETRY.right,t,47,true);waves(t);
      ctx.restore();ctx.globalAlpha=1;ctx.shadowBlur=0;
      frame++;canvas.dataset.frame=String(frame);canvas.dataset.sceneTime=t.toFixed(3);
      canvas.dataset.motion=media.matches?'reduced':paused?'paused':document.hidden?'hidden':'running';
      if(opts.onFrame)opts.onFrame({frame,time:t});
    }
    function tick(now) {
      raf=0;if(dead||paused||media.matches||document.hidden)return;
      if(!last)last=now;
      const elapsed=Math.min(now-last,80);
      const preferredFps=small?opts.mobileFps:opts.desktopFps;
      const effectiveFps=quality<.6?Math.min(preferredFps,18):quality<.86?Math.min(preferredFps,24):preferredFps;
      const interval=1000/effectiveFps;
      if(elapsed>=interval){
        time+=elapsed/1000;last=now;
        const started=global.performance?.now?.()??now;
        draw(time);
        adaptQuality((global.performance?.now?.()??started)-started,interval);
      }
      raf=global.requestAnimationFrame(tick);
    }
    function schedule() {
      if(raf)global.cancelAnimationFrame(raf);raf=0;last=0;
      if(!dead&&!paused&&!media.matches&&!document.hidden)raf=global.requestAnimationFrame(tick);
      else if(!dead)draw(time);
    }
    function resize() {
      if(dead)return;
      const r=canvas.getBoundingClientRect();width=Math.max(1,r.width);height=Math.max(1,r.height);
      small=width<700;
      const constrained=deviceQuality()<.6;
      const pixelBudget=constrained?650000:small?650000:1800000;
      const viewportQuality=Math.min(1,Math.sqrt(pixelBudget/Math.max(1,width*height)));
      baseQuality=Math.max(.46,Math.min(deviceQuality(),viewportQuality));
      quality=baseQuality;slowFrames=0;fastFrames=0;reportQuality();
      dpr=Math.min(global.devicePixelRatio||1,small?opts.mobileMaxDpr:opts.maxDpr,quality<.6?1:quality<.86?1.05:Infinity,Math.sqrt(pixelBudget/(width*height)));
      canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
      transform=sceneTransform(width,height);prepareGrid();prepareFixedLight();draw(time);schedule();
    }
    function visibility(){schedule();}
    function motionChange(){schedule();}
    const observer=typeof ResizeObserver!=='undefined'?new ResizeObserver(resize):null;
    observer?.observe(canvas);global.addEventListener('resize',resize,{passive:true});
    global.addEventListener('pointermove',pointerMove,{passive:true});
    global.addEventListener('pointerout',pointerLeave,{passive:true});
    document.addEventListener('visibilitychange',visibility);media.addEventListener('change',motionChange);
    resize();
    return {
      pause(){paused=true;schedule();},resume(){paused=false;schedule();},
      getState(){return {supported:true,frame,time,paused,reducedMotion:media.matches,hidden:document.hidden,width,height,dpr,quality,qualityTier:qualityTier(quality),gridCells:gridCells.length,gridRevision,gridPixels:gridSurface?gridSurface.width*gridSurface.height:0,transform,geometry:GEOMETRY};},
      destroy(){dead=true;poster?.removeEventListener('load',posterLoaded);lightMask=null;atlas?.close?.();atlas=null;gridSurface=null;gridContext=null;gridCells=[];if(raf)global.cancelAnimationFrame(raf);observer?.disconnect();global.removeEventListener('resize',resize);global.removeEventListener('pointermove',pointerMove);global.removeEventListener('pointerout',pointerLeave);document.removeEventListener('visibilitychange',visibility);media.removeEventListener('change',motionChange);ctx.clearRect(0,0,canvas.width,canvas.height);},
      /* Deterministic frame export supports verification without running the clock. */
      renderAt(seconds){if(!dead&&Number.isFinite(seconds))draw(Math.max(0,seconds));}
    };
  }
  global.AIWORKMatrix=Object.freeze({mount,sceneTransform,geometry:GEOMETRY,palette:PALETTE});
  if(typeof module!=='undefined'&&module.exports)module.exports=global.AIWORKMatrix;
})(typeof window!=='undefined'?window:globalThis);
