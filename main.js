import { supabase, OWNER_EMAIL, STORAGE_BUCKET } from './supabase.js';
import './style.css';

const starter = {
  profile: {
    name: 'Prarthana Pradhan',
    role: 'Aerospace Engineering Student',
    tagline: 'Exploring the engineering behind flight, propulsion and space.',
    location: 'India',
    about: 'I am an aerospace engineering student interested in the science and engineering of flight and space exploration. My interests include aerodynamics, propulsion, aircraft systems, aerospace structures, orbital mechanics and simulation. I enjoy turning theoretical concepts into practical projects and visual tools.',
    photo: '', resume: '', availability: 'Open to learning opportunities and technical collaborations.'
  },
  highlights: [
    { label: 'Discipline', value: 'Aerospace Engineering' },
    { label: 'Focus', value: 'Flight · Propulsion · Space' },
    { label: 'Approach', value: 'Learn · Build · Analyse' }
  ],
  skills: [
    { category: 'Programming & Computing', items: 'Python, MATLAB, Arduino IDE, C/C++ fundamentals' },
    { category: 'Aerospace & Analysis', items: 'Orbital Mechanics, Aircraft Performance, Rocket Propulsion, Aircraft Systems' },
    { category: 'CAD & Simulation', items: 'SimScale, MATLAB/Simulink, 3D modelling fundamentals' },
    { category: 'Electronics & Instrumentation', items: 'ESP32, ADXL345, Sensor Integration, Data Acquisition' },
    { category: 'Tools & Workflow', items: 'Git, GitHub, Technical Documentation, Canva' }
  ],
  projects: [
    { title: 'Orbit Visualizer', category: 'Astrodynamics', description: 'A 2D/3D orbit visualizer using classical orbital elements and the two-body model to represent satellite trajectories around Earth.', tags: ['Orbital Mechanics', 'Python', '3D Visualization'], source: '', demo: '', image: '' },
    { title: 'Engine Vibration Measurement', category: 'Instrumentation', description: 'An accelerometer-based measurement system using an ADXL345 and ESP32 to record three-axis acceleration and study vibration in time and frequency domains.', tags: ['ESP32', 'ADXL345', 'FFT'], source: '', demo: '', image: '' },
    { title: 'Blue Ninja Rocket Fin Analysis', category: 'Aerospace Structures', description: 'A simulation workflow exploring rocket-fin geometry, material definition, boundary conditions and structural/flow analysis using engineering simulation tools.', tags: ['Rocketry', 'SimScale', 'FEM / CFD'], source: '', demo: '', image: '' },
    { title: 'Rocket Nozzle Study', category: 'Propulsion', description: 'A study of convergent-divergent nozzle geometry, compressible flow behaviour and the governing relations used in rocket propulsion.', tags: ['Rocket Propulsion', 'Nozzle Design'], source: 'https://github.com/prarthanapradhan2005-ux/rocket-nozzle', demo: '', image: '' }
  ],
  builds: [],
  experience: [],
  certificates: [
    { title: 'Airbus Aircraft Fitter', issuer: 'Airbus', date: '', file: '', credential: '' },
    { title: 'Fundamentals of Remote Sensing', issuer: 'NASA ARSET', date: '', file: '', credential: '' },
    { title: 'MATLAB Onramp', issuer: 'MathWorks', date: '', file: '', credential: '' },
    { title: 'India Space Lab Internship', issuer: 'India Space Lab', date: '', file: '', credential: '' },
    { title: 'NASA Open Science Essentials', issuer: 'NASA', date: '', file: '', credential: '' }
  ],
  articles: [],
  posts: [],
  links: {
    github: 'https://github.com/prarthanapradhan2005-ux',
    linkedin: 'https://www.linkedin.com/in/prarthana-pradhan-682643310/',
    email: 'prarthanapradhan2005@gmail.com',
    instagram: 'https://www.instagram.com/_somewhereenchanted/'
  }
};

