/**
 * Created by semir.sabic on 3/14/14.
 */
define([
    'marionette',
    'text!templates/portfolio/project_media.html',
    'models/portfolio/experience'

], function (Marionette, Template, Experience) {
    "use strict";

    var ExperienceMediaView = Marionette.ItemView.extend({
        template: Template,
        events: {
            'click .close-reveal-modal .close-modal': 'closeModal'
        },

        initialize: function (params) {
            this.reqres = params.reqres;
            this.model = new Experience(params.model, params);
        },

        onRender: function (params) {
            this.$el.foundation();
        }
    });
    return ExperienceMediaView;
});