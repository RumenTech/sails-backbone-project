/**
 * Created by semir.sabic on 18.4.2014.
 */

define([
    'marionette',
    'text!templates/careerpath/index.html',
    'regions/modal_region',
    'collections/careerpath/careerpath_tabs',
    'views/careerpath/tab_compositeview',
    'collections/careerpath/careerpath_categories',
    'views/careerpath/category_compositeview',
    'collections/careerpath/careerpath_resources',
    'views/careerpath/resource_compositeview',
    'collections/careerpath/careerpath_comments',
    'views/careerpath/comment_compositeview'
], function (Marionette, Template, ModalRegion, Tabs, TabCompositeview, Categories, CategoriesCompositeview, Resources, ResourcesCompositeView, CommentsCollection, CommentsCompositeView) {
    "use strict";

    var CareerPathIndexView = Marionette.Layout.extend({
        template: Template,

        regions: {
            modal: ModalRegion,
            tabs: '#tabs-section',
            categories: '#categories-section',
            resources: '#resources-section'
        },

        events: {
            'click .tabElement': 'selectTab',
            'click .cp_category': 'selectCategory',
            'click #viewComments': 'viewComments'
        },

        initialize: function (options) {
            this.options = options;
            this.vent = options.vent;
            this.reqres = options.reqres;
            this.session = this.reqres.request('session');
            this.localParams = {};
            this.localParams.reqres = this.reqres;
            this.localParams.session = this.session;
            this.collection = new Tabs(null, options);
            this.listenTo(this.collection, 'loaded', this.onLoaded, this);
            this.listenTo(this.collection, 'no college', this.onEmpty, this);
        },

        onRender: function () {
            $('body').css('visibility', 'visible');
        },

        onLoaded: function () {
            $("#pageloader").fadeOut(300);
            this.tabs.show(new TabCompositeview({
                reqres: this.reqres,
                data: this.collection
            }));
            var tabId = this.collection.models[0].id;
            this.selectTab(null, tabId);
        },

        onEmpty: function () {
            $("#pageloader").fadeOut(300);
            this.tabs.show(new TabCompositeview({
                reqres: this.reqres,
                data: null
            }));
        },

        selectTab: function (e, tabId) {
            var tabId = tabId || $(e.currentTarget).attr('tabid');
            $('.tabElement').css('background-color', ' #EFEFEF');
            $('[tabid=' + tabId + ']').css('background-color', 'dodgerblue');
            this.newCategories = new Categories(tabId, this.localParams);
            this.listenTo(this.newCategories, 'loaded', this.showTab, this);
        },

        showTab: function () {
            this.categories.reset();
            this.resources.reset();
            this.categories.show(new CategoriesCompositeview({
                reqres: this.reqres,
                data: this.newCategories
            }));

            this.listenTo(this.categories.currentView, 'showModal', this.showModal, this);
            this.selectCategory(null, this.newCategories.models[0].id);
        },

        selectCategory: function (e, catId) {
            var catId = catId || $(e.currentTarget).attr('catid');
            $('.cp_category').css('background-color', '#EFEFEF');
            $('[catid=' + catId + ']').css('background-color', 'dodgerblue');
            this.newResources = new Resources(catId, this.localParams);
            this.listenTo(this.newResources, 'loaded', this.showResources, this);
        },

        showResources: function () {
            this.resources.reset();
            this.resources.show(new ResourcesCompositeView({
                reqres: this.reqres,
                data: this.newResources
            }));

            this.listenTo(this.resources.currentView, 'showModal', this.showModal, this);
        },

        viewComments: function (e) {
            var resId = $(e.currentTarget).attr('resid');
            this.commentsCollection = new CommentsCollection(resId, this.localParams);
            this.commentsCollection.tagId = resId;
            this.listenTo(this.commentsCollection, 'loaded', this.showComments, this);
        },

        showComments: function () {
            var rm = new Marionette.RegionManager();
            var tagId = this.commentsCollection.tagId;
            var commentsRegion = rm.addRegion('comments', '#comment-region-' + tagId);
            commentsRegion.show(new CommentsCompositeView({
                reqres: this.reqres,
                data: this.commentsCollection
            }));
        },

        showModal: function (formClass) {
            var options = {
                model: this.model,
                reqres: this.reqres
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({model: this.model, reqres: this.reqres, data: this.newCategories}, options));
        }
    });

    return CareerPathIndexView;
});