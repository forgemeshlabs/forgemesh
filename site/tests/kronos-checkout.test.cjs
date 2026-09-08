const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const Module=require('node:module');
const ts=require('typescript');const site=path.resolve(__dirname,'..');
const originalResolve=Module._resolveFilename;
Module._resolveFilename=function(id,...rest){return originalResolve.call(this,id.startsWith('@/')?path.join(site,id.slice(2)):id,...rest)};
require.extensions['.ts']=(module,file)=>module._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true,resolveJsonModule:true}}).outputText,file);
const {kronosContract,kronosAgreementFields}=require('../lib/kronos-contract.ts');
const {createKronosCheckout}=require('../lib/stripe.ts');const {POST,GET}=require('../app/api/kronos/checkout/route.ts');
process.env.STRIPE_SECRET_KEY='offline-test-placeholder';
let calls=[];
global.fetch=async(url,opts)=>{assert.equal(url,'https://api.stripe.com/v1/checkout/sessions');calls.push({url,opts});return {ok:true,json:async()=>({id:'cs_test_confirmed',url:'https://checkout.stripe.com/test-only'})}};
const valid={termsVersion:'01.3',termsAccepted:true,immediateDelivery:true};
function req(fields={},origin='https://forgemesh.io') {return new Request('https://forgemesh.io/api/kronos/checkout',{method:'POST',headers:{origin,'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({terms_version:'01.3',terms_accepted:'yes',immediate_delivery:'yes',...fields})})}

test('both affirmative choices and the current immutable version are required',()=>{
 for(const x of [{...valid,termsAccepted:false},{...valid,immediateDelivery:false},{...valid,termsVersion:'01.2'}])assert.throws(()=>kronosAgreementFields(x));
});
test('agreement metadata points to the actual published terms bytes and explicit provider consent',()=>{
 const fields=kronosAgreementFields(valid,new Date('2026-09-08T18:00:00Z'));
 assert.equal(fields['consent_collection[terms_of_service]'],'required');
 const hash=require('node:crypto').createHash('sha256').update(fs.readFileSync(path.join(site,'public/kronos-field-guide/terms/01.3/LICENSE.txt'))).digest('hex');assert.equal(fields['metadata[terms_sha256]'],hash);
 assert.equal(fields['metadata[site_assent_recorded_at]'],'2026-09-08T18:00:00.000Z');assert.equal(fields['metadata[archive_sha256]'],kronosContract.archiveSha256);
});
test('session creation sends the real accepted edition and does not accept caller-supplied metadata',async()=>{
 const r=await createKronosCheckout('price_test',valid);assert.equal(r.id,'cs_test_confirmed');const form=new URLSearchParams(calls.at(-1).opts.body);assert.equal(form.get('metadata[product_edition]'),'01.3');assert.equal(form.get('consent_collection[terms_of_service]'),'required');assert.ok(form.get('custom_text[terms_of_service_acceptance][message]').includes(kronosContract.termsUrl));
});
test('GET is read-only and returns to the purchase form',async()=>{
 const n=calls.length;const r=await GET();assert.equal(r.status,303);assert.ok(r.headers.get('location').endsWith('#purchase'));assert.equal(calls.length,n);
});
test('omitted choices and stale editions cannot create checkout',async()=>{
 const n=calls.length;for(const f of [{terms_accepted:''},{immediate_delivery:''},{terms_version:'01.2'}])assert.equal((await POST(req(f))).status,400);assert.equal(calls.length,n);
});
test('cross-origin purchase creation is refused',async()=>{
 const n=calls.length;assert.equal((await POST(req({},'https://attacker.invalid'))).status,403);assert.equal(calls.length,n);
});
test('valid form creates one session and redirects to provider',async()=>{
 const n=calls.length;const r=await POST(req());assert.equal(r.status,303);assert.equal(r.headers.get('location'),'https://checkout.stripe.com/test-only');assert.equal(calls.length,n+1);
});
test('oversized form and unsupported content type fail without provider calls',async()=>{
 const n=calls.length;assert.equal((await POST(req({extra:'x'.repeat(4100)}))).status,413);
 const r=new Request('https://forgemesh.io/api/kronos/checkout',{method:'POST',headers:{origin:'https://forgemesh.io','content-type':'application/json'},body:'{}'});assert.equal((await POST(r)).status,415);assert.equal(calls.length,n);
});
