define([
    'marionette',
    'views/alumni/add_story_view',
    'views/alumni/filter_form_view',
    'views/alumni/friend_request_view',
    'views/alumni/gallery_compositeview',
    'views/alumni/story_view',
    'views/alumni/story_form_view',
    'text!templates/alumni/index.html',
    'regions/modal_region',
    'collections/alumni',
    'models/alumnus'
], function (Marionette, AddStoryView, FilterFormView, FriendRequestView, GalleryCompositeView, StoryView, StoryFormView, Template, ModalRegion, Alumni, Alumnus) {
    "use strict";

    var IndexView = Marionette.Layout.extend({
        template: Template,

        regions: {
            filterForm: '#filter-form-section',
            gallery: '#gallery-section',
            modal: ModalRegion
        },

        initialize: function (options) {
            this.vent = options.vent;
            this.reqres = options.reqres;
            this.collection = new Alumni(null, options);
            this.listenTo(this.collection, 'loaded', this.onLoaded, this);
            var session = this.reqres.request('session');

            var config = this.reqres.request('config');
            $("#pageloader").fadeIn(config.spinnerTimeout).delay(config.spinnerTimeout).fadeOut(config.spinnerTimeout);

        },

        onRender: function () {
            $('body').css('visibility', 'visible');
        },

        onLoaded: function () {

            this.filterForm.show(new FilterFormView({
                reqres: this.reqres,
                collection: this.collection
            }));
            this.listenTo(this.filterForm.currentView, 'alumni:filter', this.onFilter, this);

            this.gallery.show(new GalleryCompositeView({
                reqres: this.reqres,
                collection: this.collection
            }));

            this.listenTo(this.gallery.currentView, 'showModal itemview:showModal', this.showModal, this);
            $("#searchAlumnus").click();
        },

        onFilter: function (view, model) {
            this.collection.reset();
            this.collection.fetch({
                data: $.param({
                    name: model.get('name'),
                    company: model.get('company'),
                    major: model.get('major')
                })
            });
        },

        showModal: function (view, formClass) {
            var options = {
                model: view.model,
                collection: this.collection
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass(options));
        }
    });

    return IndexView;
});