define([
    'marionette',
    'text!templates/college/index.html',
    'regions/modal_region',
    'models/college',
    'views/college/edit/basic_information_form_view',
    'views/college/candidates_compositeview',
    'views/college/events_compositeview',
    'views/college/media_compositeview',
    'views/college/edit/edit_college_description_view',
    'views/college/edit/college_profile_picture_form_view'
], function (Marionette, Template, ModalRegion, College, formClass, CandidateCompositeView, EventCompositeView, MediaCompositeView, editDescription, formLogo) {
    "use strict";

    var IndexView = Marionette.Layout.extend({
        template: Template,

        regions: {
            modal: ModalRegion,
            candidates: '#candidates-section',
            collegeEvents: '#events-section',
            collegeMedia: '#media-section'
        },

        events: {
            'click #editCollegeInformation': 'showCollegeInfoModal',
            'click #saveCollegeInformation': 'save',
            'click #openLogo': 'showModalLogo',
            'click #editDescription': 'showModalDesc'
        },

        initialize: function (options) {
            this.vent = options.vent;
            this.reqres = options.reqres;
            this.model = new College(null, options);
            var config = this.reqres.request('config');

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

            this.collegeEvents.show(new EventCompositeView({
                reqres: this.reqres,
                data: this.model.get('events')
            }));

            this.collegeMedia.show(new MediaCompositeView({
                reqres: this.reqres,
                data: this.model.get('media'),
                student: this.model
            }));

            this.listenTo(this.candidates.currentView, 'showModal itemview:showModal', this.showCandidateModalItem, this);
            this.listenTo(this.collegeEvents.currentView, 'showModal itemview:showModal', this.showEventModalItem, this);
            this.listenTo(this.collegeMedia.currentView, 'showModal itemview:showModal', this.showMediaModalItem, this);
        },

        showCollegeInfoModal: function () {
            var options = {
                model: this.model,
                reqres: this.reqres
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({model: this.model, reqres: this.reqres}, options));
            this.listenTo(this.modal.currentView, 'saved', this.update, this);
        },

        showEventModalItem: function (view, formClass, collection) {
            var options = {
                model: view.model,
                collection: this.collection,
                reqres: this.reqres,
                student: this.model
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({collection: collection, model: view.model, college_id: this.model.id, reqres: this.reqres}, options));
        },

        showModalDesc: function () {
            var options = {
                model: this.model,
                reqres: this.reqres
            };
            options = _.extend(options, this.options);
            this.modal.show(new editDescription({model: this.model, reqres: this.reqres}, options));
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

        showCandidateModalItem: function (view, formClass, collection) {
            var options = {
                model: view.model,
                collection: this.collection,
                reqres: this.reqres,
                student: this.model
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({collection: collection, model: view.model, college_id: this.model.id, reqres: this.reqres}, options));
        },

        showMediaModalItem: function (view, formClass, collection) {
            var options = {
                model: view.model,
                collection: this.collection,
                reqres: this.reqres
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({collection: collection, model: view.model, college_id: this.model.id, reqres: this.reqres}, options));
        }
    });

    return IndexView;
});
