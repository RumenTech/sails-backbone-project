define([
    'marionette',
    'text!templates/company/talents/talents_index.html',
    'models/company',
    'regions/modal_region'
], function (Marionette, Template, Company, ModalRegion) {
    "use strict";

    var JobsIndexView = Marionette.Layout.extend({
        template: Template,

        regions: {
            modal: ModalRegion
        },

        events: {

        },

        initialize: function (options) {
            this.vent = options.vent;
            this.reqres = options.reqres;
            this.model = new Company(null, options);
            this.config = this.reqres.request('config');
            this.listenTo(this.model, 'loaded', this.onLoaded, this);
        },

        onRender: function () {
            $('body').css('visibility', 'visible');
        },

        onLoaded: function () {
            $("#pageloader").fadeIn(300).delay(this.config.spinnerTimeout).fadeOut(300);
        }
    });

    return JobsIndexView;
});
