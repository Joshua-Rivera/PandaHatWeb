let isPaused=matchMedia('(prefers-reduced-motion: reduce)').matches;
const pause=document.querySelector('#pause-all');
function setPause(){document.body.classList.toggle('paused',isPaused);pause.textContent=isPaused?'Resume motion':'Pause all';pause.setAttribute('aria-pressed',String(isPaused));}
pause.addEventListener('click',()=>{isPaused=!isPaused;setPause();});setPause();
function expand(article){const d=article.querySelector('.demo-expand');d.classList.toggle('open');const open=d.classList.contains('open');d.querySelector('button').setAttribute('aria-expanded',String(open));d.querySelector('button span').textContent=open?'−':'+';}
document.querySelectorAll('[data-play]').forEach(button=>button.addEventListener('click',()=>{const article=button.closest('article');if(article.querySelector('.demo-expand')){expand(article);return;}article.classList.remove('playing');void article.offsetWidth;article.classList.add('playing');}));
document.querySelector('.sample-question').addEventListener('click',e=>expand(e.target.closest('article')));
document.querySelector('.mini-member').addEventListener('click',e=>{const article=e.target.closest('article');article.classList.remove('playing');void article.offsetWidth;article.classList.add('playing');});
