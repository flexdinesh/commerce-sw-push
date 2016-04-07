'use strict';

if ('serviceWorker' in navigator) {
    console.log('Service Worker is supported');
    navigator.serviceWorker.register('sw.js').then(function(registration) {
        console.log("registered ");
        return navigator.serviceWorker.ready;
    }).then(function(reg) {
        console.log('Service Worker is ready :^)', reg);
        reg.pushManager.subscribe({ userVisibleOnly: true }).then(function(sub) {
            console.log('endpoint:', sub.endpoint);
            var endpointSections = sub.endpoint.split('/');
            var subscriptionId = endpointSections[endpointSections.length - 1];
            console.log(subscriptionId);
            var jqxhr = $.post("https://commerce-push.herokuapp.com/db/addToken", { tokenid: subscriptionId })
                .done(function() {
                    console.log("tokenid sent to server");
                })
                .fail(function() {
                    console.log("sending tokenid failed");
                })
        });
    }).catch(function(error) {
        console.log('Service Worker error :^(', error);
    });

}
