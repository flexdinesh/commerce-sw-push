'use strict';

$(document).ready(function() {
    $.material.init();

    $(function() {
        $("[data-hide]").on("click", function() {
            $(this).closest("." + $(this).attr("data-hide")).hide();
        });
    });

    $("#notificationButton").click(function() {
        var title = $("#title").val();
        var message = $("#message").val();
        // var uri = $("#uri").val();
        var uri = "http://192.168.2.98/webapp/wcs/stores/servlet/en/aurorac/"

        var jqXHR = $.ajax({
            url: "https://commerce-push.herokuapp.com/push/setPushMessage",
            type: "POST",
            data: jQuery.param({
                title: title,
                body: message,
                url: uri
            })
        }).done(function(response, textStatus, jqXHR) {
            console.log("Notification content updated");
            $('#statusSuccess p').html('Notification content successfully updated');
            $('#statusSuccess').show();
        }).fail(function(jqXHR, textStatus, errorThrown) {
            $('#statusFail p').html('Notification content update failed!');
            $('#statusFail').show();
            console.log("Notification content update failed!");
        });
    });

    $("#pushButton").click(function() {

        var jqXHR = $.ajax({
            url: "https://commerce-push.herokuapp.com/push/sendPush",
            type: "POST"
        }).done(function(response, textStatus, jqXHR) {
            $('#statusSuccess p').html('Push successfully triggered to all devices');
            $('#statusSuccess').show();
            // console.log("Push triggered");
        }).fail(function(jqXHR, textStatus, errorThrown) {
            $('#statusFail p').html('Push trigger failed!');
            $('#statusFail').show();
            console.log("Push trigger failed!");
        });
    });

});

if ('serviceWorker' in navigator) {
    console.log('Service Worker is supported');
    navigator.serviceWorker.register('sw.js').then(function(registration) {
        console.log("registered ");
        return navigator.serviceWorker.ready;
    }).then(function(reg) {
        // console.log('Service Worker is ready :^)', reg);
        reg.pushManager.subscribe({ userVisibleOnly: true }).then(function(sub) {
            // console.log('endpoint:', sub.endpoint);
            var endpointSections = sub.endpoint.split('/');
            var subscriptionId = endpointSections[endpointSections.length - 1];
            // console.log(subscriptionId);
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
