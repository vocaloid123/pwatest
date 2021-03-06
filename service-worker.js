importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");
var cacheStorageKey = 'minimal-pwa-8'
var cacheList=[
  './',
  'index.html',
  'images/img1.png',
  'images/img2.png',
  'images/img3.png',
]
self.addEventListener('install',e => {  // install 事件，它发生在浏览器安装并注册 Service Worker 时       
  // e.waitUtil 用于在安装成功之前执行一些预装逻辑
  console.log('install')
  e.waitUntil(
    caches.open(cacheStorageKey)
    .then(cache => cache.addAll(cacheList))
    .then(() => self.skipWaiting())
  )
})
self.addEventListener('fetch',function(e) {
  console.log('fetch')
  e.respondWith(
    caches.match(e.request).then(function(response){
      if(response != null){
        return response
      }
      return fetch(e.request.url)
    })
  )
})
self.addEventListener('activated',function(e) {
  console.log('activated')
  e.waitUntil(
    //获取所有cache名称
    caches.keys().then(cacheNames => {
      return Promise.all(
        // 获取所有不同于当前版本名称cache下的内容
        cacheNames.filter(cacheNames => {
          return cacheNames !== cacheStorageKey
        }).map(cacheNames => {
          return caches.delete(cacheNames)
        })
      )
    }).then(() => {
      return self.clients.claim()
    })
  )
})