const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
import fs from 'node:fs/promises';
const root=process.cwd()+'/.ui-refresh-shots';
const phase=process.argv[2]||'before';
await fs.rm(`${root}/${phase}/results.json`, { force: true });
const pages=[['home','/'],['articles','/articles/'],['about','/about/'],['tools','/tools/'],['long-article','/tutorials/es/basics/installation.html']];
if(phase==='after')pages.push(['consumer','/tools/consumer-copilot/'],['weekly','/tools/pandacoder-weekly/']);
const browser=await chromium.launch({...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),headless:true,args:['--disable-dev-shm-usage']});
const results=[];
for(const target of phase==='before'?['local']:['netlify','cloudflare','github']){
 const dir=`${root}/${phase}${phase==='after'?'/'+target:''}`;await fs.mkdir(dir,{recursive:true});
 for(const [device,width,height] of [['desktop',1440,900],['mobile',390,844]]) for(const mode of ['light','dark']){
  const context=await browser.newContext({viewport:{width,height},colorScheme:mode});
  await context.addInitScript(mode=>localStorage.setItem('vitepress-theme-appearance',mode),mode);
  if(phase==='after'&&target==='netlify')await context.route('**/api/**',route=>route.fulfill({status:200,contentType:new URL(route.request().url()).pathname.includes('pandacoder-proxy')?'text/html':'application/json',body:new URL(route.request().url()).pathname.includes('pandacoder-proxy') ? '<!doctype html><html lang="zh-CN"><body><h1>PandaCoder 周报</h1><p>本地验证：代理服务已就绪。</p></body></html>' : JSON.stringify({visits:1234,views:128,likes:12,hasLiked:false,success:true})}));
  if(phase==='after'&&target==='netlify')await context.route('**/.netlify/functions/**',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({comments:[]})}));
  // Keep external analytics and ads out of visual QA; first-party APIs remain observable.
  await context.route(/https?:\/\/(?!localhost|127\.0\.0\.1)/,route=>route.abort());
  const page=await context.newPage();let errors=[],apis=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(/hydration|Failed to resolve component/i.test(m.text())||m.type()==='error'&&!/net::ERR_FAILED|Failed to load resource/.test(m.text()))errors.push(m.text())});
  page.on('response',r=>{if(new URL(r.url()).origin==='http://localhost:4173'&&new URL(r.url()).pathname.startsWith('/assets/')&&r.status()>=400)errors.push('Asset '+r.status()+': '+r.url())});
  page.on('request',r=>{if(new URL(r.url()).pathname.startsWith('/api/'))apis.push(r.url())});
  for(const [name,path]of pages){
   errors=[];apis=[];
   const response=await page.goto('http://localhost:4173'+path+(phase==='after'?'?__deploy='+target:''),{waitUntil:'networkidle'});
   await page.waitForFunction(() => !!document.getElementById('site-runtime')?.textContent, {timeout:15000});
   await page.waitForTimeout(1300);
   await page.screenshot({path:`${dir}/${name}-${device}-${mode}.png`,fullPage:true});
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
   const ui=await page.evaluate(()=>({notice:document.querySelectorAll('.requires-backend-notice').length,iframe:!!document.querySelector('.pandacoder-container iframe'),feedback:!!document.querySelector('.feedback-button'),stats:document.querySelector('.article-stats')?.innerText,visits:document.getElementById('site-visits-container')?.innerText,footSeparator:getComputedStyle(document.getElementById('site-visits-container'),'::before').content}));
   results.push({target,device,mode,name,status:response.status(),overflow,apis:[...new Set(apis)],errors,ui});
   console.log(JSON.stringify(results.at(-1)));
   if(response.status()!==200||overflow||errors.length)throw new Error('Page acceptance failed: '+JSON.stringify(results.at(-1)));
   if(phase==='after'&&['cloudflare','github'].includes(target)&&(apis.length||ui.feedback||ui.iframe))throw new Error('Static host requested backend');
   if(phase==='after'&&target==='netlify'&&!ui.feedback)throw new Error('Netlify feedback missing');
   if(phase==='after'&&target!=='netlify'&&['consumer','weekly'].includes(name)&&!ui.notice)throw new Error('Backend notice missing');
  }await context.close();
 }
}
await fs.writeFile(`${root}/${phase}/results.json`,JSON.stringify(results,null,2));await browser.close();
