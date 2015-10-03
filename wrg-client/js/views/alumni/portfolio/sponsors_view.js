define([
    'marionette',
    'text!templates/alumni/portfolio/sponsors.html'
], function (Marionette, Template) {
    "use strict";

    var SponsorsView = Marionette.ItemView.extend({
        template: Template,

        initialize: function (params) {
        },

        onRender: function () {
        }
    });

    return SponsorsView;
});