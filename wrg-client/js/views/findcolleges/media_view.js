/**
 * Created by semir.sabic on 3/20/14.
 */
define([
    'marionette',
    'text!templates/findcolleges/college_media.html'
], function (Marionette, Template) {
    "use strict";

    var CollegeMediaView = Marionette.ItemView.extend({
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
    return CollegeMediaView;
})