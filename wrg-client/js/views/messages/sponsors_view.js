/**
 * Created by Mistral on 3/11/14.
 */

define([
    'marionette',
    'text!templates/messages/sponsors.html'
], function (Marionette, Template) {
    'use strict';

    var SponsorsView = Marionette.ItemView.extend({
        template: Template,

        initialize: function (params) {
        },

        onRender: function () {
        }
    });
    return SponsorsView;
});
