
self.addEventListener('install', function(evt) {
  console.log('service worker installed');
})

self.addEventListener('fetch', function(evt){
  return fetch(evt.request)
});
