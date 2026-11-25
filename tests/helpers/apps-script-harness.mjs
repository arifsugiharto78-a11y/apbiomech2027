import vm from 'node:vm';
import crypto from 'node:crypto';
import {readFileSync} from 'node:fs';

export function appsScriptHarness(overrides={}) {
  const properties={REGISTRATION_MODE:'TEST',TEST_SPREADSHEET_ID:'synthetic-test-database',TEST_EMAIL_ALLOWLIST:'demo.participant@example.invalid',CONSENT_VERSION:'2026-11-25-draft',ACK_EMAIL_ENABLED:'true',...overrides};
  const rows=[], sent=[], logs=[], cache=new Map();
  let held=false, quota=100, mailFails=false, forceBusy=false;
  const assertLock=()=>{if(!held)throw new Error('UNLOCKED_WRITE');};
  const range=(r,c,n=1,w=1)=>({
    getValues:()=>Array.from({length:n},(_,i)=>Array.from({length:w},(_,j)=>rows[r+i-1]?.[c+j-1]??'')),
    setValue:value=>{assertLock();rows[r-1][c-1]=value;return range(r,c,n,w);},
    setValues:values=>{assertLock();values.forEach((row,i)=>{rows[r+i-1]??=[];row.forEach((v,j)=>{rows[r+i-1][c+j-1]=v;});});return range(r,c,n,w);},
    setFontWeight:()=>range(r,c,n,w),setBackground:()=>range(r,c,n,w),setFontColor:()=>range(r,c,n,w),setNumberFormat:()=>range(r,c,n,w)
  });
  const sheet={getLastRow:()=>rows.length,getMaxRows:()=>1000,getRange:range,appendRow:row=>{assertLock();rows.push([...row]);},setFrozenRows:()=>{},setColumnWidths:()=>{}};
  const context=vm.createContext({console:{log:value=>logs.push(value)},Date,JSON,Number,String,Object,Math,Error,
    PropertiesService:{getScriptProperties:()=>({getProperty:key=>properties[key]??null,setProperty:(key,value)=>{assertLock();properties[key]=value;}})},
    LockService:{getScriptLock:()=>({tryLock:()=>{if(held||forceBusy)return false;held=true;return true;},releaseLock:()=>{held=false;}})},
    SpreadsheetApp:{openById:id=>{if(!id)throw new Error('Missing database');return {getSheetByName:()=>sheet,insertSheet:()=>sheet};},flush:()=>{assertLock();}},
    CacheService:{getScriptCache:()=>({get:key=>cache.get(key)||null,put:(key,value)=>{assertLock();cache.set(key,value);}})},
    Utilities:{getUuid:()=>crypto.randomUUID(),DigestAlgorithm:{SHA_256:'sha256'},Charset:{UTF_8:'utf8'},computeDigest:(_,value)=>[...crypto.createHash('sha256').update(value).digest()]},
    MailApp:{getRemainingDailyQuota:()=>quota,sendEmail:message=>{if(mailFails)throw new Error('Synthetic mail failure');sent.push(message);}},
    HtmlService:{createHtmlOutput:html=>({html,setTitle(){return this;},addMetaTag(){return this;}})}
  });
  for(const file of ['Core','Schema','Database','Email','Payment','Code'])vm.runInContext(readFileSync(new URL(`../../backend/google-apps-script/${file}.gs`,import.meta.url),'utf8'),context,{filename:file+'.gs'});
  rows.push([...context.REGISTRATION_HEADERS]);
  return {context,properties,rows,sent,logs,setQuota:value=>{quota=value;},failMail:()=>{mailFails=true;},forceBusy:()=>{forceBusy=true;}};
}
export function syntheticSubmission(changes={}) {
  return {title:'Dr',givenName:'Demo Participant',familyName:'',email:'demo.participant@example.invalid',confirmEmail:'demo.participant@example.invalid',phone:'+62 812 0000 0000',institution:'Example University',department:'Example Department',country:'Indonesia',position:'Researcher',category:'Regular participant',membership:'Non-member',participation:'Non-presenting participant',invitation:'No',workshop:'Undecided',privacy:'yes',terms:'yes',accuracy:'yes',synthetic:'yes',mode:'TEST',consentVersion:'2026-11-25-draft',submissionKey:crypto.randomUUID(),startedAt:String(Date.now()-10000),website:'',...changes};
}
export function formEvent(input) {
  const contents=new URLSearchParams(input).toString();
  return {parameter:input,parameters:Object.fromEntries(Object.entries(input).map(([k,v])=>[k,[v]])),postData:{type:'application/x-www-form-urlencoded',length:contents.length,contents}};
}
