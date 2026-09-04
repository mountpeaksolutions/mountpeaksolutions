const menu=document.querySelector('.menu'),nav=document.querySelector('.nav');menu?.addEventListener('click',()=>{nav.style.display=nav.style.display==='flex'?'none':'flex';nav.style.position='absolute';nav.style.top='78px';nav.style.left='0';nav.style.right='0';nav.style.padding='18px 6%';nav.style.background='#171025';nav.style.flexDirection='column';nav.style.boxShadow='0 15px 30px #00000055'});nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{if(innerWidth<=900)nav.style.display='none'}));
const search=document.getElementById('jobSearch'),type=document.getElementById('jobType');function filterJobs(){const q=(search.value||'').toLowerCase(),t=(type.value||'').toLowerCase();document.querySelectorAll('#jobList article').forEach(card=>{const r=card.dataset.role||'';const ok=(!q||r.includes(q))&&(!t||r.includes(t));card.style.display=ok?'flex':'none'})}search?.addEventListener('input',filterJobs);type?.addEventListener('change',filterJobs);
const aiToggle=document.getElementById('aiToggle'),aiPanel=document.getElementById('aiPanel');aiToggle?.addEventListener('click',()=>aiPanel.hidden=!aiPanel.hidden);document.querySelectorAll('.ai-links button').forEach(b=>b.addEventListener('click',()=>{document.querySelector(b.dataset.go)?.scrollIntoView({behavior:'smooth'});aiPanel.hidden=true}));
document.querySelectorAll('.pay-tabs button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.pay-tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');const card=b.dataset.pay==='card';document.getElementById('cardPanel').hidden=!card;document.getElementById('paypalPanel').hidden=card}));document.getElementById('payBtn')?.addEventListener('click',()=>alert('Secure payment gateway will be connected when the backend/payment integration is deployed.'));

const chatToggle=document.getElementById('chatToggle'),chatBox=document.getElementById('chatBox'),chatClose=document.getElementById('chatClose'),chatInput=document.getElementById('chatInput'),chatSend=document.getElementById('chatSend'),chatMessages=document.getElementById('chatMessages');function addChat(text,cls){const d=document.createElement('div');d.className=cls;d.textContent=text;chatMessages?.appendChild(d);chatMessages?.scrollTo(0,chatMessages.scrollHeight)}function answer(q){const x=q.toLowerCase();if(x.includes('profile'))return 'You can submit your profile from the Submit Profile section on the website. The secure backend connection will be added later.';if(x.includes('job'))return 'Open the Jobs section to browse available opportunities and use the search controls.';if(x.includes('service'))return 'MountPeak Group provides Information & Technology, digital, business and workforce solutions.';if(x.includes('payment'))return 'Open Payment from the navigation to choose Credit/Debit Card or PayPal.';return 'I can help you navigate MountPeak Group. Try asking about jobs, services, profile submission or payments.'}function sendChat(){const q=(chatInput?.value||'').trim();if(!q)return;addChat(q,'user-msg');chatInput.value='';setTimeout(()=>addChat(answer(q),'bot-msg'),250)}chatToggle?.addEventListener('click',()=>chatBox.hidden=!chatBox.hidden);chatClose?.addEventListener('click',()=>chatBox.hidden=true);chatSend?.addEventListener('click',sendChat);chatInput?.addEventListener('keydown',e=>{if(e.key==='Enter')sendChat()});document.querySelectorAll('.chat-suggestions button').forEach(b=>b.addEventListener('click',()=>{chatInput.value=b.dataset.chat;sendChat()}));
/* ===== MOUNTPEAK AI INTERACTION ===== */

document.addEventListener('DOMContentLoaded',()=>{
  const revealItems=document.querySelectorAll(
    '.stats,.about-cards article,.cards article,.steps div,.employer-grid span,.job-list article'
  );

  const observer=new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
      if(entry.isIntersecting){
        entry.target.classList.add('mp-visible');
        observer.unobserve(entry.target);
      }
    });
  },{
    threshold:.12
  });

  revealItems.forEach((el,index)=>{
    el.style.setProperty('--mp-delay',`${Math.min(index*70,420)}ms`);
    el.classList.add('mp-reveal');
    observer.observe(el);
  });

  /* AI navigation button interaction */
  const aiButton=document.querySelector('.ai-nav>button');

  aiButton?.addEventListener('click',()=>{
    aiButton.classList.remove('mp-ai-click');
    void aiButton.offsetWidth;
    aiButton.classList.add('mp-ai-click');
  });

  /* Smooth button feedback */
  document.querySelectorAll('.btn,.small-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      btn.classList.remove('mp-button-click');
      void btn.offsetWidth;
      btn.classList.add('mp-button-click');
    });
  });
});
