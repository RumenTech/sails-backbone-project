/**
 * Created by semir.sabic on 3/19/14.
 */
define([
    'marionette',
    'text!templates/findcompanies/company_media.html'
], function (Marionette, Template) {
    "use strict";

    var CompanyMediaView = Marionette.ItemView.extend({
        template: Template,
        events: {
            'click .close-reveal-modal .close-modal': 'closeModal'
        },

        initialize: function (params) {
            this.reqres = params.reqres;
            this.model = params.model;
        },

        onRender: function (params) {
            this.$el.foundation();
        }
    });
    return CompanyMediaView;
});