let content = structuredClone(starter);
let session = null;
let busy = false;
const app = document.querySelector('#app');
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url = value => /^https?:\/\//i.test(value || '') ? value : '';
const arr = value => Array.isArray(value) ? value : [];
const merge = data => ({ ...structuredClone(starter), ...data, profile: { ...starter.profile, ...(data?.profile || {}) }, links: { ...starter.links, ...(data?.links || {}) } });
const anchor = (href, label, cls='text-link') => url(href) ? `<a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${label}</a>` : '';

// Animated constellation layer: intentionally subtle and respects reduced-motion settings.
function initConstellation() {
  const canvas = document.querySelector('#constellation');
  const ctx = canvas.getContext('2d');
  let w=0,h=0,pts=[],raf=0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resize(){ w=canvas.width=innerWidth*devicePixelRatio; h=canvas.height=innerHeight*devicePixelRatio; canvas.style.width=innerWidth+'px'; canvas.style.height=innerHeight+'px'; const count=Math.min(105,Math.floor(innerWidth/13)); pts=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.16*devicePixelRatio,vy:(Math.random()-.5)*.16*devicePixelRatio,r:(Math.random()*1.25+.35)*devicePixelRatio,p:Math.random()*Math.PI*2})); }
  function draw(t=0){ ctx.clearRect(0,0,w,h); const max=150*devicePixelRatio; for(let i=0;i<pts.length;i++){const p=pts[i]; if(!reduced){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;} const glow=.42+.28*Math.sin(t*.0007+p.p);ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(205,220,255,${glow})`;ctx.fill();for(let j=i+1;j<pts.length;j++){const q=pts[j],dx=p.x-q.x,dy=p.y-q.y,d=Math.hypot(dx,dy);if(d<max){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(126,158,214,${(1-d/max)*.16})`;ctx.lineWidth=devicePixelRatio;ctx.stroke();}}} if(!reduced)raf=requestAnimationFrame(draw); }
  resize(); draw(); addEventListener('resize',()=>{cancelAnimationFrame(raf);resize();draw();});
}

