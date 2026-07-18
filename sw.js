const CACHE='oatf-v6.6';
const SCOPE=new URL(self.registration.scope);
const paths=[
  '', 'index.html','404.html','manifest.webmanifest',
  'assets/styles.css','assets/v4.css','assets/mobile-app.css','assets/v61.css','assets/v62.css','assets/v63.css','assets/v64.css','assets/v65.css','assets/v66.css',
  'assets/site.js','assets/mobile-app.js','assets/v61.js','assets/v62.js','assets/v63.js','assets/v64.js','assets/v65.js','assets/v66.js','assets/favicon.svg',
  'assets/icons/icon-192.png','assets/icons/icon-512.png','assets/icons/apple-touch-icon.png',
  'assets/images/oatf-logo-fallback.svg','assets/images/hero-fallback.svg',
  'assets/images/riverside-fallback.svg','assets/images/sandiego-fallback.svg',
  'assets/images/orangecounty-fallback.svg','assets/images/mascot-fallback.svg',
  'about/','history/','faq/','contact/','participate/','photos/','californiafairs/',
  'riversidecountyfair/','sdfair/','orangecountyfair/',
  'pennants/','giveaways/','tvsfa/'
];
const urls=paths.map(p=>new URL(p,SCOPE).href);
self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>Promise.allSettled(urls.map(url=>cache.add(url))))
      .then(()=>self.skipWaiting())
  );
});
self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const req=event.request;
  event.respondWith(
    caches.match(req).then(cached=>{
      const fresh=fetch(req).then(response=>{
        if(response && response.ok){
          caches.open(CACHE).then(cache=>cache.put(req,response.clone()));
        }
        return response;
      }).catch(()=>cached || (req.mode==='navigate'
        ? caches.match(new URL('404.html',SCOPE).href)
        : undefined));
      return cached || fresh;
    })
  );
});