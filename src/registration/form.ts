import {RegistrationCore as core} from '../../registration/core.mjs';

export function initRegistrationForm() {
  const form=document.querySelector<HTMLFormElement>('#participant-registration');
  if (!form) return;
  const mode=form.dataset.mode || 'DEMO';
  form.setAttribute('rel','noopener');
  const button=form.querySelector<HTMLButtonElement>('#registration-submit')!;
  const errors=form.querySelector<HTMLElement>('#registration-errors')!;
  const result=form.querySelector<HTMLElement>('#registration-result')!;
  const progress=form.querySelector<HTMLElement>('#registration-progress')!;
  const retry=form.querySelector<HTMLButtonElement>('#registration-retry')!;
  const control=(name:string)=>form.elements.namedItem(name) as HTMLInputElement|HTMLSelectElement|RadioNodeList;
  const namedControls=(name:string)=>form.querySelectorAll<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>(`[name="${name}"]`);
  function inlineError(name:string,message:string) {
    namedControls(name).forEach(field=>message?field.setAttribute('aria-invalid','true'):field.removeAttribute('aria-invalid'));
    const inline=form!.querySelector<HTMLElement>(`#error-${name}`);
    if (inline) inline.textContent=message;
    if (!message) {
      errors.querySelectorAll<HTMLElement>('li').forEach(item=>{if(item.dataset.field===name)item.remove();});
      if(!errors.querySelector('li')) errors.hidden=true;
    }
  }
  let sent=false;
  const key=crypto.randomUUID();
  control('submissionKey').value=key;
  control('startedAt').value=String(Date.now());
  const endpoint=form.dataset.endpoint || '';
  const ready=mode==='DEMO'||(/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint)&&['TEST','LIVE'].includes(mode));
  if (mode!=='DEMO' && ready) form.action=endpoint;
  button.disabled=!ready;
  if (!ready) progress.textContent='Registration is unavailable while configuration is completed. No information has been sent.';
  function conditional() {
    const presenter=form!.querySelector<HTMLFieldSetElement>('#presenter-fields')!;
    const student=form!.querySelector<HTMLFieldSetElement>('#student-fields')!;
    presenter.hidden=presenter.disabled=control('participation').value!=='Presenting author';
    student.hidden=student.disabled=control('category').value!=='Student participant';
    if(presenter.hidden) for(const name of ['presentation','abstractIds']) inlineError(name,'');
    if(student.hidden) for(const name of ['degree','studentStatus']) inlineError(name,'');
  }
  form.addEventListener('change',conditional);
  conditional();
  function validateEditedField(event:Event) {
    const field=event.target;
    if(!(field instanceof HTMLInputElement||field instanceof HTMLSelectElement||field instanceof HTMLTextAreaElement)||!Object.prototype.hasOwnProperty.call(core.limits,field.name)||field.type==='hidden') return;
    if(event.type==='input'&&field.getAttribute('aria-invalid')!=='true') return;
    const checked=core.validate(Object.fromEntries(new FormData(form!).entries()),mode);
    inlineError(field.name,checked.errors[field.name]||'');
    if(field.name==='email'&&control('confirmEmail').value) inlineError('confirmEmail',checked.errors.confirmEmail||'');
    result.hidden=true;
  }
  for(const event of ['focusout','change','input']) form.addEventListener(event,validateEditedField);
  document.querySelector('#registration-sample')?.addEventListener('click',()=>{
    const sample:Record<string,string>={title:'Dr',givenName:'Demo Participant',familyName:'',email:'demo.participant@example.invalid',confirmEmail:'demo.participant@example.invalid',phone:'+62 812 0000 0000',institution:'Example University (synthetic)',department:'Example Biomechanics Department',country:'ID',position:'Researcher',category:'Regular participant',membership:'Non-member',participation:'Non-presenting participant',invitation:'No',workshop:'Undecided'};
    for (const [name,value] of Object.entries(sample)) control(name).value=value;
    for (const name of ['privacy','terms','accuracy','synthetic']) (control(name) as HTMLInputElement).checked=false;
    conditional();
    progress.textContent='Synthetic details filled. Please review the agreements yourself.';
    (control('givenName') as HTMLInputElement).focus();
  });
  form.addEventListener('submit',event=>{
    if (sent || !ready) {event.preventDefault();return;}
    const input=Object.fromEntries(new FormData(form).entries());
    const checked=core.validate(input,mode);
    errors.hidden=true;
    errors.querySelector('ul')!.replaceChildren();
    for (const field of form.querySelectorAll<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>('input,select,textarea')) {
      field.removeAttribute('aria-invalid');
      const message=form.querySelector<HTMLElement>(`#error-${field.name}`);
      if (message) message.textContent='';
    }
    if (!checked.valid) {
      event.preventDefault();
      for (const [name,message] of Object.entries(checked.errors)) {
        inlineError(name,message);
        const li=document.createElement('li'), link=document.createElement('a');
        li.dataset.field=name;
        link.href=`#reg-${name}`;
        const label=name==='participation'?'Participation type':form.querySelector<HTMLLabelElement>(`label[for="reg-${name}"]`)?.textContent?.replace('*','').trim() || name;
        link.textContent=`${label}: ${message}`;
        li.append(link);errors.querySelector('ul')!.append(li);
      }
      errors.hidden=false;errors.focus();result.hidden=true;
      progress.textContent='Your entries are still here. Correct the highlighted fields and try again.';
      return;
    }
    if (mode==='DEMO') {
      event.preventDefault();
      const heading=document.createElement('h2');heading.textContent='Demo acknowledgment — nothing submitted';
      const body=document.createElement('p');body.textContent=`Dear ${checked.data.givenName}, this is how your acknowledgment will appear. Sample registration ID: DEMO-APB2027-0001. Category: ${checked.data.category}.`;
      const note=document.createElement('p');note.textContent='No record was created and no email was sent. This demonstration is not confirmation of conference participation.';
      const payment=document.createElement('p');payment.textContent='Payment status: Pending Payment (demonstration only). No payment is requested.';
      result.replaceChildren(heading,body,payment,note);result.hidden=false;result.focus();
      progress.textContent='Demonstration completed locally.';
      return;
    }
    // Native browser POST navigates a separate tab. No CORS fetch, opaque response, or false success.
    sent=true;button.disabled=true;form.setAttribute('aria-busy','true');
    progress.textContent='Opening the registration response in a new tab…';
    window.setTimeout(()=>{
      form.removeAttribute('aria-busy');
      progress.textContent='Check the new tab for your registration ID or an error. This page cannot verify the response. If the tab did not open or a network error occurred, retry below; your details are retained.';
      retry.hidden=false;
    },1000);
  });
  retry.addEventListener('click',()=>{
    sent=false;button.disabled=false;retry.hidden=true;
    progress.textContent='Retry enabled with the same submission reference to prevent a duplicate record. Review the response tab before sending again.';
  });
}
