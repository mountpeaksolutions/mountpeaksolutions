const API = window.MOUNTPEAK_API || '/api';

function formDataObject(form) { return new FormData(form); }
async function sendForm(form, url, messageEl) {
  const button = form.querySelector('button[type="submit"]');
  if (button) button.disabled = true;
  try {
    const res = await fetch(`${API}${url}`, {method:'POST', body:formDataObject(form)});
    const data = await res.json();
    messageEl.textContent = data.message || (res.ok ? 'Submitted successfully.' : 'Something went wrong.');
    messageEl.className = `form-message ${res.ok ? 'success' : 'error'}`;
    if (res.ok) form.reset();
  } catch { messageEl.textContent='Unable to connect to the server. Please try again.'; messageEl.className='form-message error'; }
  if (button) button.disabled = false;
}

function addMessage(text, who='bot') { const box=document.getElementById('aiMessages'); const d=document.createElement('div'); d.className=`ai-msg ${who}`; d.textContent=text; box.appendChild(d); box.scrollTop=box.scrollHeight; }

const candidateForm=document.getElementById('candidateForm');
if(candidateForm){ const m=document.createElement('p'); candidateForm.appendChild(m); candidateForm.addEventListener('submit',e=>{e.preventDefault();sendForm(candidateForm,'/candidates',m);}); }
const contactForm=document.getElementById('contactForm');
if(contactForm){ const m=document.createElement('p'); contactForm.appendChild(m); contactForm.addEventListener('submit',e=>{e.preventDefault();sendForm(contactForm,'/contact',m);}); }

// Payment modal: backend creates provider checkout sessions. Card = Stripe Checkout; PayPal = PayPal order.
const paymentPanel=document.getElementById('paymentPanel');
document.querySelectorAll('a[href="#payment"], [data-payment]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();paymentPanel.setAttribute('aria-hidden','false');}));
document.querySelector('[data-close="paymentPanel"]')?.addEventListener('click',()=>paymentPanel.setAttribute('aria-hidden','true'));
async function startPayment(provider){
  const amount=document.getElementById('paymentAmount').value; const msg=document.getElementById('paymentMessage');
  if(!amount || Number(amount)<=0){msg.textContent='Enter a valid amount.';return;}
  msg.textContent='Creating secure checkout…';
  try{const r=await fetch(`${API}/payments/${provider}/create`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({amount:Number(amount),currency:'USD'})}); const d=await r.json(); if(!r.ok) throw new Error(d.message||'Payment could not be started.'); window.location.href=d.approvalUrl||d.checkoutUrl;}catch(e){msg.textContent=e.message;}
}
document.getElementById('paypalBtn')?.addEventListener('click',()=>startPayment('paypal'));
document.getElementById('cardBtn')?.addEventListener('click',()=>startPayment('stripe'));

// AI navigation
const aiPanel=document.getElementById('aiPanel');
document.getElementById('aiOpen')?.addEventListener('click',()=>aiPanel.setAttribute('aria-hidden','false'));
document.getElementById('aiClose')?.addEventListener('click',()=>aiPanel.setAttribute('aria-hidden','true'));
document.getElementById('aiForm')?.addEventListener('submit',async e=>{e.preventDefault();const input=document.getElementById('aiInput');const text=input.value.trim();if(!text)return;addMessage(text,'user');input.value='';try{const r=await fetch(`${API}/ai/navigation`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text})});const d=await r.json();addMessage(d.reply||'I can help you navigate the website.');if(d.action){setTimeout(()=>{if(d.action==='profile')location.hash='profile';if(d.action==='contact')location.hash='contact';if(d.action==='services')location.hash='services';if(d.action==='candidates')location.hash='candidates';if(d.action==='employers')location.hash='employers';if(d.action==='payment'){paymentPanel.setAttribute('aria-hidden','false');}},300)}}catch{addMessage('I’m temporarily unavailable. Please use the navigation menu or contact our team.');}});
(async()=>{const qs=new URLSearchParams(location.search);const orderId=qs.get('token');if(qs.get('paypal_return')==='1'&&orderId){try{const r=await fetch(`${API}/payments/paypal/capture`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId})});const d=await r.json();if(r.ok)alert(`Payment status: ${d.status}`);else alert(d.message||'Payment capture failed.');}catch{} history.replaceState({},'',location.pathname);}})();
