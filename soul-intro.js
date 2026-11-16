(()=>{'use strict';
if(!document.querySelector('.hero-v2')||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const KEY='soul-v25-intro-seen';const REPLAY='soul-v25-replay';document.getElementById('soulReplayIntro')?.addEventListener('click',()=>{try{sessionStorage.removeItem(KEY);sessionStorage.setItem(REPLAY,'1')}catch{}location.href=location.pathname;});
try{const replay=sessionStorage.getItem(REPLAY)==='1';sessionStorage.removeItem(REPLAY);if(!replay&&(sessionStorage.getItem(KEY)||location.hash||new URLSearchParams(location.search).has('soulReturn')||scrollY>40))return;sessionStorage.setItem(KEY,'1')}catch{}
const overlay=document.createElement('div');overlay.id='soulMaterialize';overlay.setAttribute('aria-hidden','true');
overlay.innerHTML='<canvas></canvas><img class="soul-intro-logo" src="assets/soul-brand-original.png" alt="" style="display:none">';
document.body.appendChild(overlay);document.body.classList.add('soul-intro');
const canvas=overlay.querySelector('canvas'),ctx=canvas.getContext('2d',{alpha:false}),logo=overlay.querySelector('img');
if(!ctx){overlay.remove();document.body.classList.remove('soul-intro');return}
let w,h,scale,particles=[],targets=[];const TAU=Math.PI*2,duration=5300,start=performance.now();let done=false;
function resize(){w=innerWidth;h=innerHeight;scale=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.floor(w*scale);canvas.height=Math.floor(h*scale);ctx.setTransform(scale,0,0,scale,0,0);
const count=Math.min(5200,Math.max(2600,Math.floor(w*h/360)));particles=Array.from({length:count},()=>({angle:Math.random()*TAU,rad:Math.hypot(w,h)*(.2+Math.random()*.75),speed:.6+Math.random()*1.1,size:.6+Math.random()*2.9,seed:Math.random(),drift:Math.random()*TAU}));
// Sample the actual emblem outline from a dedicated vector-like canvas.
const contour=document.createElement('canvas');contour.width=500;contour.height=500;
const c=contour.getContext('2d',{willReadFrequently:true});
if(c){
 c.strokeStyle='#fff';c.lineWidth=5;c.lineCap='round';c.lineJoin='round';
 c.beginPath();c.moveTo(250,390);c.lineTo(74,270);c.lineTo(74,113);
 c.bezierCurveTo(74,55,112,51,152,73);
 c.bezierCurveTo(198,97,229,132,250,164);
 c.bezierCurveTo(271,132,302,97,348,73);
 c.bezierCurveTo(388,51,426,55,426,113);
 c.lineTo(426,270);c.closePath();c.stroke();
 c.beginPath();c.moveTo(250,390);c.bezierCurveTo(244,299,233,215,250,164);c.stroke();
 c.beginPath();c.arc(250,35,24,0,TAU);c.stroke();
 const data=c.getImageData(0,0,500,500).data;
 targets=[];
 for(let y=6;y<492;y+=3)for(let x=6;x<492;x+=3){
  if(data[(y*500+x)*4+3]>70)targets.push([x/500-.5,y/500-.5]);
 }
}

}

function finish(){if(done)return;done=true;document.body.classList.remove('soul-intro');overlay.classList.add('done');setTimeout(()=>overlay.remove(),700)}
logo.onload=resize;resize();window.addEventListener('resize',resize,{passive:true});
const ease=t=>t*t*(3-2*t);
function frame(now){if(done)return;const t=Math.min(1,(now-start)/duration),cx=w/2,cy=h/2,sz=Math.min(w*.49,h*.68,450);
ctx.fillStyle='#020817';ctx.fillRect(0,0,w,h);
const g=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(w,h)*.65);g.addColorStop(0,'#0a3553');g.addColorStop(.5,'#06162c');g.addColorStop(1,'#020817');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
const gathering=ease(Math.max(0,Math.min(1,(t-.28)/.42)));const dispersing=ease(Math.max(0,Math.min(1,(t-.84)/.13)));
ctx.globalCompositeOperation='lighter';
// Soft cosmic nebula arms, without any hard rings or white outlines.
for(let arm=0;arm<3;arm++){
 const ang=t*2.7+arm*2.094;
 const px=cx+Math.cos(ang)*w*.19,py=cy+Math.sin(ang)*h*.16;
 const neb=ctx.createRadialGradient(px,py,0,px,py,Math.min(w,h)*.47);
 neb.addColorStop(0,`rgba(24,115,205,${.09*(1-t*.5)})`);
 neb.addColorStop(.48,'rgba(15,67,154,.035)');neb.addColorStop(1,'rgba(4,25,70,0)');
 ctx.fillStyle=neb;ctx.fillRect(0,0,w,h);
}
for(let i=0;i<particles.length;i++){const p=particles[i],a=p.angle+(t*9)*p.speed,rad=p.rad*(1-t*.68),swirlX=cx+Math.cos(a+rad*.002)*rad,swirlY=cy+Math.sin(a+rad*.002)*rad*.62;
const target=targets.length?targets[(i*67)%targets.length]:[(p.seed-.5)*.25,(p.seed-.5)*.25];
const haze=16+27*p.seed;const tx=cx+target[0]*sz+Math.cos(p.drift+t*2.1)*haze,ty=cy+target[1]*sz+Math.sin(p.drift+t*1.7)*haze;
let x=swirlX+(tx-swirlX)*gathering,y=swirlY+(ty-swirlY)*gathering;
x+=(x-cx)*dispersing*2.2;y+=(y-cy)*dispersing*2.2;
const alpha=(.13+.23*p.seed+.12*gathering)*(1-dispersing);
// Thousands of tiny stars make the galaxy; only a fraction get costly soft halos.
ctx.fillStyle=`rgba(${Math.round(70+75*p.seed)},${Math.round(160+70*p.seed)},255,${alpha})`;
ctx.beginPath();ctx.arc(x,y,p.size*(.45+.22*gathering),0,TAU);ctx.fill();
if(i%17===0){const radius=p.size*(4+gathering*2);const halo=ctx.createRadialGradient(x,y,0,x,y,radius);
halo.addColorStop(0,`rgba(82,213,255,${alpha*.26})`);halo.addColorStop(1,'rgba(25,90,180,0)');
ctx.fillStyle=halo;ctx.beginPath();ctx.arc(x,y,radius,0,TAU);ctx.fill();}}
ctx.globalCompositeOperation='source-over';
if(t>.59){ctx.globalAlpha=Math.min(1,(t-.59)/.20)*(1-dispersing);if(logo.complete&&logo.naturalWidth){const rw=Math.min(w*.55,h*.68,480),rh=rw*logo.naturalHeight/logo.naturalWidth;ctx.shadowColor='#27caff';ctx.shadowBlur=12;ctx.drawImage(logo,cx-rw/2,cy-rh/2,rw,rh);ctx.shadowBlur=0;}ctx.globalAlpha=1;}
if(t>.76){const f=(t-.76)/.24;overlay.style.opacity=String(Math.max(0,1-ease(f)));if(t>.83)document.body.classList.remove('soul-intro');}
if(t<1)requestAnimationFrame(frame);else finish()}
requestAnimationFrame(frame);window.addEventListener('pagehide',finish,{once:true});setTimeout(finish,7000);
})();