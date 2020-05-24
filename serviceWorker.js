const staticContactLog = "contactlog-site-v1"
const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/app.js",
  "/js/download.js",
];

self.addEventListener("install", function( installEvent ) {
  installEvent.waitUntil(precache());
});

self.addEventListener('fetch', function(evt) {
  // console.log('The service worker is serving the asset.');
  evt.respondWith(fromCache(evt.request));
  //update the cache
  evt.waitUntil(update(evt.request));
});

function precache() {
  return caches.open(staticContactLog).then(function (cache) {
    return cache.addAll([ assets ]);
  });
}

function fromCache(request) {
  return caches.open(staticContactLog).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}

function update(request) {
  return caches.open(staticContactLog).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response);
    });
  });
}

// self.addEventListener("fetch", fetchEvent => {
//   fetchEvent.respondWith(
//     caches.match(fetchEvent.request).then(res => {
//       return res || fetch(fetchEvent.request)
//     })
//   )
// })
