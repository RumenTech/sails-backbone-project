define([
    'marionette',
    'text!templates/admin/index.html',
    'regions/modal_region',
    'collections/companies',
    'views/admin/companies_compositeview',
    'utils/notifier'
], function (Marionette, Template, ModalRegion, CompaniesCollection, CompaniesCompositeView, Notificator) {
    "use strict";

    var AdminIndexView = Marionette.Layout.extend({
        template: Template,

        regions: {
            modal: ModalRegion,
            companies: '#companiesAdmin'
        },

        initialize: function (options) {
            this.vent = options.vent;
            this.reqres = options.reqres;
            this.collection = new CompaniesCollection('payment', options);
            this.listenTo(this.collection, 'loaded', this.onLoaded, this);
        },

        onLoaded: function () {
            $("#pageloader").fadeIn(800).delay(300).fadeOut(800);
            if (this.showMessage) {
                Notificator.validate('Changes saved', 'success');
            }
            this.companies.show(new CompaniesCompositeView({
                reqres: this.reqres,
                collection: this.collection
            }));
            this.listenTo(this.companies.currentView, 'saved', this.update, this);
        },

        update: function () {
            var options = {};
            options.reqres = this.reqres;
            this.collection = new CompaniesCollection('payment', options);
            this.showMessage = 'show';
            this.listenTo(this.collection, 'loaded', this.onLoaded, this);
        },

        onRender: function () {
            $('body').css('visibility', 'visible');
        }
    });

    return AdminIndexView;
});
