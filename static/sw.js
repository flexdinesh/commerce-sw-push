'use strict';

// console.log('Started', self);

function showNotification(title, body, icon, data) {
    console.log('showNotification');
    // Firefox has an issue with showing a notification with the icon from
    // the Yaho API
    // (i.e. http://l.yimg.com/a/i/brand/purplelogo//uh/us/news-wea.gif)
    // HTTP, CORs or Size issue.
    var notificationOptions = {
        body: body,
        // body: 'This is notification body',
        // icon: icon ? icon : '/images/touch/chrome-touch-icon-192x192.png',
        // tag: 'simple-push-demo-notification',
        data: data
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
        console.log('message data', event.data.text);
        var output = event.data.text();
        console.log(output);
    }

    var title = 'Title goes here';

    /*event.waitUntil(
        self.registration.showNotification(title, {
            'body': 'Notification content goes here',
            'icon': 'images/icon.png'
        }));*/

    /*var YAHOO_WEATHER_API_ENDPOINT = 'https://query.yahooapis.com/' +
        'v1/public/yql?q=select%20*%20from%20weather.forecast%20where%' +
        '20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where' +
        '%20text%3D%22london%2C%20uk%22)&format=json&env=store%3A%2F%2' +
        'Fdatatables.org%2Falltableswithkeys';*/

    var pushMessageEndPoint = 'https://commerce-push.herokuapp.com/push/getPushMessage'
        // Since this is no payload data with the first version
        // of Push notifications, here we'll grab some data from
        // an API and use it to populate a notification
    event.waitUntil(
        fetch(pushMessageEndPoint)
        .then(function(response) {
            if (response.status !== 200) {
                // Throw an error so the promise is rejected and catch() is executed
                throw new Error('Invalid status code from fetch data: ' +
                    response.status);
            }

            // Examine the text in the response
            return response.json();
        })
        .then(function(data) {
            console.log('Fetch data: ', data);
            // if (data.query.count === 0) {
            //     // Throw an error so the promise is rejected and catch() is executed
            //     throw new Error();
            // }

            // var title = 'Title goes here';
            // var message = data.query.results.channel.item.condition.text;
            // var icon = 'images/touch/chrome-touch-icon-192x192.png';

            var title = data.title;
            var message = data.body;
            var icon = data.icon;

            // Add this to the data of the notification
            // var urlToOpen = data.query.results.channel.link;
            var urlToOpen = data.url;
            return showNotification(title, message, icon, urlToOpen);
            /*var notificationFilter = {
                    tag: 'simple-push-demo-notification'
                };

        var notificationData = {
            url: urlToOpen
        };

        return showNotification(title, message, icon, notificationData);

        if (!self.registration.getNotifications) {
            return showNotification(title, message, icon, notificationData);
        }

        // Check if a notification is already displayed
        /*return self.registration.getNotifications(notificationFilter)
            .then(function(notifications) {
                if (notifications && notifications.length > 0) {
                    // Start with one to account for the new notification
                    // we are adding
                    var notificationCount = 1;
                    for (var i = 0; i < notifications.length; i++) {
                        var existingNotification = notifications[i];
                        if (existingNotification.data &&
                            existingNotification.data.notificationCount) {
                            notificationCount +=
                                existingNotification.data.notificationCount;
                        } else {
                            notificationCount++;
                        }
                        existingNotification.close();
                    }
                    message = 'You have ' + notificationCount +
                        ' weather updates.';
                    notificationData.notificationCount = notificationCount;
                }

                return showNotification(title, message, icon, notificationData);
            });*/
        })
        .catch(function(err) {
            console.error('A Problem occured with handling the push msg', err);

            var title = 'An error occured';
            var message = 'We were unable to get the information for this ' +
                'push message';

            return showNotification(title, message);
        })
    );
});

self.addEventListener('notificationclick', function(event) {
    var url = event.notification.data.url;
    event.notification.close();
    event.waitUntil(clients.openWindow(url));
});
