const questions = [
  {
    title:"What can we trust in a digital image?",
    label:"Image authenticity",
    status:"Ongoing research",
    summary:"A flexible home for watermarking, deepfake detection, manipulation localization, and future authenticity work.",
    context:"The question is broader than any single detector. The goal is to understand what evidence survives transformation, what a model can reliably detect, and where uncertainty remains.",
    methods:["Watermark robustness","Paired real/fake evaluation","Localization and mask comparison","Transformation stress tests"],
    endpoint:"research/image-authenticity"
  },
  {
    title:"Where does a model break?",
    label:"Adversarial learning",
    status:"Experimental track",
    summary:"A place for perturbations, poisoning, backdoors, transfer attacks, and other failure-oriented experiments.",
    context:"Clean accuracy is only one operating condition. This question focuses on what changes when the input, training process, or assumptions are deliberately stressed.",
    methods:["Perturbation sweeps","Training-data corruption","Transfer testing","Class-level failure analysis"],
    endpoint:"research/model-robustness"
  },
  {
    title:"How do images help us understand a landscape?",
    label:"Learning from the world",
    status:"Documented baseline",
    summary:"Existing remote-sensing work becomes one documented thread inside a larger research identity.",
    context:"This track connects RGB imagery, vegetation labels, baseline models, and reproducible evaluation while keeping the project framed as one question among many.",
    methods:["Baseline modeling","Class construction","Checkpointed evaluation","Imbalance analysis"],
    endpoint:"research/living-landscapes"
  },
  {
    title:"What should PandaHat investigate next?",
    label:"Open question",
    status:"Ready to evolve",
    summary:"A permanent open slot makes future directions feel native instead of appended after the fact.",
    context:"New work can replace this card without changing the overall site architecture. The identity stays anchored to the research process, not to one semester topic.",
    methods:["Define the question","Collect evidence","Design the experiment","Document limitations"],
    endpoint:"research/next-question"
  }
];

const members = [
  {initials:"PM",name:"Member name",role:"PM",bio:"Project direction, coordination, and research ownership."},
  {initials:"CP",name:"Member name",role:"Co-PM",bio:"Research planning, collaboration, and technical coordination."},
  {initials:"M1",name:"Member name",role:"Member",bio:"Research interests, current question, or contribution can go here."},
  {initials:"M2",name:"Member name",role:"Member",bio:"Research interests, current question, or contribution can go here."},
  {initials:"M3",name:"Member name",role:"Member",bio:"Research interests, current question, or contribution can go here."},
  {initials:"AD",name:"Advisor name",role:"Advisor",bio:"Research guidance, mentorship, and academic context."}
];

const list=document.querySelector('#questionList');
const memberGrid=document.querySelector('#memberGrid');

list.innerHTML=questions.map((q,i)=>`<article class="question" data-index="${i}">
  <button class="question-trigger" type="button" aria-expanded="false">
    <span class="question-number">Q${String(i+1).padStart(2,'0')}</span>
    <h3>${q.title}</h3>
    <span class="question-meta"><span>${q.label}</span><span>${q.status}</span></span>
    <span class="question-arrow" aria-hidden="true">↘</span>
  </button>
  <div class="question-panel"><div class="question-panel-inner"><div class="question-detail">
    <p>${q.context}</p>
    <div class="detail-grid">
      <div><h4>Current structure</h4><ul>${q.methods.map(m=>`<li>${m}</li>`).join('')}</ul></div>
      <div><h4>Endpoint</h4><p>${q.summary}</p><a class="endpoint-link" href="#" onclick="return false">${q.endpoint} ↗</a></div>
    </div>
  </div></div></div>
</article>`).join('');

list.addEventListener('click',e=>{
  const trigger=e.target.closest('.question-trigger'); if(!trigger) return;
  const q=trigger.closest('.question'); const open=q.classList.contains('open');
  document.querySelectorAll('.question.open').forEach(el=>{if(el!==q){el.classList.remove('open');el.querySelector('.question-trigger').setAttribute('aria-expanded','false')}});
  q.classList.toggle('open',!open); trigger.setAttribute('aria-expanded',String(!open));
});

