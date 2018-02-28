'use strict';



let swRegistration = null;


if ('serviceWorker' in navigator) {
  console.log('Service Worker ');

  navigator.serviceWorker.register('sw.js',{
    scope: '.' 
  })
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('serviceWorker is not supported');
}
