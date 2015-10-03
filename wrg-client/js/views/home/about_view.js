define([
    'marionette',
    'text!templates/home/about.html'
], function(Marionette, Template) {
    "use strict";

    var AboutView = Marionette.ItemView.extend({

        template: Template,

        initialize: function(params) {
            $("#pageloader").fadeIn(100).delay(200).fadeOut(100);
            $('body').css('visibility','visible');
        }
    });
    return AboutView;
});
