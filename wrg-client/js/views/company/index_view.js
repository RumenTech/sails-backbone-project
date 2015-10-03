define([
    'marionette',
    'text!templates/company/index.html',
    'regions/modal_region',
    'models/company',
    'views/company/edit/basic_information_form_view',
    'views/company/candidates_compositeview',
    'views/company/events_compositeview',
    'views/company/media_compositeview',
    'views/company/edit/company_profile_picture_form_view',
    'lib/jqueryui'

], function (Marionette, Template, ModalRegion, Company, formClass, CandidateCompositeView, EventCompositeView, MediaCompositeView, formLogo) {
    "use strict";

    var IndexView = Marionette.Layout.extend({
        template: Template,

        regions: {
            modal: ModalRegion,
            candidates: '#candidates-section',
            companyEvents: '#events-section',
            companyMedia: '#media-section'
        },

        events: {
            'click #editInformation': 'showModal',
            'click #saveInformation': 'save',
            'click #openLogo': 'showModalLogo'
        },

        initialize: function (options) {
            this.vent = options.vent;
            this.reqres = options.reqres;
            var config = this.reqres.request('config');

            this.model = new Company(null, options);
            this.model.on('loaded', this.render, this);
            this.listenTo(this.model, 'loaded', this.onLoaded, this);
            $("#pageloader").fadeIn(800).delay(config.spinnerTimeout).fadeOut(800);
        },

        onRender: function () {
            $('body').css('visibility', 'visible');
        },

        update: function (model) {
            this.model = model;
            this.render();
            this.onLoaded();
        },

        onLoaded: function () {
            this.candidates.show(new CandidateCompositeView({
                reqres: this.reqres,
                data: this.model.get('candidates')
            }));
            this.companyEvents.show(new EventCompositeView({
                reqres: this.reqres,
                data: this.model.get('events')
            }));

            this.companyMedia.show(new MediaCompositeView({
                reqres: this.reqres,
                data: this.model.get('media')
            }));

            this.listenTo(this.companyEvents.currentView, 'showModal itemview:showModal', this.showEventModalItem, this);
            this.listenTo(this.candidates.currentView, 'showModal itemview:showModal', this.showModalItem, this);
            this.listenTo(this.companyMedia.currentView, 'showModal itemview:showModal', this.showMediaModalItem, this);

            if (this.model.attributes.candidates.length > 0) {

                for (var i = 0; i < this.model.attributes.candidates.length; i++) {
                    if (this.model.attributes.candidates[i].department !== "Sales") {
                        $("#sales").find("#li" + this.model.attributes.candidates[i].id).remove();
                    }
                    if (this.model.attributes.candidates[i].department !== "Marketing") {
                        $("#marketing").find("#li" + this.model.attributes.candidates[i].id).remove();
                    }
                    if (this.model.attributes.candidates[i].department !== "Information Technology (IT)") {
                        $("#informationtech").find("#li" + this.model.attributes.candidates[i].id).remove();
                    }
                    if (this.model.attributes.candidates[i].department !== "Production") {
                        $("#production").find("#li" + this.model.attributes.candidates[i].id).remove();
                    }
                    if (this.model.attributes.candidates[i].department !== "Finance/Accounting") {
                        $("#finance").find("#li" + this.model.attributes.candidates[i].id).remove();
                    }
                    if (this.model.attributes.candidates[i].department !== "Customer Service") {
                        $("#customerservice").find("#li" + this.model.attributes.candidates[i].id).remove();
                    }
                    if (this.model.attributes.candidates[i].department !== "Human Resources") {
                        $("#humanresources").find("#li" + this.model.attributes.candidates[i].id).remove();
                    }
                    if (this.model.attributes.candidates[i].department !== "Research & Design") {
                        $("#research").find("#li" + this.model.attributes.candidates[i].id).remove();
                    }
                    if (this.model.attributes.candidates[i].department !== "Operations") {
                        $("#operations").find("#li" + this.model.attributes.candidates[i].id).remove();
                    }
                    if (this.model.attributes.candidates[i].department !== "Legal") {
                        $("#legal").find("#li" + this.model.attributes.candidates[i].id).remove();
                    }
                    if (this.model.attributes.candidates[i].department !== "Other") {
                        $("#other").find("#li" + this.model.attributes.candidates[i].id).remove();
                    }
                }
            }

            if ($("#sales").children().length < 1) {
                $("#salesli").hide();
            }
            if ($("#marketing").children().length < 1) {
                $("#marketingli").hide();
            }
            if ($("#informationtech").children().length < 1) {
                $("#informationtechli").hide();
            }
            if ($("#production").children().length < 1) {
                $("#productionli").hide();
            }
            if ($("#finance").children().length < 1) {
                $("#financeli").hide();
            }
            if ($("#customerservice").children().length < 1) {
                $("#customerserviceli").hide();
            }
            if ($("#humanresources").children().length < 1) {
                $("#humanresourcesli").hide();
            }
            if ($("#research").children().length < 1) {
                $("#researchli").hide();
            }
            if ($("#operations").children().length < 1) {
                $("#operationsli").hide();
            }
            if ($("#legal").children().length < 1) {
                $("#legalli").hide();
            }
            if ($("#other").children().length < 1) {
                $("#otherli").hide();
            }
        },

        showMediaModalItem: function (view, formClass, collection) {
            var options = {
                model: view.model,
                collection: this.collection,
                reqres: this.reqres
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({collection: collection, model: view.model, company_id: this.model.id, reqres: this.reqres}, options));
        },

        showModal: function () {
            var options = {
                model: this.model,
                reqres: this.reqres
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({model: this.model, reqres: this.reqres}, options));
            this.listenTo(this.modal.currentView, 'saved', this.update, this);
        },

        showModalLogo: function () {
            var options = {
                model: this.model,
                reqres: this.reqres
            };
            options = _.extend(options, this.options);
            this.modal.show(new formLogo({model: this.model, reqres: this.reqres}, options));
            this.listenTo(this.modal.currentView, 'saved', this.update, this);
        },

        showModalItem: function (view, formClass, collection) {
            var options = {
                model: view.model,
                collection: this.collection,
                reqres: this.reqres,
                student: this.model
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({collection: collection, model: view.model, company_id: this.model.id, reqres: this.reqres}, options));
        },

        showEventModalItem: function (view, formClass, collection) {
            var options = {
                model: view.model,
                collection: this.collection,
                reqres: this.reqres,
                student: this.model
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({collection: collection, model: view.model, company_id: this.model.id, reqres: this.reqres}, options));
        }
    });
    return IndexView;
});
