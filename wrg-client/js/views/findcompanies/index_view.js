define([
    'marionette',
    'views/findcompanies/filter_form_view',
    'views/findcompanies/suggestions_compositeview',
    'text!templates/findcompanies/index.html',
    'regions/modal_region',
    'collections/companies'
], function (Marionette, FilterFormView, SuggestionsCompositeView, Template, ModalRegion, Companies) {
    "use strict";

    var IndexView = Marionette.Layout.extend({
        template: Template,

        regions: {
            filterForm: '#filter-form-section',
            suggestions: '#suggestions-section',
            modal: ModalRegion
        },

        initialize: function (options) {
            this.vent = options.vent;
            this.reqres = options.reqres;
            this.companies = new Companies(null, {reqres: this.reqres});
            this.companies.fetching();
            this.listenTo(this.companies, 'loaded', this.loadFriends, this);

            var config = this.reqres.request('config');
            $("#pageloader").fadeIn(config.spinnerTimeout).delay(config.spinnerTimeout).fadeOut(config.spinnerTimeout);
        },

        onRender: function () {
            $('body').css('visibility', 'visible');
        },

        loadFriends: function () {
            this.filterForm.show(new FilterFormView({
                reqres: this.reqres,
                collection: null
            }));
            this.listenTo(this.filterForm.currentView, 'filter', this.onFilter, this);
            this.suggestions.show(new SuggestionsCompositeView({
                reqres: this.reqres,
                collection: this.companies
            }));
            this.listenTo(this.suggestions.currentView, 'showModal itemview:showModal', this.showModal, this);
        },

        onFilter: function (view, model) {
            this.companies.reset();
            this.companies.fetch({
                data: $.param({
                    name: model.get('name'),
                    state: model.get('state'),
                    city: model.get('city')
                })
            });
        },

        showModal: function (view, formClass, collection) {
            var options = {
                model: view.model,
                collection: this.companies,
                reqres: this.reqres
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({reqres: this.reqres}, options));
        }
    });
    return IndexView;
});