async function loadContent(){ if(!supabase)return; const {data,error}=await supabase.from('portfolio_content').select('content').eq('id',1).maybeSingle(); if(!error&&data?.content)content=merge(data.content); }
function sectionTitle(kicker,title,desc=''){return `<div class="section-heading"><span class="eyebrow">${esc(kicker)}</span><h2>${title}</h2>${desc?`<p>${esc(desc)}</p>`:''}</div>`;}
function renderPublic(){
  const p=content.profile, links=content.links||{};
  app.innerHTML=`
  <header class="site-header"><a class="wordmark" href="#home">PP<span>✳</span></a><nav class="desktop-nav"><a href="#about">About</a><a href="#projects">Projects</a><a href="#builds">Builds</a><a href="#skills">Skills</a><a href="#experience">Experience</a><a href="#certificates">Certificates</a><a href="#writing">Blog</a><a href="#articles">Articles</a><a href="#resume">Resume</a></nav><a class="nav-contact" href="#contact">Let's connect <span>↗</span></a><button class="menu-toggle" id="menu-toggle" aria-label="Toggle navigation">☰</button></header>
  <main id="home">
    <section class="hero wrap"><div class="hero-copy"><div class="status-line"><span class="status-dot"></span>${esc(p.availability||'Aerospace engineering · curiosity in motion')}</div><p class="eyebrow">PORTFOLIO / 2026—PRESENT</p><h1>Prarthana<br><span>Pradhan.</span></h1><h2>${esc(p.role)}</h2><p class="hero-intro">${esc(p.tagline)}</p><div class="hero-actions">${p.resume?anchor(p.resume,'View resume ↗','btn btn-primary'):''}<a class="btn btn-quiet" href="#projects">Explore my work <span>↓</span></a></div><div class="hero-social">${anchor(links.github,'GitHub ↗')}${anchor(links.linkedin,'LinkedIn ↗')}${anchor('mailto:'+links.email,'Email ↗')}</div></div><div class="hero-visual"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="orbit-core">${p.photo?`<img src="${esc(url(p.photo))}" alt="Portrait of Prarthana Pradhan">`:'<span>PP</span>'}</div><span class="orbit-label label-a">AEROSPACE</span><span class="orbit-label label-b">ENGINEERING</span><span class="orbit-star">✦</span></div><div class="scroll-cue">SCROLL TO EXPLORE <span>↓</span></div></section>
    <section id="about" class="wrap section-block">${sectionTitle('01 / INTRODUCTION','A little about me','Curiosity is where every good engineering question begins.')}<div class="about-grid"><div class="about-mark">PP<span>✳</span></div><div><p class="about-copy">${esc(p.about)}</p><p class="muted-line">${esc(p.location)} · ${esc(p.availability)}</p><div class="highlight-grid">${arr(content.highlights).map(x=>`<div class="highlight"><span>${esc(x.label)}</span><b>${esc(x.value)}</b></div>`).join('')}</div></div></div></section>
    <section id="projects" class="wrap section-block">${sectionTitle('02 / SELECTED WORK','Projects & explorations','A collection of engineering work, simulations and things I have built.')}<div class="project-grid">${arr(content.projects).map((x,i)=>`<article class="project-card"><div class="project-top"><span>0${i+1} / ${esc(x.category||'PROJECT')}</span><span class="project-symbol">↗</span></div>${url(x.image)?`<div class="project-image"><img src="${esc(x.image)}" alt="${esc(x.title)} preview" loading="lazy"></div>`:''}<h3>${esc(x.title)}</h3><p>${esc(x.description)}</p><div class="tags">${arr(x.tags).map(t=>`<span>${esc(t)}</span>`).join('')}</div><div class="project-links">${anchor(x.source,'Source code ↗')}${anchor(x.demo,'Live demo ↗')}</div></article>`).join('')}</div></section>
    <section id="builds" class="wrap section-block">${sectionTitle('03 / TECHNICAL BUILDS','Simulations & technical builds','Interactive tools, prototypes and engineering experiments.')}<div class="writing-grid">${arr(content.builds).map(x=>`<article class="writing-card"><span class="eyebrow">${esc(x.category||'BUILD')}</span><h3>${esc(x.title)}</h3><p>${esc(x.description||'')}</p>${anchor(x.source,'Source code ↗')}${anchor(x.demo,'Open build ↗')}</article>`).join('')||'<p class="empty-note">Technical builds and interactive simulations will appear here.</p>'}</div></section>
    <section id="skills" class="wrap section-block">${sectionTitle('04 / TOOLKIT','Skills & technologies','Tools and concepts I use while learning, analysing and building.')}<div class="skill-grid">${arr(content.skills).map((s,i)=>`<article class="skill-card"><span class="skill-index">0${i+1}</span><h3>${esc(s.category||s[0])}</h3><p>${esc(s.items||s[1])}</p></article>`).join('')}</div></section>
    <section id="experience" class="wrap section-block">${sectionTitle('05 / JOURNEY','Experience & involvement','Learning through projects, teams and technical communities.')}<div class="timeline">${arr(content.experience).length?arr(content.experience).map(x=>`<article class="timeline-item"><span class="timeline-date">${esc(x.date||'')}</span><div><h3>${esc(x.title)}</h3><p class="timeline-org">${esc(x.organization||'')}</p><p>${esc(x.description||'')}</p></div></article>`).join(''):'<p class="empty-note">New experiences and activities will be added here.</p>'}</div></section>
    <section id="certificates" class="wrap section-block">${sectionTitle('06 / CREDENTIALS','Certificates & learning','Courses, training and milestones along the way.')}<div class="certificate-list">${arr(content.certificates).map((c,i)=>`<article class="certificate-row"><span class="cert-no">0${i+1}</span><div class="cert-main"><h3>${esc(c.title)}</h3><p>${esc(c.issuer||'')}${c.date?' · '+esc(c.date):''}</p></div><div class="cert-action">${c.file?anchor(c.file,'View PDF ↗'):c.credential?anchor(c.credential,'Credential ↗'):'<span class="muted-line">Details soon</span>'}</div></article>`).join('')}</div></section>
    <section id="writing" class="wrap section-block">${sectionTitle('07 / JOURNAL','Blog & technical notes','Project journals, learning notes and reflections.')}<div class="writing-grid">${arr(content.posts).map(x=>`<article class="writing-card"><span class="eyebrow">${esc(x.date||'JOURNAL')}</span><h3>${esc(x.title)}</h3><p>${esc(x.description||'')}</p>${anchor(x.url,'Read post ↗')}</article>`).join('')||'<p class="empty-note">Blog posts will appear here as you publish them.</p>'}</div></section>
    <section id="articles" class="wrap section-block">${sectionTitle('08 / PUBLICATIONS','Published articles','Articles, contributions and external publications.')}<div class="writing-grid">${arr(content.articles).map(x=>`<article class="writing-card"><span class="eyebrow">${esc(x.publisher||x.type||'PUBLICATION')} ${x.date?'· '+esc(x.date):''}</span><h3>${esc(x.title)}</h3><p>${esc(x.description||'')}</p>${anchor(x.url,'View publication ↗')}</article>`).join('')||'<p class="empty-note">Published articles and contributions will appear here.</p>'}</div></section>
    <section id="resume" class="wrap resume-band"> <div><span class="eyebrow">07 / THE DETAILS</span><h2>Want the full picture?</h2><p>Explore my experience, education and technical background in my resume.</p></div>${p.resume?anchor(p.resume,'Download resume ↗','btn btn-primary'): '<span class="muted-line">Resume will be available here soon.</span>'}</section>
    <section id="contact" class="wrap contact-section">${sectionTitle('08 / SAY HELLO','Let’s connect.','Have an opportunity, a project idea or an interesting aerospace question?')}<a class="email-link" href="mailto:${esc(links.email)}">${esc(links.email)} <span>↗</span></a><div class="contact-social">${anchor(links.github,'GitHub ↗')}${anchor(links.linkedin,'LinkedIn ↗')}${anchor(links.instagram,'Instagram ↗')}</div></section>
  </main><footer class="site-footer"><span>© ${new Date().getFullYear()} ${esc(p.name)}.</span><span>Designed with curiosity <b>✳</b></span><a href="#admin">Owner access</a></footer>`;
  document.querySelector('#menu-toggle')?.addEventListener('click',()=>document.querySelector('.desktop-nav')?.classList.toggle('nav-open'));
}
async function renderAdmin(){
  app.innerHTML=`<header class="site-header admin-header"><a class="wordmark" href="#">PP<span>✳</span></a><a href="#" class="text-link">← Public portfolio</a></header><main class="admin-wrap"><div class="admin-intro"><span class="eyebrow">PRIVATE / OWNER ONLY</span><h1>Portfolio dashboard<span>.</span></h1><p>Manage the information displayed on your public portfolio. Changes are published when you save.</p></div><div class="admin-panel" id="authbox">${session?`<div class="signed-row"><div><span class="eyebrow">AUTHENTICATED OWNER</span><b>${esc(session.user.email)}</b></div><button class="btn btn-outline" id="signout">Sign out</button></div><div id="editor"></div>`:`<form id="login-form" class="login-form"><label>Email address<input id="email" type="email" value="${OWNER_EMAIL}" autocomplete="username" required></label><label>Password<input id="password" type="password" autocomplete="current-password" required></label><button class="btn btn-primary" type="submit">Sign in to dashboard ↗</button><p class="form-note">There is no public sign-up. Only the pre-authorized owner account can sign in.</p></form>`}</div>${!supabase?'<p class="warning">Supabase is not configured. Follow the setup guide in README before deploying.</p>':''}</main>`;
  if(!supabase)return;
  document.querySelector('#login-form')?.addEventListener('submit',async e=>{e.preventDefault();const email=document.querySelector('#email').value.trim().toLowerCase(),password=document.querySelector('#password').value;if(email!==OWNER_EMAIL)return alert('This account is not authorized.');const {error}=await supabase.auth.signInWithPassword({email,password});if(error)return alert(error.message);await refresh();});
  document.querySelector('#signout')?.addEventListener('click',async()=>{await supabase.auth.signOut();session=null;renderAdmin();});
  if(session?.user?.email?.toLowerCase()===OWNER_EMAIL)renderEditor();else if(session){await supabase.auth.signOut();session=null;renderAdmin();}
}
const fields=[['Profile JSON','profile'],['Highlights JSON','highlights'],['Skills JSON','skills'],['Projects JSON','projects'],['Technical builds JSON','builds'],['Experience JSON','experience'],['Certificates JSON','certificates'],['Articles JSON','articles'],['Blog posts JSON','posts'],['Social links JSON','links']];
function renderEditor(){
  const el=document.querySelector('#editor');if(!el)return;
  el.innerHTML=`<div class="dashboard-heading"><div><span class="eyebrow">CONTENT MANAGEMENT</span><h2>Edit your portfolio</h2><p>Update a section, upload a public file, then save and publish.</p></div><span class="secure-pill">● Owner access verified</span></div>
  <div class="upload-panel"><h3>Upload a file</h3><p>Upload your profile photo, resume or certificate PDF. The file becomes publicly viewable; only your signed-in account can upload or remove files.</p><div class="upload-controls"><select id="upload-kind"><option value="documents">Resume / certificate PDF</option><option value="images">Profile or project image</option></select><input id="upload-file" type="file" accept=".pdf,image/*"><button id="upload-btn" class="btn btn-outline">Upload file</button></div><p id="upload-result" class="form-note"></p></div>
  <div class="editor-grid">${fields.map(([label,key])=>`<label class="json-field"><span>${label}</span><textarea id="field-${key}" spellcheck="false">${esc(JSON.stringify(content[key],null,2))}</textarea></label>`).join('')}</div>
  <div class="save-row"><button class="btn btn-primary" id="save">Save & publish changes ↗</button><span id="save-status" class="form-note"></span></div>`;
  document.querySelector('#save').addEventListener('click',saveContent);
  document.querySelector('#upload-btn').addEventListener('click',uploadFile);
}
async function uploadFile(){
  const input=document.querySelector('#upload-file'),file=input.files?.[0],kind=document.querySelector('#upload-kind').value,out=document.querySelector('#upload-result');
  if(!file){out.textContent='Choose a file first.';return;} if(file.size>15*1024*1024){out.textContent='Maximum file size is 15 MB.';return;}
  const isImage=file.type.startsWith('image/'),isPdf=file.type==='application/pdf';if((kind==='images'&&!isImage)||(kind==='documents'&&!isPdf)){out.textContent=kind==='images'?'Choose an image file.':'Choose a PDF file.';return;}
  const path=`${kind}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,'-')}`;out.textContent='Uploading…';
  const {error}=await supabase.storage.from(STORAGE_BUCKET).upload(path,file,{upsert:false,contentType:file.type});if(error){out.textContent=`Upload failed: ${error.message}`;return;}
  const {data}=supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);out.innerHTML=`Uploaded. Public URL: <code>${esc(data.publicUrl)}</code>`;
  try{await navigator.clipboard.writeText(data.publicUrl);out.textContent+=' (URL copied)';}catch{}
}
async function saveContent(){
  const status=document.querySelector('#save-status');if(busy)return;busy=true;status.textContent='Saving…';
  try{const updated={};for(const [label,key] of fields){try{updated[key]=JSON.parse(document.querySelector(`#field-${key}`).value);}catch(e){throw new Error(`${label} has invalid JSON: ${e.message}`);}}
    if(!updated.profile?.name||!Array.isArray(updated.projects)||!Array.isArray(updated.certificates))throw new Error('Check that profile, projects and certificates have the correct structure.');
    const next=merge(updated);const {error}=await supabase.from('portfolio_content').upsert({id:1,content:next,updated_at:new Date().toISOString()});if(error)throw error;content=next;status.textContent='Saved and published successfully.';
  }catch(e){status.textContent=`Not saved: ${e.message}`;}finally{busy=false;}
}
async function refresh(){if(supabase){const {data}=await supabase.auth.getSession();session=data.session;await loadContent();}if(location.hash==='#admin')renderAdmin();else renderPublic();}
window.addEventListener('hashchange',refresh);
if(supabase)supabase.auth.onAuthStateChange((_event,next)=>{session=next;});
initConstellation();refresh();
