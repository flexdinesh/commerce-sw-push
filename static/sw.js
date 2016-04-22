'use strict';

// console.log('Started', self);

function showNotification(title, body, icon, urlToOpen) {
    // console.log('showNotification');
    var notificationOptions = {
        body: body,
        icon: icon,
        data: urlToOpen,
        tag: 'sw-notify'
    };
    return self.registration.showNotification(title, notificationOptions);
}

self.addEventListener('install', function(event) {
    self.skipWaiting();
    // console.log('Installed', event);
});

self.addEventListener('activate', function(event) {
    // console.log('Activated', event);
});

self.addEventListener('push', function(event) {
    // console.log('Push message', event);

    if (event.data) {
        console.log('message data', event.data);
    }

    var pushMessageEndPoint = 'https://commerce-push.herokuapp.com/push/getPushMessage'
        // Since this is no payload data with the first version
        // of Push notifications, here we'll grab some data from
        // an API and use it to populate a notification
    fetch(pushMessageEndPoint)
        .then(function(response) {
            /*if (response.status !== 200) {
                // Throw an error so the promise is rejected and catch() is executed
                console.log("error in fetch");
                throw new Error('Invalid status code from fetch data: ' +
                    response.status);
            }*/

            // Examine the text in the response
            // console.log(response.json());
            return response.json();
        })
        .then(function(data) {
            // console.log('Fetch data: ', data);

            var title = data.title;
            var message = data.body;
            var icon = '/images/icons/deals.png';

            // Add this to the data of the notification
            // var urlToOpen = data.query.results.channel.link;
            var urlToOpen = data.url;
            return showNotification(title, message, icon, urlToOpen);
        })
        .catch(function(err) {
            console.log('A Problem occured with handling the push msg', err);

            var title = 'An error occured';
            var message = 'We were unable to get the information for this ' +
                'push message';

            return showNotification(title, message);
        })
});

self.addEventListener('notificationclick', function(event) {
    var url = event.notification.data;
    // console.log("url : " + url);
    event.notification.close();
    event.waitUntil(clients.openWindow(url));
});
