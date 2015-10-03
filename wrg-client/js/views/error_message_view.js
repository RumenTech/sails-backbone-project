define([
    'backbone',
    'marionette',
    'text!templates/error_message.html'
], function (Backbone, Marionette, Template) {
    'use strict';

    var ErrorMessageView = Marionette.ItemView.extend({
        template: Template,

        initialize: function (params) {
            this.model = new Backbone.Model();
            this.model.set('errorMessage', params.message);
        }
    });
    return ErrorMessageView;
});