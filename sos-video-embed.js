(() => {
  'use strict';
  document.querySelectorAll('.sos-video-launch[data-video-id]').forEach(button => {
    button.addEventListener('click', () => {
      const id=button.dataset.videoId;
      if(!/^[A-Za-z0-9_-]{11}$/.test(id))return;
      const iframe=document.createElement('iframe');
      iframe.src='https://www.youtube.com/embed/'+id+'?autoplay=1&rel=0';
      iframe.title=button.getAttribute('aria-label')||'Видеоотзыв';
      iframe.allow='autoplay; encrypted-media; picture-in-picture; web-share';
      iframe.referrerPolicy='strict-origin-when-cross-origin';
      iframe.allowFullscreen=true;
      button.replaceWith(iframe);
    },{once:true});
  });
})();
