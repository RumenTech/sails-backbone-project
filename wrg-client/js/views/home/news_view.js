define([
    'marionette',
    'text!templates/home/news.html'
], function (Marionette, Template) {
    "use strict";

    var NewsView = Marionette.ItemView.extend({

        template: Template,

        initialize: function () {
            $("#pageloader").fadeIn(100).delay(200).fadeOut(100);
            $('body').css('visibility', 'visible');
        }
    });
    return NewsView;
});