memberGrid.innerHTML=members.map(m=>`<article class="member-card reveal">
  <div class="member-portrait" data-initials="${m.initials}" aria-label="Portrait placeholder for ${m.name}"></div>
  <div class="member-info"><h3>${m.name}</h3><span class="role-pill">${m.role}</span></div>
  <p>${m.bio}</p>
</article>`).join('');

const collageSection=document.querySelector('.collage-scroll');
const cards=[...document.querySelectorAll('.collage-card')];
const startCopy=document.querySelector('.center-copy-start');
const revealCopy=document.querySelector('.center-copy-reveal');
const header=document.querySelector('.site-header');
const progressBar=document.querySelector('#progressBar');
let raf=0, paused=false;
const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));
const mix=(a,b,t)=>a+(b-a)*t;
const smooth=t=>t*t*(3-2*t);

function updateScroll(){
  raf=0;
  const docMax=document.documentElement.scrollHeight-innerHeight;
  progressBar.style.width=`${docMax?scrollY/docMax*100:0}%`;
  header.classList.toggle('scrolled',scrollY>20);
  if(paused || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const rect=collageSection.getBoundingClientRect();
  const span=collageSection.offsetHeight-innerHeight;
  const raw=clamp((-rect.top)/Math.max(span,1));
  const p=smooth(clamp((raw-.03)/.74));
  cards.forEach((card,i)=>{
    const sx=+card.dataset.sx, sy=+card.dataset.sy, sr=+card.dataset.sr;
    const ex=+card.dataset.ex, ey=+card.dataset.ey, er=+card.dataset.er;
    const scale=(innerWidth<720?.58:innerWidth<1050?.78:1);
    const local=clamp(p + (i%3)*.015);
    const x=mix(sx,ex,local)*scale, y=mix(sy,ey,local)*scale, r=mix(sr,er,local);
    const lift=1+Math.sin(local*Math.PI)*.04;
    card.style.transform=`translate(-50%,-50%) translate(${x}px,${y}px) rotate(${r}deg) scale(${lift})`;
  });
  const wordFade=clamp((raw-.13)/.22);
  startCopy.style.opacity=String(1-wordFade);
  startCopy.style.transform=`translate(-50%,-50%) scale(${1-wordFade*.08})`;
  const reveal=clamp((raw-.29)/.24);
  revealCopy.style.opacity=String(reveal);
  revealCopy.style.transform=`translate(-50%,${mix(-44,-50,reveal)}%) scale(${mix(.94,1,reveal)})`;
  revealCopy.style.pointerEvents=reveal>.7?'auto':'none';
}

addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(updateScroll)},{passive:true});
addEventListener('resize',()=>{if(!raf)raf=requestAnimationFrame(updateScroll)});
updateScroll();

const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

const themeToggle=document.querySelector('#themeToggle');
const themeLabel=document.querySelector('#themeLabel');
const savedTheme=localStorage.getItem('pandahat-theme');
if(savedTheme){document.body.dataset.theme=savedTheme;themeLabel.textContent=savedTheme==='signal'?'Signal':'Fieldnotes'}
themeToggle.addEventListener('click',()=>{
  const next=document.body.dataset.theme==='fieldnotes'?'signal':'fieldnotes';
  document.body.dataset.theme=next; themeLabel.textContent=next==='signal'?'Signal':'Fieldnotes'; localStorage.setItem('pandahat-theme',next);
});

document.querySelector('#motionToggle').addEventListener('click',e=>{
  paused=!paused; document.body.classList.toggle('motion-paused',paused); e.currentTarget.textContent=paused?'Resume motion':'Pause motion'; e.currentTarget.setAttribute('aria-pressed',String(paused));
  if(!paused) updateScroll();
});
