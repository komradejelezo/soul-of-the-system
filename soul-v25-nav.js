(()=>{'use strict';if(document.getElementById('soul-v25-header'))return;
const sub=location.pathname.includes('/cases/'),base=sub?'../':'',home=/\/(?:index\.html)?$/.test(location.pathname);
const links=[['Главная','index.html'],['Проекты','projects.html'],['Музей','museum.html'],['Услуги','index.html#services'],['Команда','index.html#team'],['Контакты','index.html#contacts']];
const header=document.createElement('header');header.id='soul-v25-header';header.setAttribute('aria-label','Навигация по сайту');
const brand=document.createElement('a');brand.className='soul-nav-brand';brand.href=base+'index.html';brand.innerHTML='<img src="'+base+'assets/soul-brand-original.png" alt=""><span>SOUL OF THE SYSTEM</span>';header.appendChild(brand);
const items=document.createElement('nav');items.className='soul-nav-items';for(const [name,url] of links){const a=document.createElement('a');a.href=base+url;a.textContent=name;if(!url.includes('#')&&location.pathname.endsWith('/'+url))a.classList.add('active');items.appendChild(a)}header.appendChild(items);
// Persist the originating homepage position before leaving for any subpage.
const HOME_POS='soul-home-position-v30';
const getSaved=()=>{try{return JSON.parse(sessionStorage.getItem(HOME_POS)||'null')}catch{return null}};
if(home){
  const save=()=>{try{const sections=[...document.querySelectorAll('section[id],footer[id]')];let section='';for(const el of sections){if(el.getBoundingClientRect().top<innerHeight*.48)section=el.id}sessionStorage.setItem(HOME_POS,JSON.stringify({y:window.scrollY,section,time:Date.now()}))}catch{}};
  document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a)return;const dest=new URL(a.href,location.href);if(dest.pathname!==location.pathname&&dest.origin===location.origin)save()},true);
  window.addEventListener('pagehide',save);
  // Explicit return marker avoids browser native scroll restoration racing our code.
  const params=new URLSearchParams(location.search);
  if(params.has('soulReturn')){
    const p=getSaved();if(p&&Date.now()-p.time<86400000){
      if('scrollRestoration' in history)history.scrollRestoration='manual';
      const restore=()=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,p.y||0);document.documentElement.style.scrollBehavior=''};
      restore();document.addEventListener('DOMContentLoaded',restore,{once:true});
      window.addEventListener('load',()=>{restore();setTimeout(restore,100);setTimeout(restore,350);setTimeout(restore,850)},{once:true});
    }
    history.replaceState(history.state,'',location.pathname+location.hash);
  }
}
if(!home){
 const back=document.createElement('a');back.className='soul-nav-back';back.textContent='← Назад';
 const saved=getSaved();back.href=base+'index.html?soulReturn=1';
 // If the visitor arrived from another page, browser history remains a useful fallback.
 back.addEventListener('click',()=>{try{sessionStorage.setItem('soul-v25-intro-seen','1')}catch{}});
 header.appendChild(back);
}
document.body.prepend(header);
// When clicking a hash target on the homepage, scroll even if URL already has that hash.
header.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a)return;const url=new URL(a.href,location.href);if(url.pathname!==location.pathname||!url.hash)return;const target=document.getElementById(decodeURIComponent(url.hash.slice(1)));if(target){e.preventDefault();history.pushState(null,'',url.hash);target.scrollIntoView({behavior:'smooth',block:'start'});}});
if(location.hash){const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(target)requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));}
})();